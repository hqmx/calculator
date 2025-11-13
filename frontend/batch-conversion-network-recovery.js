/**
 * Batch Conversion Network Recovery
 * 네트워크 재연결 시 자동 복구 시스템
 *
 * 핵심 기능:
 * - 온라인/오프라인 상태 모니터링
 * - 네트워크 복구 시 자동 재시도
 * - 서버 변환 작업 재개
 * - 사용자 알림
 */

class BatchConversionNetworkRecovery {
  constructor(manager) {
    this.manager = manager;
    this.isOnline = navigator.onLine;
    this.wasOffline = false;
    this.offlineJobs = [];
    this.reconnectionAttempts = 0;
    this.maxReconnectionAttempts = 3;

    // 네트워크 변화 감지
    this.setupEventListeners();

    console.log('✅ BatchConversionNetworkRecovery initialized');
  }

  // ===== 이벤트 리스너 설정 =====
  setupEventListeners() {
    // 오프라인 감지
    window.addEventListener('offline', () => {
      this.handleOffline();
    });

    // 온라인 복구 감지
    window.addEventListener('online', () => {
      this.handleOnline();
    });

    // 주기적 연결 확인 (fetch 타임아웃 감지용)
    setInterval(() => {
      this.checkNetworkStatus();
    }, 10000); // 10초마다

    console.log('✅ Network event listeners registered');
  }

  // ===== 오프라인 처리 =====
  handleOffline() {
    console.warn('📡 Network connection lost');

    this.isOnline = false;
    this.wasOffline = true;

    // 실행 중인 서버 작업 일시 중지
    if (this.manager.state.active.length > 0) {
      console.log(`⏸️  Pausing ${this.manager.state.active.length} active jobs`);

      // 서버 작업만 오프라인 저장
      this.offlineJobs = this.manager.state.active.filter(job => job.route === 'server');

      // UI 업데이트
      this.showOfflineNotification();
    }

    // 관리자 일시 중지
    this.manager.state.isPaused = true;
  }

  // ===== 온라인 복구 처리 =====
  async handleOnline() {
    console.log('📡 Network connection restored');

    this.isOnline = true;

    // 서버 연결 실제 확인
    const actuallyOnline = await this.verifyServerConnection();

    if (!actuallyOnline) {
      console.warn('⚠️  navigator.onLine is true but server is unreachable');
      return;
    }

    // 오프라인이었던 경우에만 복구 시도
    if (this.wasOffline) {
      this.wasOffline = false;
      await this.attemptRecovery();
    }
  }

  // ===== 서버 연결 확인 =====
  async verifyServerConnection() {
    try {
      const response = await fetch('/api/queue-status', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(5000) // 5초 타임아웃
      });

      return response.ok;

    } catch (error) {
      console.error('❌ Server connection verification failed:', error);
      return false;
    }
  }

  // ===== 주기적 네트워크 상태 확인 =====
  async checkNetworkStatus() {
    const currentlyOnline = navigator.onLine;

    // 상태 변화 감지
    if (currentlyOnline !== this.isOnline) {
      if (currentlyOnline) {
        await this.handleOnline();
      } else {
        this.handleOffline();
      }
    }

    // 온라인인데 서버 연결 실패 시 (fetch 타임아웃 감지)
    if (currentlyOnline && this.isOnline) {
      const serverReachable = await this.verifyServerConnection();
      if (!serverReachable && !this.wasOffline) {
        console.warn('⚠️  Server unreachable, treating as offline');
        this.handleOffline();
      }
    }
  }

  // ===== 복구 시도 =====
  async attemptRecovery() {
    console.log('🔄 Attempting network recovery...');

    this.reconnectionAttempts++;

    // 복원 모달 표시
    const shouldRecover = await this.showRecoveryPrompt();

    if (!shouldRecover) {
      console.log('❌ User declined recovery');
      return;
    }

    // 일시 중지 해제
    this.manager.state.isPaused = false;

    // 1. 오프라인 중 실패한 작업 재시도
    await this.retryOfflineJobs();

    // 2. 네트워크 오류로 실패한 작업 재시도
    await this.retryNetworkFailedJobs();

    // 3. 큐 재시작
    this.manager.processQueues();

    // 성공 알림
    this.showRecoverySuccessNotification();

    console.log('✅ Network recovery completed');
  }

  // ===== 오프라인 작업 재시도 =====
  async retryOfflineJobs() {
    if (this.offlineJobs.length === 0) {
      return;
    }

    console.log(`🔄 Retrying ${this.offlineJobs.length} offline jobs`);

    for (const job of this.offlineJobs) {
      // active에서 제거
      const activeIndex = this.manager.state.active.indexOf(job);
      if (activeIndex !== -1) {
        this.manager.state.active.splice(activeIndex, 1);
      }

      // 상태 초기화
      job.status = 'pending';
      job.progress = 0;
      job.retryCount = 0;
      job.error = null;

      // 서버 큐에 다시 추가
      this.manager.state.serverQueue.push(job);
    }

    this.offlineJobs = [];

    // Storage에 저장
    if (window.batchConversionStorage) {
      window.batchConversionStorage.saveState();
    }
  }

  // ===== 네트워크 오류 작업 재시도 =====
  async retryNetworkFailedJobs() {
    // 실패한 작업 중 네트워크 관련 에러만 필터링
    const networkErrors = [
      'NETWORK_ERROR',
      'SERVER_UNREACHABLE',
      'FETCH_TIMEOUT',
      'SERVER_ERROR'
    ];

    const networkFailedJobs = this.manager.state.failed.filter(job => {
      return networkErrors.some(error => job.error?.includes(error));
    });

    if (networkFailedJobs.length === 0) {
      return;
    }

    console.log(`🔄 Retrying ${networkFailedJobs.length} network-failed jobs`);

    for (const job of networkFailedJobs) {
      // failed에서 제거
      const failedIndex = this.manager.state.failed.indexOf(job);
      if (failedIndex !== -1) {
        this.manager.state.failed.splice(failedIndex, 1);
      }

      // 상태 초기화
      job.status = 'pending';
      job.progress = 0;
      job.retryCount = 0;
      job.error = null;

      // 원래 route에 따라 큐에 추가
      if (job.route === 'client') {
        this.manager.state.clientQueue.push(job);
      } else {
        this.manager.state.serverQueue.push(job);
      }
    }

    // 통계 업데이트
    this.manager.state.stats.failedFiles -= networkFailedJobs.length;

    // Storage에 저장
    if (window.batchConversionStorage) {
      window.batchConversionStorage.saveState();
    }
  }

  // ===== 오프라인 알림 =====
  showOfflineNotification() {
    // 간단한 토스트 알림
    const toast = document.createElement('div');
    toast.className = 'batch-network-toast offline';
    toast.innerHTML = `
      <div class="batch-network-toast-content">
        <span class="icon">📡</span>
        <span class="message">인터넷 연결이 끊어졌습니다. 변환이 일시 중지되었습니다.</span>
      </div>
    `;

    document.body.appendChild(toast);

    // 3초 후 자동 제거
    setTimeout(() => {
      toast.classList.add('fade-out');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  // ===== 복구 프롬프트 =====
  async showRecoveryPrompt() {
    const jobCount = this.offlineJobs.length +
                     this.manager.state.failed.filter(job =>
                       job.error?.includes('NETWORK') ||
                       job.error?.includes('SERVER')
                     ).length;

    if (jobCount === 0) {
      return false; // 복구할 작업 없음
    }

    // 모달 생성
    const modal = document.createElement('div');
    modal.className = 'batch-recovery-modal';
    modal.innerHTML = `
      <div class="batch-recovery-content">
        <h3>📡 네트워크 복구됨</h3>
        <p>인터넷 연결이 복구되었습니다.</p>
        <div class="batch-recovery-stats">
          <div>🔄 재시도 가능한 작업: ${jobCount}개</div>
        </div>
        <p class="note">중단된 작업을 다시 시작하시겠습니까?</p>
        <div class="batch-recovery-actions">
          <button class="batch-recovery-yes">재시작</button>
          <button class="batch-recovery-no">취소</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // 사용자 선택 대기
    return new Promise((resolve) => {
      modal.querySelector('.batch-recovery-yes').addEventListener('click', () => {
        modal.remove();
        resolve(true);
      });

      modal.querySelector('.batch-recovery-no').addEventListener('click', () => {
        modal.remove();
        resolve(false);
      });
    });
  }

  // ===== 복구 성공 알림 =====
  showRecoverySuccessNotification() {
    const toast = document.createElement('div');
    toast.className = 'batch-network-toast online';
    toast.innerHTML = `
      <div class="batch-network-toast-content">
        <span class="icon">✅</span>
        <span class="message">네트워크 복구 완료. 변환을 재개합니다.</span>
      </div>
    `;

    document.body.appendChild(toast);

    // 3초 후 자동 제거
    setTimeout(() => {
      toast.classList.add('fade-out');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  // ===== 수동 재연결 시도 =====
  async manualRetry() {
    console.log('🔄 Manual retry triggered');

    // 온라인 상태 확인
    const online = await this.verifyServerConnection();

    if (!online) {
      alert('서버에 연결할 수 없습니다. 인터넷 연결을 확인하세요.');
      return false;
    }

    // 복구 시도
    await this.attemptRecovery();
    return true;
  }

  // ===== 상태 확인 =====
  getStatus() {
    return {
      isOnline: this.isOnline,
      wasOffline: this.wasOffline,
      offlineJobsCount: this.offlineJobs.length,
      reconnectionAttempts: this.reconnectionAttempts
    };
  }
}

// 전역 인스턴스 생성
if (window.batchConversionManager) {
  window.batchConversionNetworkRecovery = new BatchConversionNetworkRecovery(
    window.batchConversionManager
  );

  console.log('✅ Batch Conversion Network Recovery initialized');
} else {
  console.warn('⚠️  batchConversionManager not found, network recovery initialization skipped');
}
