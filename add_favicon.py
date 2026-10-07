import os
import glob

for f in glob.glob('*.html'):
    try:
        with open(f, 'r', encoding='utf-8', errors='ignore') as file:
            content = file.read()
        if '<link rel="icon"' not in content:
            content = content.replace('</head>', '    <link rel="icon" type="image/png" href="assets/strategix%20logo.png">\n</head>')
            with open(f, 'w', encoding='utf-8') as file:
                file.write(content)
            print(f"Added to {f}")
    except Exception as e:
        print(f"Failed {f}: {e}")
