# CALCULATOR 프로젝트 아키텍처 설계

## 📁 폴더 구조

```
calculator/
├── frontend/
│   ├── index.html                    # 홈페이지 (카테고리 그리드)
│   ├── style.css                     # CONVERTER 기반 공통 스타일
│   ├── category.css                  # 카테고리 그리드 스타일
│   │
│   ├── assets/                       # 공통 에셋
│   │   ├── images/
│   │   ├── icons/
│   │   └── favicon 파일들
│   │
│   ├── js/                           # JavaScript 모듈
│   │   ├── common/                   # 공통 스크립트
│   │   │   ├── i18n.js              # 다국어 지원
│   │   │   ├── nav-common.js        # 네비게이션 공통
│   │   │   ├── theme.js             # 다크/라이트 모드
│   │   │   └── utils.js             # 유틸리티 함수
│   │   │
│   │   └── calculators/              # 개별 계산기 로직
│   │       ├── bmi.js
│   │       ├── mortgage.js
│   │       ├── percentage.js
│   │       └── ...
│   │
│   ├── general/                      # 일반 계산기 카테고리
│   │   ├── GEMINI.md                # 카테고리 콘텐츠 관리
│   │   ├── basic-calculator.html
│   │   ├── scientific-calculator.html
│   │   ├── percentage-calculator.html
│   │   ├── fraction-calculator.html
│   │   └── engineering-calculator.html
│   │
│   ├── finance/                      # 금융 카테고리
│   │   ├── GEMINI.md
│   │   ├── mortgage-calculator.html
│   │   ├── loan-calculator.html
│   │   ├── interest-calculator.html
│   │   ├── tax-calculator.html
│   │   ├── salary-calculator.html
│   │   ├── roi-calculator.html
│   │   ├── currency-converter.html
│   │   └── tip-calculator.html
│   │
│   ├── health/                       # 건강 & 피트니스 카테고리
│   │   ├── GEMINI.md
│   │   ├── bmi-calculator.html
│   │   ├── calorie-calculator.html
│   │   ├── weight-loss-calculator.html
│   │   ├── pregnancy-calculator.html
│   │   ├── ovulation-calculator.html
│   │   └── protein-calculator.html
│   │
│   ├── date-time/                    # 날짜 & 시간 카테고리
│   │   ├── GEMINI.md
│   │   ├── age-calculator.html
│   │   ├── date-calculator.html
│   │   ├── time-calculator.html
│   │   ├── work-hours-calculator.html
│   │   ├── timezone-converter.html
│   │   └── countdown-timer.html
│   │
│   ├── math/                         # 수학 카테고리
│   │   ├── GEMINI.md
│   │   ├── equation-solver.html
│   │   ├── matrix-calculator.html
│   │   ├── probability-calculator.html
│   │   ├── statistics-calculator.html
│   │   ├── gcd-calculator.html
│   │   ├── prime-calculator.html
│   │   └── triangle-calculator.html
│   │
│   ├── conversion/                   # 단위 변환 카테고리
│   │   ├── GEMINI.md
│   │   ├── length-converter.html
│   │   ├── weight-converter.html
│   │   ├── temperature-converter.html
│   │   ├── area-converter.html
│   │   ├── volume-converter.html
│   │   ├── speed-converter.html
│   │   ├── pressure-converter.html
│   │   └── energy-converter.html
│   │
│   ├── media/                        # 미디어 & 기술 카테고리
│   │   ├── GEMINI.md
│   │   ├── pixel-calculator.html
│   │   ├── screen-size-calculator.html
│   │   ├── bitrate-calculator.html
│   │   ├── download-time-calculator.html
│   │   ├── subnet-calculator.html
│   │   └── storage-calculator.html
│   │
│   └── construction/                 # 건축 & DIY 카테고리
│       ├── GEMINI.md
│       ├── paint-calculator.html
│       ├── tile-calculator.html
│       ├── wallpaper-calculator.html
│       ├── concrete-calculator.html
│       └── stair-calculator.html
```

---

## 🎯 설계 원칙

### 1. 단일 페이지 자체 완결성
- **별도 how-to-use 페이지 없음**: 각 계산기 페이지가 자체적으로 사용법 설명
- **페이지 내 섹션 구성**:
  ```html
  <main>
    <!-- 계산기 인터페이스 -->
    <section class="calculator-section"></section>

    <!-- 사용 방법 (임베디드) -->
    <section class="how-to-use-section"></section>

    <!-- 예시 및 팁 -->
    <section class="examples-section"></section>

    <!-- FAQ (계산기별) -->
    <section class="faq-section"></section>
  </main>
  ```

### 2. 카테고리별 GEMINI.md 역할
각 카테고리 폴더의 `GEMINI.md`는 해당 카테고리의 모든 계산기에 대한:
- 계산기별 제목 및 설명
- 입력 필드 레이블 및 설명
- 사용 방법 단계별 가이드
- 예시 데이터
- FAQ 콘텐츠
- 다국어 키워드

**구조 예시**:
```markdown
# Finance Category - Calculator Contents

## Mortgage Calculator

### Page Metadata
- Title: "Mortgage Calculator - Calculate Your Monthly Payment | HQMX"
- Description: "Calculate monthly mortgage payments with taxes and insurance..."
- Keywords: "mortgage calculator, home loan, monthly payment"

### Calculator Interface
**Input Fields**:
- Loan Amount ($): "Enter your home loan amount"
- Interest Rate (%): "Annual interest rate"
- Loan Term (years): "Length of the mortgage"
- Property Tax ($/year): "Annual property tax"
- Insurance ($/year): "Homeowners insurance premium"

### How to Use Section
1. Enter your loan amount
2. Input your interest rate
3. Select loan term
4. ...

### Examples
**Example 1**: $300,000 loan at 4.5% for 30 years
**Example 2**: $500,000 loan at 3.8% for 15 years

### FAQ
Q: What is included in monthly payment?
A: Principal, interest, taxes, and insurance (PITI)
...
```

### 3. CONVERTER 디자인 완전 복제
- `index.html.backup`에서 레이아웃, 색상, 컴포넌트 추출
- 네비게이션, 헤더, 푸터는 동일
- 파일 업로드 섹션 → 계산기 인터페이스로 교체
- Features, Usage Guide 섹션 → 계산기별 맞춤 콘텐츠

---

## 🚀 구현 전략

### Phase 1: 기반 구축 (1주)
1. **폴더 구조 생성**: 8개 카테고리 폴더 생성
2. **템플릿 추출**: index.html.backup → calculator-template.html
3. **공통 컴포넌트**:
   - 네비게이션 (nav-common.js)
   - 다국어 (i18n.js)
   - 테마 전환 (theme.js)
   - 유틸리티 (utils.js)

### Phase 2: 우선순위 계산기 (Phase 1 - 15개) (3-4주)
CATEGORY.md Phase 1 순서대로 구현:

1. ⭐ **BMI Calculator** (health/) - 난이도: 하 (1-2일)
2. ⭐ **Currency Converter** (finance/) - 난이도: 중 (3-5일, API 필요)
3. ⭐ **Mortgage Calculator** (finance/) - 난이도: 상 (7-14일)
4. ⭐ **Calorie Calculator** (health/) - 난이도: 중
5. ⭐ **Basic Calculator** (general/) - 난이도: 하
6. ⭐ **Age Calculator** (date-time/) - 난이도: 하
7. ⭐ **Tax Calculator** (finance/) - 난이도: 상
8. ⭐ **Pregnancy Calculator** (health/) - 난이도: 중
9. ⭐ **Weight Loss Calculator** (health/) - 난이도: 중
10. ⭐ **Loan Calculator** (finance/) - 난이도: 상
11. ⭐ **Percentage Calculator** (general/) - 난이도: 하
12. ⭐ **Length Converter** (conversion/) - 난이도: 하
13. ⭐ **Weight Converter** (conversion/) - 난이도: 하
14. ⭐ **Scientific Calculator** (general/) - 난이도: 상
15. ⭐ **Date Calculator** (date-time/) - 난이도: 중

### Phase 3: 나머지 계산기 (Phase 2-3) (2-3개월)

---

## 📝 계산기 페이지 템플릿 구조

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <!-- SEO 메타태그 (계산기별 맞춤) -->
    <title>[Calculator Name] - Free Online Calculator | HQMX</title>
    <meta name="description" content="[Calculator-specific description]">
    <meta name="keywords" content="[calculator-specific keywords]">

    <!-- CONVERTER 기반 CSS -->
    <link rel="stylesheet" href="/style.css">
    <link rel="stylesheet" href="/category.css">

    <!-- Favicon -->
    <link rel="icon" type="image/png" href="/assets/favicon-96x96.png">
</head>
<body>
    <div class="container">
        <!-- CONVERTER 네비게이션 (공통) -->
        <nav class="top-nav">
            <!-- 로고, 메뉴, 테마, 언어 선택 -->
        </nav>

        <!-- 헤더 (계산기별 맞춤) -->
        <header class="header">
            <h1>[Calculator Name]</h1>
            <p class="tagline">[Calculator tagline]</p>
        </header>

        <main class="main-content">
            <!-- 계산기 인터페이스 섹션 -->
            <section class="calculator-section">
                <div class="calculator-container">
                    <!-- 입력 필드 -->
                    <div class="input-group">
                        <label>[Field Label]</label>
                        <input type="number" id="field1">
                    </div>

                    <!-- 계산 버튼 -->
                    <button class="calculate-btn">Calculate</button>

                    <!-- 결과 표시 -->
                    <div class="result-display">
                        <h3>Result</h3>
                        <p id="result"></p>
                    </div>
                </div>
            </section>

            <!-- 사용 방법 섹션 (임베디드) -->
            <section class="usage-guide-section">
                <h3>How to Use</h3>
                <div class="guide-steps">
                    <div class="step">
                        <span class="step-number">1</span>
                        <h4>[Step Title]</h4>
                        <p>[Step Description]</p>
                    </div>
                    <!-- More steps -->
                </div>
            </section>

            <!-- 예시 섹션 -->
            <section class="examples-section">
                <h3>Examples</h3>
                <div class="example-grid">
                    <div class="example-card">
                        <h4>Example 1</h4>
                        <p>[Example details]</p>
                    </div>
                </div>
            </section>

            <!-- FAQ 섹션 (계산기별) -->
            <section class="faq-section">
                <h3>Frequently Asked Questions</h3>
                <div class="faq-item">
                    <h4>[Question]</h4>
                    <p>[Answer]</p>
                </div>
            </section>

            <!-- Features 섹션 (CONVERTER 스타일) -->
            <section class="feature-section">
                <div class="feature-item">
                    <i class="fas fa-icon"></i>
                    <h4>[Feature Title]</h4>
                    <p>[Feature Description]</p>
                </div>
            </section>
        </main>

        <!-- CONVERTER 푸터 (공통) -->
        <footer>
            <!-- 소셜, 저작권 -->
        </footer>
    </div>

    <!-- Scripts -->
    <script src="/js/common/i18n.js"></script>
    <script src="/js/common/nav-common.js"></script>
    <script src="/js/common/theme.js"></script>
    <script src="/js/calculators/[calculator-name].js"></script>
</body>
</html>
```

---

## 🔧 기술 구현 가이드

### 1. 템플릿 생성 워크플로우
```bash
# 1. index.html.backup에서 공통 부분 추출
- 네비게이션, 헤더, 푸터 추출
- CSS 클래스 체계 파악
- JavaScript 공통 함수 식별

# 2. calculator-template.html 생성
- 계산기 인터페이스 섹션 추가
- CONVERTER 스타일 유지
- 플레이스홀더로 변수화

# 3. 각 계산기별 콘텐츠 주입
- 카테고리 GEMINI.md에서 콘텐츠 읽기
- 템플릿에 맞춰 HTML 생성
- 계산기 로직 JavaScript 연결
```

### 2. 카테고리 GEMINI.md 활용
```javascript
// 스크립트로 GEMINI.md 파싱하여 HTML 생성 가능
// 또는 수동으로 콘텐츠 복사-붙여넣기
```

### 3. 다국어 지원
```javascript
// i18n.js 확장
const translations = {
  en: {
    calculators: {
      bmi: {
        title: "BMI Calculator",
        weight: "Weight (kg)",
        height: "Height (cm)",
        // ...
      }
    }
  },
  ko: {
    calculators: {
      bmi: {
        title: "BMI 계산기",
        weight: "체중 (kg)",
        height: "키 (cm)",
        // ...
      }
    }
  }
};
```

---

## ✅ 품질 체크리스트

각 계산기 완료 시 확인:
- [ ] CONVERTER 디자인 완전 복제
- [ ] 모바일 반응형 테스트
- [ ] 다양한 입력값 테스트
- [ ] 에러 처리 구현
- [ ] SEO 메타태그 최적화
- [ ] 사용 방법 섹션 작성
- [ ] 예시 및 FAQ 추가
- [ ] 21개 언어 번역 (i18n.js)
- [ ] 크로스 브라우저 테스트
- [ ] Lighthouse 점수 90+

---

## 🎯 즉시 실행 액션

### Step 1: 폴더 구조 생성
```bash
mkdir -p frontend/{general,finance,health,date-time,math,conversion,media,construction}
mkdir -p frontend/js/{common,calculators}
```

### Step 2: 카테고리 GEMINI.md 템플릿 생성
각 카테고리 폴더에 GEMINI.md 템플릿 생성

### Step 3: BMI Calculator 프로토타입
- health/bmi-calculator.html
- health/GEMINI.md (BMI 콘텐츠)
- js/calculators/bmi.js

### Step 4: 검증 및 반복
프로토타입 완성 → 검토 → 나머지 계산기에 패턴 적용

---

**다음 단계**: BMI Calculator 프로토타입 개발 시작
