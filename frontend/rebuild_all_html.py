#!/usr/bin/env python3
"""
모든 HTML 파일을 temperature-converter-v2.html 구조로 재생성
"""

import os
from pathlib import Path

# Base template (temperature-converter-v2.html의 최신 구조)
BASE_TEMPLATE = '''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title}</title>
    <meta name="description" content="{description}">

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="/style.css?v=20251101blur2">
    <link rel="stylesheet" href="/css/calculator.css">

    <link rel="icon" type="image/png" href="/assets/favicon-96x96.png" sizes="96x96" />
    <link rel="icon" type="image/svg+xml" href="/assets/favicon.svg" />
    <link rel="shortcut icon" href="/assets/favicon.ico" />
</head>
<body>
    <div class="container">
        <!-- Navigation Header -->
        <nav class="top-nav">
            <div class="nav-left">
                <a href="/" class="converter-logo-link">
                    <div class="converter-logo">
                        <span class="converter-text"><span class="converter-c">C</span><span class="converter-rest">ALCULATOR</span></span>
                    </div>
                </a>
            </div>

            <div class="nav-center">
                <!-- 햄버거 메뉴 버튼 (모바일용) -->
                <button class="hamburger-menu" id="hamburgerMenu">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>

                <div class="nav-menu">
                    <a href="/" class="nav-link">Home</a>
                    <a href="/how-to-use.html" class="nav-link">How to Use</a>
                    <a href="/faq.html" class="nav-link">FAQ</a>
                    <a href="/sitemap.html" class="nav-link">Site Map</a>
                    <a href="/api.html" class="nav-link">API</a>
                </div>

                <!-- 모바일 메뉴 오버레이 -->
                <div class="mobile-menu-overlay" id="mobileMenuOverlay">
                    <div class="mobile-menu-box">
                        <div class="mobile-menu-links">
                            <a href="/" class="mobile-menu-link">Home</a>
                            <a href="/how-to-use.html" class="mobile-menu-link">How to Use</a>
                            <a href="/faq.html" class="mobile-menu-link">FAQ</a>
                            <a href="/sitemap.html" class="mobile-menu-link">Site Map</a>
                            <a href="/api.html" class="mobile-menu-link">API</a>
                        </div>

                        <div class="mobile-menu-controls">
                            <div class="mobile-control-item menu-divider">
                                <button id="mobileThemeToggleBtn" class="mobile-theme-toggle-btn">
                                    <i class="fas fa-sun"></i>
                                    <i class="fas fa-moon"></i>
                                </button>
                                <button id="mobileLanguageSelectorBtn" class="mobile-language-selector-btn">
                                    <i class="fas fa-globe"></i>
                                    <span id="mobileCurrentLanguage">EN</span>
                                    <i class="fas fa-chevron-down"></i>
                                </button>
                            </div>
                            <div class="mobile-control-item">
                                <div id="mobileLanguageOptions" class="mobile-language-options">
                                    <a href="#" data-lang="en">English</a>
                                    <a href="#" data-lang="ko">한국어</a>
                                    <a href="#" data-lang="es">Español</a>
                                    <a href="#" data-lang="fr">Français</a>
                                    <a href="#" data-lang="de">Deutsch</a>
                                    <a href="#" data-lang="ja">日本語</a>
                                    <a href="#" data-lang="zh-CN">简体中文</a>
                                    <a href="#" data-lang="zh-TW">繁體中文</a>
                                    <a href="#" data-lang="pt">Português</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="nav-right">
                <button id="themeToggleBtn" class="theme-toggle-btn">
                    <i class="fas fa-sun"></i>
                    <i class="fas fa-moon"></i>
                </button>
                <div class="language-switcher">
                    <button id="language-selector-btn" class="language-selector-btn">
                        <i class="fas fa-globe"></i>
                        <span id="current-language">English</span>
                        <i class="fas fa-chevron-down"></i>
                    </button>
                    <div id="language-options" class="language-options">
                        <a href="#" data-lang="en">English</a>
                        <a href="#" data-lang="ko">한국어</a>
                        <a href="#" data-lang="es">Español</a>
                        <a href="#" data-lang="fr">Français</a>
                        <a href="#" data-lang="de">Deutsch</a>
                        <a href="#" data-lang="ja">日本語</a>
                        <a href="#" data-lang="zh-CN">简体中文</a>
                        <a href="#" data-lang="zh-TW">繁體中文</a>
                        <a href="#" data-lang="pt">Português</a>
                        <a href="#" data-lang="ru">Русский</a>
                        <a href="#" data-lang="ar">عربي</a>
                        <a href="#" data-lang="hi">हिन्दी</a>
                        <a href="#" data-lang="th">ไทย</a>
                        <a href="#" data-lang="vi">Tiếng Việt</a>
                        <a href="#" data-lang="id">Bahasa Indonesia</a>
                        <a href="#" data-lang="it">Italiano</a>
                        <a href="#" data-lang="tr">Türkçe</a>
                    </div>
                </div>
            </div>
        </nav>

        <header class="header">
            <p class="tagline">{tagline}</p>
        </header>

        <main class="main-content">
            {content}
        </main>

        <footer>
            <div class="footer-social">
                <a href="https://x.com/8hqmx" target="_blank" rel="noopener noreferrer" class="footer-twitter" aria-label="Follow us on X (Twitter)">
                    <img src="/assets/x-twitter-footer.svg" alt="X (Twitter)" class="footer-social-icon">
                </a>
            </div>
            <p>
                <span>&copy; 2025 HQMX Calculator. All Rights Reserved.</span>
                <span class="footer-contact"> • support@hqmx.net</span>
            </p>
        </footer>
    </div>

    <script src="/js/main.js"></script>
    {scripts}
</body>
</html>
'''

# 계산기 정의
CALCULATORS = {
    'conversion/length-converter.html': {
        'title': 'Length Converter - Convert Between Length Units | CALCULATOR',
        'description': 'Free online length converter. Convert between meters, feet, inches, centimeters, kilometers, miles, and more.',
        'tagline': 'Length Converter',
        'category': 'conversion',
        'scripts': '<script src="/js/utils/unit-converter.js"></script>\n    <script src="/js/calculators/length.js"></script>',
        'content': '''            <section class="upload-section">
                <div class="upload-container">
                    <h4>Convert between different length units</h4>

                    <div class="converter-grid">
                        <div class="converter-box">
                            <div class="converter-label">From</div>
                            <input type="number" id="fromValue" class="converter-input" value="0" step="any" autofocus>
                            <select id="fromUnit" class="converter-select">
                                <option value="m" selected>Meter (m)</option>
                                <option value="km">Kilometer (km)</option>
                                <option value="cm">Centimeter (cm)</option>
                                <option value="mm">Millimeter (mm)</option>
                                <option value="mi">Mile (mi)</option>
                                <option value="yd">Yard (yd)</option>
                                <option value="ft">Foot (ft)</option>
                                <option value="in">Inch (in)</option>
                            </select>
                        </div>

                        <button id="swapBtn" class="swap-btn" title="Swap units">
                            <i class="fas fa-exchange-alt"></i>
                        </button>

                        <div class="converter-box">
                            <div class="converter-label">To</div>
                            <input type="text" id="toValue" class="converter-input" readonly>
                            <select id="toUnit" class="converter-select">
                                <option value="m">Meter (m)</option>
                                <option value="km">Kilometer (km)</option>
                                <option value="cm">Centimeter (cm)</option>
                                <option value="mm">Millimeter (mm)</option>
                                <option value="mi">Mile (mi)</option>
                                <option value="yd">Yard (yd)</option>
                                <option value="ft" selected>Foot (ft)</option>
                                <option value="in">Inch (in)</option>
                            </select>
                        </div>
                    </div>
                </div>
            </section>

            <section class="info-section">
                <h3>Common Length Conversions</h3>
                <div class="reference-table-container">
                    <table class="reference-table">
                        <thead>
                            <tr>
                                <th>Conversion</th>
                                <th>Formula</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Meters to Feet</td>
                                <td>multiply by 3.28084</td>
                            </tr>
                            <tr>
                                <td>Kilometers to Miles</td>
                                <td>multiply by 0.621371</td>
                            </tr>
                            <tr>
                                <td>Centimeters to Inches</td>
                                <td>multiply by 0.393701</td>
                            </tr>
                            <tr>
                                <td>Feet to Meters</td>
                                <td>multiply by 0.3048</td>
                            </tr>
                            <tr>
                                <td>Miles to Kilometers</td>
                                <td>multiply by 1.60934</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>'''
    },
    # 다른 계산기들도 추가 가능
}

def generate_html(config):
    """HTML 생성"""
    # Active class 설정
    active_classes = {
        'general_active': ' active' if config['category'] == 'general' else '',
        'finance_active': ' active' if config['category'] == 'finance' else '',
        'health_active': ' active' if config['category'] == 'health' else '',
        'conversion_active': ' active' if config['category'] == 'conversion' else '',
        'datetime_active': ' active' if config['category'] == 'date-time' else '',
    }

    return BASE_TEMPLATE.format(
        title=config['title'],
        description=config['description'],
        tagline=config['tagline'],
        content=config['content'],
        scripts=config['scripts'],
        **active_classes
    )

def main():
    """모든 계산기 HTML 생성"""
    frontend_dir = Path('/Users/wonjunjang/hqmx/calculator/frontend')

    for file_path, config in CALCULATORS.items():
        full_path = frontend_dir / file_path
        html_content = generate_html(config)

        with open(full_path, 'w', encoding='utf-8') as f:
            f.write(html_content)

        print(f"✅ Generated: {file_path}")

    print(f"\n✅ All {len(CALCULATORS)} calculator(s) generated!")

if __name__ == '__main__':
    main()
