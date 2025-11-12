document.addEventListener('DOMContentLoaded', () => {
    // --- CONVERTER EXPAND FUNCTIONALITY ---
    const converterExpandBtn = document.getElementById('converterExpandBtn');
    const converterLogoLink = document.querySelector('.sitemap-left .logo-link');
    const categoryIconsNav = document.querySelector('.category-icons-nav');
    const categoryIconBtns = document.querySelectorAll('.category-icon-btn');
    const supportedConversions = document.querySelector('.supported-conversions');

    // Function to toggle category icons
    function toggleCategoryIcons() {
        if (categoryIconsNav) {
            // Close DOWNLOADER panel if it's open (mutual exclusion)
            const platformNav = document.querySelector('.platform-icons-nav');
            const dlExpandBtn = document.getElementById('downloaderExpandBtn');
            const platformBtns = document.querySelectorAll('.platform-icon-btn');

            if (platformNav && platformNav.classList.contains('show')) {
                platformNav.classList.remove('show');
                if (dlExpandBtn) {
                    dlExpandBtn.classList.remove('expanded');
                }
                platformBtns.forEach(btn => btn.classList.remove('active'));
            }

            categoryIconsNav.classList.toggle('show');
            if (converterExpandBtn) {
                converterExpandBtn.classList.toggle('expanded');
            }

            // If hiding, also hide all categories
            if (!categoryIconsNav.classList.contains('show')) {
                const allCategories = document.querySelectorAll('.conversion-category');
                allCategories.forEach(cat => {
                    cat.classList.remove('active');
                    cat.classList.remove('show-badges');
                });
                categoryIconBtns.forEach(btn => btn.classList.remove('active'));

                // Hide supported conversions when category icons are hidden
                if (supportedConversions) {
                    supportedConversions.style.display = 'none';
                }
            } else {
                // Show supported conversions when category icons are shown
                if (supportedConversions) {
                    supportedConversions.style.display = 'block';
                }
            }
        }
    }

    // Converter + button click
    if (converterExpandBtn) {
        converterExpandBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleCategoryIcons();
        });
    }

    // Converter logo click - Removed (now just a link to hqmx.net)

    // 카테고리 아이콘 버튼 클릭 시 배지 표시
    categoryIconBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.dataset.category;

            // Show category icons if not shown
            if (!categoryIconsNav.classList.contains('show')) {
                categoryIconsNav.classList.add('show');
                if (converterExpandBtn) {
                    converterExpandBtn.classList.add('expanded');
                }
            }

            // 모든 카테고리 아이콘 버튼에서 active 제거
            categoryIconBtns.forEach(b => b.classList.remove('active'));
            // 클릭한 버튼에 active 추가
            btn.classList.add('active');

            // 모든 카테고리에서 active와 show-badges 제거
            const allCategories = document.querySelectorAll('.conversion-category');
            allCategories.forEach(cat => {
                cat.classList.remove('active');
                cat.classList.remove('show-badges');
            });

            // 클릭한 카테고리를 active로 설정하고 배지 표시
            const targetCategory = document.querySelector(`.conversion-category[data-category="${category}"]`);
            if (targetCategory) {
                targetCategory.classList.add('active');
                targetCategory.classList.add('show-badges');

                // Show supported conversions section
                if (supportedConversions) {
                    supportedConversions.style.display = 'block';
                }
            }
        });
    });

    // --- DOWNLOADER EXPAND FUNCTIONALITY ---
    const downloaderExpandBtn = document.getElementById('downloaderExpandBtn');
    const downloaderLogoLink = document.querySelector('.sitemap-right .logo-link');
    const platformIconsNav = document.querySelector('.platform-icons-nav');
    const platformIconBtns = document.querySelectorAll('.platform-icon-btn');

    // Function to toggle platform icons
    function togglePlatformIcons() {
        if (platformIconsNav) {
            // Close CONVERTER panel if it's open (mutual exclusion)
            const categoryNav = document.querySelector('.category-icons-nav');
            const convExpandBtn = document.getElementById('converterExpandBtn');
            const categoryBtns = document.querySelectorAll('.category-icon-btn');
            const supportedConv = document.querySelector('.supported-conversions');

            if (categoryNav && categoryNav.classList.contains('show')) {
                categoryNav.classList.remove('show');
                if (convExpandBtn) {
                    convExpandBtn.classList.remove('expanded');
                }
                categoryBtns.forEach(btn => btn.classList.remove('active'));

                // Also hide conversion categories and supported conversions
                const allCategories = document.querySelectorAll('.conversion-category');
                allCategories.forEach(cat => {
                    cat.classList.remove('active');
                    cat.classList.remove('show-badges');
                });
                if (supportedConv) {
                    supportedConv.style.display = 'none';
                }
            }

            platformIconsNav.classList.toggle('show');
            if (downloaderExpandBtn) {
                downloaderExpandBtn.classList.toggle('expanded');
            }

            // If hiding, remove active states
            if (!platformIconsNav.classList.contains('show')) {
                platformIconBtns.forEach(btn => btn.classList.remove('active'));
            }
        }
    }

    // Downloader + button click
    if (downloaderExpandBtn) {
        downloaderExpandBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            togglePlatformIcons();
        });
    }

    // Downloader logo click - Removed (now just a link to downloader.hqmx.net)

    // Platform icon button click handlers
    platformIconBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Ignore clicks on disabled buttons
            if (btn.disabled || btn.classList.contains('disabled')) {
                return;
            }

            const platform = btn.dataset.platform;

            // Show platform icons if not shown
            if (!platformIconsNav.classList.contains('show')) {
                platformIconsNav.classList.add('show');
                if (downloaderExpandBtn) {
                    downloaderExpandBtn.classList.add('expanded');
                }
            }

            // Toggle active state
            platformIconBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Navigate to platform-specific downloader page
            // For now, just log - you can implement navigation later
            console.log(`${platform} downloader selected`);
            // window.location.href = `https://hqmx.net/downloader/${platform}`;
        });
    });
});
