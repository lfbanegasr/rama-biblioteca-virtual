"""Store optimized copies of visual references already used on RAMA's public site."""
from pathlib import Path
from urllib.request import Request, urlopen
from io import BytesIO
from PIL import Image
import json

root = Path(__file__).resolve().parents[1]
assets = root / 'public/assets'
sources = {
    'rama-encuentro.webp': 'https://fundacion-rama.com/wp-content/uploads/2024/03/ggffg-min_color.png',
    'rama-lectura.webp': 'https://fundacion-rama.com/wp-content/uploads/2024/03/happy-teenager_1098-15582.jpg',
    'rama-consulta.webp': 'https://fundacion-rama.com/wp-content/uploads/2024/03/doing-homework-together_1098-14640.jpg',
}
report = []
for filename, url in sources.items():
    with urlopen(Request(url, headers={'User-Agent': 'Mozilla/5.0'}), timeout=45) as response:
        picture = Image.open(BytesIO(response.read())).convert('RGB')
    picture.thumbnail((1920, 1400), Image.Resampling.LANCZOS)
    picture.save(assets / filename, 'WEBP', quality=88, method=6)
    report.append({'file': filename, 'source': url, 'width': picture.width, 'height': picture.height, 'bytes': (assets / filename).stat().st_size})
(assets / 'procedencia-imagenes.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps(report))
