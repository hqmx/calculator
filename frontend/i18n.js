// Internationalization (i18n) Module for HQMX Converter
class I18n {
    constructor() {
        this.currentLang = 'en';
        this.translations = {};
        this.rtlLanguages = ['ar', 'he', 'fa', 'ur'];
        this.init();
    }

    async init() {
        // URL 파라미터의 언어가 최우선 (다국어 SEO URL 지원)
        const urlLang = this.getLanguageFromURL();

        // Get saved language or detect from browser
        this.currentLang = urlLang || localStorage.getItem('language') || this.detectLanguage();

        // Load translations
        await this.loadTranslations(this.currentLang);

        // Apply translations
        this.applyTranslations();
        this.updateDirection();
        this.updateLanguageSelector();

        // Update SEO tags for conversion pages
        if (this.isConversionPage()) {
            const conversionInfo = this.parseConversionFromURL();
            if (conversionInfo) {
                this.updateSEOTags(conversionInfo.from, conversionInfo.to);
            }
        }
    }

    getLanguageFromURL() {
        // 1. URL 쿼리 파라미터에서 언어 코드 추출 (nginx rewrite 결과)
        const params = new URLSearchParams(window.location.search);
        if (params.has('lang')) {
            return params.get('lang');
        }

        // 2. URL pathname에서 직접 파싱 (/{언어코드}/... 형식)
        const pathname = window.location.pathname;

        // /{언어코드}/{from}-to-{to} 형식
        const pathMatch = pathname.match(/^\/([^\/]+)\/([a-z0-9]+)-to-([a-z0-9]+)\/?$/i);
        if (pathMatch) {
            const langCode = pathMatch[1];
            // 단축 코드 변환 (kr → ko, cn → zh-CN, tw → zh-TW)
            const langMapping = {
                'kr': 'ko',
                'cn': 'zh-CN',
                'tw': 'zh-TW'
            };
            return langMapping[langCode] || langCode;
        }

        // /{언어코드} 형식 (홈페이지)
        const langMatch = pathname.match(/^\/([^\/]+)\/?$/);
        if (langMatch && langMatch[1] !== 'index.html') {
            const langCode = langMatch[1];
            const langMapping = {
                'kr': 'ko',
                'cn': 'zh-CN',
                'tw': 'zh-TW'
            };
            const normalizedLang = langMapping[langCode] || langCode;

            // 지원되는 언어인지 확인
            const supportedLangs = [
                'en', 'de', 'es', 'fr', 'hi', 'id', 'it', 'ko', 'ja',
                'my', 'ms', 'fil', 'pt', 'ru', 'th', 'tr', 'vi',
                'zh-CN', 'zh-TW', 'ar', 'bn'
            ];
            if (supportedLangs.includes(normalizedLang)) {
                return normalizedLang;
            }
        }

        return null;
    }

    detectLanguage() {
        const browserLang = navigator.language || navigator.userLanguage;
        const langCode = browserLang.split('-')[0];

        // Supported languages
        const supportedLangs = [
            'en', 'de', 'es', 'fr', 'hi', 'id', 'it', 'ko', 'ja',
            'my', 'ms', 'fil', 'pt', 'ru', 'th', 'tr', 'vi',
            'zh-CN', 'zh-TW', 'ar', 'bn'
        ];

        return supportedLangs.includes(langCode) ? langCode : 'en';
    }

    async loadTranslations(lang) {
        try {
            const response = await fetch(`/calculator/locales/${lang}.json`);
            if (response.ok) {
                this.translations = await response.json();
            } else {
                throw new Error(`Failed to load ${lang}.json`);
            }
        } catch (error) {
            console.warn(`Failed to load translations for ${lang}, falling back to English`);
            if (lang !== 'en') {
                await this.loadTranslations('en');
            }
        }
    }

    t(key, params = {}) {
        let translation = this.getNestedValue(this.translations, key) || key;

        // Replace parameters in translation
        Object.keys(params).forEach(param => {
            translation = translation.replace(new RegExp(`{${param}}`, 'g'), params[param]);
        });

        return translation;
    }

    getNestedValue(obj, key) {
        return key.split('.').reduce((current, keyPart) => {
            return current && current[keyPart] !== undefined ? current[keyPart] : null;
        }, obj);
    }

    applyTranslations() {
        // 성능 최적화: DOM을 일시적으로 숨겨서 reflow를 한 번만 발생시킴
        // 177개+ 요소 변경 시 177회 reflow → 1회 reflow로 감소
        // ⚠️ DISABLED: 브라우저 프리즈 문제로 인해 비활성화
        // const originalDisplay = document.body.style.display;
        // document.body.style.display = 'none';

        // Translate elements with data-i18n-key attribute
        const elements = document.querySelectorAll('[data-i18n-key]');
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n-key');
            const translation = this.t(key);

            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = translation;
            } else {
                element.textContent = translation;
            }
        });

        // Translate elements with data-i18n-html attribute (allows HTML tags)
        const htmlElements = document.querySelectorAll('[data-i18n-html]');
        htmlElements.forEach(element => {
            const key = element.getAttribute('data-i18n-html');
            const translation = this.t(key);
            element.innerHTML = translation;
        });

        // Translate elements with data-i18n-placeholder attribute
        const placeholderElements = document.querySelectorAll('[data-i18n-placeholder]');
        placeholderElements.forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            element.placeholder = this.t(key);
        });

        // Translate elements with data-i18n-title attribute
        const titleElements = document.querySelectorAll('[data-i18n-title]');
        titleElements.forEach(element => {
            const key = element.getAttribute('data-i18n-title');
            element.title = this.t(key);
        });

        // ⚠️ DISABLED: 브라우저 프리즈 문제로 인해 비활성화
        // document.body.offsetHeight; // Force reflow
        // document.body.style.display = originalDisplay;
    }

    updateDirection() {
        const isRTL = this.rtlLanguages.includes(this.currentLang);
        document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
        document.body.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
    }

    updateLanguageSelector() {
        const currentLanguageElement = document.getElementById('current-language');
        if (currentLanguageElement) {
            const languageNames = {
                'en': 'English',
                'de': 'Deutsch',
                'es': 'Español',
                'fr': 'Français',
                'hi': 'हिन्दी / Hindī',
                'id': 'Bahasa Indonesia',
                'it': 'Italiano',
                'ko': '한국어',
                'ja': '日本語',
                'my': 'Myanmar (မြန်မာ)',
                'ms': 'Malay',
                'fil': 'Filipino',
                'pt': 'Português',
                'ru': 'Русский',
                'th': 'ไทย',
                'tr': 'Türkçe',
                'vi': 'Tiếng Việt',
                'zh-CN': '简体中文',
                'zh-TW': '繁體中文',
                'ar': 'عربي',
                'bn': 'বাঙালি'
            };

            currentLanguageElement.textContent = languageNames[this.currentLang] || 'English';
        }
    }

    async changeLanguage(lang) {
        if (lang === this.currentLang) return;

        this.currentLang = lang;
        localStorage.setItem('language', lang);

        await this.loadTranslations(lang);
        this.applyTranslations();
        this.updateDirection();
        this.updateLanguageSelector();

        // Emit language change event
        document.dispatchEvent(new CustomEvent('languageChanged', {
            detail: { language: lang }
        }));
    }

    // Format numbers according to locale
    formatNumber(number, options = {}) {
        try {
            return new Intl.NumberFormat(this.getLocale(), options).format(number);
        } catch (error) {
            return number.toString();
        }
    }

    // Format dates according to locale
    formatDate(date, options = {}) {
        try {
            return new Intl.DateTimeFormat(this.getLocale(), options).format(date);
        } catch (error) {
            return date.toString();
        }
    }

    // Format file sizes with localized units
    formatFileSize(bytes) {
        if (bytes === 0) return this.t('fileSize.zero');

        const k = 1024;
        const sizes = [
            this.t('fileSize.bytes'),
            this.t('fileSize.kb'),
            this.t('fileSize.mb'),
            this.t('fileSize.gb'),
            this.t('fileSize.tb')
        ];

        const i = Math.floor(Math.log(bytes) / Math.log(k));
        const size = parseFloat((bytes / Math.pow(k, i)).toFixed(2));

        return `${this.formatNumber(size)} ${sizes[i]}`;
    }

    getLocale() {
        const localeMap = {
            'en': 'en-US',
            'de': 'de-DE',
            'es': 'es-ES',
            'fr': 'fr-FR',
            'hi': 'hi-IN',
            'id': 'id-ID',
            'it': 'it-IT',
            'ko': 'ko-KR',
            'ja': 'ja-JP',
            'my': 'my-MM',
            'ms': 'ms-MY',
            'fil': 'fil-PH',
            'pt': 'pt-PT',
            'ru': 'ru-RU',
            'th': 'th-TH',
            'tr': 'tr-TR',
            'vi': 'vi-VN',
            'zh-CN': 'zh-CN',
            'zh-TW': 'zh-TW',
            'ar': 'ar-SA',
            'bn': 'bn-BD'
        };

        return localeMap[this.currentLang] || 'en-US';
    }

    // Get current language
    getCurrentLanguage() {
        return this.currentLang;
    }

    // Check if current language is RTL
    isRTL() {
        return this.rtlLanguages.includes(this.currentLang);
    }

    // ==================== SEO Methods for Conversion Pages ====================

    // Check if current page is a conversion page
    isConversionPage() {
        return window.location.pathname.includes('/convert/');
    }

    // Parse conversion info from URL
    parseConversionFromURL() {
        const pathname = window.location.pathname;
        // Match: /convert/jpg-to-png or /ko/convert/jpg-to-png
        const match = pathname.match(/\/convert\/([a-z0-9]+)-to-([a-z0-9]+)/i);
        if (match) {
            return {
                from: match[1].toLowerCase(),
                to: match[2].toLowerCase(),
                fromUpper: match[1].toUpperCase(),
                toUpper: match[2].toUpperCase()
            };
        }
        return null;
    }

    // Get localized format name
    getFormatName(format) {
        const key = `seo.formats.${format.toLowerCase()}`;
        const name = this.t(key);
        // If translation not found, return uppercase format
        return name === key ? format.toUpperCase() : name;
    }

    // Get SEO title based on template
    getSEOTitle(from, to) {
        const template = this.t('seo.templates.title');
        const fromName = this.getFormatName(from);
        const toName = this.getFormatName(to);

        return template
            .replace('{FROM}', fromName)
            .replace('{TO}', toName);
    }

    // Get SEO description based on template
    getSEODescription(from, to) {
        const template = this.t('seo.templates.description');
        const fromName = this.getFormatName(from);
        const toName = this.getFormatName(to);

        return template
            .replace('{FROM}', fromName)
            .replace('{TO}', toName);
    }

    // Get SEO Open Graph title based on template
    getSEOOGTitle(from, to) {
        const template = this.t('seo.templates.og_title');
        const fromName = this.getFormatName(from);
        const toName = this.getFormatName(to);

        return template
            .replace('{FROM}', fromName)
            .replace('{TO}', toName);
    }

    // Update all SEO meta tags dynamically
    updateSEOTags(from, to) {
        // Update document title
        const title = this.getSEOTitle(from, to);
        document.title = title;

        // Update meta description
        const description = this.getSEODescription(from, to);
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.setAttribute('content', description);
        }

        // Update Open Graph tags
        const ogTitle = this.getSEOOGTitle(from, to);
        const ogTitleMeta = document.querySelector('meta[property="og:title"]');
        if (ogTitleMeta) {
            ogTitleMeta.setAttribute('content', ogTitle);
        }

        const ogDescMeta = document.querySelector('meta[property="og:description"]');
        if (ogDescMeta) {
            ogDescMeta.setAttribute('content', description);
        }

        // Update Twitter Card tags
        const twitterTitleMeta = document.querySelector('meta[name="twitter:title"]');
        if (twitterTitleMeta) {
            twitterTitleMeta.setAttribute('content', ogTitle);
        }

        const twitterDescMeta = document.querySelector('meta[name="twitter:description"]');
        if (twitterDescMeta) {
            twitterDescMeta.setAttribute('content', description);
        }

        console.log(`SEO tags updated for ${from.toUpperCase()} → ${to.toUpperCase()} in ${this.currentLang}`);
    }

    // Apply translations with support for dynamic parameters
    applyTranslationsWithParams() {
        const elements = document.querySelectorAll('[data-i18n-key]');
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n-key');
            const from = element.getAttribute('data-i18n-from') || '';
            const to = element.getAttribute('data-i18n-to') || '';

            let translation = this.t(key);

            // Replace {FROM} and {TO} placeholders if present
            if (from && to) {
                const fromName = this.getFormatName(from);
                const toName = this.getFormatName(to);
                translation = translation
                    .replace('{FROM}', fromName)
                    .replace('{TO}', toName);
            }

            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = translation;
            } else {
                element.textContent = translation;
            }
        });
    }

    // ==================== End of SEO Methods ====================

    // Update URL with new language code
    updateURLWithLanguage(newLang) {
        const pathname = window.location.pathname;
        // Use standard ISO language codes for URLs
        const urlLang = newLang;

        // Supported language codes (ISO 639-1 standard)
        const allLangCodes = [
            'en', 'de', 'es', 'fr', 'hi', 'id', 'it', 'ko', 'ja',
            'my', 'ms', 'fil', 'pt', 'ru', 'th', 'tr', 'vi',
            'zh-CN', 'zh-TW', 'zh', 'ar', 'bn', 'cs', 'he', 'nl', 'sv', 'pl'
        ];

        // Pattern 1: /{lang}/{from}-to-{to}
        const conversionMatch = pathname.match(/^\/([^\/]+)\/([a-z0-9]+)-to-([a-z0-9]+)\/?$/i);
        if (conversionMatch && allLangCodes.includes(conversionMatch[1])) {
            window.location.href = `/${urlLang}/${conversionMatch[2]}-to-${conversionMatch[3]}`;
            return;
        }

        // Pattern 2: /{from}-to-{to} (no language)
        const conversionOnlyMatch = pathname.match(/^\/([a-z0-9]+)-to-([a-z0-9]+)\/?$/i);
        if (conversionOnlyMatch) {
            window.location.href = `/${urlLang}/${conversionOnlyMatch[1]}-to-${conversionOnlyMatch[2]}`;
            return;
        }

        // Pattern 3: /{lang} (homepage with language)
        const langOnlyMatch = pathname.match(/^\/([^\/]+)\/?$/);
        if (langOnlyMatch && langOnlyMatch[1] !== 'index.html' && allLangCodes.includes(langOnlyMatch[1])) {
            window.location.href = `/${urlLang}`;
            return;
        }

        // Pattern 4: / (root homepage)
        if (pathname === '/' || pathname === '/index.html') {
            window.location.href = `/${urlLang}`;
            return;
        }

        // Default: stay on current page, just change language
        // (for other pages that don't follow the pattern)
    }
}

// Initialize i18n function
async function initI18n() {
    // 중복 초기화 방지
    if (window.i18nInitialized) {
        console.warn('i18n.js: Already initialized');
        return;
    }
    window.i18nInitialized = true;

    window.i18n = new I18n();

    // Set up language change handlers
    const languageOptions = document.getElementById('language-options');
    if (languageOptions && !languageOptions.dataset.listenerAttached) {
        // 중복 이벤트 리스너 바인딩 방지
        languageOptions.dataset.listenerAttached = 'true';

        languageOptions.addEventListener('click', async (e) => {
            if (e.target.dataset.lang) {
                e.preventDefault(); // Prevent default <a> tag behavior
                const newLang = e.target.dataset.lang;

                // Close language selector
                const languageSwitcher = e.target.closest('.language-switcher');
                if (languageSwitcher) {
                    languageSwitcher.classList.remove('open');
                }

                // Update URL with new language (this will navigate)
                window.i18n.updateURLWithLanguage(newLang);

                // If updateURLWithLanguage didn't navigate (stayed on same page),
                // change language without reload
                if (window.location.pathname === window.location.pathname) {
                    await window.i18n.changeLanguage(newLang);
                }
            }
        });
    }
}

// Initialize i18n when DOM is loaded (handles both early and late script loading)
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initI18n);
} else {
    // DOM already loaded, initialize immediately
    initI18n();
}

// Global translation function
function t(key, params = {}) {
    return window.i18n ? window.i18n.t(key, params) : key;
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = I18n;
}