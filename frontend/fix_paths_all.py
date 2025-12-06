import os
import re

# Define the root directory to search for HTML files
ROOT_DIR = '/Users/wonjunjang/hqmx/calculator/frontend'

# Define patterns to replace
# Key: Pattern to search for (regex), Value: Replacement string
PATTERNS = [
    # CSS Files
    (r'(href=["\'])/css/', r'\1/calculator/css/'),
    (r'(href=["\'])/style.css', r'\1/calculator/style.css'),
    (r'(href=["\'])/category.css', r'\1/calculator/category.css'),
    
    # JS Files
    (r'(src=["\'])/js/', r'\1/calculator/js/'),
    (r'(src=["\'])/i18n.js', r'\1/calculator/i18n.js'),
    (r'(src=["\'])/category.js', r'\1/calculator/category.js'),
    (r'(src=["\'])/locales.js', r'\1/calculator/locales.js'),
    (r'(src=["\'])/nav-common.js', r'\1/calculator/nav-common.js'),
    
    # Assets
    (r'(href=["\'])/assets/', r'\1/calculator/assets/'),
    (r'(src=["\'])/assets/', r'\1/calculator/assets/'),
    
    # Manifest & Icons
    (r'(href=["\'])/manifest.json', r'\1/calculator/manifest.json'),
    (r'(href=["\'])/favicon', r'\1/calculator/assets/favicon'),
    
    # Navigation Links (Internal)
    # Be careful not to replace external links or already correct links
    # We replace root-relative links to known categories
    (r'(href=["\'])/(general|date-time|finance|health|conversion|math|media|construction)/', r'\1/calculator/\2/'),
    
    # Common pages at root
    (r'(href=["\'])/how-to-use.html', r'\1/calculator/how-to-use.html'),
    (r'(href=["\'])/faq.html', r'\1/calculator/faq.html'),
    (r'(href=["\'])/sitemap.html', r'\1/calculator/sitemap.html'),
    (r'(href=["\'])/api.html', r'\1/calculator/api.html'),
    
    # Home link (special case: href="/" -> href="/calculator/")
    # Only if it's strictly href="/"
    (r'href="/"', r'href="/calculator/"'),
]

def fix_paths_in_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    
    for pattern, replacement in PATTERNS:
        # Use regex substitution
        # This regex matches the quote and ensures we only replace if it starts with /
        # The patterns above capture the quote in group 1
        content = re.sub(pattern, replacement, content)
        
    if content != original_content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Fixed: {file_path}")
    # else:
    #    print(f"Skipped (No changes): {file_path}")

def main():
    count = 0
    for root, dirs, files in os.walk(ROOT_DIR):
        for file in files:
            if file.endswith('.html'):
                file_path = os.path.join(root, file)
                fix_paths_in_file(file_path)
                count += 1
    
    print(f"Processed {count} HTML files.")

if __name__ == "__main__":
    main()
