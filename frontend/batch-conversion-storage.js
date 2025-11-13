/**
 * Batch Conversion Storage Manager
 * LocalStorage + IndexedDB 하이브리드 영속성 시스템
 *
 * 핵심 기능:
 * - 페이지 새로고침/닫기 시 상태 저장
 * - 재방문 시 자동 복원
 * - 완료된 파일 Blob을 IndexedDB에 저장
 * - 메타데이터는 localStorage에 저장
 */

class BatchConversionStorage {
  constructor(manager) {
    this.manager = manager;
    this.db = null;
    this.dbName = 'BatchConversionDB';
    this.dbVersion = 1;
    this.storeName = 'completedFiles';

    // LocalStorage 키
    this.storageKey = 'batchConversionState';
    this.maxAge = 3600000; // 1시간 (밀리초)

    // 저장 throttle
    this.saveTimeout = null;
    this.saveThrottleMs = 5000; // 5초

    console.log('✅ BatchConversionStorage initialized');
  }

  // ===== IndexedDB 초기화 =====
  async initDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => {
        console.error('❌ IndexedDB open failed:', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        console.log('✅ IndexedDB opened successfully');
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // completedFiles 저장소 생성
        if (!db.objectStoreNames.contains(this.storeName)) {
          const objectStore = db.createObjectStore(this.storeName, { keyPath: 'jobId' });
          objectStore.createIndex('timestamp', 'timestamp', { unique: false });
          console.log('✅ IndexedDB object store created');
        }
      };
    });
  }

  // ===== 상태 저장 (throttled) =====
  saveState() {
    // 이미 예약된 저장이 있으면 취소
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
    }

    // 5초 후에 저장 (throttle)
    this.saveTimeout = setTimeout(() => {
      this.saveStateNow();
    }, this.saveThrottleMs);
  }

  // ===== 상태 즉시 저장 =====
  saveStateNow() {
    try {
      const state = this.manager.state;

      // 메타데이터만 localStorage에 저장 (Blob 제외)
      const stateToSave = {
        version: 1,
        timestamp: Date.now(),

        // 큐 정보 (Blob 제외, 파일 메타데이터만)
        queue: state.queue.map(job => this.serializeJob(job)),
        clientQueue: state.clientQueue.map(job => this.serializeJob(job)),
        serverQueue: state.serverQueue.map(job => this.serializeJob(job)),

        // 진행 중인 작업 (재시도 가능)
        active: state.active.map(job => this.serializeJob(job)),

        // 실패한 작업 (재시도 대상)
        failed: state.failed.map(job => ({
          ...this.serializeJob(job),
          error: job.error,
          retryCount: job.retryCount
        })),

        // 완료된 작업은 jobId만 저장 (Blob은 IndexedDB)
        completed: state.completed.map(job => ({
          id: job.id,
          fileName: job.file.name,
          outputFormat: job.outputFormat
        })),

        // 통계
        stats: state.stats,

        // 네트워크 속도
        networkSpeed: {
          upload: this.manager.networkMonitor?.uploadSpeed || 0,
          download: this.manager.networkMonitor?.downloadSpeed || 0
        }
      };

      // localStorage에 저장
      localStorage.setItem(this.storageKey, JSON.stringify(stateToSave));
      console.log('💾 State saved to localStorage');

    } catch (error) {
      console.error('❌ Failed to save state:', error);
    }
  }

  // ===== Job 직렬화 (Blob/File 제외) =====
  serializeJob(job) {
    return {
      id: job.id,
      file: {
        name: job.file.name,
        size: job.file.size,
        type: job.file.type,
        lastModified: job.file.lastModified
      },
      outputFormat: job.outputFormat,
      status: job.status,
      progress: job.progress || 0,
      route: job.route,
      startTime: job.startTime,
      endTime: job.endTime,
      estimatedTime: job.estimatedTime
    };
  }

  // ===== 완료된 파일 IndexedDB에 저장 =====
  async saveCompletedFile(job) {
    if (!this.db) {
      await this.initDB();
    }

    try {
      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const objectStore = transaction.objectStore(this.storeName);

      // Blob을 ArrayBuffer로 변환하여 저장
      const arrayBuffer = await job.result.blob.arrayBuffer();

      const record = {
        jobId: job.id,
        fileName: job.file.name,
        outputFormat: job.outputFormat,
        blob: arrayBuffer,
        mimeType: job.result.blob.type,
        timestamp: Date.now()
      };

      const request = objectStore.put(record);

      return new Promise((resolve, reject) => {
        request.onsuccess = () => {
          console.log(`💾 Saved completed file to IndexedDB: ${job.file.name}`);
          resolve();
        };
        request.onerror = () => {
          console.error(`❌ Failed to save to IndexedDB: ${job.file.name}`, request.error);
          reject(request.error);
        };
      });

    } catch (error) {
      console.error('❌ IndexedDB save error:', error);
    }
  }

  // ===== 완료된 파일 IndexedDB에서 로드 =====
  async loadCompletedFile(jobId) {
    if (!this.db) {
      await this.initDB();
    }

    try {
      const transaction = this.db.transaction([this.storeName], 'readonly');
      const objectStore = transaction.objectStore(this.storeName);
      const request = objectStore.get(jobId);

      return new Promise((resolve, reject) => {
        request.onsuccess = () => {
          const record = request.result;
          if (record) {
            // ArrayBuffer를 Blob으로 복원
            const blob = new Blob([record.blob], { type: record.mimeType });
            resolve({
              blob,
              filename: record.fileName
            });
          } else {
            resolve(null);
          }
        };
        request.onerror = () => {
          console.error('❌ Failed to load from IndexedDB:', request.error);
          reject(request.error);
        };
      });

    } catch (error) {
      console.error('❌ IndexedDB load error:', error);
      return null;
    }
  }

  // ===== 상태 복원 =====
  async restoreState() {
    try {
      const savedStateStr = localStorage.getItem(this.storageKey);

      if (!savedStateStr) {
        console.log('ℹ️ No saved state found');
        return null;
      }

      const savedState = JSON.parse(savedStateStr);

      // 저장된 시간 확인
      const age = Date.now() - savedState.timestamp;
      if (age > this.maxAge) {
        console.log('⏰ Saved state is too old, clearing...');
        this.clearState();
        return null;
      }

      console.log(`✅ Found saved state (${Math.floor(age / 1000)}s ago)`);

      // IndexedDB 초기화
      await this.initDB();

      return savedState;

    } catch (error) {
      console.error('❌ Failed to restore state:', error);
      return null;
    }
  }

  // ===== 복원 UI 표시 =====
  async showRestorePrompt(savedState) {
    // 복원 가능한 작업 수 계산
    const pendingCount = (savedState.queue?.length || 0) +
                         (savedState.active?.length || 0) +
                         (savedState.failed?.length || 0);
    const completedCount = savedState.completed?.length || 0;

    if (pendingCount === 0 && completedCount === 0) {
      return false;
    }

    // 모달 생성
    const modal = document.createElement('div');
    modal.className = 'batch-restore-modal';
    modal.innerHTML = `
      <div class="batch-restore-content">
        <h3>🔄 이전 변환 작업 복원</h3>
        <p>${Math.floor((Date.now() - savedState.timestamp) / 1000)}초 전에 진행 중이던 작업이 있습니다.</p>
        <div class="batch-restore-stats">
          ${pendingCount > 0 ? `<div>⏳ 대기/진행 중: ${pendingCount}개</div>` : ''}
          ${completedCount > 0 ? `<div>✅ 완료: ${completedCount}개</div>` : ''}
        </div>
        <div class="batch-restore-actions">
          <button class="batch-restore-yes">복원하기</button>
          <button class="batch-restore-no">삭제하기</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // 사용자 선택 대기
    return new Promise((resolve) => {
      modal.querySelector('.batch-restore-yes').addEventListener('click', () => {
        modal.remove();
        resolve(true);
      });

      modal.querySelector('.batch-restore-no').addEventListener('click', () => {
        modal.remove();
        this.clearState();
        resolve(false);
      });
    });
  }

  // ===== 상태 복원 실행 =====
  async executeRestore(savedState) {
    try {
      console.log('🔄 Restoring state...');

      // 1. 큐 복원
      this.manager.state.queue = savedState.queue || [];
      this.manager.state.clientQueue = savedState.clientQueue || [];
      this.manager.state.serverQueue = savedState.serverQueue || [];

      // 2. 실패한 작업 복원
      this.manager.state.failed = savedState.failed || [];

      // 3. 완료된 작업 복원 (IndexedDB에서 Blob 로드)
      if (savedState.completed && savedState.completed.length > 0) {
        for (const completedJob of savedState.completed) {
          const result = await this.loadCompletedFile(completedJob.id);
          if (result) {
            this.manager.state.completed.push({
              id: completedJob.id,
              file: { name: completedJob.fileName },
              outputFormat: completedJob.outputFormat,
              result: result,
              status: 'completed'
            });
          }
        }
      }

      // 4. 진행 중이던 작업은 실패로 처리 (재시도 가능)
      if (savedState.active && savedState.active.length > 0) {
        savedState.active.forEach(job => {
          job.status = 'failed';
          job.error = '페이지 새로고침으로 인한 중단';
          this.manager.state.failed.push(job);
        });
      }

      // 5. 통계 복원
      if (savedState.stats) {
        this.manager.state.stats = savedState.stats;
      }

      // 6. 네트워크 속도 복원
      if (savedState.networkSpeed) {
        this.manager.networkMonitor.uploadSpeed = savedState.networkSpeed.upload;
        this.manager.networkMonitor.downloadSpeed = savedState.networkSpeed.download;
      }

      console.log('✅ State restored successfully');

      // UI 업데이트
      if (this.manager.updateProgress) {
        this.manager.updateProgress();
      }

      // 실패한 작업이 있으면 재시도 제안
      if (this.manager.state.failed.length > 0) {
        this.showRetryPrompt();
      }

      return true;

    } catch (error) {
      console.error('❌ Failed to execute restore:', error);
      return false;
    }
  }

  // ===== 재시도 프롬프트 =====
  showRetryPrompt() {
    if (!confirm(`${this.manager.state.failed.length}개의 실패한 작업이 있습니다. 다시 시도하시겠습니까?`)) {
      return;
    }

    // 실패한 작업을 큐에 다시 추가
    const failedJobs = [...this.manager.state.failed];
    this.manager.state.failed = [];

    failedJobs.forEach(job => {
      job.status = 'pending';
      job.retryCount = 0;
      job.error = null;

      if (job.route === 'client') {
        this.manager.state.clientQueue.push(job);
      } else {
        this.manager.state.serverQueue.push(job);
      }
    });

    console.log(`🔄 Retrying ${failedJobs.length} failed jobs`);

    // 변환 재시작
    this.manager.processQueues();
  }

  // ===== 상태 삭제 =====
  clearState() {
    try {
      // localStorage 삭제
      localStorage.removeItem(this.storageKey);
      console.log('🗑️  Cleared localStorage state');

      // IndexedDB 삭제
      if (this.db) {
        const transaction = this.db.transaction([this.storeName], 'readwrite');
        const objectStore = transaction.objectStore(this.storeName);
        objectStore.clear();
        console.log('🗑️  Cleared IndexedDB state');
      }

    } catch (error) {
      console.error('❌ Failed to clear state:', error);
    }
  }

  // ===== IndexedDB 오래된 항목 정리 =====
  async cleanupOldFiles() {
    if (!this.db) {
      await this.initDB();
    }

    try {
      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const objectStore = transaction.objectStore(this.storeName);
      const index = objectStore.index('timestamp');

      const cutoffTime = Date.now() - this.maxAge;
      const request = index.openCursor();

      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          if (cursor.value.timestamp < cutoffTime) {
            cursor.delete();
            console.log(`🗑️  Deleted old file: ${cursor.value.fileName}`);
          }
          cursor.continue();
        }
      };

    } catch (error) {
      console.error('❌ Failed to cleanup old files:', error);
    }
  }

  // ===== 페이지 종료 시 저장 =====
  setupBeforeUnloadHandler() {
    window.addEventListener('beforeunload', (event) => {
      // 진행 중인 작업이 있으면 경고
      if (this.manager.state.active.length > 0) {
        event.preventDefault();
        event.returnValue = '변환이 진행 중입니다. 페이지를 벗어나시겠습니까?';
      }

      // 상태 즉시 저장
      this.saveStateNow();
    });

    console.log('✅ beforeunload handler registered');
  }

  // ===== 주기적 체크포인트 =====
  startPeriodicCheckpoint(intervalMs = 30000) {
    setInterval(() => {
      if (this.manager.state.active.length > 0 ||
          this.manager.state.queue.length > 0) {
        console.log('📍 Checkpoint: saving state...');
        this.saveStateNow();
      }
    }, intervalMs);

    console.log(`✅ Periodic checkpoint started (${intervalMs / 1000}s)`);
  }
}

// 전역 인스턴스 생성
if (window.batchConversionManager) {
  window.batchConversionStorage = new BatchConversionStorage(window.batchConversionManager);

  // 초기화
  (async () => {
    // IndexedDB 초기화
    await window.batchConversionStorage.initDB();

    // 저장된 상태 복원 확인
    const savedState = await window.batchConversionStorage.restoreState();
    if (savedState) {
      const shouldRestore = await window.batchConversionStorage.showRestorePrompt(savedState);
      if (shouldRestore) {
        await window.batchConversionStorage.executeRestore(savedState);
      } else {
        window.batchConversionStorage.clearState();
      }
    }

    // 이벤트 핸들러 설정
    window.batchConversionStorage.setupBeforeUnloadHandler();
    window.batchConversionStorage.startPeriodicCheckpoint(30000); // 30초

    // 오래된 파일 정리
    window.batchConversionStorage.cleanupOldFiles();

    console.log('✅ Batch Conversion Storage fully initialized');
  })();

} else {
  console.warn('⚠️  batchConversionManager not found, storage initialization skipped');
}
