/**
 * Batch Conversion Manager
 * 여러 파일을 동시에 변환하는 시스템
 *
 * 핵심 전략: 속도 우선 (EC2 Spot Instance 사용으로 비용 부담 낮음)
 * - 더 빠른 쪽(클라이언트 vs 서버)으로 자동 라우팅
 * - 클라이언트 큐(순차)와 서버 큐(병렬) 독립 실행
 * - 실시간 네트워크 속도 측정으로 동적 최적화
 */

// ===== 네트워크 속도 모니터 =====
class NetworkSpeedMonitor {
  constructor() {
    this.uploadSpeed = 5 * 1024 * 1024;   // 기본값: 5MB/s
    this.downloadSpeed = 10 * 1024 * 1024; // 기본값: 10MB/s
    this.samples = [];
    this.maxSamples = 10;
  }

  recordUploadSpeed(bytes, milliseconds) {
    const speed = bytes / (milliseconds / 1000); // bytes/s
    this.samples.push({
      type: 'upload',
      speed,
      timestamp: Date.now()
    });

    if (this.samples.length > this.maxSamples) {
      this.samples.shift();
    }

    this.updateAverageSpeed();
  }

  recordDownloadSpeed(bytes, milliseconds) {
    const speed = bytes / (milliseconds / 1000);
    this.samples.push({
      type: 'download',
      speed,
      timestamp: Date.now()
    });

    if (this.samples.length > this.maxSamples) {
      this.samples.shift();
    }

    this.updateAverageSpeed();
  }

  updateAverageSpeed() {
    const recent = this.samples.slice(-5); // 최근 5개
    const uploads = recent.filter(s => s.type === 'upload');
    const downloads = recent.filter(s => s.type === 'download');

    if (uploads.length > 0) {
      this.uploadSpeed = uploads.reduce((sum, s) => sum + s.speed, 0) / uploads.length;
    }

    if (downloads.length > 0) {
      this.downloadSpeed = downloads.reduce((sum, s) => sum + s.speed, 0) / downloads.length;
    }
  }

  getNetworkSpeed() {
    return {
      uploadSpeed: this.uploadSpeed,
      downloadSpeed: this.downloadSpeed
    };
  }
}

// ===== 진행률 추적기 =====
class ProgressTracker {
  constructor(batchManager) {
    this.manager = batchManager;
  }

  calculateOverallProgress() {
    const { queue, active, completed } = this.manager.state;
    const totalWeight = this.manager.state.stats.totalSize;

    if (totalWeight === 0) return 0;

    let completedWeight = 0;

    // 완료된 파일
    completed.forEach(job => {
      completedWeight += job.file.size;
    });

    // 실행 중인 파일 (부분 진행률)
    active.forEach(job => {
      completedWeight += job.file.size * (job.progress / 100);
    });

    return (completedWeight / totalWeight) * 100;
  }

  estimateTimeRemaining() {
    const { stats } = this.manager.state;
    const elapsed = Date.now() - stats.startTime;
    const progress = this.calculateOverallProgress();

    if (progress === 0 || progress === 100) return 0;

    const totalEstimated = (elapsed / progress) * 100;
    return Math.max(0, totalEstimated - elapsed);
  }

  formatTime(milliseconds) {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  }
}

// ===== 에러 핸들러 =====
class ErrorHandler {
  constructor() {
    this.errorTypes = {
      NETWORK: {
        retryable: true,
        maxRetries: 3,
        backoff: 'exponential',
        message: '네트워크 오류. 재시도 중...'
      },
      SERVER_OVERLOAD: {
        retryable: true,
        maxRetries: 2,
        fallback: 'client',
        backoff: 'fixed',
        message: '서버 과부하. 브라우저 변환 시도 중...'
      },
      CONVERSION_FAILED: {
        retryable: true,
        maxRetries: 1,
        message: '변환 실패. 재시도 중...'
      },
      UNSUPPORTED_FORMAT: {
        retryable: false,
        message: '지원하지 않는 형식입니다.'
      },
      FILE_TOO_LARGE: {
        retryable: false,
        message: '파일이 너무 큽니다. (최대 2.5GB)'
      },
      CLIENT_OUT_OF_MEMORY: {
        retryable: false,
        fallback: 'server',
        message: '메모리 부족. 서버에서 처리합니다...'
      }
    };
  }

  async handleError(job, error, retryCount = 0) {
    const errorType = this.classifyError(error);
    const config = this.errorTypes[errorType];

    console.error(`Error in job ${job.file.name}:`, errorType, error);

    // 재시도 불가능한 에러
    if (!config.retryable) {
      // Fallback 시도
      if (config.fallback) {
        console.log(`Attempting fallback to ${config.fallback}`);
        return await this.attemptFallback(job, config.fallback);
      }

      return {
        success: false,
        error: errorType,
        message: config.message
      };
    }

    // 최대 재시도 횟수 초과
    if (retryCount >= config.maxRetries) {
      console.log(`Max retries exceeded for ${job.file.name}`);

      if (config.fallback) {
        return await this.attemptFallback(job, config.fallback);
      }

      return {
        success: false,
        error: `${errorType}_MAX_RETRIES`,
        message: `${config.message} (최대 재시도 초과)`
      };
    }

    // Backoff 대기
    const delay = this.calculateBackoff(config.backoff, retryCount);
    console.log(`Retrying ${job.file.name} after ${delay}ms (attempt ${retryCount + 1})`);
    await this.sleep(delay);

    // 재시도 표시 (retryCoun를 job에 저장)
    job.retryCount = retryCount + 1;

    // 재시도
    return { retry: true, retryCount: retryCount + 1 };
  }

  async attemptFallback(job, fallbackTo) {
    if (fallbackTo === 'client' && window.converterEngine && canConvertClient(job.file)) {
      console.log(`Fallback to client: ${job.file.name}`);
      job.route = 'client';
      return { fallback: 'client' };
    }

    if (fallbackTo === 'server' && job.file.size <= 2500 * 1024 * 1024) {
      console.log(`Fallback to server: ${job.file.name}`);
      job.route = 'server';
      return { fallback: 'server' };
    }

    return {
      success: false,
      error: 'NO_FALLBACK',
      message: 'Fallback 옵션을 사용할 수 없습니다.'
    };
  }

  classifyError(error) {
    const message = error.message || error.toString();

    if (message.includes('network') || message.includes('fetch') || message.includes('Failed to fetch')) {
      return 'NETWORK';
    }
    if (message.includes('SERVER_OVERLOAD') || message.includes('503') || message.includes('429')) {
      return 'SERVER_OVERLOAD';
    }
    if (message.includes('memory') || message.includes('Memory') || message.includes('heap')) {
      return 'CLIENT_OUT_OF_MEMORY';
    }
    if (message.includes('unsupported') || message.includes('not supported')) {
      return 'UNSUPPORTED_FORMAT';
    }
    if (message.includes('too large') || message.includes('exceeds')) {
      return 'FILE_TOO_LARGE';
    }

    return 'CONVERSION_FAILED';
  }

  calculateBackoff(strategy, retryCount) {
    if (strategy === 'exponential') {
      return Math.pow(2, retryCount) * 1000; // 1s, 2s, 4s, 8s...
    }
    return 5000; // 고정 5초
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// ===== 메모리 관리자 =====
class MemoryManager {
  constructor() {
    this.memoryThreshold = 0.8; // 80% 사용 시 경고
  }

  checkMemoryAvailability() {
    if (performance.memory) {
      const { usedJSHeapSize, jsHeapSizeLimit } = performance.memory;
      const usage = usedJSHeapSize / jsHeapSizeLimit;

      return {
        available: usage < this.memoryThreshold,
        usage: usage,
        remaining: jsHeapSizeLimit - usedJSHeapSize
      };
    }

    // Fallback: 추정치
    return { available: true, usage: 0.5, remaining: 1024 * 1024 * 1024 };
  }

  async cleanup() {
    // FFmpeg WASM 파일시스템 정리
    if (window.converterEngine?.ffmpegLoaded) {
      await window.converterEngine.cleanupFiles();
    }

    // Blob URL 정리
    if (window.blobURLs) {
      window.blobURLs.forEach(url => URL.revokeObjectURL(url));
      window.blobURLs = [];
    }

    // 가비지 컬렉션 힌트
    if (window.gc) {
      window.gc();
    }
  }
}

// ===== 메인 BatchConversionManager =====
class BatchConversionManager {
  constructor() {
    this.state = {
      queue: [],           // 전체 작업 큐
      active: [],          // 현재 실행 중
      completed: [],       // 완료
      failed: [],          // 실패

      clientQueue: [],     // 클라이언트 큐
      serverQueue: [],     // 서버 큐

      isPaused: false,
      isCancelled: false,

      stats: {
        totalFiles: 0,
        totalSize: 0,
        completedFiles: 0,
        completedSize: 0,
        failedFiles: 0,
        startTime: null,
        endTime: null
      }
    };

    this.networkMonitor = new NetworkSpeedMonitor();
    this.progressTracker = new ProgressTracker(this);
    this.errorHandler = new ErrorHandler();
    this.memoryManager = new MemoryManager();

    this.maxConcurrentServer = 4; // EC2 설정
    this.progressUpdateInterval = null;
  }

  // ===== 메인 실행 함수 =====
  async convertAll(files, outputFormats) {
    try {
      // Step 1: 초기화 및 검증
      await this.initialize(files, outputFormats);

      // Step 2: 라우팅 분석 (속도 기반)
      const { clientQueue, serverQueue } = this.analyzeAndRoute(files, outputFormats);

      // Step 3: 예상 시간 표시
      this.showEstimatedTime(clientQueue, serverQueue);

      // Step 4: UI 업데이트 (진행률 대시보드)
      this.showBatchProgressUI();

      // Step 5: 진행률 업데이트 시작
      this.startProgressUpdates();

      // Step 6: 병렬 실행 (클라이언트 + 서버 동시)
      await Promise.allSettled([
        this.processClientQueue(clientQueue),
        this.processServerQueue(serverQueue)
      ]);

      // Step 7: 완료 처리
      await this.handleBatchComplete();

    } catch (error) {
      console.error('Batch conversion failed:', error);
      this.showError('일괄 변환 중 오류가 발생했습니다: ' + error.message);
    } finally {
      this.stopProgressUpdates();
    }
  }

  // ===== 초기화 =====
  async initialize(files, outputFormats) {
    console.log(`Initializing batch conversion for ${files.length} files`);

    // 검증
    if (files.length === 0) {
      throw new Error('변환할 파일이 없습니다.');
    }

    if (files.length > 100) {
      throw new Error('최대 100개까지 동시 변환 가능합니다.');
    }

    const totalSize = files.reduce((sum, f) => sum + f.size, 0);
    if (totalSize > 10 * 1024 * 1024 * 1024) { // 10GB
      throw new Error('총 파일 크기가 10GB를 초과합니다.');
    }

    // 상태 초기화
    this.state.queue = files.map((file, index) => ({
      id: `job_${Date.now()}_${index}`,
      file,
      outputFormat: outputFormats[index] || outputFormats[0],
      status: 'pending',
      progress: 0,
      route: null,
      retryCount: 0
    }));

    this.state.active = [];
    this.state.completed = [];
    this.state.failed = [];
    this.state.isPaused = false;
    this.state.isCancelled = false;

    this.state.stats = {
      totalFiles: files.length,
      totalSize: totalSize,
      completedFiles: 0,
      completedSize: 0,
      failedFiles: 0,
      startTime: Date.now(),
      endTime: null
    };
  }

  // ===== 라우팅 분석 (속도 기반) =====
  analyzeAndRoute(files, outputFormats) {
    console.log('Analyzing and routing files...');

    const { uploadSpeed, downloadSpeed } = this.networkMonitor.getNetworkSpeed();

    const analysis = this.state.queue.map(job => {
      const clientTime = this.estimateClientTime(job.file);
      const serverTime = this.estimateServerTime(job.file, uploadSpeed, downloadSpeed);
      const canUseClient = canConvertClient(job.file);

      // 라우팅 결정
      let route = 'server'; // 기본값

      if (!canUseClient) {
        route = 'server';
      } else if (clientTime < serverTime * 0.8) {
        // 클라이언트가 20% 이상 빠르면 클라이언트
        route = 'client';
      } else if (serverTime < clientTime * 0.8) {
        // 서버가 20% 이상 빠르면 서버
        route = 'server';
      } else {
        // 비슷하면 클라이언트 우선 (프라이버시)
        route = 'client';
      }

      job.route = route;
      job.estimatedTime = route === 'client' ? clientTime : serverTime;

      return {
        job,
        clientTime,
        serverTime,
        canUseClient,
        route
      };
    });

    // 큐 분리
    const clientQueue = analysis
      .filter(a => a.route === 'client')
      .map(a => a.job)
      .sort((a, b) => a.estimatedTime - b.estimatedTime); // 짧은 것부터

    const serverQueue = analysis
      .filter(a => a.route === 'server')
      .map(a => a.job)
      .sort((a, b) => b.file.size - a.file.size); // 큰 것부터 (병렬 효율)

    this.state.clientQueue = clientQueue;
    this.state.serverQueue = serverQueue;

    console.log(`Route analysis: ${clientQueue.length} client, ${serverQueue.length} server`);

    return { clientQueue, serverQueue };
  }

  // ===== 시간 예측 함수 =====
  estimateClientTime(file) {
    const baseSpeed = {
      'image': 50 * 1024 * 1024,      // 50 MB/s (매우 빠름)
      'video': 5 * 1024 * 1024,       // 5 MB/s (보통)
      'audio': 20 * 1024 * 1024       // 20 MB/s (빠름)
    };

    const category = this.getFileCategory(file);
    const speed = baseSpeed[category] || 10 * 1024 * 1024;

    // FFmpeg 로딩 시간 (처음 1회만)
    const ffmpegLoadTime = (!window.converterEngine?.ffmpegLoaded) ? 3000 : 0;

    const conversionTime = (file.size / speed) * 1000;

    return conversionTime + ffmpegLoadTime;
  }

  estimateServerTime(file, uploadSpeed, downloadSpeed) {
    const baseSpeed = {
      'image': 100 * 1024 * 1024,     // 100 MB/s (Sharp 매우 빠름)
      'video': 8 * 1024 * 1024,       // 8 MB/s (FFmpeg 보통)
      'audio': 30 * 1024 * 1024       // 30 MB/s (FFmpeg 빠름)
    };

    const category = this.getFileCategory(file);
    const conversionSpeed = baseSpeed[category] || 10 * 1024 * 1024;

    const uploadTime = (file.size / uploadSpeed) * 1000;
    const conversionTime = (file.size / conversionSpeed) * 1000;
    const downloadTime = (file.size / downloadSpeed) * 1000;

    return uploadTime + conversionTime + downloadTime;
  }

  getFileCategory(file) {
    const type = file.type.toLowerCase();

    if (type.startsWith('image/')) return 'image';
    if (type.startsWith('video/')) return 'video';
    if (type.startsWith('audio/')) return 'audio';

    // 확장자 기반
    const ext = file.name.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'tiff'].includes(ext)) return 'image';
    if (['mp4', 'avi', 'mov', 'mkv', 'webm', 'flv'].includes(ext)) return 'video';
    if (['mp3', 'wav', 'flac', 'aac', 'ogg', 'm4a'].includes(ext)) return 'audio';

    return 'unknown';
  }

  // ===== 클라이언트 큐 처리 (순차) =====
  async processClientQueue(queue) {
    console.log(`Processing client queue: ${queue.length} files`);

    for (const job of queue) {
      if (this.state.isCancelled) {
        console.log('Batch conversion cancelled');
        break;
      }

      while (this.state.isPaused) {
        await this.sleep(500);
      }

      job.status = 'processing';
      this.state.active.push(job);

      try {
        const startTime = Date.now();

        // 클라이언트 변환 실행
        const result = await this.convertOnClient(job);

        const elapsed = Date.now() - startTime;
        console.log(`Client conversion completed: ${job.file.name} (${elapsed}ms)`);

        job.status = 'completed';
        job.result = result;
        this.state.completed.push(job);
        this.state.stats.completedFiles++;
        this.state.stats.completedSize += job.file.size;

        // Phase 3C: Analytics 기록
        if (window.batchConversionAnalytics) {
          window.batchConversionAnalytics.recordConversion(job, true, elapsed);
        }

        // Storage: 완료된 파일 저장
        if (window.batchConversionStorage) {
          await window.batchConversionStorage.saveCompletedFile(job);
          window.batchConversionStorage.saveState();
        }

      } catch (error) {
        console.error(`Client conversion failed: ${job.file.name}`, error);

        const handleResult = await this.errorHandler.handleError(job, error, job.retryCount);

        if (handleResult.retry) {
          // 재시도
          queue.push(job);
        } else if (handleResult.fallback === 'server') {
          // 서버로 Fallback
          this.state.serverQueue.push(job);
        } else {
          // 실패 처리
          job.status = 'failed';
          job.error = handleResult.message || error.message;
          this.state.failed.push(job);
          this.state.stats.failedFiles++;

          // Phase 3C: Analytics 기록 (실패)
          if (window.batchConversionAnalytics) {
            const elapsed = Date.now() - startTime;
            window.batchConversionAnalytics.recordConversion(job, false, elapsed);
          }

          // Storage: 상태 저장
          if (window.batchConversionStorage) {
            window.batchConversionStorage.saveState();
          }
        }
      } finally {
        // active에서 제거
        const index = this.state.active.indexOf(job);
        if (index > -1) {
          this.state.active.splice(index, 1);
        }
      }

      // 메모리 정리
      await this.memoryManager.cleanup();
    }

    console.log('Client queue processing completed');
  }

  // ===== 서버 큐 처리 (병렬) =====
  async processServerQueue(queue) {
    console.log(`Processing server queue: ${queue.length} files`);

    const workers = [];

    while (queue.length > 0 || workers.length > 0) {
      if (this.state.isCancelled) {
        console.log('Batch conversion cancelled');
        break;
      }

      while (this.state.isPaused) {
        await this.sleep(500);
      }

      // 빈 워커 슬롯에 새 작업 할당
      while (workers.length < this.maxConcurrentServer && queue.length > 0) {
        const job = queue.shift();
        job.status = 'processing';
        this.state.active.push(job);

        const workerPromise = this.processServerJob(job)
          .finally(() => {
            workers.splice(workers.indexOf(workerPromise), 1);

            // active에서 제거
            const index = this.state.active.indexOf(job);
            if (index > -1) {
              this.state.active.splice(index, 1);
            }
          });

        workers.push(workerPromise);
      }

      // 하나라도 완료될 때까지 대기
      if (workers.length > 0) {
        await Promise.race(workers);
      }
    }

    console.log('Server queue processing completed');
  }

  async processServerJob(job) {
    try {
      const startTime = Date.now();

      // 서버 변환 실행
      const result = await this.convertOnServer(job);

      const elapsed = Date.now() - startTime;
      console.log(`Server conversion completed: ${job.file.name} (${elapsed}ms)`);

      // 네트워크 속도 기록
      if (job.uploadTime) {
        this.networkMonitor.recordUploadSpeed(job.file.size, job.uploadTime);
      }
      if (job.downloadTime) {
        this.networkMonitor.recordDownloadSpeed(job.file.size, job.downloadTime);
      }

      job.status = 'completed';
      job.result = result;
      this.state.completed.push(job);
      this.state.stats.completedFiles++;
      this.state.stats.completedSize += job.file.size;

      // Phase 3C: Analytics 기록
      if (window.batchConversionAnalytics) {
        window.batchConversionAnalytics.recordConversion(job, true, elapsed);
      }

      // Storage: 완료된 파일 저장
      if (window.batchConversionStorage) {
        await window.batchConversionStorage.saveCompletedFile(job);
        window.batchConversionStorage.saveState();
      }

    } catch (error) {
      console.error(`Server conversion failed: ${job.file.name}`, error);

      const handleResult = await this.errorHandler.handleError(job, error, job.retryCount);

      if (handleResult.retry) {
        // 재시도
        this.state.serverQueue.push(job);
      } else if (handleResult.fallback === 'client') {
        // 클라이언트로 Fallback
        this.state.clientQueue.push(job);
      } else {
        // 실패 처리
        job.status = 'failed';
        job.error = handleResult.message || error.message;
        this.state.failed.push(job);
        this.state.stats.failedFiles++;

        // Phase 3C: Analytics 기록 (실패)
        if (window.batchConversionAnalytics) {
          const elapsed = Date.now() - startTime;
          window.batchConversionAnalytics.recordConversion(job, false, elapsed);
        }

        // Storage: 상태 저장
        if (window.batchConversionStorage) {
          window.batchConversionStorage.saveState();
        }
      }
    }
  }

  // ===== 실제 변환 함수 (기존 시스템 연동) =====
  async convertOnClient(job) {
    // 기존 converter-engine.js의 convert 함수 호출
    if (!window.converterEngine) {
      throw new Error('Converter engine not initialized');
    }

    return await window.converterEngine.convert(
      job.file,
      job.outputFormat,
      (progress) => {
        job.progress = progress;
      }
    );
  }

  async convertOnServer(job) {
    const formData = new FormData();
    formData.append('file', job.file);
    formData.append('outputFormat', job.outputFormat);

    // 업로드 시작 시간
    const uploadStartTime = Date.now();

    const response = await fetch('/api/convert', {
      method: 'POST',
      body: formData
    });

    job.uploadTime = Date.now() - uploadStartTime;

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();
    const jobId = data.jobId;

    // 진행률 폴링
    return await this.pollServerProgress(job, jobId);
  }

  async pollServerProgress(job, jobId) {
    while (true) {
      await this.sleep(1000); // 1초마다 체크

      const response = await fetch(`/api/progress/${jobId}`);
      const data = await response.json();

      job.progress = data.progress || 0;

      if (data.status === 'completed') {
        // 다운로드
        const downloadStartTime = Date.now();

        const downloadResponse = await fetch(`/api/download/${jobId}`);
        const blob = await downloadResponse.blob();

        job.downloadTime = Date.now() - downloadStartTime;

        return {
          blob,
          filename: data.filename || `converted_${job.file.name}`
        };
      }

      if (data.status === 'failed') {
        throw new Error(data.error || 'Server conversion failed');
      }
    }
  }

  // ===== UI 함수 =====
  showEstimatedTime(clientQueue, serverQueue) {
    const clientTime = clientQueue.reduce((sum, job) => sum + job.estimatedTime, 0);
    const serverTime = serverQueue.length > 0
      ? Math.max(...serverQueue.map(job => job.estimatedTime))
      : 0;

    const totalEstimated = Math.max(clientTime, serverTime);

    console.log(`Estimated time: ${this.progressTracker.formatTime(totalEstimated)}`);
    console.log(`- Client: ${clientQueue.length} files (${this.progressTracker.formatTime(clientTime)})`);
    console.log(`- Server: ${serverQueue.length} files (${this.progressTracker.formatTime(serverTime)})`);

    // TODO: UI에 표시
  }

  showBatchProgressUI() {
    // TODO: 진행률 대시보드 UI 표시
    console.log('Showing batch progress UI');
  }

  startProgressUpdates() {
    this.progressUpdateInterval = setInterval(() => {
      const progress = this.progressTracker.calculateOverallProgress();
      const remaining = this.progressTracker.estimateTimeRemaining();

      console.log(`Progress: ${progress.toFixed(1)}% | Remaining: ${this.progressTracker.formatTime(remaining)}`);

      // TODO: UI 업데이트
    }, 1000);
  }

  stopProgressUpdates() {
    if (this.progressUpdateInterval) {
      clearInterval(this.progressUpdateInterval);
      this.progressUpdateInterval = null;
    }
  }

  async handleBatchComplete() {
    this.state.stats.endTime = Date.now();
    const totalTime = this.state.stats.endTime - this.state.stats.startTime;

    console.log('=== Batch Conversion Complete ===');
    console.log(`Total files: ${this.state.stats.totalFiles}`);
    console.log(`Completed: ${this.state.stats.completedFiles}`);
    console.log(`Failed: ${this.state.stats.failedFiles}`);
    console.log(`Total time: ${this.progressTracker.formatTime(totalTime)}`);

    // TODO: 다운로드 옵션 표시
    if (this.state.completed.length > 0) {
      await this.handleDownloads(this.state.completed);
    }

    if (this.state.failed.length > 0) {
      this.showFailedFiles(this.state.failed);
    }
  }

  async handleDownloads(completedFiles) {
    const count = completedFiles.length;

    if (count <= 3) {
      // 자동 개별 다운로드
      console.log('Auto-downloading files individually');
      for (const job of completedFiles) {
        this.downloadFile(job.result);
        await this.sleep(500);
      }
    } else {
      // 사용자 선택
      console.log('Showing download options');
      // TODO: 다이얼로그 표시
    }
  }

  downloadFile(result) {
    const blob = result.blob;
    const filename = result.filename;

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();

    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  showFailedFiles(failedJobs) {
    console.log('=== Failed Files ===');
    failedJobs.forEach(job => {
      console.log(`- ${job.file.name}: ${job.error}`);
    });

    // TODO: UI에 실패 목록 표시 + 재시도 버튼
  }

  showError(message) {
    console.error(message);
    // TODO: UI 에러 메시지 표시
  }

  // ===== 제어 함수 =====
  pause() {
    this.state.isPaused = true;
    console.log('Batch conversion paused');
  }

  resume() {
    this.state.isPaused = false;
    console.log('Batch conversion resumed');
  }

  cancel() {
    this.state.isCancelled = true;
    console.log('Batch conversion cancelled');
  }

  // ===== 유틸리티 =====
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // ===== Phase 3: 형식 일괄 변경 API =====

  /**
   * 대기 중인 모든 작업의 출력 형식 일괄 변경
   * @param {string} newFormat - 새 출력 형식
   * @returns {number} 변경된 작업 개수
   */
  bulkChangeFormat(newFormat) {
    if (!window.batchConversionPresets) {
      console.error('❌ Presets system not loaded');
      return 0;
    }

    // Presets 시스템에 위임
    return window.batchConversionPresets.bulkChangeFormat(newFormat, this);
  }

  /**
   * Phase 3: 프리셋 적용
   * @param {string} presetId - 적용할 프리셋 ID
   * @returns {number} 변경된 작업 개수
   */
  applyPreset(presetId) {
    if (!window.batchConversionPresets) {
      console.error('❌ Presets system not loaded');
      return 0;
    }

    return window.batchConversionPresets.applyPreset(presetId, this);
  }
}

// 전역 헬퍼 함수 (기존 시스템과의 호환성)
function canConvertClient(file) {
  // 클라이언트에서 변환 가능한지 확인
  if (!window.converterEngine) return false;

  const ext = file.name.split('.').pop().toLowerCase();
  const clientFormats = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp',
                         'mp4', 'avi', 'mov', 'webm',
                         'mp3', 'wav', 'flac', 'ogg'];

  return clientFormats.includes(ext) && file.size <= 2000 * 1024 * 1024; // 2GB
}

// 전역 인스턴스
window.batchConversionManager = new BatchConversionManager();

console.log('✅ Batch Conversion Manager loaded');
