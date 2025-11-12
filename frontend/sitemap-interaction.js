/**
 * Sitemap Category Interaction
 * 카테고리 아이콘 클릭 시 해당 카테고리의 변환 배지 토글
 * index.html의 script.js에서 추출하여 일반화
 */

(function() {
    'use strict';

    /**
     * 카테고리 탭 기능 초기화
     * - 카테고리 버튼 클릭 시 해당 카테고리만 표시
     * - 첫 번째 카테고리를 기본으로 활성화
     */
    function initializeCategoryTabs() {
        const categoryButtons = document.querySelectorAll('.category-icon-btn');
        const categories = document.querySelectorAll('.conversion-category');

        if (categoryButtons.length === 0 || categories.length === 0) {
            console.warn('카테고리 버튼 또는 카테고리가 없습니다.');
            return;
        }

        // 카테고리 버튼 클릭 이벤트
        categoryButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetCategory = button.getAttribute('data-category');

                // 모든 버튼의 active 클래스 제거
                categoryButtons.forEach(btn => btn.classList.remove('active'));

                // 클릭된 버튼에 active 클래스 추가
                button.classList.add('active');

                // 모든 카테고리 숨김 (active 및 show-badges 제거)
                categories.forEach(cat => {
                    cat.classList.remove('active');
                    cat.classList.remove('show-badges');
                });

                // 선택된 카테고리만 표시 (active 및 show-badges 추가)
                const targetCat = document.querySelector(`.conversion-category[data-category="${targetCategory}"]`);
                if (targetCat) {
                    targetCat.classList.add('active');
                    targetCat.classList.add('show-badges');
                }
            });
        });

        // 초기 상태: 카테고리 아이콘만 표시, 뱃지는 클릭 시에만 표시
    }

    /**
     * "Show More" 버튼 기능 초기화
     * - 각 서브카테고리의 배지 수가 limit을 초과하면 "Show More" 버튼 표시
     * - 버튼 클릭 시 모든 배지 표시
     */
    function initializeShowMoreButtons() {
        const subcategories = document.querySelectorAll('.conversion-subcategory');

        subcategories.forEach(subcategory => {
            const badgeContainer = subcategory.querySelector('.conversion-badges');
            if (!badgeContainer) return;

            const badges = Array.from(badgeContainer.querySelectorAll('.conversion-badge'));

            // 화면 크기에 따라 표시할 배지 수 결정
            const getVisibleLimit = () => {
                if (window.innerWidth >= 1024) {
                    return 32; // 8 columns × 4 rows (데스크톱)
                } else {
                    return 24; // 3 columns × 8 rows (모바일)
                }
            };

            const limit = getVisibleLimit();

            // 배지 수가 limit 이하면 Show More 버튼 불필요
            if (badges.length <= limit) {
                return;
            }

            // 초기에 limit개만 표시
            badges.forEach((badge, index) => {
                if (index >= limit) {
                    badge.style.display = 'none';
                }
            });

            // Show More 버튼 생성
            const showMoreBtn = document.createElement('button');
            showMoreBtn.className = 'show-more-btn';
            showMoreBtn.textContent = `Show ${badges.length - limit} More`;
            showMoreBtn.addEventListener('click', () => {
                badges.forEach(badge => {
                    badge.style.display = '';
                });
                showMoreBtn.remove();
            });

            badgeContainer.after(showMoreBtn);
        });
    }

    // DOM 로드 완료 후 초기화
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initializeCategoryTabs();
            initializeShowMoreButtons();
        });
    } else {
        // DOMContentLoaded 이벤트가 이미 발생한 경우
        initializeCategoryTabs();
        initializeShowMoreButtons();
    }
})();
