# CALCULATOR 프로젝트 - 카테고리 및 계산기 분류

## 프로젝트 개요

**목표**: 월간 검색량 100,000+ 이상의 고수요 계산기 서비스 구축
**기준**: 영문 키워드 기준 실제 검색량 데이터 기반  
**참고**: Calculator.net (39M+ 월방문), OmniCalculator (17M+ 월방문, 3,700+ 계산기)

---

## 카테고리 분류 및 구현 난이도

### 1. General (일반 계산기)
**총 예상 검색량: 2,000,000+**

| 계산기명 | 영문 키워드 | 예상 검색량 | 구현난이도 | 설명 |
|---------|-----------|-----------|---------|------|
| 기본 계산기 | basic calculator | 800K+ | ⭐ 하 | 사칙연산, 메모리 기능 |
| 과학 계산기 | scientific calculator | 500K+ | ⭐⭐⭐ 상 | 삼각함수, 로그, 지수 |
| 공학 계산기 | engineering calculator | 200K+ | ⭐⭐⭐ 상 | 단위변환, 복소수 연산 |
| 분수 계산기 | fraction calculator | 300K+ | ⭐⭐ 중 | 분수 연산 및 약분 |
| 퍼센트 계산기 | percentage calculator | 600K+ | ⭐ 하 | 백분율 계산 |

**구현 우선순위**: 기본 → 퍼센트 → 분수 → 과학 → 공학

---

### 2. Date & Time (날짜 및 시간)
**총 예상 검색량: 1,800,000+**

| 계산기명 | 영문 키워드 | 예상 검색량 | 구현난이도 | 설명 |
|---------|-----------|-----------|---------|------|
| 날짜 계산기 | date calculator | 500K+ | ⭐⭐ 중 | 날짜 차이, 날짜 더하기/빼기 |
| 나이 계산기 | age calculator | 800K+ | ⭐ 하 | 생년월일 기반 나이 계산 |
| 시간 계산기 | time calculator | 300K+ | ⭐⭐ 중 | 시간 더하기/빼기 |
| 근무시간 계산기 | work hours calculator | 200K+ | ⭐⭐ 중 | 근무시간 및 급여 계산 |
| 시간대 변환기 | timezone converter | 250K+ | ⭐⭐ 중 | 국제 시간대 변환 |
| 카운트다운 타이머 | countdown timer | 150K+ | ⭐ 하 | 특정 날짜까지 남은 시간 |

**구현 우선순위**: 나이 → 날짜 → 시간 → 근무시간 → 시간대 → 타이머

---

### 3. Finance (금융)
**총 예상 검색량: 3,500,000+**

| 계산기명 | 영문 키워드 | 예상 검색량 | 구현난이도 | 설명 |
|---------|-----------|-----------|---------|------|
| 대출 계산기 | loan calculator | 600K+ | ⭐⭐⭐ 상 | 월 상환액, 이자 계산 |
| 주택담보대출 | mortgage calculator | 1,200K+ | ⭐⭐⭐ 상 | 원리금균등상환, 원금균등상환 |
| 이자 계산기 | interest calculator | 400K+ | ⭐⭐ 중 | 단리/복리 이자 계산 |
| 세금 계산기 | tax calculator | 800K+ | ⭐⭐⭐ 상 | 소득세, 부가세 계산 |
| 급여 계산기 | salary calculator | 350K+ | ⭐⭐ 중 | 실수령액 계산 |
| 투자수익률 | ROI calculator | 300K+ | ⭐⭐ 중 | 투자 수익률 계산 |
| 환율 변환기 | currency converter | 1,500K+ | ⭐⭐ 중 | 실시간 환율 변환 (API 필요) |
| 팁 계산기 | tip calculator | 200K+ | ⭐ 하 | 팁 및 1/N 계산 |

**구현 우선순위**: 환율 → 주택담보 → 세금 → 대출 → 급여 → 이자 → 투자수익률 → 팁

---

### 4. Health & Fitness (건강 및 피트니스)
**총 예상 검색량: 3,300,000+**

| 계산기명 | 영문 키워드 | 예상 검색량 | 구현난이도 | 설명 |
|---------|-----------|-----------|---------|------|
| BMI 계산기 | BMI calculator | 1,500K+ | ⭐ 하 | 체질량지수 및 건강 상태 |
| 칼로리 계산기 | calorie calculator | 1,000K+ | ⭐⭐ 중 | 일일 필요 칼로리 |
| 체중 감량 | weight loss calculator | 600K+ | ⭐⭐ 중 | 목표 체중 달성 기간 |
| 임신 계산기 | pregnancy calculator | 700K+ | ⭐⭐ 중 | 임신 주수, 예정일 계산 |
| 배란일 계산기 | ovulation calculator | 400K+ | ⭐⭐ 중 | 가임기 계산 |
| 단백질 계산기 | protein calculator | 200K+ | ⭐ 하 | 일일 단백질 필요량 |

**구현 우선순위**: BMI → 칼로리 → 임신 → 체중감량 → 배란일 → 단백질

---

### 5. Unit Conversion (단위 변환)
**총 예상 검색량: 2,100,000+**

| 계산기명 | 영문 키워드 | 예상 검색량 | 구현난이도 | 설명 |
|---------|-----------|-----------|---------|------|
| 길이 변환 | length converter | 600K+ | ⭐ 하 | cm, inch, feet, meter |
| 무게 변환 | weight converter | 500K+ | ⭐ 하 | kg, lb, oz, ton |
| 온도 변환 | temperature converter | 400K+ | ⭐ 하 | Celsius, Fahrenheit, Kelvin |
| 면적 변환 | area converter | 300K+ | ⭐ 하 | m², ft², acre, hectare |
| 부피 변환 | volume converter | 350K+ | ⭐ 하 | L, mL, gallon, cup |
| 속도 변환 | speed converter | 200K+ | ⭐ 하 | km/h, mph, m/s |
| 압력 변환 | pressure converter | 150K+ | ⭐ 하 | Pa, psi, bar, atm |
| 에너지 변환 | energy converter | 120K+ | ⭐ 하 | J, cal, kWh, BTU |

**구현 우선순위**: 길이 → 무게 → 온도 → 부피 → 면적 → 속도 → 압력 → 에너지

**참고**: CONVERTER 프로젝트와 통합 가능

---

### 6. Math (수학)
**총 예상 검색량: 1,300,000+**

| 계산기명 | 영문 키워드 | 예상 검색량 | 구현난이도 | 설명 |
|---------|-----------|-----------|---------|------|
| 방정식 풀이 | equation solver | 400K+ | ⭐⭐⭐ 상 | 1차, 2차 방정식 해결 |
| 행렬 계산기 | matrix calculator | 300K+ | ⭐⭐⭐ 상 | 행렬 연산 (덧셈, 곱셈, 역행렬) |
| 확률 계산기 | probability calculator | 200K+ | ⭐⭐ 중 | 조합, 순열, 확률 |
| 통계 계산기 | statistics calculator | 250K+ | ⭐⭐ 중 | 평균, 표준편차, 분산 |
| 최대공약수 | GCD calculator | 150K+ | ⭐ 하 | 최대공약수, 최소공배수 |
| 소수 계산기 | prime number calculator | 120K+ | ⭐⭐ 중 | 소수 판별 및 소인수분해 |
| 삼각형 계산 | triangle calculator | 200K+ | ⭐⭐ 중 | 넓이, 각도, 변의 길이 |

**구현 우선순위**: 방정식 → 행렬 → 통계 → 확률 → 삼각형 → 최대공약수 → 소수

---

### 7. Media & Technology (미디어 및 기술)
**총 예상 검색량: 900,000+**

| 계산기명 | 영문 키워드 | 예상 검색량 | 구현난이도 | 설명 |
|---------|-----------|-----------|---------|------|
| 픽셀 계산기 | pixel calculator | 300K+ | ⭐ 하 | DPI, PPI, 해상도 계산 |
| 화면 크기 | screen size calculator | 200K+ | ⭐ 하 | 인치를 기준 화면 크기 계산 |
| 비디오 비트레이트 | video bitrate calculator | 150K+ | ⭐⭐ 중 | 파일 크기 계산 |
| 다운로드 시간 | download time calculator | 180K+ | ⭐ 하 | 파일 다운로드 소요 시간 |
| IP 서브넷 | IP subnet calculator | 250K+ | ⭐⭐⭐ 상 | 네트워크 서브넷 계산 |
| 저장공간 변환 | storage calculator | 120K+ | ⭐ 하 | TB, GB, MB, KB 변환 |

**구현 우선순위**: 픽셀 → IP서브넷 → 화면크기 → 다운로드시간 → 비디오비트레이트 → 저장공간

**참고**: CONVERTER, DOWNLOADER 프로젝트와 통합 가능

---

### 8. Construction & DIY (건축 및 DIY)
**총 예상 검색량: 800,000+**

| 계산기명 | 영문 키워드 | 예상 검색량 | 구현난이도 | 설명 |
|---------|-----------|-----------|---------|------|
| 벽지 계산기 | wallpaper calculator | 200K+ | ⭐⭐ 중 | 필요한 벽지 롤 수 |
| 페인트 계산기 | paint calculator | 300K+ | ⭐⭐ 중 | 필요한 페인트 양 |
| 타일 계산기 | tile calculator | 250K+ | ⭐⭐ 중 | 필요한 타일 개수 |
| 콘크리트 계산 | concrete calculator | 200K+ | ⭐⭐ 중 | 필요한 콘크리트 양 |
| 계단 계산기 | stair calculator | 150K+ | ⭐⭐⭐ 상 | 계단 설계 계산 |

**구현 우선순위**: 페인트 → 타일 → 벽지 → 콘크리트 → 계단

---

## 프로젝트 구현 로드맵

### Phase 1: High-Impact Calculators (최우선 15개)
**총 예상 검색량: 10,000,000+**

1. ⭐ **BMI 계산기** (1,500K+) - 난이도: 하
2. ⭐ **환율 변환기** (1,500K+) - 난이도: 중 (API 필요)
3. ⭐ **주택담보대출** (1,200K+) - 난이도: 상
4. ⭐ **칼로리 계산기** (1,000K+) - 난이도: 중
5. ⭐ **기본 계산기** (800K+) - 난이도: 하
6. ⭐ **나이 계산기** (800K+) - 난이도: 하
7. ⭐ **세금 계산기** (800K+) - 난이도: 상
8. ⭐ **임신 계산기** (700K+) - 난이도: 중
9. ⭐ **체중감량 계산기** (600K+) - 난이도: 중
10. ⭐ **대출 계산기** (600K+) - 난이도: 상
11. ⭐ **퍼센트 계산기** (600K+) - 난이도: 하
12. ⭐ **길이 변환** (600K+) - 난이도: 하
13. ⭐ **무게 변환** (500K+) - 난이도: 하
14. ⭐ **과학 계산기** (500K+) - 난이도: 상
15. ⭐ **날짜 계산기** (500K+) - 난이도: 중

### Phase 2: Medium-Impact Calculators (차순위 20개)
**총 예상 검색량: 6,000,000+**

날짜/시간, 금융, 건강, 단위변환, 미디어 카테고리의 중간 검색량 계산기

### Phase 3: Specialized Calculators (전문 30개)
**총 예상 검색량: 4,000,000+**

수학, 건축/DIY, 미디어/기술 등 전문적인 계산기

---

## 구현 난이도 기준

### ⭐ 하 (Low) - 1-2일 소요
- 간단한 수식 계산
- 기본 입력/출력
- 최소한의 로직
- 예: 퍼센트, BMI, 나이, 단위변환 등

### ⭐⭐ 중 (Medium) - 3-5일 소요
- 복잡한 수식 및 알고리즘
- 다중 입력 및 조건부 로직
- 데이터 검증 및 에러 처리
- 예: 날짜, 이자, 칼로리, 페인트 등

### ⭐⭐⭐ 상 (High) - 7-14일 소요
- 고급 수학 함수 및 알고리즘
- 복잡한 비즈니스 로직
- 외부 라이브러리/API 필요
- 예: 과학계산기, 대출, 세금, 행렬 등

---

## SEO 최적화 전략

### URL 구조
```
https://calculator.hqmx.net/
https://calculator.hqmx.net/bmi-calculator
https://calculator.hqmx.net/mortgage-calculator
https://calculator.hqmx.net/category/finance
https://calculator.hqmx.net/category/health
```

### 다국어 지원 (21개 언어)
```
https://calculator.hqmx.net/ko/bmi-calculator (한국어)
https://calculator.hqmx.net/es/bmi-calculator (스페인어)
https://calculator.hqmx.net/ja/bmi-calculator (일본어)
https://calculator.hqmx.net/zh/bmi-calculator (중국어)
```

### 페이지별 메타태그 템플릿
- **Title**: "[계산기 이름] - Free Online Calculator | HQMX"
- **Description**: "Calculate [기능] quickly and accurately. Free, fast, and easy to use."
- **Keywords**: "[계산기 영문명], [계산기 한글명], free calculator, online calculator"

---

## 경쟁사 분석

### 주요 경쟁사
1. **calculator.net** - 오래된 디자인, 광고 많음
2. **calculator.com** - 모던한 UI, 깔끔함
3. **omnicalculator.com** - 3,700+ 계산기, SEO 강세
4. **calculatorsoup.com** - 교육용, 상세한 설명

### HQMX 차별화 전략
1. **모던한 UI/UX**: CONVERTER 기반 깔끔한 디자인
2. **빠른 로딩**: 순수 HTML + 바닐라 JS
3. **다국어 지원**: 21개 언어 (주요 경쟁사 대비 우위)
4. **크로스 프로모션**: CONVERTER, DOWNLOADER와 연계
5. **모바일 최적화**: 반응형 디자인, 터치 최적화

---

## 기술 스택

### 프론트엔드
- **HTML5**: 시맨틱 마크업
- **CSS3**: CONVERTER 기반 스타일
- **Vanilla JavaScript**: 외부 라이브러리 최소화
- **Chart.js**: 그래프 시각화 (필요시)
- **Math.js**: 고급 수학 함수 (과학계산기)

### 백엔드 (최소화)
- **환율 API**: Open Exchange Rates / Fixer.io
- **정적 호스팅**: EC2 또는 CloudFront

### 배포
- **EC2 IP**: 3.213.100.223
- **Git Repo**: https://github.com/hqmx/calculator.git

---

## 프로젝트 타임라인

- **Phase 1 완료**: 3개월 (15개 계산기)
- **Phase 2 완료**: 6개월 (35개 계산기)
- **Phase 3 완료**: 9-12개월 (65개 계산기)

**목표**: 1년 내 65개 계산기 완성, 월 100만+ 오가닉 방문

---

## 업데이트 로그

- **2025-01-13**: 초기 카테고리 분류 및 검색량 분석 완료
- **데이터 출처**: Calculator.net, OmniCalculator, 업계 표준 추정치

---

**총 계산기 수**: 65개
**총 예상 검색량**: 20,000,000+ (월간)
**목표**: 각 카테고리별 점진적 서비스 확장
