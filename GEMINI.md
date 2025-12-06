# CALCULATOR 프로젝트 개발 가이드

## 📋 프로젝트 기본 정보

**프로젝트명**: CALCULATOR
**루트 폴더**: `~/hqmx/calculator`
**Git 저장소**: https://github.com/hqmx/calculator.git
**EC2 탄력적 IP**: 3.213.100.223
**EC2 키**: `../hqmx-ec2.pem` (프로젝트 루트 참조)
**언어**: 에이전트는 개발자와 한글로 소통
- **병렬 에이전트 작업을 필요할때마다 자주 사용하도록한다**

---

## 🎯 프로젝트 핵심 개념

CALCULATOR는 HQMX의 세 번째 브랜치 서비스입니다.
- **첫 번째**: CONVERTER (단위 변환 서비스)
- **두 번째**: DOWNLOADER (다운로드 서비스)
- **세 번째**: CALCULATOR (계산기 서비스) ← 현재 프로젝트

### 핵심 전략
1. **SEO 기반 서비스 구성**: 월 검색량 100,000+ 키워드만 서비스화
2. **무료 서비스**: 광고 수익 모델
3. **크로스 프로모션**: CONVERTER, DOWNLOADER와 연계
4. **다국어 지원**: 21개 언어

---

## 🚨 중요: 디자인 원칙 (절대 준수)

### ⛔ 임의 디자인 변경 절대 불가

**모든 디자인은 CONVERTER 프로젝트 기반으로 작성됩니다.**

- **참조 프로젝트**: `~/hqmx/converter`
- **기준 파일**: `converter/index.html`
- **방식**: CONVERTER의 구조를 복사하고 **내용과 텍스트만 변경**

### 디자인 시스템 규칙

#### 1. 로고 및 브랜딩
```
원본 CONVERTER 로고:
├─ C : 블루 그라데이션 (강조)
└─ ONVERTER : 모노톤 (다크/라이트 모드 대응)

CALCULATOR 로고:
├─ C : 블루 그라데이션 (동일)
└─ ALCULATOR : 모노톤 (동일)

규칙:
- 맨 앞 글자만 블루 그라데이션
- 나머지 글자는 모노톤 (다크/라이트 모드)
- 전체 대문자
- 맨 앞 글자가 나머지보다 약간 크게
- 상하 정렬 키 유지
```

#### 2. 레이아웃 및 컨테이너
```
CONVERTER 레이아웃 그대로 사용:
├─ 네비게이션 바 (위치, 크기, 스타일 동일)
├─ 메인 컨테이너
│   ├─ 블러 효과 (불투명도 동일)
│   ├─ Width (모바일 최적화 설정)
│   ├─ Padding/Margin (동일)
│   └─ 배경색 (다크/라이트 모드)
├─ 사이드바/메뉴 (구조 동일)
└─ 푸터 (동일)

변경 가능:
- 컨테이너 내부의 텍스트 및 콘텐츠만 변경 가능
- 계산기 입력 필드 및 버튼
```

#### 📊 Results Section 레이아웃 규칙 (중요)

**태그라인 (Tagline)**
- 작은 글자 한 줄만 사용 가능
- 예: "Calculate Your Daily Calorie Needs"
- 추가 설명이나 긴 텍스트 금지
- 나머지 내용은 메인 컨테이너에 표시

**Results Section 그리드 레이아웃**

1. **패널 3개인 경우** (예: Daily Calories, BMR, TDEE)
   ```css
   /* 웹 화면 (Desktop) */
   grid-template-columns: repeat(3, 1fr);  /* 1행 3열, 한 줄에 3개 */
   gap: 1.5rem;

   /* 모바일 화면 */
   grid-template-columns: 1fr;  /* 1열, 세로로 쌓기 */
   gap: 1rem;
   ```
   - Desktop: 한 줄에 3개 모두 표시
   - Mobile: 세로로 하나씩 표시

2. **패널 4개 이상인 경우** (예: 4개, 6개, 8개)
   ```css
   /* 웹 화면 (Desktop) */
   grid-template-columns: repeat(2, 1fr);  /* 1행 2열, 한 줄에 2개씩 */
   gap: 1.5rem;

   /* 모바일 화면 */
   grid-template-columns: 1fr;  /* 1열, 세로로 쌓기 */
   gap: 1rem;
   ```
   - Desktop: 한 줄에 2개씩 표시 (2행 또는 3행)
   - Mobile: 세로로 하나씩 표시

**적용 예시**
```html
<!-- 3개 패널 예시 (Calorie Calculator) -->
<div class="result-cards-grid">  <!-- 3열 그리드 -->
    <div class="result-card">Daily Calories</div>
    <div class="result-card">BMR</div>
    <div class="result-card">TDEE</div>
</div>

<!-- 4개 패널 예시 (가상) -->
<div class="result-cards-grid">  <!-- 2열 그리드 -->
    <div class="result-card">Result 1</div>
    <div class="result-card">Result 2</div>
    <div class="result-card">Result 3</div>
    <div class="result-card">Result 4</div>
</div>
```

**CSS 구현**
```css
/* 3개 패널 */
.result-cards-grid-3 {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
}

/* 4개 이상 패널 */
.result-cards-grid-4 {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
}

/* 모바일 공통 */
@media (max-width: 768px) {
    .result-cards-grid-3,
    .result-cards-grid-4 {
        grid-template-columns: 1fr;
        gap: 1rem;
    }
}
```

#### 3. 색상 시스템
```css
/* CONVERTER와 동일한 색상 사용 */
Primary: 블루 그라데이션 (로고, 강조)
Background (Light): #ffffff, #f8f9fa
Background (Dark): #1a1a1a, #2d2d2d
Text (Light): #333333, #666666
Text (Dark): #ffffff, #cccccc
Border: rgba(0, 0, 0, 0.1) / rgba(255, 255, 255, 0.1)
```

#### 4. 폰트 및 타이포그래피
```
CONVERTER 폰트 시스템 동일 적용:
- 제목 폰트
- 본문 폰트
- 크기 스케일
- 행간
- 자간
```

#### 5. 컴포넌트
```
CONVERTER 컴포넌트 재사용:
├─ 네비게이션 바 (메뉴 항목만 수정)
├─ 입력 필드 스타일
├─ 버튼 스타일
├─ 드롭다운
├─ 토글 스위치 (다크/라이트 모드)
├─ 사이트맵
└─ 푸터

계산기 전용 컴포넌트:
├─ 계산기 버튼 그리드 (CONVERTER 버튼 스타일 적용)
├─ 결과 디스플레이 (CONVERTER 입력 필드 스타일)
└─ 그래프/차트 (필요시, Chart.js 사용)
```

---

## 📁 프로젝트 구조

```
calculator/
├── index.html              # 메인 랜딩 페이지
├── 101.md                  # 프로젝트 개요 문서
├── CATEGORY.md             # 카테고리 및 계산기 분류
├── GEMINI.md               # 개발 가이드 (이 파일)
├── css/
│   ├── main.css           # CONVERTER 기반 메인 스타일
│   ├── calculator.css     # 계산기 전용 스타일
│   └── responsive.css     # 반응형 디자인
├── js/
│   ├── main.js            # 공통 JavaScript
│   ├── calculators/       # 개별 계산기 로직
│   │   ├── bmi.js
│   │   ├── mortgage.js
│   │   ├── percentage.js
│   │   └── ...
│   └── utils.js           # 유틸리티 함수
├── pages/
│   ├── bmi-calculator.html
│   ├── mortgage-calculator.html
│   └── ...
├── category/
│   ├── finance.html       # 금융 카테고리 페이지
│   ├── health.html        # 건강 카테고리 페이지
│   └── ...
├── assets/
│   ├── images/
│   └── icons/
└── locales/               # 다국어 지원
    ├── ko.json
    ├── en.json
    ├── es.json
    └── ...
```

---

## 💻 개발 가이드라인

### 1. HTML 구조
```html
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <!-- SEO 메타태그 -->
    <title>[계산기 이름] - Free Online Calculator | HQMX</title>
    <meta name="description" content="Calculate [기능] quickly and accurately. Free, fast, and easy to use.">
    <meta name="keywords" content="[영문 키워드], [한글 키워드], calculator, 계산기">

    <!-- CONVERTER 기반 CSS -->
    <link rel="stylesheet" href="/css/main.css">
    <link rel="stylesheet" href="/css/calculator.css">
</head>
<body>
    <!-- CONVERTER 네비게이션 바 (복사) -->
    <nav class="navbar">
        <!-- 로고: CALCULATOR -->
        <!-- 메뉴 항목 -->
    </nav>

    <!-- 메인 컨테이너 (CONVERTER 스타일) -->
    <main class="container">
        <div class="calculator-wrapper">
            <!-- 계산기 제목 -->
            <!-- 입력 필드 -->
            <!-- 버튼 -->
            <!-- 결과 표시 -->
        </div>
    </main>

    <!-- CONVERTER 푸터 (복사) -->
    <footer class="footer">
        <!-- 사이트맵 -->
        <!-- 저작권 -->
    </footer>

    <!-- JavaScript -->
    <script src="/js/main.js"></script>
    <script src="/js/calculators/[calculator-name].js"></script>
</body>
</html>
```

### 2. JavaScript 구조
```javascript
// 개별 계산기 모듈 (예: bmi.js)
(function() {
    'use strict';

    // 계산기 로직
    class BMICalculator {
        constructor() {
            this.init();
        }

        init() {
            this.bindEvents();
        }

        bindEvents() {
            // 이벤트 리스너
        }

        calculate() {
            // 계산 로직
        }

        displayResult(result) {
            // 결과 표시
        }

        validate(input) {
            // 입력 검증
        }
    }

    // 초기화
    document.addEventListener('DOMContentLoaded', function() {
        new BMICalculator();
    });
})();
```

### 3. CSS 스타일
```css
/* calculator.css */
/* CONVERTER 스타일 기반, 계산기 전용 스타일만 추가 */

.calculator-wrapper {
    /* CONVERTER 컨테이너 스타일 상속 */
    max-width: 600px;
    margin: 0 auto;
    padding: 2rem;
}

.calc-button {
    /* CONVERTER 버튼 스타일 기반 */
    /* 크기, 색상, 호버 효과 동일 */
}

.calc-result {
    /* CONVERTER 입력 필드 스타일 기반 */
}
```

---

## 🔧 기술 스택

### 프론트엔드 (필수)
- **HTML5**: 시맨틱 마크업, 접근성 준수
- **CSS3**: CONVERTER 기반, Flexbox/Grid
- **Vanilla JavaScript**: 외부 라이브러리 최소화
  - No jQuery
  - No React/Vue/Angular
  - ES6+ 문법 사용

### 라이브러리 (필요시만)
```javascript
// 허용되는 라이브러리 (CDN 사용)
- Chart.js: 그래프 시각화 (금융, 통계 계산기)
- Math.js: 고급 수학 함수 (과학 계산기)
- Day.js: 날짜/시간 연산 (날짜 계산기)
```

### API (필요시)
```javascript
// 환율 변환기
- Open Exchange Rates API
- Fixer.io API

// 사용 예시
const API_KEY = 'your-api-key';
const API_URL = 'https://api.exchangerate-api.com/v4/latest/USD';
```

---

## 📐 개발 프로세스

### 1. 계산기 개발 순서
```
1. CATEGORY.md 참조 → 우선순위 확인
2. CONVERTER 파일 복사 → 기본 구조 생성
3. 내용 변경 → 계산기 특화 콘텐츠
4. 로직 구현 → JavaScript 계산 함수
5. 테스트 → 다양한 입력값 검증
6. SEO 최적화 → 메타태그, 구조화 데이터
7. 다국어 → 21개 언어 번역
8. 배포 → Cloudflare Pages (Git Push)
```

### 2. 코드 스타일
```javascript
// 네이밍 규칙
- 변수/함수: camelCase (예: calculateBMI)
- 클래스: PascalCase (예: BMICalculator)
- 상수: UPPER_SNAKE_CASE (예: MAX_HEIGHT)

// 주석
- 한글로 작성
- 복잡한 로직에만 추가
- JSDoc 스타일 선호

/**
 * BMI를 계산합니다.
 * @param {number} weight - 체중 (kg)
 * @param {number} height - 키 (cm)
 * @returns {number} BMI 값
 */
function calculateBMI(weight, height) {
    const heightInMeters = height / 100;
    return weight / (heightInMeters * heightInMeters);
}
```

### 3. 에러 처리
```javascript
// 입력 검증
function validateInput(value, min, max) {
    if (isNaN(value)) {
        throw new Error('숫자를 입력해주세요.');
    }
    if (value < min || value > max) {
        throw new Error(`${min}에서 ${max} 사이의 값을 입력해주세요.`);
    }
    return true;
}

// 사용자에게 친화적인 에러 메시지
try {
    const result = calculate();
    displayResult(result);
} catch (error) {
    displayError(error.message);
}
```

---

## 🌐 SEO 최적화

### 1. URL 구조
```
기본 구조:
https://calculator.hqmx.net/[calculator-name]

예시:
https://calculator.hqmx.net/bmi-calculator
https://calculator.hqmx.net/mortgage-calculator

카테고리 페이지:
https://calculator.hqmx.net/category/finance
https://calculator.hqmx.net/category/health

다국어:
https://calculator.hqmx.net/ko/bmi-calculator
https://calculator.hqmx.net/es/bmi-calculator
```

### 2. 메타태그 템플릿
```html
<!-- 기본 메타태그 -->
<title>BMI 계산기 - Free Online BMI Calculator | HQMX</title>
<meta name="description" content="Calculate your Body Mass Index (BMI) quickly and accurately. Free BMI calculator with health recommendations.">
<meta name="keywords" content="BMI calculator, body mass index, BMI 계산기, 체질량지수">

<!-- Open Graph (소셜 미디어) -->
<meta property="og:title" content="BMI 계산기 - Free Online Calculator">
<meta property="og:description" content="Calculate your BMI quickly and accurately.">
<meta property="og:image" content="https://calculator.hqmx.net/assets/images/bmi-og.jpg">
<meta property="og:url" content="https://calculator.hqmx.net/bmi-calculator">
<meta property="og:type" content="website">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="BMI 계산기 - Free Online Calculator">
<meta name="twitter:description" content="Calculate your BMI quickly and accurately.">

<!-- Canonical URL -->
<link rel="canonical" href="https://calculator.hqmx.net/bmi-calculator">

<!-- 다국어 태그 -->
<link rel="alternate" hreflang="en" href="https://calculator.hqmx.net/en/bmi-calculator">
<link rel="alternate" hreflang="ko" href="https://calculator.hqmx.net/ko/bmi-calculator">
```

### 3. 구조화 데이터 (Schema.org)
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "BMI Calculator",
  "description": "Calculate your Body Mass Index quickly and accurately",
  "url": "https://calculator.hqmx.net/bmi-calculator",
  "applicationCategory": "HealthApplication",
  "operatingSystem": "Any",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "provider": {
    "@type": "Organization",
    "name": "HQMX",
    "url": "https://hqmx.net"
  }
}
</script>
```

---

## 🌍 다국어 지원

### 지원 언어 (21개)
```
1. 영어 (en)
2. 한국어 (ko)
3. 스페인어 (es)
4. 일본어 (ja)
5. 중국어 간체 (zh-CN)
6. 중국어 번체 (zh-TW)
7. 프랑스어 (fr)
8. 독일어 (de)
9. 이탈리아어 (it)
10. 포르투갈어 (pt)
11. 러시아어 (ru)
12. 아랍어 (ar)
13. 힌디어 (hi)
14. 태국어 (th)
15. 베트남어 (vi)
16. 인도네시아어 (id)
17. 터키어 (tr)
18. 폴란드어 (pl)
19. 네덜란드어 (nl)
20. 스웨덴어 (sv)
21. 노르웨이어 (no)
```

### 번역 파일 구조
```json
// locales/ko.json
{
  "calculator": {
    "bmi": {
      "title": "BMI 계산기",
      "description": "체질량지수를 계산하세요",
      "weight": "체중 (kg)",
      "height": "키 (cm)",
      "calculate": "계산하기",
      "result": "당신의 BMI는 {bmi}입니다.",
      "category": {
        "underweight": "저체중",
        "normal": "정상",
        "overweight": "과체중",
        "obese": "비만"
      }
    }
  }
}
```

---

## 🚀 배포 및 관리

### 1. 배포 프로세스 (EC2 통합 배포)
**이 프로젝트는 단일 EC2 인스턴스에 통합 배포됩니다.**

1.  **Git 저장소 업데이트**: 로컬에서 변경 사항을 커밋합니다.
    ```bash
    git add .
    git commit -m "Update calculator"
    ```
2.  **배포 스크립트 실행**: 프로젝트 루트에서 실행합니다.
    ```bash
    ./deploy.sh calculator
    ```

### 3. 성능 최적화
```
✅ 이미지 최적화: WebP 포맷, lazy loading
✅ CSS/JS 압축: Minify, 번들링
✅ CDN 사용: Cloudflare (자동)
✅ 캐싱: 브라우저 캐싱, 서버 캐싱
✅ Gzip 압축: 서버 레벨
```

### 4. 모니터링
```
- Google Analytics: 트래픽 분석
- Google Search Console: SEO 모니터링
- 에러 로그: 서버 로그 확인
- 성능 측정: Lighthouse, PageSpeed Insights
```
---

## 📊 품질 체크리스트

### 계산기 개발 완료 전 체크
```
[ ] CONVERTER 디자인 기반으로 작성
[ ] 모바일 반응형 테스트 완료
[ ] 다양한 입력값 테스트 (정상, 비정상, 경계값)
[ ] 에러 처리 구현
[ ] SEO 메타태그 작성
[ ] 구조화 데이터 추가
[ ] 21개 언어 번역 완료
[ ] 크로스 브라우저 테스트 (Chrome, Safari, Firefox)
[ ] 접근성 테스트 (키보드 네비게이션, 스크린 리더)
[ ] 성능 테스트 (Lighthouse 점수 90+)
```

---

## 🔗 관련 프로젝트

### CONVERTER 연계
- 단위 변환 계산기는 CONVERTER와 통합
- 길이, 무게, 온도, 면적, 부피 등

### DOWNLOADER 연계
- 다운로드 시간 계산기
- 비디오 비트레이트 계산기

### 크로스 프로모션
```html
<!-- 푸터에 다른 서비스 링크 -->
<footer>
    <div class="related-services">
        <a href="https://converter.hqmx.net">CONVERTER</a>
        <a href="https://downloader.hqmx.net">DOWNLOADER</a>
        <a href="https://calculator.hqmx.net">CALCULATOR</a>
    </div>
</footer>
```

---

## 📝 개발 팁

### 계산 정확도
```javascript
// 부동소수점 오류 방지
function roundToDecimal(number, decimals) {
    return Math.round(number * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

// 예시
const bmi = roundToDecimal(weight / (height * height), 2);
```

### 사용자 경험
```javascript
// 실시간 계산 (debounce)
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 입력 필드에 실시간 계산 적용
inputField.addEventListener('input', debounce(function() {
    calculate();
}, 500));
```

### 로컬 스토리지 활용
```javascript
// 최근 계산 결과 저장
function saveToHistory(calculation) {
    const history = JSON.parse(localStorage.getItem('calcHistory') || '[]');
    history.unshift(calculation);
    if (history.length > 10) history.pop();
    localStorage.setItem('calcHistory', JSON.stringify(history));
}
```

---

## ❓ FAQ

**Q: CONVERTER 디자인을 반드시 따라야 하나요?**
A: 네, 절대적으로 따라야 합니다. 브랜드 일관성과 개발 효율성을 위해 필수입니다.

**Q: 새로운 라이브러리를 추가해도 되나요?**
A: 최소한으로만 사용하세요. Chart.js, Math.js, Day.js 정도만 허용됩니다.

**Q: 계산기 우선순위는 어떻게 정하나요?**
A: CATEGORY.md의 Phase 1 → Phase 2 → Phase 3 순서를 따릅니다.

**Q: 다국어 번역은 어떻게 하나요?**
A: Google Translate API 또는 전문 번역 서비스를 이용합니다.

---

## 📚 참고 자료

- **CONVERTER 프로젝트**: `~/hqmx/converter`
- **CATEGORY.md**: 계산기 분류 및 우선순위
- **101.md**: 프로젝트 개요
- **Git 저장소**: https://github.com/hqmx/calculator.git

---

## 📞 문의

프로젝트 관련 문의나 이슈는 Git 저장소의 Issues에 등록해주세요.

---

**마지막 업데이트**: 2025-11-23
**문서 버전**: 1.1
**작성자**: HQMX Development Team
---

## 🚨 트러블슈팅 (Troubleshooting)

### ✅ [FIXED] 배포 및 경로 문제 (2025-12-01)

**증상:**
1.  `/calculator/` 경로에 접속 시 `main` 서비스의 콘텐츠(사이트맵)가 표시됨.
2.  페이지가 로드되더라도 CSS, JavaScript, 이미지 등 에셋 파일들이 404 오류를 반환하며 깨져 보임.

**원인:**
1.  **잘못된 배포:** `calculator` 서비스 디렉토리에 `main` 서비스의 `frontend` 파일들이 잘못 배포되어 있었음.
2.  **잘못된 경로:** 모든 HTML 파일 (`index.html` 및 하위 계산기 페이지) 내의 CSS, JS, 이미지 경로가 `/style.css` 와 같은 루트 절대 경로로 되어 있어, 서브디렉토리(`_`/calculator/`_) 환경에서 올바른 파일을 찾지 못함.

**해결 과정:**
1.  **재배포:** `./deploy.sh calculator prod` 명령어를 사용하여 올바른 `calculator/frontend` 디렉토리의 콘텐츠를 서버에 다시 배포함.
2.  **경로 수정 스크립트 작성:** 모든 HTML 파일의 에셋 및 네비게이션 경로에 `_/calculator/`_ 접두사를 추가하는 `fix_calculator_all_paths.py` 스크립트를 작성하여 실행함.
3.  **최종 배포:** 경로가 수정된 파일들을 다시 서버에 배포하여 모든 문제를 해결함.

### ✅ [FIXED] 네비게이터 언어 설정 문제 (2025-12-01)

**증상:**
- 페이지 로드 시 네비게이션 바의 언어가 'English'로 기본 설정되어 표시되지 않는 문제.

**원인:**
- `index.html`에 불필요한 `nav-common.js` 스크립트와 다른 프로젝트에서 복사된 것으로 보이는 관련 없는 스크립트 블록이 포함되어 있어, `i18n.js`의 언어 초기화 기능과 충돌을 일으킴.

**해결 과정:**
1.  `calculator/frontend/index.html`에서 불필요한 `<script src="/calculator/nav-common.js"></script>` 라인을 제거함.
2.  `index.html` 하단의 관련 없는 `DOMContentLoaded` 이벤트 리스너 스크립트 블록을 제거함.
3.  수정된 `index.html` 파일을 서버에 다시 배포하여 문제를 해결함.

### ✅ [FIXED] 긴급 복구: CSS/JS 경로 깨짐 및 Legacy Revert (2025-12-06)

**증상:**
- Calculator 서비스의 모든 CSS, JS, 이미지 파일이 404 에러를 반환하며 사이트 UI가 완전히 깨짐.
- 최근 작업으로 인해 파일 경로 체계가 꼬인 상태.

**원인:**
- 최신 코드 변경 사항이 불안정하여 UI 파손.
- 코드를 11월 29일(안정 버전)로 롤백했으나, 해당 버전은 `calculator.hqmx.net` (루트 기반) 아키텍처용으로 작성되어 있어, 현재의 `hqmx.net/calculator/` (서브디렉토리 기반) 배포 환경에서 경로 불일치 발생.
- `src="/js/..."`, `href="/css/..."` 등의 절대 경로가 `/calculator/` 접두사 없이 루트(`hqmx.net/`)를 가리킴.

**해결 과정:**
1.  **Git Revert**: `frontend/` 디렉토리를 `34a9863` (11월 29일) 커밋 상태로 강제 롤백.
2.  **경로 일괄 수정 (Batch Fix)**:
    - `fix_paths_all.py` 파이썬 스크립트를 작성하여 43개의 모든 HTML 및 JS 파일을 스캔.
    - 루트 절대 경로(`/css/`, `/js/`, `/assets/`, `/locales/` 등)를 서브디렉토리 경로(`/calculator/css/`, `/calculator/js/` 등)로 일괄 치환.
    - `i18n.js` 동적 import 경로 및 `sitemap.html` 리소스 경로 수정.
3.  **검증**: Playwright를 통해 홈 및 서브 페이지(BMI 계산기 등)의 리소스 로딩 정상화 확인 (200 OK).

**교훈:**
- 레거시 코드로 롤백할 때는 현재 배포 환경(서브디렉토리 구조)과의 호환성을 반드시 확인해야 함.
- 절대 경로 사용 시 서비스 접두사(`/calculator/`) 누락 주의.
