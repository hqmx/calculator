#!/usr/bin/env python3
import re
import os

def process_ssi(html_file, output_file=None):
    """SSI include 태그를 실제 파일 내용으로 교체"""
    if output_file is None:
        output_file = html_file.replace('.html', '_processed.html')
    
    with open(html_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # SSI include 패턴 찾기: <!--# include file="..." -->
    pattern = r'<!--#\s*include\s+file="([^"]+)"\s*-->'
    
    def replace_include(match):
        include_path = match.group(1)
        # 절대 경로를 상대 경로로 변환
        if include_path.startswith('/'):
            include_path = include_path[1:]
        
        try:
            with open(include_path, 'r', encoding='utf-8') as inc_file:
                return inc_file.read()
        except FileNotFoundError:
            print(f"⚠️  파일을 찾을 수 없습니다: {include_path}")
            return match.group(0)  # 원본 그대로 유지
    
    # SSI 태그를 파일 내용으로 교체
    processed = re.sub(pattern, replace_include, content)
    
    # 결과 저장
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(processed)
    
    print(f"✅ SSI 처리 완료: {output_file}")
    return output_file

if __name__ == '__main__':
    process_ssi('index.html', 'index_local.html')
