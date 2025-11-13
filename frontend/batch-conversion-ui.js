/**
 * Batch Conversion UI Functions
 * 일괄 변환 UI 생성 및 업데이트 함수들
 */

class BatchConversionUI {
  constructor(manager) {
    this.manager = manager;
    this.dashboardElement = null;
    this.overlayElement = null;
  }

  // ===== 예상 시간 표시 =====
  showEstimatedTime(clientQueue, serverQueue) {
    const clientTime = clientQueue.reduce((sum, job) => sum + job.estimatedTime, 0);
    const serverTime = serverQueue.length > 0
      ? Math.max(...serverQueue.map(job => job.estimatedTime))
      : 0;

    const totalEstimated = Math.max(clientTime, serverTime);

    console.log(`📊 Estimated time: ${this.manager.progressTracker.formatTime(totalEstimated)}`);
    console.log(`💻 Client: ${clientQueue.length} files (${this.manager.progressTracker.formatTime(clientTime)})`);
    console.log(`☁️  Server: ${serverQueue.length} files (${this.manager.progressTracker.formatTime(serverTime)})`);

    // UI에 표시 (선택적)
    const estimateHTML = `
      <div class="batch-time-estimate-details">
        <h4>⏱️ 예상 소요 시간: ${this.manager.progressTracker.formatTime(totalEstimated)}</h4>
        <div class="batch-route-breakdown">
          ${clientQueue.length > 0 ? `
            <div class="batch-route-info">
              <span class="icon">💻</span>
              <span>브라우저: ${clientQueue.length}개 파일</span>
              <span class="time">${this.manager.progressTracker.formatTime(clientTime)}</span>
            </div>
          ` : ''}
          ${serverQueue.length > 0 ? `
            <div class="batch-route-info">
              <span class="icon">☁️</span>
              <span>서버: ${serverQueue.length}개 파일</span>
              <span class="time">${this.manager.progressTracker.formatTime(serverTime)}</span>
            </div>
          ` : ''}
        </div>
        <p class="note">⚡ 가장 빠른 경로로 자동 선택되었습니다</p>
      </div>
    `;

    return estimateHTML;
  }

  // ===== 진행률 대시보드 생성 =====
  showBatchProgressUI() {
    // 오버레이 생성
    this.overlayElement = document.createElement('div');
    this.overlayElement.className = 'batch-overlay';

    // 대시보드 생성
    this.dashboardElement = document.createElement('div');
    this.dashboardElement.className = 'batch-conversion-dashboard';

    // 초기 HTML
    this.dashboardElement.innerHTML = `
      <div class="batch-dashboard-header">
        <h3>Converting ${this.manager.state.stats.totalFiles} files...</h3>
        <div class="batch-overall-progress">
          <div class="batch-progress-bar">
            <div class="batch-progress-fill" style="width: 0%"></div>
          </div>
          <div class="batch-progress-text">
            <span class="progress-percentage">0%</span>
            <span class="progress-count">(0/${this.manager.state.stats.totalFiles})</span>
          </div>
        </div>
        <span class="batch-time-estimate">
          <span class="icon">⏱️</span>
          Estimated time: Calculating...
        </span>
      </div>

      <div class="batch-file-list" id="batchFileList">
        ${this.renderFileList()}
      </div>

      <div class="batch-controls">
        <button class="batch-pause-btn" onclick="window.batchConversionManager.pause()">
          Pause
        </button>
        <button class="batch-cancel-btn" onclick="window.batchConversionManager.cancel()">
          Cancel All
        </button>
        <button class="batch-download-btn" disabled>
          Download All
        </button>
        <button class="batch-statistics-btn" onclick="window.batchConversionUI?.showStatisticsModal()">
          📊 Statistics
        </button>
      </div>
    `;

    // DOM에 추가
    document.body.appendChild(this.overlayElement);
    document.body.appendChild(this.dashboardElement);

    // Phase 3: Bulk Actions 드롭다운 추가
    this.addBulkActionsDropdown();

    // Phase 3B: Drag & Drop 활성화
    this.enableDragAndDrop();

    console.log('✅ Batch progress UI shown');
  }

  // ===== 파일 리스트 렌더링 =====
  renderFileList() {
    const allJobs = [
      ...this.manager.state.completed,
      ...this.manager.state.active,
      ...this.manager.state.queue,
      ...this.manager.state.failed
    ];

    return allJobs.map(job => this.renderFileItem(job)).join('');
  }

  renderFileItem(job) {
    const statusIcons = {
      'completed': '✓',
      'processing': '⏳',
      'pending': '⏸',
      'failed': '❌'
    };

    const icon = statusIcons[job.status] || '⏸';
    const spinning = job.status === 'processing' ? 'spinning' : '';

    let progressHTML = '';
    if (job.status === 'processing' && job.progress > 0) {
      progressHTML = `
        <div class="batch-file-progress">
          <div class="batch-progress-bar mini">
            <div class="batch-progress-fill" style="width: ${job.progress}%"></div>
          </div>
          <span>${Math.round(job.progress)}%</span>
        </div>
      `;
    }

    let errorHTML = '';
    if (job.status === 'failed') {
      errorHTML = `
        <span class="batch-error">${job.error || '변환 실패'}</span>
        <button class="batch-retry-btn" onclick="window.batchConversionUI.retryJob('${job.id}')">
          재시도
        </button>
      `;
    }

    const fileSize = this.formatFileSize(job.file.size);
    const outputFormat = job.outputFormat.toUpperCase();

    // Phase 3B: Drag & Drop 지원
    const isDraggable = job.status === 'pending';
    const draggableAttr = isDraggable ? 'draggable="true"' : '';
    const dragHandleHTML = isDraggable ? '<span class="batch-drag-handle">⋮⋮</span>' : '';

    return `
      <div class="batch-file-item ${job.status}" data-job-id="${job.id}" ${draggableAttr}>
        ${dragHandleHTML}
        <span class="batch-status-icon ${spinning}">${icon}</span>
        <span class="batch-filename">${job.file.name} → ${outputFormat}</span>
        <span class="batch-filesize">[${fileSize}]</span>
        ${progressHTML}
        ${errorHTML}
      </div>
    `;
  }

  // ===== UI 업데이트 =====
  updateProgress() {
    if (!this.dashboardElement) return;

    // 전체 진행률
    const progress = this.manager.progressTracker.calculateOverallProgress();
    const remaining = this.manager.progressTracker.estimateTimeRemaining();

    // 진행률 바 업데이트
    const progressFill = this.dashboardElement.querySelector('.batch-progress-fill');
    if (progressFill) {
      progressFill.style.width = `${progress}%`;
    }

    // 텍스트 업데이트
    const progressPercentage = this.dashboardElement.querySelector('.progress-percentage');
    if (progressPercentage) {
      progressPercentage.textContent = `${Math.round(progress)}%`;
    }

    const progressCount = this.dashboardElement.querySelector('.progress-count');
    if (progressCount) {
      const completed = this.manager.state.stats.completedFiles;
      const total = this.manager.state.stats.totalFiles;
      progressCount.textContent = `(${completed}/${total})`;
    }

    // 예상 시간 업데이트
    const timeEstimate = this.dashboardElement.querySelector('.batch-time-estimate');
    if (timeEstimate && remaining > 0) {
      timeEstimate.innerHTML = `
        <span class="icon">⏱️</span>
        Estimated time: ${this.manager.progressTracker.formatTime(remaining)}
      `;
    }

    // 파일 리스트 업데이트
    const fileList = this.dashboardElement.querySelector('#batchFileList');
    if (fileList) {
      fileList.innerHTML = this.renderFileList();
    }

    // 다운로드 버튼 활성화
    const downloadBtn = this.dashboardElement.querySelector('.batch-download-btn');
    if (downloadBtn && this.manager.state.completed.length > 0) {
      downloadBtn.disabled = false;
      downloadBtn.onclick = () => this.showDownloadOptions();
    }
  }

  // ===== 다운로드 옵션 모달 =====
  showDownloadOptions() {
    const completedFiles = this.manager.state.completed;
    const count = completedFiles.length;

    const modal = document.createElement('div');
    modal.className = 'batch-download-options';
    modal.innerHTML = `
      <h3>${count}개 파일 변환 완료</h3>
      <button onclick="window.batchConversionUI.downloadIndividually()">
        개별 다운로드 (${count}번 클릭)
      </button>
      <button class="primary" onclick="window.batchConversionUI.downloadAsZip()">
        ZIP으로 다운로드 (권장)
      </button>
    `;

    // 기존 컨텐츠를 모달로 교체
    const dashboard = this.dashboardElement;
    dashboard.innerHTML = '';
    dashboard.appendChild(modal);
  }

  // ===== 개별 다운로드 =====
  async downloadIndividually() {
    const completedFiles = this.manager.state.completed;

    for (const job of completedFiles) {
      this.downloadFile(job.result);
      await this.sleep(500); // 브라우저 차단 방지
    }

    this.closeDashboard();
  }

  // ===== ZIP 다운로드 =====
  async downloadAsZip() {
    const completedFiles = this.manager.state.completed;

    // 진행 표시
    const modal = this.dashboardElement.querySelector('.batch-download-options');
    modal.innerHTML = `
      <h3>ZIP 파일 생성 중...</h3>
      <div class="batch-progress-bar">
        <div class="batch-progress-fill" id="zipProgress" style="width: 0%"></div>
      </div>
    `;

    try {
      // JSZip 사용
      if (typeof JSZip === 'undefined') {
        throw new Error('JSZip library not loaded');
      }

      const zip = new JSZip();

      for (const job of completedFiles) {
        const blob = job.result.blob;
        const filename = job.result.filename;
        zip.file(filename, blob);
      }

      const zipBlob = await zip.generateAsync({
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: { level: 6 }
      }, (metadata) => {
        const progressFill = document.getElementById('zipProgress');
        if (progressFill) {
          progressFill.style.width = `${metadata.percent}%`;
        }
      });

      // 다운로드
      this.downloadFile({
        blob: zipBlob,
        filename: `converted_files_${Date.now()}.zip`
      });

      this.closeDashboard();

    } catch (error) {
      console.error('ZIP creation failed:', error);
      alert('ZIP 파일 생성 중 오류가 발생했습니다: ' + error.message);
    }
  }

  // ===== 파일 다운로드 =====
  downloadFile(result) {
    const blob = result.blob;
    const filename = result.filename;

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  // ===== 실패 파일 표시 =====
  showFailedFiles(failedJobs) {
    if (failedJobs.length === 0) return;

    const failedHTML = failedJobs.map(job => `
      <div class="batch-file-item failed">
        <span class="batch-status-icon">❌</span>
        <span class="batch-filename">${job.file.name}</span>
        <span class="batch-error">${job.error}</span>
        <button class="batch-retry-btn" onclick="window.batchConversionUI.retryJob('${job.id}')">
          재시도
        </button>
      </div>
    `).join('');

    // 실패 목록을 대시보드에 추가
    const fileList = this.dashboardElement.querySelector('#batchFileList');
    if (fileList) {
      fileList.innerHTML = `
        <div style="padding: 16px; background: #ffebee; border-radius: 8px; margin-bottom: 16px;">
          <h4 style="margin: 0 0 12px 0; color: #d32f2f;">❌ ${failedJobs.length}개 파일 변환 실패</h4>
        </div>
        ${this.renderFileList()}
      `;
    }
  }

  // ===== 재시도 =====
  async retryJob(jobId) {
    const job = this.manager.state.failed.find(j => j.id === jobId);
    if (!job) return;

    // 실패 목록에서 제거
    const index = this.manager.state.failed.indexOf(job);
    this.manager.state.failed.splice(index, 1);

    // 재시도
    job.status = 'pending';
    job.retryCount = 0;
    job.error = null;

    if (job.route === 'client') {
      this.manager.state.clientQueue.push(job);
    } else {
      this.manager.state.serverQueue.push(job);
    }

    console.log(`🔄 Retrying job: ${job.file.name}`);
    this.updateProgress();
  }

  // ===== 대시보드 닫기 =====
  closeDashboard() {
    if (this.dashboardElement) {
      this.dashboardElement.remove();
      this.dashboardElement = null;
    }

    if (this.overlayElement) {
      this.overlayElement.remove();
      this.overlayElement = null;
    }

    console.log('❌ Batch progress UI closed');
  }

  // ===== Phase 3: Bulk Actions UI =====

  /**
   * Bulk Actions 드롭다운 추가
   */
  addBulkActionsDropdown() {
    if (!this.dashboardElement) return;

    const statsDiv = this.dashboardElement.querySelector('.batch-progress-stats');
    if (!statsDiv) return;

    // 이미 존재하면 제거
    const existing = this.dashboardElement.querySelector('.batch-bulk-actions');
    if (existing) existing.remove();

    const bulkActionsHTML = `
      <div class="batch-bulk-actions">
        <button class="batch-bulk-actions-btn" id="bulkActionsBtn">
          ⚙️ Bulk Actions
        </button>
        <div class="batch-bulk-actions-menu" id="bulkActionsMenu" style="display: none;">
          <button class="batch-bulk-action-item" data-action="change-format">
            🔄 Change All to Format
          </button>
          <button class="batch-bulk-action-item" data-action="apply-preset">
            📋 Apply Preset
          </button>
          <button class="batch-bulk-action-item" data-action="save-preset">
            💾 Save as Preset
          </button>
        </div>
      </div>
    `;

    statsDiv.insertAdjacentHTML('afterend', bulkActionsHTML);

    // 이벤트 리스너 연결
    this._attachBulkActionsListeners();
  }

  /**
   * Bulk Actions 이벤트 리스너 연결
   */
  _attachBulkActionsListeners() {
    const btn = document.getElementById('bulkActionsBtn');
    const menu = document.getElementById('bulkActionsMenu');

    if (!btn || !menu) return;

    // 드롭다운 토글
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
    });

    // 외부 클릭 시 메뉴 닫기
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.batch-bulk-actions')) {
        menu.style.display = 'none';
      }
    });

    // 메뉴 항목 클릭 핸들러
    const menuItems = menu.querySelectorAll('.batch-bulk-action-item');
    menuItems.forEach(item => {
      item.addEventListener('click', (e) => {
        const action = e.target.dataset.action;
        menu.style.display = 'none';

        switch (action) {
          case 'change-format':
            this.showBulkFormatChangeModal();
            break;
          case 'apply-preset':
            this.showApplyPresetModal();
            break;
          case 'save-preset':
            this.showSavePresetModal();
            break;
        }
      });
    });
  }

  /**
   * 형식 일괄 변경 모달 표시
   */
  showBulkFormatChangeModal() {
    const pendingCount = this.manager.state.queue.filter(j => j.status === 'pending').length;

    if (pendingCount === 0) {
      alert('No pending jobs to change format');
      return;
    }

    // 사용 가능한 형식 목록
    const formats = ['jpg', 'png', 'webp', 'gif', 'pdf', 'mp4', 'webm', 'gif', 'mp3', 'wav', 'ogg'];

    const modalHTML = `
      <div class="batch-modal-overlay" id="bulkFormatModal">
        <div class="batch-modal-content">
          <h3>🔄 Bulk Format Change</h3>
          <p>Change all pending files to:</p>

          <select id="bulkFormatSelect" class="batch-format-select">
            ${formats.map(fmt => `<option value="${fmt}">${fmt.toUpperCase()}</option>`).join('')}
          </select>

          <p class="batch-modal-info">Affects: ${pendingCount} pending files</p>

          <div class="batch-modal-actions">
            <button class="batch-modal-cancel" id="bulkFormatCancel">Cancel</button>
            <button class="batch-modal-confirm" id="bulkFormatApply">Apply</button>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // 이벤트 리스너
    document.getElementById('bulkFormatCancel').addEventListener('click', () => {
      document.getElementById('bulkFormatModal').remove();
    });

    document.getElementById('bulkFormatApply').addEventListener('click', () => {
      const format = document.getElementById('bulkFormatSelect').value;
      const count = this.manager.bulkChangeFormat(format);

      document.getElementById('bulkFormatModal').remove();
      this.updateProgress();

      // 성공 메시지
      this._showToast(`✅ Changed ${count} files to ${format.toUpperCase()}`);
    });
  }

  /**
   * 프리셋 적용 모달 표시
   */
  showApplyPresetModal() {
    if (!window.batchConversionPresets) {
      alert('Presets system not loaded');
      return;
    }

    const presets = window.batchConversionPresets.loadPresets();

    if (presets.length === 0) {
      alert('No presets saved. Create one first!');
      return;
    }

    const modalHTML = `
      <div class="batch-modal-overlay" id="applyPresetModal">
        <div class="batch-modal-content">
          <h3>📋 Apply Preset</h3>
          <p>Select a preset to apply:</p>

          <div class="batch-preset-list">
            ${presets.map(preset => `
              <div class="batch-preset-item" data-preset-id="${preset.id}">
                <span class="batch-preset-name">${preset.name}</span>
                <span class="batch-preset-format">${preset.targetFormat.toUpperCase()}</span>
              </div>
            `).join('')}
          </div>

          <div class="batch-modal-actions">
            <button class="batch-modal-cancel" id="applyPresetCancel">Cancel</button>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // 이벤트 리스너
    document.getElementById('applyPresetCancel').addEventListener('click', () => {
      document.getElementById('applyPresetModal').remove();
    });

    // 프리셋 클릭 핸들러
    const presetItems = document.querySelectorAll('.batch-preset-item');
    presetItems.forEach(item => {
      item.addEventListener('click', () => {
        const presetId = item.dataset.presetId;
        const count = this.manager.applyPreset(presetId);

        document.getElementById('applyPresetModal').remove();
        this.updateProgress();

        // 성공 메시지
        const preset = presets.find(p => p.id === presetId);
        this._showToast(`✅ Applied preset "${preset.name}": ${count} files changed`);
      });
    });
  }

  /**
   * 프리셋 저장 모달 표시
   */
  showSavePresetModal() {
    if (!window.batchConversionPresets) {
      alert('Presets system not loaded');
      return;
    }

    // 사용 가능한 형식 목록
    const formats = ['jpg', 'png', 'webp', 'gif', 'pdf', 'mp4', 'webm', 'gif', 'mp3', 'wav', 'ogg'];

    const modalHTML = `
      <div class="batch-modal-overlay" id="savePresetModal">
        <div class="batch-modal-content">
          <h3>💾 Save Preset</h3>

          <label class="batch-modal-label">
            Preset Name:
            <input type="text" id="presetNameInput" class="batch-modal-input" placeholder="e.g., Web Optimization" />
          </label>

          <label class="batch-modal-label">
            Target Format:
            <select id="presetFormatSelect" class="batch-format-select">
              ${formats.map(fmt => `<option value="${fmt}">${fmt.toUpperCase()}</option>`).join('')}
            </select>
          </label>

          <div class="batch-modal-actions">
            <button class="batch-modal-cancel" id="savePresetCancel">Cancel</button>
            <button class="batch-modal-confirm" id="savePresetConfirm">Save</button>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // 이벤트 리스너
    document.getElementById('savePresetCancel').addEventListener('click', () => {
      document.getElementById('savePresetModal').remove();
    });

    document.getElementById('savePresetConfirm').addEventListener('click', () => {
      const name = document.getElementById('presetNameInput').value.trim();
      const format = document.getElementById('presetFormatSelect').value;

      if (!name) {
        alert('Please enter a preset name');
        return;
      }

      const preset = window.batchConversionPresets.savePreset(name, format);

      if (preset) {
        document.getElementById('savePresetModal').remove();
        this._showToast(`✅ Preset "${name}" saved successfully`);
      } else {
        alert('Failed to save preset');
      }
    });
  }

  /**
   * 토스트 알림 표시
   */
  _showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'batch-toast';
    toast.textContent = message;

    document.body.appendChild(toast);

    // 3초 후 제거
    setTimeout(() => {
      toast.classList.add('fade-out');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  // ===== Phase 3B: Drag & Drop Queue Reordering =====

  /**
   * Drag & Drop 활성화
   */
  enableDragAndDrop() {
    if (!this.dashboardElement) return;

    this.draggedElement = null;
    this.draggedJobId = null;

    // 파일 리스트 컨테이너
    const fileList = this.dashboardElement.querySelector('.batch-file-list');
    if (!fileList) return;

    // 이벤트 위임 방식으로 드래그 이벤트 처리
    fileList.addEventListener('dragstart', (e) => this.handleDragStart(e));
    fileList.addEventListener('dragend', (e) => this.handleDragEnd(e));
    fileList.addEventListener('dragover', (e) => this.handleDragOver(e));
    fileList.addEventListener('dragleave', (e) => this.handleDragLeave(e));
    fileList.addEventListener('drop', (e) => this.handleDrop(e));

    console.log('✅ Drag & Drop enabled');
  }

  /**
   * 드래그 시작 핸들러
   */
  handleDragStart(e) {
    const item = e.target.closest('.batch-file-item');
    if (!item || !item.draggable) return;

    this.draggedElement = item;
    this.draggedJobId = item.dataset.jobId;

    // 시각적 피드백
    item.style.opacity = '0.5';
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', item.innerHTML);

    console.log('🖱️  Drag started:', this.draggedJobId);
  }

  /**
   * 드래그 종료 핸들러
   */
  handleDragEnd(e) {
    if (!this.draggedElement) return;

    // 시각적 피드백 제거
    this.draggedElement.style.opacity = '';

    // 모든 drop indicator 제거
    const items = this.dashboardElement.querySelectorAll('.batch-file-item');
    items.forEach(item => {
      item.classList.remove('drag-over-top', 'drag-over-bottom');
    });

    this.draggedElement = null;
    this.draggedJobId = null;
  }

  /**
   * 드래그 오버 핸들러
   */
  handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';

    const item = e.target.closest('.batch-file-item');
    if (!item || item === this.draggedElement) return;

    // 드롭 위치 표시 (위쪽 또는 아래쪽)
    const rect = item.getBoundingClientRect();
    const midpoint = rect.top + rect.height / 2;

    // 모든 indicator 제거
    const items = this.dashboardElement.querySelectorAll('.batch-file-item');
    items.forEach(i => {
      i.classList.remove('drag-over-top', 'drag-over-bottom');
    });

    // 새 indicator 추가
    if (e.clientY < midpoint) {
      item.classList.add('drag-over-top');
    } else {
      item.classList.add('drag-over-bottom');
    }
  }

  /**
   * 드래그 리브 핸들러
   */
  handleDragLeave(e) {
    const item = e.target.closest('.batch-file-item');
    if (!item) return;

    item.classList.remove('drag-over-top', 'drag-over-bottom');
  }

  /**
   * 드롭 핸들러
   */
  handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();

    const targetItem = e.target.closest('.batch-file-item');
    if (!targetItem || !this.draggedElement || targetItem === this.draggedElement) {
      this.handleDragEnd(e);
      return;
    }

    // indicator 제거
    targetItem.classList.remove('drag-over-top', 'drag-over-bottom');

    // 드롭 위치 결정
    const rect = targetItem.getBoundingClientRect();
    const midpoint = rect.top + rect.height / 2;
    const dropBefore = e.clientY < midpoint;

    // 실제 순서 변경
    const draggedJobId = this.draggedJobId;
    const targetJobId = targetItem.dataset.jobId;

    this.reorderQueue(draggedJobId, targetJobId, dropBefore);

    // 드래그 상태 초기화
    this.handleDragEnd(e);
  }

  /**
   * 큐 순서 변경
   * @param {string} draggedJobId - 드래그된 작업 ID
   * @param {string} targetJobId - 타겟 작업 ID
   * @param {boolean} dropBefore - 타겟 앞에 드롭할지 여부
   */
  reorderQueue(draggedJobId, targetJobId, dropBefore) {
    // pending 상태인 작업만 필터링 (queue에서만)
    const queue = this.manager.state.queue;

    // 드래그된 작업 찾기
    const draggedIndex = queue.findIndex(job => job.id === draggedJobId);
    if (draggedIndex === -1) {
      console.warn('⚠️  Dragged job not found in queue');
      return;
    }

    // pending 상태 확인
    if (queue[draggedIndex].status !== 'pending') {
      this._showToast('⚠️  Only pending files can be reordered');
      return;
    }

    // 타겟 작업 찾기
    const targetIndex = queue.findIndex(job => job.id === targetJobId);
    if (targetIndex === -1) {
      console.warn('⚠️  Target job not found in queue');
      return;
    }

    // 배열에서 제거
    const [draggedJob] = queue.splice(draggedIndex, 1);

    // 새 위치 계산
    let newIndex = queue.findIndex(job => job.id === targetJobId);
    if (!dropBefore) {
      newIndex++;
    }

    // 새 위치에 삽입
    queue.splice(newIndex, 0, draggedJob);

    // 상태 저장
    if (window.batchConversionStorage) {
      window.batchConversionStorage.saveState();
    }

    // UI 업데이트
    this.updateProgress();

    console.log(`🔄 Reordered: ${draggedJob.file.name} moved to position ${newIndex + 1}`);
    this._showToast(`✅ Queue reordered: ${draggedJob.file.name}`);
  }

  // ===== Phase 3C: Statistics Modal =====

  /**
   * 통계 모달 표시
   */
  showStatisticsModal() {
    if (!window.batchConversionAnalytics) {
      console.error('❌ Analytics system not loaded');
      this._showToast('❌ Analytics system not available', 'error');
      return;
    }

    const stats = window.batchConversionAnalytics.getStats();
    const topFormats = window.batchConversionAnalytics.getTopFormats(5);
    const routing = window.batchConversionAnalytics.getRoutingEfficiency();
    const currentSession = window.batchConversionAnalytics.getCurrentSessionStats();

    // 전체 통계가 없으면 안내 메시지
    if (stats.totalConversions === 0) {
      this._showToast('ℹ️ No conversion statistics available yet', 'info');
      return;
    }

    // 모달 HTML 생성
    const modalHTML = `
      <div class="batch-modal-overlay" onclick="this.remove()">
        <div class="batch-modal statistics-modal" onclick="event.stopPropagation()">
          <h3>📊 Conversion Statistics</h3>

          <!-- 전체 통계 -->
          <div class="statistics-section">
            <h4>Overall Statistics</h4>
            <div class="statistics-grid">
              <div class="stat-item">
                <span class="stat-label">Total Conversions</span>
                <span class="stat-value">${stats.totalConversions}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Success Rate</span>
                <span class="stat-value">${(stats.successRate * 100).toFixed(1)}%</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Average Time</span>
                <span class="stat-value">${(stats.averageTime / 1000).toFixed(1)}s</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Total Time</span>
                <span class="stat-value">${this._formatDuration(stats.totalTime)}</span>
              </div>
            </div>
          </div>

          <!-- 상위 변환 형식 -->
          ${topFormats.length > 0 ? `
            <div class="statistics-section">
              <h4>Top Conversion Formats</h4>
              <div class="format-list">
                ${topFormats.map(format => `
                  <div class="format-item">
                    <span class="format-name">${format.format}</span>
                    <div class="format-stats">
                      <span class="format-count">${format.count} conversions</span>
                      <span class="format-rate">${(format.successRate * 100).toFixed(0)}% success</span>
                      <span class="format-time">${(format.averageTime / 1000).toFixed(1)}s avg</span>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <!-- 라우팅 효율성 -->
          ${(routing.client.count > 0 || routing.server.count > 0) ? `
            <div class="statistics-section">
              <h4>Routing Efficiency</h4>
              <div class="routing-grid">
                <div class="routing-item">
                  <span class="routing-label">Client Processing</span>
                  <span class="routing-count">${routing.client.count} conversions</span>
                  <span class="routing-efficiency">${(routing.client.efficiency * 100).toFixed(1)}% optimal</span>
                </div>
                <div class="routing-item">
                  <span class="routing-label">Server Processing</span>
                  <span class="routing-count">${routing.server.count} conversions</span>
                  <span class="routing-efficiency">${(routing.server.efficiency * 100).toFixed(1)}% optimal</span>
                </div>
                <div class="routing-item routing-overall">
                  <span class="routing-label">Overall Routing</span>
                  <span class="routing-efficiency">${(routing.overall * 100).toFixed(1)}% optimal</span>
                </div>
              </div>
            </div>
          ` : ''}

          <!-- 현재 세션 -->
          ${currentSession ? `
            <div class="statistics-section">
              <h4>Current Session</h4>
              <div class="session-stats">
                <span class="session-label">Duration: ${this._formatDuration(currentSession.duration)}</span>
                <span class="session-label">Completed: ${currentSession.jobsCompleted}</span>
                <span class="session-label">Failed: ${currentSession.jobsFailed}</span>
                <span class="session-label">Success Rate: ${(currentSession.successRate * 100).toFixed(1)}%</span>
              </div>
            </div>
          ` : ''}

          <!-- 액션 버튼 -->
          <div class="batch-modal-actions">
            <button class="batch-modal-btn secondary" onclick="window.batchConversionUI._exportStatistics()">
              Export Stats
            </button>
            <button class="batch-modal-btn secondary" onclick="window.batchConversionUI._resetStatistics()">
              Reset Stats
            </button>
            <button class="batch-modal-btn" onclick="this.closest('.batch-modal-overlay').remove()">
              Close
            </button>
          </div>
        </div>
      </div>
    `;

    // 모달 표시
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    console.log('📊 Statistics modal displayed');
  }

  /**
   * 통계 내보내기
   */
  _exportStatistics() {
    if (!window.batchConversionAnalytics) return;

    const json = window.batchConversionAnalytics.exportStats();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `batch-conversion-stats-${Date.now()}.json`;
    a.click();

    URL.revokeObjectURL(url);
    this._showToast('✅ Statistics exported successfully');
    console.log('📊 Statistics exported');
  }

  /**
   * 통계 초기화 (확인 후)
   */
  _resetStatistics() {
    if (!window.batchConversionAnalytics) return;

    if (!confirm('Are you sure you want to reset all statistics? This action cannot be undone.')) {
      return;
    }

    window.batchConversionAnalytics.resetStats();
    document.querySelector('.batch-modal-overlay')?.remove();
    this._showToast('✅ Statistics reset successfully');
    console.log('🗑️ Statistics reset');
  }

  /**
   * Duration 포맷팅 (밀리초 → 시:분:초)
   */
  _formatDuration(ms) {
    if (!ms || ms < 0) return '0s';

    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  }

  // ===== 유틸리티 =====
  formatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// 전역 인스턴스 생성
if (window.batchConversionManager) {
  window.batchConversionUI = new BatchConversionUI(window.batchConversionManager);

  // BatchConversionManager에 UI 메서드 연결
  window.batchConversionManager.showEstimatedTime = function(clientQueue, serverQueue) {
    return window.batchConversionUI.showEstimatedTime(clientQueue, serverQueue);
  };

  window.batchConversionManager.showBatchProgressUI = function() {
    return window.batchConversionUI.showBatchProgressUI();
  };

  window.batchConversionManager.updateProgress = function() {
    return window.batchConversionUI.updateProgress();
  };

  window.batchConversionManager.showDownloadOptions = function() {
    return window.batchConversionUI.showDownloadOptions();
  };

  window.batchConversionManager.showFailedFiles = function(failedJobs) {
    return window.batchConversionUI.showFailedFiles(failedJobs);
  };

  window.batchConversionManager.closeDashboard = function() {
    return window.batchConversionUI.closeDashboard();
  };

  console.log('✅ Batch Conversion UI functions loaded');
}
