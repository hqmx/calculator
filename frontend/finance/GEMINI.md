# Finance Category - Content Management

이 파일은 Finance 카테고리의 모든 계산기 페이지에서 사용할 콘텐츠를 관리합니다.

---

## 1. Currency Converter (환율 변환기)

### Metadata
```yaml
title: "Currency Converter - Live Exchange Rates | HQMX"
description: "Free online currency converter. Convert between USD, EUR, KRW, JPY, and 160+ currencies with real-time exchange rates. Accurate and fast."
keywords: "currency converter, exchange rate calculator, money converter, currency exchange, 환율 계산기, 환율 변환기, 환율 조회"
url_slug: "currency-converter"
category: "finance"
priority: "high"
monthly_searches: 1500000
```

### Page Title
**English**: Currency Converter - Live Exchange Rates
**Korean**: 환율 변환기 - 실시간 환율 계산

### Description
Convert currencies instantly with real-time exchange rates. Supports over 160 currencies including USD, EUR, KRW, JPY, CNY, and GBP. Perfect for travelers, international shopping, and business.

### Features
1. **Real-Time Rates**
   - Live exchange rate updates
   - Data from reliable financial sources
   - Support for 160+ world currencies

2. **User-Friendly Interface**
   - Instant conversion as you type
   - Easy currency search and selection
   - Swap currencies with one click

3. **Smart Features**
   - Auto-detect local currency (optional)
   - Historical rate charts (Phase 2)
   - Offline mode support (last known rates)

### How to Use (3 Steps)
1. **Enter Amount**: Type the amount you want to convert
2. **Select Currencies**: Choose the source currency (From) and target currency (To)
3. **View Result**: See the converted amount instantly

### API Integration
- **Provider**: ExchangeRate-API (Open Access or Free Tier)
- **Endpoint**: `https://open.er-api.com/v6/latest/USD` (Example)
- **Update Frequency**: Daily (Free) or Real-time (Premium) - We will use the standard free tier which updates daily/hourly depending on the specific endpoint used.

### Supported Major Currencies
- USD (United States Dollar)
- EUR (Euro)
- KRW (South Korean Won)
- JPY (Japanese Yen)
- GBP (British Pound)
- CNY (Chinese Yuan)
- AUD (Australian Dollar)
- CAD (Canadian Dollar)
- CHF (Swiss Franc)
- HKD (Hong Kong Dollar)

### FAQ
**Q: Are the exchange rates accurate?**
A: Yes, we use professional-grade currency data sources. However, for actual transactions, rates may vary slightly due to bank fees.

**Q: How often are rates updated?**
A: Rates are updated regularly to ensure accuracy.

**Q: Can I convert crypto currencies?**
A: Currently we support major fiat currencies. Crypto support may be added in future updates.

---

## Common Elements for Finance Calculators

### Navigation Menu Items
```javascript
const financeCalculators = [
    { name: 'Currency Converter', url: '/finance/currency-converter.html' },
    { name: 'Mortgage Calculator', url: '/finance/mortgage-calculator.html' },
    { name: 'Loan Calculator', url: '/finance/loan-calculator.html' },
    { name: 'Tax Calculator', url: '/finance/tax-calculator.html' },
    { name: 'Salary Calculator', url: '/finance/salary-calculator.html' }
];
```

---

**최종 업데이트**: 2025-11-23
**버전**: 1.0
**관리**: HQMX Development Team
