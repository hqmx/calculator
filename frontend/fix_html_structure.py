#!/usr/bin/env python3
"""
HTML 파일을 CONVERTER 구조에 맞게 수정하는 스크립트
- 모든 컨텐츠를 .container div로 감싸기
- CSS/JS 로드 통일
- category.css 제거, /css/main.css와 /js/main.js 추가
"""

import os
import re
from pathlib import Path

def fix_html_file(file_path):
    """단일 HTML 파일 수정"""
    print(f"Processing: {file_path}")

    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 이미 수정된 파일인지 확인 (temperature-converter-v2.html 스타일)
    if '<div class="container">' in content and 'nav-common.js' in content:
        print(f"  Already fixed: {file_path}")
        return

    # 1. CSS 링크 수정
    # category.css 제거
    content = re.sub(r'<link rel="stylesheet" href="/category\.css">\n\s*', '', content)

    # style.css 뒤에 /css/calculator.css 있는지 확인하고 없으면 추가
    if '/css/calculator.css' not in content:
        content = re.sub(
            r'(<link rel="stylesheet" href="/style\.css\?v=[^"]+">)',
            r'\1\n    <link rel="stylesheet" href="/css/calculator.css">',
            content
        )

    # 2. Body 내용을 container로 감싸기
    # body 태그 찾기
    body_match = re.search(r'<body[^>]*>(.*?)</body>', content, re.DOTALL)
    if not body_match:
        print(f"  ERROR: No body tag found in {file_path}")
        return

    body_content = body_match.group(1).strip()

    # 이미 container로 감싸져 있는지 확인
    if body_content.strip().startswith('<div class="container">'):
        print(f"  Already has container: {file_path}")
        return

    # container로 감싸기
    new_body_content = f'''
    <div class="container">
{body_content}
    </div>
'''

    content = re.sub(
        r'<body[^>]*>.*?</body>',
        f'<body>\n{new_body_content}\n</body>',
        content,
        flags=re.DOTALL
    )

    # 3. JavaScript 수정
    # 기존 스크립트 태그들 찾기 (</body> 직전)
    content = re.sub(
        r'</body>',
        '''
    <script src="/js/main.js"></script>
</body>''',
        content
    )

    # nav-common.js나 category.js 제거
    content = re.sub(r'<script src="/nav-common\.js"></script>\n\s*', '', content)
    content = re.sub(r'<script src="/category\.js"></script>\n\s*', '', content)

    # 중복 제거
    content = re.sub(r'(<script src="/js/main\.js"></script>\s*)+', r'<script src="/js/main.js"></script>\n', content)

    # 파일 저장
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f"  Fixed: {file_path}")

def main():
    """모든 HTML 파일 수정"""
    frontend_dir = Path('/Users/wonjunjang/hqmx/calculator/frontend')

    # 수정할 파일 목록
    html_files = [
        # Conversion
        'conversion/length-converter.html',
        'conversion/weight-converter.html',
        'conversion/area-converter.html',
        'conversion/volume-converter.html',
        # Health
        'health/bmi-calculator.html',
        'health/calorie-calculator.html',
        # Date-Time
        'date-time/age-calculator.html',
        'date-time/date-calculator.html',
        # General
        'general/basic-calculator.html',
        'general/percentage-calculator.html',
    ]

    for html_file in html_files:
        file_path = frontend_dir / html_file
        if file_path.exists():
            fix_html_file(file_path)
        else:
            print(f"  NOT FOUND: {file_path}")

    print("\n✅ All files processed!")

if __name__ == '__main__':
    main()
