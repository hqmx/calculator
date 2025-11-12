// ========================================
// CALCULATOR 프로젝트 - UI 전용 스크립트
// 컨버터 기능 제거, UI 인터랙션만 유지
// ========================================

function initializeApp() {
    console.log('🚀 Calculator App 초기화 시작');

    // --- FEATURE FLAGS CHECK ---
    if (window.FEATURES && !window.FEATURES.SOCIAL_MEDIA) {
        const socialBtn = document.getElementById('socialCategoryBtn');
        const socialSection = document.getElementById('socialMediaSection');
        if (socialBtn) socialBtn.style.display = 'none';
        if (socialSection) socialSection.style.display = 'none';
    }

    // --- DOM ELEMENTS ---
    const dom = {
        themeToggleBtn: document.getElementById('themeToggle'),
        mobileThemeToggleBtn: document.getElementById('mobileThemeToggleBtn'),
        languageSelectorBtn: document.getElementById('current-language'),
        hamburgerMenu: document.getElementById('hamburgerMenu'),
        mobileMenuOverlay: document.getElementById('mobileMenuOverlay'),
        mobileLanguageOptions: document.querySelector('.mobile-menu-overlay .language-options')
    };

    // --- THEME TOGGLE ---
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.setAttribute('data-theme', savedTheme);

    function handleThemeToggle() {
        const newTheme = document.body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        document.body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    }

    if (dom.themeToggleBtn) {
        dom.themeToggleBtn.addEventListener('click', handleThemeToggle);
    }
    if (dom.mobileThemeToggleBtn) {
        dom.mobileThemeToggleBtn.addEventListener('click', handleThemeToggle);
    }

    // --- MOBILE MENU ---
    function toggleMobileMenu() {
        const hamburgerMenu = document.getElementById('hamburgerMenu');
        const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');

        hamburgerMenu.classList.toggle('active');
        mobileMenuOverlay.classList.toggle('show');

        // 모바일 메뉴가 열릴 때 토글 버튼들 강제 표시
        if (mobileMenuOverlay.classList.contains('show')) {
            const mobileControls = document.querySelector('.mobile-menu-controls');
            const mobileControlItems = document.querySelectorAll('.mobile-control-item');
            const mobileThemeBtn = document.getElementById('mobileThemeToggleBtn');
            const mobileLangBtn = document.getElementById('mobileLanguageSelectorBtn');

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

            if (mobileThemeBtn) {
                mobileThemeBtn.style.display = 'flex';
                mobileThemeBtn.style.visibility = 'visible';
                mobileThemeBtn.style.opacity = '1';
            }

            if (mobileLangBtn) {
                mobileLangBtn.style.display = 'flex';
                mobileLangBtn.style.visibility = 'visible';
                mobileLangBtn.style.opacity = '1';
            }
        }
    }

    function closeMobileMenu() {
        const hamburgerMenu = document.getElementById('hamburgerMenu');
        const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');

        hamburgerMenu.classList.remove('active');
        mobileMenuOverlay.classList.remove('show');
    }

    if (dom.hamburgerMenu) {
        dom.hamburgerMenu.addEventListener('click', toggleMobileMenu);
    }

    if (dom.mobileMenuOverlay) {
        dom.mobileMenuOverlay.addEventListener('click', (e) => {
            if (e.target === dom.mobileMenuOverlay) {
                closeMobileMenu();
            }
        });
    }

    // --- LANGUAGE SELECTOR ---
    function toggleLanguageOptions() {
        const switcher = dom.languageSelectorBtn.parentElement;
        switcher.classList.toggle('open');
    }

    function handleLanguageChange(e) {
        if (e.target.dataset.lang) {
            const lang = e.target.dataset.lang;
            const langName = e.target.textContent;

            localStorage.setItem('language', lang);
            document.getElementById('current-language').textContent = langName;

            // Close language options
            dom.languageSelectorBtn.parentElement.classList.remove('open');

            // Update page language
            updatePageLanguage(lang);
        }
    }

    if (dom.languageSelectorBtn) {
        dom.languageSelectorBtn.addEventListener('click', toggleLanguageOptions);
    }

    const languageOptions = document.querySelector('.language-options');
    if (languageOptions) {
        languageOptions.addEventListener('click', handleLanguageChange);
    }

    if (dom.mobileLanguageOptions) {
        dom.mobileLanguageOptions.addEventListener('click', handleLanguageChange);
    }

    // --- I18N FUNCTIONS ---
    function updatePageLanguage(lang) {
        // I18n update logic would go here
        console.log(`Language changed to: ${lang}`);
        // Placeholder: In production, call i18n.js functions
    }

    function t(key, params = {}) {
        // Translation function placeholder
        return key;
    }

    // --- TOAST NOTIFICATIONS ---
    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;

        document.body.appendChild(toast);

        setTimeout(() => toast.classList.add('show'), 10);

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    window.showToast = showToast;

    // --- SCROLL HANDLER ---
    function handleScroll() {
        const scrollBtn = document.querySelector('.scroll-to-top');
        if (scrollBtn) {
            if (window.scrollY > 500) {
                scrollBtn.classList.add('visible');
            } else {
                scrollBtn.classList.remove('visible');
            }
        }
    }

    window.addEventListener('scroll', handleScroll);

    // --- CATEGORY TABS ---
    initializeCategoryTabs();

    // --- SHOW MORE BUTTONS ---
    initializeShowMoreButtons();

    // --- INITIALIZATION COMPLETE ---
    console.log('✅ Calculator App 초기화 완료');
}

// Category tabs functionality
function initializeCategoryTabs() {
    const categoryButtons = document.querySelectorAll('.category-icon-btn');
    const categories = document.querySelectorAll('.conversion-category');

    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetCategory = button.getAttribute('data-category');

            // Remove active class from all buttons
            categoryButtons.forEach(btn => btn.classList.remove('active'));

            // Add active class to clicked button
            button.classList.add('active');

            // Hide all categories
            categories.forEach(cat => cat.classList.remove('active'));

            // Show target category
            const targetCat = document.querySelector(`.conversion-category[data-category="${targetCategory}"]`);
            if (targetCat) {
                targetCat.classList.add('active');
            }
        });
    });
}

// Show More functionality for conversion badges
function initializeShowMoreButtons() {
    const subcategories = document.querySelectorAll('.conversion-subcategory');

    subcategories.forEach(subcategory => {
        const badgeContainer = subcategory.querySelector('.conversion-badges');
        if (!badgeContainer) return;

        const badges = Array.from(badgeContainer.querySelectorAll('.conversion-badge'));

        // Determine visible limit based on screen size
        const getVisibleLimit = () => {
            if (window.innerWidth >= 1024) {
                return 32; // 8 columns × 4 rows
            } else {
                return 24; // 3 columns × 8 rows
            }
        };

        const limit = getVisibleLimit();

        // Only show "Show More" button if badges exceed limit
        if (badges.length > limit) {
            // Hide extra badges initially
            badges.forEach((badge, index) => {
                if (index >= limit) {
                    badge.classList.add('hidden');
                }
            });

            // Create "Show More" button
            const showMoreBtn = document.createElement('button');
            showMoreBtn.className = 'show-more-btn';
            showMoreBtn.textContent = '+';
            badgeContainer.appendChild(showMoreBtn);

            // Toggle visibility on button click
            showMoreBtn.addEventListener('click', () => {
                const isExpanded = showMoreBtn.classList.contains('expanded');

                badges.forEach((badge, index) => {
                    if (index >= limit) {
                        if (isExpanded) {
                            badge.classList.add('hidden');
                        } else {
                            badge.classList.remove('hidden');
                        }
                    }
                });

                showMoreBtn.classList.toggle('expanded');
                showMoreBtn.textContent = isExpanded ? '+' : '×';
            });
        }
    });
}

// --- INITIALIZATION ---
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}
