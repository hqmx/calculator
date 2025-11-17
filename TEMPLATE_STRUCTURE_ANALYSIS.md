# CALCULATOR HTML Template Structure Analysis

## Executive Summary

Analysis of `index.html.backup` (CONVERTER template) vs `temperature-converter-v2.html` reveals **critical structural elements missing** from calculator pages. This document provides the complete, correct HTML structure for all calculator pages.

---

## 1. COMPLETE NAVIGATION STRUCTURE

### 1.1 Desktop Navigation (nav-left)
```html
<div class="nav-left">
    <a href="/" class="converter-logo-link">
        <div class="converter-logo">
            <span class="converter-text">
                <span class="converter-c">C</span>
                <span class="converter-rest">ALCULATOR</span>
            </span>
        </div>
    </a>
</div>
```

### 1.2 Mobile Menu with Complete Controls
**MISSING in temperature-converter-v2.html:**

```html
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
            <a href="#" data-lang="de">Deutsch</a>
            <a href="#" data-lang="es">Español</a>
            <a href="#" data-lang="fr">Français</a>
            <a href="#" data-lang="hi">हिन्दी / Hindī</a>
            <a href="#" data-lang="id">Bahasa Indonesia</a>
            <a href="#" data-lang="it">Italiano</a>
            <a href="#" data-lang="ko">한국어</a>
            <a href="#" data-lang="ja">日本語</a>
            <a href="#" data-lang="my">Myanmar (မြန်မာ)</a>
            <a href="#" data-lang="ms">Malay</a>
            <a href="#" data-lang="fil">Filipino</a>
            <a href="#" data-lang="pt">Português</a>
            <a href="#" data-lang="ru">Русский</a>
            <a href="#" data-lang="th">ไทย</a>
            <a href="#" data-lang="tr">Türkçe</a>
            <a href="#" data-lang="vi">Tiếng Việt</a>
            <a href="#" data-lang="zh-CN">简体中文</a>
            <a href="#" data-lang="zh-TW">繁體中文</a>
            <a href="#" data-lang="ar">عربي</a>
            <a href="#" data-lang="bn">বাঙালি</a>
        </div>
    </div>
</div>
```

### 1.3 Desktop Right Controls (nav-right)
**MISSING in temperature-converter-v2.html:**

```html
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
            <a href="#" data-lang="de">Deutsch</a>
            <a href="#" data-lang="es">Español</a>
            <a href="#" data-lang="fr">Français</a>
            <a href="#" data-lang="hi">हिन्दी / Hindī</a>
            <a href="#" data-lang="id">Bahasa Indonesia</a>
            <a href="#" data-lang="it">Italiano</a>
            <a href="#" data-lang="ko">한국어</a>
            <a href="#" data-lang="ja">日本語</a>
            <a href="#" data-lang="my">Myanmar (မြန်မာ)</a>
            <a href="#" data-lang="ms">Malay</a>
            <a href="#" data-lang="fil">Filipino</a>
            <a href="#" data-lang="pt">Português</a>
            <a href="#" data-lang="ru">Русский</a>
            <a href="#" data-lang="th">ไทย</a>
            <a href="#" data-lang="tr">Türkçe</a>
            <a href="#" data-lang="vi">Tiếng Việt</a>
            <a href="#" data-lang="zh-CN">简体中文</a>
            <a href="#" data-lang="zh-TW">繁體中文</a>
            <a href="#" data-lang="ar">عربي</a>
            <a href="#" data-lang="bn">বাঙালি</a>
        </div>
    </div>
</div>
```

---

## 2. COMPLETE FOOTER STRUCTURE

### 2.1 Sitemap Section
**COMPLETELY MISSING in temperature-converter-v2.html:**

```html
<section class="sitemap">
    <div class="sitemap-content">
        <div class="sitemap-bottom">
            <!-- LEFT: CONVERTER Logo -->
            <div class="sitemap-side sitemap-left">
                <a href="https://hqmx.net" class="logo-link converter-link">
                    <div class="converter-logo">
                        <span class="converter-text">
                            <span class="converter-c">C</span>
                            <span class="converter-rest">ONVERTER</span>
                        </span>
                    </div>
                </a>
                <button class="sitemap-expand-btn converter-expand-btn" id="converterExpandBtn">
                    <i class="fas fa-plus"></i>
                </button>
            </div>

            <!-- CENTER: HQMX Brand -->
            <div class="sitemap-center">
                <a href="https://hqmx.net" class="hqmx-brand-link">
                    <div class="hqmx-brand">
                        <h1>HQM<span class="logo-x">X</span></h1>
                    </div>
                </a>
                <p class="sitemap-tagline">High Quality Media X</p>
                <h3 class="sitemap-title">Site Map</h3>
            </div>

            <!-- RIGHT: DOWNLOADER Logo -->
            <div class="sitemap-side sitemap-right">
                <a href="https://downloader.hqmx.net" class="logo-link downloader-link">
                    <div class="downloader-logo">
                        <span class="downloader-text">
                            <span class="downloader-d">D</span>
                            <span class="downloader-rest">OWNLOADER</span>
                        </span>
                    </div>
                </a>
                <button class="sitemap-expand-btn downloader-expand-btn" id="downloaderExpandBtn">
                    <i class="fas fa-plus"></i>
                </button>
            </div>
        </div>

        <!-- Category Icon Navigation (for CONVERTER) -->
        <div class="category-icons-nav">
            <button class="category-icon-btn" data-category="cross-category" title="Cross-Category Conversions">
                <i class="fas fa-fire"></i>
            </button>
            <button class="category-icon-btn" data-category="video" title="Video Conversions">
                <i class="fas fa-video"></i>
            </button>
            <button class="category-icon-btn" data-category="image" title="Image Conversions">
                <i class="fas fa-image"></i>
            </button>
            <button class="category-icon-btn" data-category="audio" title="Audio Conversions">
                <i class="fas fa-music"></i>
            </button>
            <button class="category-icon-btn" data-category="document" title="Document Conversions">
                <i class="fas fa-file-alt"></i>
            </button>
            <button class="category-icon-btn" data-category="archive" title="Archive Conversions">
                <i class="fas fa-file-archive"></i>
            </button>
        </div>

        <!-- Platform Icon Navigation (for DOWNLOADER) -->
        <div class="platform-icons-nav">
            <a href="https://downloader.hqmx.net/en/instagram" class="platform-icon-link">
                <button class="platform-icon-btn" data-platform="instagram" title="Instagram Downloader">
                    <img src="https://cdn.simpleicons.org/instagram/E4405F" alt="Instagram">
                </button>
            </a>
            <a href="https://downloader.hqmx.net/en/tiktok" class="platform-icon-link">
                <button class="platform-icon-btn" data-platform="tiktok" title="TikTok Downloader">
                    <img src="https://cdn.simpleicons.org/tiktok/010101" alt="TikTok">
                </button>
            </a>
            <a href="https://downloader.hqmx.net/en/facebook" class="platform-icon-link">
                <button class="platform-icon-btn" data-platform="facebook" title="Facebook Downloader">
                    <img src="https://cdn.simpleicons.org/facebook/1877F2" alt="Facebook">
                </button>
            </a>
            <a href="https://downloader.hqmx.net/en/twitter" class="platform-icon-link">
                <button class="platform-icon-btn" data-platform="twitter" title="X (Twitter) Downloader">
                    <img src="https://cdn.simpleicons.org/x/000000" alt="X (Twitter)" class="x-icon">
                </button>
            </a>
            <a href="https://downloader.hqmx.net/en/reddit" class="platform-icon-link">
                <button class="platform-icon-btn" data-platform="reddit" title="Reddit Downloader">
                    <img src="https://cdn.simpleicons.org/reddit/FF4500" alt="Reddit">
                </button>
            </a>
            <a href="https://downloader.hqmx.net/en/pinterest" class="platform-icon-link">
                <button class="platform-icon-btn" data-platform="pinterest" title="Pinterest Downloader">
                    <img src="https://cdn.simpleicons.org/pinterest/E60023" alt="Pinterest">
                </button>
            </a>
            <a href="https://soundcloud.hqmx.net" class="platform-icon-link">
                <button class="platform-icon-btn" data-platform="soundcloud" title="SoundCloud Downloader">
                    <img src="https://cdn.simpleicons.org/soundcloud/FF5500" alt="SoundCloud">
                </button>
            </a>
            <a href="https://dailymotion.hqmx.net" class="platform-icon-link">
                <button class="platform-icon-btn" data-platform="dailymotion" title="Dailymotion Downloader">
                    <img src="https://cdn.simpleicons.org/dailymotion/0066DC" alt="Dailymotion">
                </button>
            </a>
            <a href="https://tumblr.hqmx.net" class="platform-icon-link">
                <button class="platform-icon-btn" data-platform="tumblr" title="Tumblr Downloader">
                    <img src="https://cdn.simpleicons.org/tumblr/36465D" alt="Tumblr">
                </button>
            </a>
        </div>

        <!-- Supported Conversions Section -->
        <div class="supported-conversions">
            <p class="section-description">683 conversion combinations across 6 categories • Click any badge to start converting</p>

            <!-- Cross-Category Conversions -->
            <div class="conversion-category" data-category="cross-category">
                <div class="conversion-badges-container">
                    <div class="conversion-badges">
                        <a href="https://hqmx.net/convert/jpg-to-pdf" class="conversion-badge">
                            <span class="badge-front">JPG-PDF</span>
                            <span class="badge-back">PDF-JPG</span>
                        </a>
                        <!-- ... more badges ... -->
                    </div>
                </div>
            </div>

            <!-- Video Conversions -->
            <div class="conversion-category" data-category="video">
                <div class="conversion-badges-container">
                    <div class="conversion-badges">
                        <!-- Video conversion badges -->
                    </div>
                </div>
            </div>

            <!-- Image, Audio, Document, Archive categories... -->
        </div>
    </div>
</section>
```

### 2.2 Footer Copyright
```html
<footer>
    <div class="footer-social">
        <a href="https://x.com/8hqmx" target="_blank" rel="noopener noreferrer" class="footer-twitter" aria-label="Follow us on X (Twitter)">
            <img src="/assets/x-twitter-footer.svg" alt="X (Twitter)" class="footer-social-icon">
        </a>
    </div>
    <p>
        <span>&copy; 2024 HQMX Converter. All Rights Reserved.</span>
        <span class="footer-contact"> • support@hqmx.net</span>
    </p>
</footer>
```

---

## 3. CONTAINER HIERARCHY

### 3.1 Proper Nesting Structure
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <!-- Meta tags, stylesheets, favicons -->
</head>
<body>
    <div class="container">
        <!-- Navigation -->
        <nav class="top-nav">...</nav>

        <!-- Header -->
        <header class="header">
            <p class="tagline">Calculator Title</p>
        </header>

        <!-- Main Content -->
        <main class="main-content">
            <!-- Calculator Section -->
            <section class="upload-section">
                <div class="upload-container">
                    <!-- Calculator UI -->
                </div>
            </section>

            <!-- Info/Reference Sections -->
            <section class="info-section">...</section>
        </main>
    </div>

    <!-- Sitemap (OUTSIDE container) -->
    <section class="sitemap">...</section>

    <!-- Footer (OUTSIDE container) -->
    <footer>...</footer>

    <!-- Scripts -->
</body>
</html>
```

**CRITICAL:** Sitemap and Footer are **OUTSIDE** `.container` div.

---

## 4. CSS CLASSES AND LAYOUT

### 4.1 Essential Classes Present in Backup
```css
/* Container Structure */
.container                  /* Main wrapper with blur background */
.top-nav                    /* Navigation bar */
.nav-left, .nav-center, .nav-right  /* Nav sections */
.header                     /* Page title area */
.main-content               /* Content wrapper */

/* Navigation */
.hamburger-menu             /* Mobile menu button */
.mobile-menu-overlay        /* Mobile menu container */
.mobile-menu-box            /* Mobile menu content */
.mobile-menu-links          /* Mobile menu navigation */
.mobile-menu-controls       /* Theme/language controls */
.menu-divider               /* Visual separator */

/* Language/Theme Controls */
.language-switcher          /* Desktop language dropdown */
.language-selector-btn      /* Language button */
.language-options           /* Language dropdown menu */
.theme-toggle-btn           /* Theme switch button */
.mobile-theme-toggle-btn    /* Mobile theme switch */
.mobile-language-selector-btn  /* Mobile language button */
.mobile-language-options    /* Mobile language dropdown */

/* Sitemap */
.sitemap                    /* Sitemap section */
.sitemap-content            /* Sitemap container */
.sitemap-bottom             /* Logo row */
.sitemap-side               /* Left/right logo containers */
.sitemap-center             /* Center HQMX brand */
.sitemap-expand-btn         /* Expand buttons (+) */
.category-icons-nav         /* CONVERTER categories */
.platform-icons-nav         /* DOWNLOADER platforms */
.supported-conversions      /* Conversion badges area */
.conversion-category        /* Category wrapper */
.conversion-badges-container /* Badges wrapper */
.conversion-badge           /* Individual badge */

/* Calculator Specific */
.upload-section             /* Calculator container section */
.upload-container           /* Calculator wrapper */
.converter-grid             /* Calculator layout grid */
.converter-box              /* Input/output box */
.converter-label            /* Input label */
.converter-input            /* Input field */
.converter-select           /* Dropdown select */
.swap-btn                   /* Swap button */
.info-section               /* Information section */
.reference-table            /* Reference data table */
```

---

## 5. JAVASCRIPT DEPENDENCIES

### 5.1 Required Scripts (in order)
```html
<!-- Common Navigation -->
<script src="/nav-common.js"></script>

<!-- Calculator Specific -->
<script src="/js/utils/unit-converter.js"></script>
<script src="/js/calculators/[calculator-name].js"></script>
```

### 5.2 Additional Scripts in Backup
```html
<!-- Sitemap Functionality (embedded inline) -->
<script>
    // Category/Platform icon navigation
    // Expand/collapse functionality
    // Mutual exclusion between CONVERTER/DOWNLOADER
</script>
```

---

## 6. CRITICAL MISSING ELEMENTS

### Elements MISSING in `temperature-converter-v2.html`:

1. **Language Selector** (both desktop and mobile)
2. **Mobile Menu Controls** (theme + language in mobile menu)
3. **Complete Sitemap Section** (entire footer structure)
4. **CONVERTER/DOWNLOADER Cross-Promotion**
5. **Category Icon Navigation**
6. **Platform Icon Navigation**
7. **Supported Conversions Badges**
8. **HQMX Brand Center Section**
9. **Social Media Footer Links**
10. **Sitemap JavaScript Functionality**

---

## 7. COMPLETE TEMPLATE FOR CALCULATOR PAGES

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>[Calculator Name] - Free Online Calculator | CALCULATOR</title>
    <meta name="description" content="[Calculator description]">

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="/style.css?v=20251101blur2">
    <link rel="stylesheet" href="/css/calculator.css">

    <link rel="icon" type="image/png" href="/assets/favicon-96x96.png" sizes="96x96" />
    <link rel="icon" type="image/svg+xml" href="/assets/favicon.svg" />
    <link rel="shortcut icon" href="/assets/favicon.ico" />
    <link rel="apple-touch-icon" sizes="180x180" href="/assets/apple-touch-icon.png" />
    <link rel="manifest" href="/manifest.json" />
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
                <!-- Hamburger Menu Button -->
                <button class="hamburger-menu" id="hamburgerMenu">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>

                <div class="nav-menu">
                    <a href="/category/general.html" class="nav-link">General</a>
                    <a href="/category/finance.html" class="nav-link">Finance</a>
                    <a href="/category/health.html" class="nav-link">Health</a>
                    <a href="/category/conversion.html" class="nav-link">Conversion</a>
                    <a href="/category/date-time.html" class="nav-link">Date & Time</a>
                </div>

                <!-- Mobile Menu Overlay -->
                <div class="mobile-menu-overlay" id="mobileMenuOverlay">
                    <div class="mobile-menu-box">
                        <div class="mobile-menu-links">
                            <a href="/category/general.html" class="mobile-menu-link">General</a>
                            <a href="/category/finance.html" class="mobile-menu-link">Finance</a>
                            <a href="/category/health.html" class="mobile-menu-link">Health</a>
                            <a href="/category/conversion.html" class="mobile-menu-link">Conversion</a>
                            <a href="/category/date-time.html" class="mobile-menu-link">Date & Time</a>
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
                                    <a href="#" data-lang="de">Deutsch</a>
                                    <a href="#" data-lang="es">Español</a>
                                    <a href="#" data-lang="fr">Français</a>
                                    <a href="#" data-lang="hi">हिन्दी / Hindī</a>
                                    <a href="#" data-lang="id">Bahasa Indonesia</a>
                                    <a href="#" data-lang="it">Italiano</a>
                                    <a href="#" data-lang="ko">한국어</a>
                                    <a href="#" data-lang="ja">日本語</a>
                                    <a href="#" data-lang="my">Myanmar (မြန်မာ)</a>
                                    <a href="#" data-lang="ms">Malay</a>
                                    <a href="#" data-lang="fil">Filipino</a>
                                    <a href="#" data-lang="pt">Português</a>
                                    <a href="#" data-lang="ru">Русский</a>
                                    <a href="#" data-lang="th">ไทย</a>
                                    <a href="#" data-lang="tr">Türkçe</a>
                                    <a href="#" data-lang="vi">Tiếng Việt</a>
                                    <a href="#" data-lang="zh-CN">简体中文</a>
                                    <a href="#" data-lang="zh-TW">繁體中文</a>
                                    <a href="#" data-lang="ar">عربي</a>
                                    <a href="#" data-lang="bn">বাঙালি</a>
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
                        <a href="#" data-lang="de">Deutsch</a>
                        <a href="#" data-lang="es">Español</a>
                        <a href="#" data-lang="fr">Français</a>
                        <a href="#" data-lang="hi">हिन्दी / Hindī</a>
                        <a href="#" data-lang="id">Bahasa Indonesia</a>
                        <a href="#" data-lang="it">Italiano</a>
                        <a href="#" data-lang="ko">한국어</a>
                        <a href="#" data-lang="ja">日本語</a>
                        <a href="#" data-lang="my">Myanmar (မြန်မာ)</a>
                        <a href="#" data-lang="ms">Malay</a>
                        <a href="#" data-lang="fil">Filipino</a>
                        <a href="#" data-lang="pt">Português</a>
                        <a href="#" data-lang="ru">Русский</a>
                        <a href="#" data-lang="th">ไทย</a>
                        <a href="#" data-lang="tr">Türkçe</a>
                        <a href="#" data-lang="vi">Tiếng Việt</a>
                        <a href="#" data-lang="zh-CN">简体中文</a>
                        <a href="#" data-lang="zh-TW">繁體中文</a>
                        <a href="#" data-lang="ar">عربي</a>
                        <a href="#" data-lang="bn">বাঙালি</a>
                    </div>
                </div>
            </div>
        </nav>

        <header class="header">
            <p class="tagline">[Calculator Title]</p>
        </header>

        <main class="main-content">
            <!-- Calculator Section -->
            <section class="upload-section">
                <div class="upload-container">
                    <!-- Calculator-specific UI goes here -->
                </div>
            </section>

            <!-- Additional Info Sections -->
            <section class="info-section">
                <!-- Reference tables, guides, etc. -->
            </section>
        </main>
    </div>

    <!-- SITEMAP (OUTSIDE CONTAINER) -->
    <section class="sitemap">
        <!-- Full sitemap structure from backup -->
    </section>

    <!-- FOOTER (OUTSIDE CONTAINER) -->
    <footer>
        <div class="footer-social">
            <a href="https://x.com/8hqmx" target="_blank" rel="noopener noreferrer" class="footer-twitter" aria-label="Follow us on X (Twitter)">
                <img src="/assets/x-twitter-footer.svg" alt="X (Twitter)" class="footer-social-icon">
            </a>
        </div>
        <p>
            <span>&copy; 2024 HQMX Calculator. All Rights Reserved.</span>
            <span class="footer-contact"> • support@hqmx.net</span>
        </p>
    </footer>

    <script src="/nav-common.js"></script>
    <script src="/js/utils/unit-converter.js"></script>
    <script src="/js/calculators/[calculator-name].js"></script>
</body>
</html>
```

---

## 8. IMPLEMENTATION CHECKLIST

For each calculator page, verify:

- [ ] Language selector present (desktop + mobile)
- [ ] Mobile menu has theme/language controls
- [ ] Sitemap section included
- [ ] CONVERTER/DOWNLOADER cross-promotion
- [ ] Category icons navigation
- [ ] Platform icons navigation
- [ ] HQMX brand center section
- [ ] Footer social links
- [ ] Proper container hierarchy (sitemap/footer outside)
- [ ] All CSS classes match backup template
- [ ] JavaScript dependencies loaded in order
- [ ] Sitemap expand/collapse functionality

---

## 9. DESIGN PRINCIPLES

### From CLAUDE.md:
1. **CONVERTER Template as Base**: All structure from `~/hqmx/converter/index.html`
2. **Logo Pattern**: First letter gradient (C), rest monochrome (ALCULATOR)
3. **Layout Consistency**: Same blur effects, padding, margins, containers
4. **Color System**: Same primary gradient, background, text colors
5. **Component Reuse**: Navigation, buttons, inputs, dropdowns identical
6. **Cross-Promotion**: CONVERTER, DOWNLOADER, CALCULATOR interconnected

---

**Version**: 1.0
**Last Updated**: 2025-01-15
**Based on**: `/Users/wonjunjang/hqmx/calculator/frontend/index.html.backup`
