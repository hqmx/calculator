/**
 * nav-common.js
 * 공통 네비게이션 기능 (how-to-use, faq 페이지용)
 * - 스크롤 블러 효과
 * - 햄버거 메뉴
 * - 테마 토글
 * - 언어 선택기
 * - index.html은 script.js를 사용하므로 이 파일 불필요
 */

(function() {
    'use strict';

    // 중복 초기화 방지
    if (window.navCommonInitialized) {
        console.warn('nav-common.js: Already initialized');
        return;
    }
    window.navCommonInitialized = true;

    // DOM 로드 완료 후 초기화
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        initScrollBlurEffect();
        initHamburgerMenu();
        initThemeToggle();
        initLanguageSelector();
        initMobileControls();
    }

    /**
     * 스크롤 시 헤더 블러 효과
     */
    function initScrollBlurEffect() {
        const topNav = document.querySelector('.top-nav');
        if (!topNav) {
            console.warn('nav-common.js: .top-nav element not found');
            return;
        }

        function handleScroll() {
            if (window.scrollY > 0) {
                topNav.classList.add('scrolled');
            } else {
                topNav.classList.remove('scrolled');
            }
        }

        // 초기 상태 확인
        handleScroll();

        // 스크롤 이벤트 리스너 추가
        window.addEventListener('scroll', handleScroll, { passive: true });

        console.log('nav-common.js: Scroll blur effect initialized');
    }

    /**
     * 햄버거 메뉴 토글
     */
    function initHamburgerMenu() {
        const hamburgerMenu = document.getElementById('hamburgerMenu');
        const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');

        if (!hamburgerMenu || !mobileMenuOverlay) {
            console.warn('nav-common.js: Hamburger menu elements not found');
            return;
        }

        // 햄버거 버튼 클릭
        hamburgerMenu.addEventListener('click', toggleMobileMenu);

        // 메뉴 바깥 클릭 시 닫기
        document.addEventListener('click', (e) => {
            if (mobileMenuOverlay.classList.contains('show') &&
                !e.target.closest('#hamburgerMenu') &&
                !e.target.closest('.mobile-menu-box')) {
                closeMobileMenu();
            }
        });

        // 모바일 메뉴 링크 클릭 시 메뉴 닫기
        document.querySelectorAll('.mobile-nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                // 실제 URL 링크는 기본 동작 허용하고 메뉴만 닫기
                if (href && !href.startsWith('#')) {
                    closeMobileMenu();
                    return;
                }
            });
        });

        console.log('nav-common.js: Hamburger menu initialized');
    }

    function toggleMobileMenu() {
        const hamburgerMenu = document.getElementById('hamburgerMenu');
        const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');

        hamburgerMenu.classList.toggle('active');
        mobileMenuOverlay.classList.toggle('show');

        // 모바일 메뉴가 열릴 때 컨트롤 버튼들 강제 표시
        if (mobileMenuOverlay.classList.contains('show')) {
            const mobileControls = document.querySelector('.mobile-menu-controls');
            const mobileControlItems = document.querySelectorAll('.mobile-control-item');

            if (mobileControls) {
                mobileControls.style.display = 'block';
                mobileControls.style.visibility = 'visible';
                mobileControls.style.opacity = '1';
            }

            mobileControlItems.forEach(item => {
                item.style.display = 'flex';
                item.style.visibility = 'visible';
                item.style.opacity = '1';
            });
        }
    }

    function closeMobileMenu() {
        const hamburgerMenu = document.getElementById('hamburgerMenu');
        const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');

        if (hamburgerMenu) hamburgerMenu.classList.remove('active');
        if (mobileMenuOverlay) mobileMenuOverlay.classList.remove('show');
    }

    /**
     * 테마 토글 (라이트/다크 모드)
     */
    function initThemeToggle() {
        const themeToggleBtn = document.getElementById('themeToggleBtn');
        const mobileThemeToggleBtn = document.getElementById('mobileThemeToggleBtn');

        if (themeToggleBtn) {
            themeToggleBtn.addEventListener('click', handleThemeToggle);
        }

        if (mobileThemeToggleBtn) {
            mobileThemeToggleBtn.addEventListener('click', handleThemeToggle);
        }

        if (themeToggleBtn || mobileThemeToggleBtn) {
            console.log('nav-common.js: Theme toggle initialized');
        }
    }

    function handleThemeToggle() {
        const newTheme = document.body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        document.body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    }

    /**
     * 언어 선택기 토글
     */
    function initLanguageSelector() {
        const languageSelectorBtn = document.getElementById('language-selector-btn');
        const languageOptions = document.getElementById('language-options');
        const languageSwitcher = document.querySelector('.language-switcher');

        if (languageSelectorBtn && languageOptions) {
            languageSelectorBtn.addEventListener('click', () => {
                if (languageSwitcher) {
                    languageSwitcher.classList.toggle('open');
                }
            });

            // 언어 선택기 바깥 클릭 시 닫기
            document.addEventListener('click', (e) => {
                if (languageSwitcher &&
                    languageSwitcher.classList.contains('open') &&
                    !e.target.closest('.language-switcher')) {
                    languageSwitcher.classList.remove('open');
                }
            });

            console.log('nav-common.js: Language selector initialized');
        }
    }

    /**
     * 모바일 언어 선택기 및 컨트롤
     */
    function initMobileControls() {
        const mobileLanguageSelectorBtn = document.getElementById('mobileLanguageSelectorBtn');
        const mobileLanguageOptions = document.getElementById('mobileLanguageOptions');

        if (mobileLanguageSelectorBtn && mobileLanguageOptions) {
            mobileLanguageSelectorBtn.addEventListener('click', () => {
                mobileLanguageOptions.classList.toggle('show');
            });

            // i18n.js가 언어 변경을 처리하므로 여기서는 UI 토글만 담당
            // 언어 옵션 클릭 시 닫기는 i18n.js가 처리

            console.log('nav-common.js: Mobile language selector initialized');
        }
    }

})();
