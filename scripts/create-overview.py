"""Compose a compact comparison from the actual browser screenshots."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

root = Path(__file__).resolve().parents[1]
output = Image.new('RGB', (1504, 500), '#edf2f5')
draw = ImageDraw.Draw(output)
font = ImageFont.truetype('C:/Windows/Fonts/arial.ttf', 21)
for index, (variant, label) in enumerate([
    ('a', 'A · Institucional'), ('b', 'B · Biblioteca')
]):
    x = 16 + index * 744
    draw.text((x, 12), label, font=font, fill='#00215e')
    screenshot = Image.open(root / f'qa/screenshots/inicio-{variant}-1440.png').convert('RGB')
    screenshot = screenshot.crop((0, 0, 1440, 880)).resize((728, 445), Image.Resampling.LANCZOS)
    output.paste(screenshot, (x, 48))
output.save(root / 'qa/comparacion-prototipos.png')
