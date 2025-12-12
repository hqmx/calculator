# Calculator Service Troubleshooting History

## 🚨 트러블슈팅 (Troubleshooting)

### ✅ [FIXED] 배포 및 경로 문제 (2025-12-01)

**증상:**
1.  `/calculator/` 경로에 접속 시 `main` 서비스의 콘텐츠(사이트맵)가 표시됨.
2.  페이지가 로드되더라도 CSS, JavaScript, 이미지 등 에셋 파일들이 404 오류를 반환하며 깨져 보임.

**원인:**
1.  **잘못된 배포:** `calculator` 서비스 디렉토리에 `main` 서비스의 `frontend` 파일들이 잘못 배포되어 있었음.
2.  **잘못된 경로:** 모든 HTML 파일 (`index.html` 및 하위 계산기 페이지) 내의 CSS, JS, 이미지 경로가 `/style.css` 와 같은 루트 절대 경로로 되어 있어, 서브디렉토리(`_`/calculator/`_) 환경에서 올바른 파일을 찾지 못함.

**해결 과정:**
1.  **재배포:** `./deploy.sh calculator prod` 명령어를 사용하여 올바른 `calculator/frontend` 디렉토리의 콘텐츠를 서버에 다시 배포함.
2.  **경로 수정 스크립트 작성:** 모든 HTML 파일의 에셋 및 네비게이션 경로에 `_/calculator/`_ 접두사를 추가하는 `fix_calculator_all_paths.py` 스크립트를 작성하여 실행함.
3.  **최종 배포:** 경로가 수정된 파일들을 다시 서버에 배포하여 모든 문제를 해결함.

### ✅ [FIXED] 네비게이터 언어 설정 문제 (2025-12-01)

**증상:**
- 페이지 로드 시 네비게이션 바의 언어가 'English'로 기본 설정되어 표시되지 않는 문제.

**원인:**
- `index.html`에 불필요한 `nav-common.js` 스크립트와 다른 프로젝트에서 복사된 것으로 보이는 관련 없는 스크립트 블록이 포함되어 있어, `i18n.js`의 언어 초기화 기능과 충돌을 일으킴.

**해결 과정:**
1.  `calculator/frontend/index.html`에서 불필요한 `<script src="/calculator/nav-common.js"></script>` 라인을 제거함.
2.  `index.html` 하단의 관련 없는 `DOMContentLoaded` 이벤트 리스너 스크립트 블록을 제거함.
3.  수정된 `index.html` 파일을 서버에 다시 배포하여 문제를 해결함.

### ✅ [FIXED] 긴급 복구: CSS/JS 경로 깨짐 및 Legacy Revert (2025-12-06)

**증상:**
- Calculator 서비스의 모든 CSS, JS, 이미지 파일이 404 에러를 반환하며 사이트 UI가 완전히 깨짐.
- 최근 작업으로 인해 파일 경로 체계가 꼬인 상태.

**원인:**
- 최신 코드 변경 사항이 불안정하여 UI 파손.
- 코드를 11월 29일(안정 버전)로 롤백했으나, 해당 버전은 `calculator.hqmx.net` (루트 기반) 아키텍처용으로 작성되어 있어, 현재의 `hqmx.net/calculator/` (서브디렉토리 기반) 배포 환경에서 경로 불일치 발생.
- `src="/js/..."`, `href="/css/..."` 등의 절대 경로가 `/calculator/` 접두사 없이 루트(`hqmx.net/`)를 가리킴.

**해결 과정:**
1.  **Git Revert**: `frontend/` 디렉토리를 `34a9863` (11월 29일) 커밋 상태로 강제 롤백.
2.  **경로 일괄 수정 (Batch Fix)**:
    - `fix_paths_all.py` 파이썬 스크립트를 작성하여 43개의 모든 HTML 및 JS 파일을 스캔.
    - 루트 절대 경로(`/css/`, `/js/`, `/assets/`, `/locales/` 등)를 서브디렉토리 경로(`/calculator/css/`, `/calculator/js/` 등)로 일괄 치환.
    - `i18n.js` 동적 import 경로 및 `sitemap.html` 리소스 경로 수정.
3.  **검증**: Playwright를 통해 홈 및 서브 페이지(BMI 계산기 등)의 리소스 로딩 정상화 확인 (200 OK).

**교훈:**
- 레거시 코드로 롤백할 때는 현재 배포 환경(서브디렉토리 구조)과의 호환성을 반드시 확인해야 함.
- 절대 경로 사용 시 서비스 접두사(`/calculator/`) 누락 주의.
