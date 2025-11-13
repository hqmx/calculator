/**
 * Batch Conversion Analytics
 * 변환 통계 및 분석 시스템
 *
 * 핵심 기능:
 * - 변환 시간, 성공률, 실패율 추적
 * - 라우팅 정확도 분석 (클라이언트 vs 서버)
 * - 형식별 변환 통계
 * - 네트워크 성능 모니터링
 * - 세션별 통계
 */

class BatchConversionAnalytics {
  constructor() {
    this.storageKey = 'batch-conversion-analytics';
    this.maxSessions = 30; // 최대 30개 세션 보관
    this.stats = this.loadStatsFromStorage();
    this.currentSessionId = `session_${Date.now()}`;
    this.sessionStartTime = Date.now();

    // 현재 세션 초기화
    this.initializeSession();

    console.log('✅ BatchConversionAnalytics initialized');
  }

  // ===== LocalStorage 관리 =====

  /**
   * LocalStorage에서 통계 로드
   */
  loadStatsFromStorage() {
    try {
      const data = localStorage.getItem(this.storageKey);

      if (!data) {
        return this._createDefaultStats();
      }

      const parsed = JSON.parse(data);

      // 데이터 구조 검증
      if (!parsed || parsed.version !== 1 || !parsed.aggregate) {
        console.warn('⚠️  Invalid analytics data, resetting');
        return this._createDefaultStats();
      }

      // 오래된 세션 정리 (30일 이상)
      this._cleanupOldSessions(parsed);

      console.log(`📊 Loaded analytics: ${parsed.aggregate.totalConversions} conversions tracked`);
      return parsed;

    } catch (error) {
      console.error('❌ Failed to load analytics:', error);
      return this._createDefaultStats();
    }
  }

  /**
   * 통계를 LocalStorage에 저장 (throttled)
   */
  saveStatsToStorage() {
    // Throttle: 1초에 최대 1회만 저장
    if (this._saveTimeout) {
      clearTimeout(this._saveTimeout);
    }

    this._saveTimeout = setTimeout(() => {
      try {
        const data = JSON.stringify(this.stats);
        localStorage.setItem(this.storageKey, data);
        console.log('💾 Analytics saved');
      } catch (error) {
        if (error.name === 'QuotaExceededError') {
          console.warn('⚠️  LocalStorage quota exceeded, cleaning up old sessions');
          this._cleanupOldestSessions();

          // 재시도
          try {
            const data = JSON.stringify(this.stats);
            localStorage.setItem(this.storageKey, data);
          } catch (retryError) {
            console.error('❌ Failed to save analytics after cleanup:', retryError);
          }
        } else {
          console.error('❌ Failed to save analytics:', error);
        }
      }
    }, 1000); // 1초 throttle
  }

  /**
   * 기본 통계 데이터 구조 생성
   */
  _createDefaultStats() {
    return {
      version: 1,
      aggregate: {
        totalConversions: 0,
        successfulConversions: 0,
        failedConversions: 0,
        totalTime: 0,
        averageTime: 0,
        byFormat: {},
        byRoute: {
          client: { count: 0, optimal: 0, accuracy: 0, avgTime: 0 },
          server: { count: 0, optimal: 0, accuracy: 0, avgTime: 0 }
        }
      },
      sessions: []
    };
  }

  /**
   * 30일 이상 오래된 세션 정리
   */
  _cleanupOldSessions(stats) {
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    stats.sessions = stats.sessions.filter(s => s.startTime > thirtyDaysAgo);
  }

  /**
   * 가장 오래된 세션 50% 삭제
   */
  _cleanupOldestSessions() {
    const sessions = this.stats.sessions;
    if (sessions.length === 0) return;

    // 시간순 정렬
    sessions.sort((a, b) => a.startTime - b.startTime);

    // 하위 50% 삭제
    const deleteCount = Math.ceil(sessions.length * 0.5);
    const deleted = sessions.splice(0, deleteCount);

    console.log(`🗑️  Deleted ${deleteCount} old sessions`);
  }

  // ===== 세션 관리 =====

  /**
   * 현재 세션 초기화
   */
  initializeSession() {
    this.currentSession = {
      id: this.currentSessionId,
      startTime: this.sessionStartTime,
      endTime: null,
      jobsCompleted: 0,
      jobsFailed: 0,
      totalTime: 0,
      conversions: []
    };

    this.stats.sessions.push(this.currentSession);
    this.saveStatsToStorage();
  }

  /**
   * 현재 세션 종료
   */
  endSession() {
    if (this.currentSession) {
      this.currentSession.endTime = Date.now();
      this.saveStatsToStorage();
      console.log(`📊 Session ended: ${this.currentSession.jobsCompleted} completed, ${this.currentSession.jobsFailed} failed`);
    }
  }

  // ===== 통계 기록 =====

  /**
   * 변환 완료 기록
   * @param {object} job - 작업 객체
   * @param {boolean} success - 성공 여부
   * @param {number} duration - 소요 시간 (밀리초)
   */
  recordConversion(job, success, duration) {
    try {
      if (!job || typeof duration !== 'number') {
        console.warn('⚠️  Invalid analytics data');
        return;
      }

      // 음수 duration 방지
      const safeDuration = Math.max(0, duration);

      // 형식 키 생성
      const formatKey = `${job.inputFormat}→${job.outputFormat}`;

      // Aggregate 통계 업데이트
      this.stats.aggregate.totalConversions++;

      if (success) {
        this.stats.aggregate.successfulConversions++;
      } else {
        this.stats.aggregate.failedConversions++;
      }

      this.stats.aggregate.totalTime += safeDuration;
      this.stats.aggregate.averageTime =
        this.stats.aggregate.totalTime / this.stats.aggregate.totalConversions;

      // 형식별 통계
      if (!this.stats.aggregate.byFormat[formatKey]) {
        this.stats.aggregate.byFormat[formatKey] = {
          count: 0,
          successful: 0,
          failed: 0,
          totalTime: 0,
          averageTime: 0,
          successRate: 0
        };
      }

      const formatStats = this.stats.aggregate.byFormat[formatKey];
      formatStats.count++;

      if (success) {
        formatStats.successful++;
        formatStats.totalTime += safeDuration;
        formatStats.averageTime = formatStats.totalTime / formatStats.successful;
      } else {
        formatStats.failed++;
      }

      formatStats.successRate = formatStats.successful / formatStats.count;

      // 현재 세션 업데이트
      if (this.currentSession) {
        if (success) {
          this.currentSession.jobsCompleted++;
        } else {
          this.currentSession.jobsFailed++;
        }
        this.currentSession.totalTime += safeDuration;

        this.currentSession.conversions.push({
          formatKey,
          success,
          duration: safeDuration,
          timestamp: Date.now()
        });
      }

      // 저장
      this.saveStatsToStorage();

      console.log(`📊 Recorded: ${formatKey} ${success ? '✅' : '❌'} (${(safeDuration / 1000).toFixed(1)}s)`);

    } catch (error) {
      console.error('❌ Failed to record conversion:', error);
    }
  }

  /**
   * 라우팅 결정 기록
   * @param {object} job - 작업 객체
   * @param {string} chosenRoute - 선택된 라우트 ('client' 또는 'server')
   * @param {boolean} wasOptimal - 최적 선택이었는지 여부
   * @param {number} duration - 실제 소요 시간
   */
  recordRouting(job, chosenRoute, wasOptimal, duration) {
    try {
      if (!chosenRoute || !this.stats.aggregate.byRoute[chosenRoute]) {
        return;
      }

      const routeStats = this.stats.aggregate.byRoute[chosenRoute];
      routeStats.count++;

      if (wasOptimal) {
        routeStats.optimal++;
      }

      routeStats.accuracy = routeStats.optimal / routeStats.count;

      // 평균 시간 계산
      if (duration && duration > 0) {
        const totalTime = routeStats.avgTime * (routeStats.count - 1) + duration;
        routeStats.avgTime = totalTime / routeStats.count;
      }

      this.saveStatsToStorage();

      console.log(`📊 Routing: ${chosenRoute} ${wasOptimal ? '✅ optimal' : '⚠️ suboptimal'}`);

    } catch (error) {
      console.error('❌ Failed to record routing:', error);
    }
  }

  // ===== 통계 조회 =====

  /**
   * 전체 통계 반환
   */
  getStats() {
    return {
      ...this.stats.aggregate,
      successRate: this.stats.aggregate.successfulConversions / this.stats.aggregate.totalConversions || 0,
      failureRate: this.stats.aggregate.failedConversions / this.stats.aggregate.totalConversions || 0
    };
  }

  /**
   * 형식별 상위 N개 반환
   * @param {number} limit - 반환할 개수
   */
  getTopFormats(limit = 10) {
    const formats = Object.entries(this.stats.aggregate.byFormat)
      .map(([key, stats]) => ({
        format: key,
        ...stats
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);

    return formats;
  }

  /**
   * 라우팅 통계 반환
   */
  getRoutingStats() {
    return {
      client: { ...this.stats.aggregate.byRoute.client },
      server: { ...this.stats.aggregate.byRoute.server }
    };
  }

  /**
   * 현재 세션 통계 반환
   */
  getCurrentSessionStats() {
    if (!this.currentSession) return null;

    const duration = Date.now() - this.currentSession.startTime;

    return {
      ...this.currentSession,
      duration,
      successRate: this.currentSession.jobsCompleted /
        (this.currentSession.jobsCompleted + this.currentSession.jobsFailed) || 0
    };
  }

  /**
   * 최근 N개 세션 반환
   */
  getRecentSessions(limit = 10) {
    return this.stats.sessions
      .slice(-limit)
      .reverse()
      .map(session => ({
        ...session,
        duration: session.endTime ? session.endTime - session.startTime : null
      }));
  }

  // ===== 통계 관리 =====

  /**
   * 모든 통계 초기화
   */
  resetStats() {
    this.stats = this._createDefaultStats();
    this.initializeSession();
    this.saveStatsToStorage();

    console.log('🗑️  All analytics reset');
    return true;
  }

  /**
   * 통계 내보내기 (JSON)
   */
  exportStats() {
    return JSON.stringify(this.stats, null, 2);
  }

  /**
   * 통계 가져오기 (JSON)
   */
  importStats(jsonString) {
    try {
      const imported = JSON.parse(jsonString);

      if (!imported || imported.version !== 1) {
        console.error('❌ Invalid analytics import format');
        return false;
      }

      this.stats = imported;
      this.saveStatsToStorage();

      console.log(`✅ Imported analytics: ${imported.aggregate.totalConversions} conversions`);
      return true;

    } catch (error) {
      console.error('❌ Failed to import analytics:', error);
      return false;
    }
  }

  // ===== 분석 기능 =====

  /**
   * 성능 분석: 느린 변환 찾기
   */
  getSlowConversions(threshold = 30000) {
    const slowFormats = [];

    for (const [key, stats] of Object.entries(this.stats.aggregate.byFormat)) {
      if (stats.averageTime > threshold) {
        slowFormats.push({
          format: key,
          averageTime: stats.averageTime,
          count: stats.count
        });
      }
    }

    return slowFormats.sort((a, b) => b.averageTime - a.averageTime);
  }

  /**
   * 신뢰도 분석: 실패율이 높은 변환
   */
  getUnreliableConversions(threshold = 0.2) {
    const unreliable = [];

    for (const [key, stats] of Object.entries(this.stats.aggregate.byFormat)) {
      const failureRate = stats.failed / stats.count;
      if (failureRate > threshold && stats.count >= 3) {
        unreliable.push({
          format: key,
          failureRate,
          count: stats.count,
          failed: stats.failed
        });
      }
    }

    return unreliable.sort((a, b) => b.failureRate - a.failureRate);
  }

  /**
   * 라우팅 효율성 분석
   */
  getRoutingEfficiency() {
    const { client, server } = this.stats.aggregate.byRoute;

    const clientEfficiency = client.count > 0 ? client.accuracy : 0;
    const serverEfficiency = server.count > 0 ? server.accuracy : 0;
    const overallEfficiency = (client.optimal + server.optimal) / (client.count + server.count) || 0;

    return {
      client: {
        count: client.count,
        optimal: client.optimal,
        efficiency: clientEfficiency,
        avgTime: client.avgTime
      },
      server: {
        count: server.count,
        optimal: server.optimal,
        efficiency: serverEfficiency,
        avgTime: server.avgTime
      },
      overall: overallEfficiency
    };
  }
}

// 전역 인스턴스 생성
if (typeof window !== 'undefined') {
  window.batchConversionAnalytics = new BatchConversionAnalytics();
  console.log('✅ Batch Conversion Analytics system initialized');

  // 페이지 언로드 시 세션 종료
  window.addEventListener('beforeunload', () => {
    if (window.batchConversionAnalytics) {
      window.batchConversionAnalytics.endSession();
    }
  });
}
