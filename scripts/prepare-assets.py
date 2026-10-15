from pathlib import Path
import urllib.request, re, json
from zipfile import ZipFile
from xml.etree import ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
def fetch(url):
    return urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent':'Mozilla/5.0'}),timeout=40).read()
for folder in ['public/assets','public/fonts','public/documents','qa/reference','docs']:
    (ROOT/folder).mkdir(parents=True,exist_ok=True)
logo='https://fundacion-rama.com/wp-content/uploads/2024/03/cropped-Fundacion-RAMA-scaled-1.jpg'
(ROOT/'public/assets/rama-logo.jpg').write_bytes(fetch(logo))
css=fetch('https://fonts.googleapis.com/css2?family=Raleway:wght@400..800&display=swap').decode()
(ROOT/'qa/reference/google-fonts.css').write_text(css,encoding='utf-8')
# Request a modern browser response to obtain WOFF2 and prefer the latin subset.
request=urllib.request.Request('https://fonts.googleapis.com/css2?family=Raleway:wght@400..800&display=swap',headers={'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'})
css=urllib.request.urlopen(request,timeout=40).read().decode()
(ROOT/'qa/reference/raleway-variable.css').write_text(css,encoding='utf-8')
urls=re.findall(r'url\((https://[^)]+)\)',css)
assert urls, 'No se encontró la fuente'
(ROOT/'public/fonts/raleway-latin.woff2').write_bytes(fetch(urls[-1]))
license_url='https://raw.githubusercontent.com/google/fonts/main/ofl/raleway/OFL.txt'
(ROOT/'public/fonts/OFL-Raleway.txt').write_bytes(fetch(license_url))
site_css=fetch('https://fundacion-rama.com/wp-content/themes/bridge/css/style_dynamic.css').decode()
(ROOT/'qa/reference/style_dynamic.css').write_text(site_css,encoding='utf-8')
with ZipFile(ROOT.parent/'Prepropuesta web y biblioteca virtual Fundación RAMA con Hostinger.docx') as z:
    x=ET.fromstring(z.read('word/document.xml'))
    extracted='\n'.join(t.text or '' for t in x.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}t'))
    (ROOT/'qa/reference/prepropuesta-texto.txt').write_text(extracted,encoding='utf-8')
print(json.dumps({'logo':logo,'font_files':len(urls),'font_bytes':(ROOT/'public/fonts/raleway-latin.woff2').stat().st_size},ensure_ascii=False))
