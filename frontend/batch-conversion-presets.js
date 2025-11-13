/**
 * Batch Conversion Presets
 * 형식 일괄 변경 및 프리셋 저장 시스템
 *
 * 핵심 기능:
 * - 대기 중인 모든 작업의 출력 형식 일괄 변경
 * - 자주 사용하는 변환 설정을 프리셋으로 저장
 * - LocalStorage 기반 프리셋 관리
 * - 프리셋 적용 및 삭제
 */

class BatchConversionPresets {
  constructor() {
    this.storageKey = 'batch-conversion-presets';
    this.maxPresets = 20; // 최대 프리셋 개수
    this.presets = this.loadPresetsFromStorage();

    console.log('✅ BatchConversionPresets initialized');
  }

  // ===== LocalStorage 관리 =====

  /**
   * LocalStorage에서 프리셋 로드
   */
  loadPresetsFromStorage() {
    try {
      const data = localStorage.getItem(this.storageKey);

      if (!data) {
        return this._createDefaultPresetsData();
      }

      const parsed = JSON.parse(data);

      // 데이터 구조 검증
      if (!parsed || parsed.version !== 1 || !Array.isArray(parsed.presets)) {
        console.warn('⚠️  Invalid presets data, resetting');
        return this._createDefaultPresetsData();
      }

      console.log(`📦 Loaded ${parsed.presets.length} presets from storage`);
      return parsed;

    } catch (error) {
      console.error('❌ Failed to load presets:', error);
      return this._createDefaultPresetsData();
    }
  }

  /**
   * 프리셋을 LocalStorage에 저장
   */
  savePresetsToStorage() {
    try {
      const data = JSON.stringify(this.presets);
      localStorage.setItem(this.storageKey, data);
      console.log(`💾 Saved ${this.presets.presets.length} presets`);
      return true;

    } catch (error) {
      if (error.name === 'QuotaExceededError') {
        console.warn('⚠️  LocalStorage quota exceeded, cleaning up old presets');
        this._cleanupOldPresets();

        // 재시도
        try {
          const data = JSON.stringify(this.presets);
          localStorage.setItem(this.storageKey, data);
          return true;
        } catch (retryError) {
          console.error('❌ Failed to save presets after cleanup:', retryError);
          return false;
        }
      }

      console.error('❌ Failed to save presets:', error);
      return false;
    }
  }

  /**
   * 기본 프리셋 데이터 구조 생성
   */
  _createDefaultPresetsData() {
    return {
      version: 1,
      presets: []
    };
  }

  /**
   * 사용 빈도가 낮은 오래된 프리셋 정리
   */
  _cleanupOldPresets() {
    if (this.presets.presets.length === 0) {
      return;
    }

    // 사용 빈도 기준으로 정렬 (낮은 순)
    this.presets.presets.sort((a, b) => {
      const aScore = a.useCount || 0;
      const bScore = b.useCount || 0;
      return aScore - bScore;
    });

    // 하위 25% 삭제
    const deleteCount = Math.ceil(this.presets.presets.length * 0.25);
    const deleted = this.presets.presets.splice(0, deleteCount);

    console.log(`🗑️  Cleaned up ${deleteCount} least-used presets:`, deleted.map(p => p.name));
  }

  // ===== 프리셋 관리 API =====

  /**
   * 새 프리셋 저장
   * @param {string} name - 프리셋 이름
   * @param {string} targetFormat - 출력 형식
   * @returns {object|null} 생성된 프리셋 객체 또는 null (실패 시)
   */
  savePreset(name, targetFormat) {
    if (!name || !targetFormat) {
      console.error('❌ Invalid preset data:', { name, targetFormat });
      return null;
    }

    // 이름 중복 확인
    const existing = this.presets.presets.find(p => p.name === name);
    if (existing) {
      console.warn(`⚠️  Preset "${name}" already exists`);

      // 덮어쓰기
      existing.targetFormat = targetFormat;
      existing.updatedAt = Date.now();

      if (this.savePresetsToStorage()) {
        console.log(`✅ Updated preset: ${name} → ${targetFormat}`);
        return existing;
      }
      return null;
    }

    // 최대 개수 체크
    if (this.presets.presets.length >= this.maxPresets) {
      console.warn(`⚠️  Maximum ${this.maxPresets} presets reached`);
      this._cleanupOldPresets();
    }

    // 새 프리셋 생성
    const preset = {
      id: `preset_${Date.now()}`,
      name: name,
      targetFormat: targetFormat,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      useCount: 0
    };

    this.presets.presets.push(preset);

    if (this.savePresetsToStorage()) {
      console.log(`✅ Saved new preset: ${name} → ${targetFormat}`);
      return preset;
    }

    return null;
  }

  /**
   * 모든 프리셋 로드
   * @returns {array} 프리셋 배열
   */
  loadPresets() {
    return [...this.presets.presets]; // 복사본 반환
  }

  /**
   * 프리셋 삭제
   * @param {string} presetId - 삭제할 프리셋 ID
   * @returns {boolean} 성공 여부
   */
  deletePreset(presetId) {
    const index = this.presets.presets.findIndex(p => p.id === presetId);

    if (index === -1) {
      console.warn(`⚠️  Preset not found: ${presetId}`);
      return false;
    }

    const deleted = this.presets.presets.splice(index, 1);

    if (this.savePresetsToStorage()) {
      console.log(`🗑️  Deleted preset: ${deleted[0].name}`);
      return true;
    }

    return false;
  }

  /**
   * 프리셋 적용 (대기 중인 모든 작업에 형식 일괄 적용)
   * @param {string} presetId - 적용할 프리셋 ID
   * @param {object} manager - BatchConversionManager 인스턴스
   * @returns {number} 변경된 작업 개수
   */
  applyPreset(presetId, manager) {
    const preset = this.presets.presets.find(p => p.id === presetId);

    if (!preset) {
      console.error(`❌ Preset not found: ${presetId}`);
      return 0;
    }

    // 사용 횟수 증가
    preset.useCount = (preset.useCount || 0) + 1;
    preset.lastUsedAt = Date.now();
    this.savePresetsToStorage();

    // 형식 일괄 변경
    const count = this.bulkChangeFormat(preset.targetFormat, manager);

    console.log(`✅ Applied preset "${preset.name}": ${count} jobs changed to ${preset.targetFormat}`);
    return count;
  }

  // ===== 형식 일괄 변경 =====

  /**
   * 대기 중인 모든 작업의 출력 형식 일괄 변경
   * @param {string} newFormat - 새 출력 형식
   * @param {object} manager - BatchConversionManager 인스턴스
   * @returns {number} 변경된 작업 개수
   */
  bulkChangeFormat(newFormat, manager) {
    if (!newFormat || !manager) {
      console.error('❌ Invalid bulk change parameters');
      return 0;
    }

    // 대기 중인 작업만 필터링
    const pendingJobs = manager.state.queue.filter(job => job.status === 'pending');

    if (pendingJobs.length === 0) {
      console.log('ℹ️  No pending jobs to change');
      return 0;
    }

    // 대용량 큐 처리 (20개 초과 시 배치 처리)
    if (pendingJobs.length > 20) {
      return this._batchChangeFormat(pendingJobs, newFormat, manager);
    }

    // 소규모 큐는 동기 처리
    let changedCount = 0;
    for (const job of pendingJobs) {
      // 형식 호환성 검증 (기본적인 검증)
      if (this._isFormatCompatible(job.inputFormat, newFormat)) {
        job.outputFormat = newFormat;
        changedCount++;
      } else {
        console.warn(`⚠️  Incompatible format change: ${job.inputFormat} → ${newFormat} (skipped)`);
      }
    }

    // 상태 저장
    if (window.batchConversionStorage) {
      window.batchConversionStorage.saveState();
    }

    // UI 업데이트
    if (window.batchConversionUI) {
      window.batchConversionUI.updateDashboard();
    }

    console.log(`✅ Bulk format change: ${changedCount} jobs → ${newFormat}`);
    return changedCount;
  }

  /**
   * 대용량 큐 배치 처리 (requestAnimationFrame 사용)
   * @private
   */
  _batchChangeFormat(jobs, newFormat, manager) {
    let processed = 0;
    let changedCount = 0;
    const batchSize = 20;

    return new Promise((resolve) => {
      const processBatch = () => {
        const end = Math.min(processed + batchSize, jobs.length);

        for (let i = processed; i < end; i++) {
          if (this._isFormatCompatible(jobs[i].inputFormat, newFormat)) {
            jobs[i].outputFormat = newFormat;
            changedCount++;
          }
        }

        processed = end;

        if (processed < jobs.length) {
          // 다음 배치 예약
          requestAnimationFrame(processBatch);
        } else {
          // 완료 처리
          if (window.batchConversionStorage) {
            window.batchConversionStorage.saveState();
          }
          if (window.batchConversionUI) {
            window.batchConversionUI.updateDashboard();
          }

          console.log(`✅ Batch format change completed: ${changedCount}/${jobs.length} jobs → ${newFormat}`);
          resolve(changedCount);
        }
      };

      processBatch();
    });
  }

  /**
   * 형식 호환성 검증 (기본적인 카테고리 체크)
   * @private
   */
  _isFormatCompatible(inputFormat, outputFormat) {
    // 이미지 형식
    const imageFormats = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp', 'tiff', 'ico', 'svg'];

    // 비디오 형식
    const videoFormats = ['mp4', 'webm', 'mov', 'avi', 'mkv', 'flv', 'wmv', 'mpeg', 'mpg', 'm4v', 'gif'];

    // 오디오 형식
    const audioFormats = ['mp3', 'wav', 'ogg', 'aac', 'm4a', 'flac', 'wma', 'opus', 'aiff', 'alac'];

    const input = inputFormat.toLowerCase();
    const output = outputFormat.toLowerCase();

    // 같은 카테고리 내 변환만 허용
    if (imageFormats.includes(input) && imageFormats.includes(output)) return true;
    if (videoFormats.includes(input) && videoFormats.includes(output)) return true;
    if (audioFormats.includes(input) && audioFormats.includes(output)) return true;

    // 비디오 → GIF 허용
    if (videoFormats.includes(input) && output === 'gif') return true;

    return false;
  }

  // ===== 유틸리티 메서드 =====

  /**
   * 프리셋 개수 반환
   */
  getPresetCount() {
    return this.presets.presets.length;
  }

  /**
   * 프리셋 초기화 (모두 삭제)
   */
  resetPresets() {
    this.presets = this._createDefaultPresetsData();
    const success = this.savePresetsToStorage();

    if (success) {
      console.log('🗑️  All presets deleted');
    }

    return success;
  }

  /**
   * 프리셋 내보내기 (JSON)
   */
  exportPresets() {
    return JSON.stringify(this.presets, null, 2);
  }

  /**
   * 프리셋 가져오기 (JSON)
   */
  importPresets(jsonString) {
    try {
      const imported = JSON.parse(jsonString);

      if (!imported || imported.version !== 1 || !Array.isArray(imported.presets)) {
        console.error('❌ Invalid preset import format');
        return false;
      }

      this.presets = imported;
      const success = this.savePresetsToStorage();

      if (success) {
        console.log(`✅ Imported ${imported.presets.length} presets`);
      }

      return success;

    } catch (error) {
      console.error('❌ Failed to import presets:', error);
      return false;
    }
  }
}

// 전역 인스턴스 생성
if (typeof window !== 'undefined') {
  window.batchConversionPresets = new BatchConversionPresets();
  console.log('✅ Batch Conversion Presets system initialized');
}
