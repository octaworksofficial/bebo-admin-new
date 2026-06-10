import re

with open('api/ornek-rapor-maili.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Find <div id="converted-body" ...>
start = html.find('<div id="converted-body"')
if start != -1:
    end = html.find('</div></div></div></div>', start)
    if end != -1:
        extracted = html[start:end+6]
        # save to a file
        with open('api/extracted.html', 'w', encoding='utf-8') as f:
            f.write(extracted)
        print("Extracted successfully.")
    else:
        print("End not found.")
else:
    print("Start not found.")
