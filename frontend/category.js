// 카테고리 페이지 JavaScript

(function() {
    'use strict';

    // 검색 기능
    const searchInput = document.getElementById('categorySearch');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase().trim();
            const cards = document.querySelectorAll('.category-card');

            cards.forEach(card => {
                const name = card.querySelector('.category-name')?.textContent.toLowerCase() || '';
                const desc = card.querySelector('.category-description')?.textContent.toLowerCase() || '';

                if (name.includes(searchTerm) || desc.includes(searchTerm)) {
                    card.style.display = 'flex';
                    // 애니메이션 효과
                    card.style.animation = 'fadeIn 0.3s ease';
                } else {
                    card.style.display = 'none';
                }
            });

            // 검색 결과가 없을 경우 메시지 표시
            const visibleCards = document.querySelectorAll('.category-card[style*="display: flex"]');
            const gridSection = document.querySelector('.category-grid-section');
            let noResultsMsg = document.getElementById('noResultsMessage');

            if (visibleCards.length === 0) {
                if (!noResultsMsg) {
                    noResultsMsg = document.createElement('div');
                    noResultsMsg.id = 'noResultsMessage';
                    noResultsMsg.className = 'no-results-message';
                    noResultsMsg.innerHTML = `
                        <i class="fas fa-search"></i>
                        <p>No calculators found matching "${searchTerm}"</p>
                        <small>Try different keywords</small>
                    `;
                    gridSection.appendChild(noResultsMsg);
                }
            } else {
                if (noResultsMsg) {
                    noResultsMsg.remove();
                }
            }
        });
    }

    // 카테고리 카드 애니메이션 (Intersection Observer)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // 순차적 애니메이션을 위한 지연
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);

                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // 초기 스타일 설정 및 Observer 등록
    document.querySelectorAll('.category-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.5s ease';
        observer.observe(card);
    });

    // Popular 카드 애니메이션
    document.querySelectorAll('.popular-card').forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.5s ease';

        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, (index + 8) * 100); // 카테고리 카드 다음에 애니메이션
    });

    // 카테고리 카드 호버 시 아이콘 회전 효과
    document.querySelectorAll('.category-card').forEach(card => {
        const iconWrapper = card.querySelector('.category-icon-wrapper');

        card.addEventListener('mouseenter', () => {
            if (iconWrapper) {
                iconWrapper.style.transform = 'scale(1.1) rotate(5deg)';
            }
        });

        card.addEventListener('mouseleave', () => {
            if (iconWrapper) {
                iconWrapper.style.transform = 'scale(1) rotate(0deg)';
            }
        });
    });

    // 검색 입력 포커스 시 효과
    if (searchInput) {
        searchInput.addEventListener('focus', function() {
            this.parentElement.style.transform = 'scale(1.02)';
        });

        searchInput.addEventListener('blur', function() {
            this.parentElement.style.transform = 'scale(1)';
        });
    }

})();

// CSS 애니메이션 키프레임 추가
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: scale(0.95);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }

    .no-results-message {
        text-align: center;
        padding: 3rem 2rem;
        color: var(--light-text-color);
        grid-column: 1 / -1;
    }

    .no-results-message i {
        font-size: 3rem;
        margin-bottom: 1rem;
        opacity: 0.3;
    }

    .no-results-message p {
        font-size: 1.2rem;
        font-weight: 600;
        margin-bottom: 0.5rem;
    }

    .no-results-message small {
        font-size: 0.9rem;
        opacity: 0.7;
    }

    .search-container {
        transition: transform 0.3s ease;
    }
`;
document.head.appendChild(style);
