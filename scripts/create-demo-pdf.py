from pathlib import Path
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import A4
from reportlab.platypus import Paragraph
from reportlab.lib.styles import ParagraphStyle

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'public/documents/documento-demostracion.pdf'
OUT.parent.mkdir(parents=True,exist_ok=True)
c=canvas.Canvas(str(OUT),pagesize=A4)
c.setTitle('Fundación RAMA - Documento de demostración')
c.setAuthor('Prototipo de biblioteca virtual')
w,h=A4
navy=HexColor('#00215e'); teal=HexColor('#007f83'); gray=HexColor('#586b7e')
normal=ParagraphStyle('body',fontName='Helvetica',fontSize=11,leading=18,textColor=gray)
def text(content,y):
    p=Paragraph(content,normal); _,height=p.wrap(w-112,600);p.drawOn(c,56,y-height);return y-height-20
def header(page):
    c.setFillColor(navy);c.rect(0,h-13,w,13,fill=1,stroke=0)
    c.setFont('Helvetica-Bold',10);c.drawString(56,h-65,'FUNDACIÓN RAMA')
    c.setFillColor(teal);c.setFont('Helvetica',8);c.drawRightString(w-56,h-65,'BIBLIOTECA VIRTUAL / MUESTRA')
    c.setStrokeColor(HexColor('#dce3e9'));c.line(56,65,w-56,65)
    c.setFillColor(gray);c.setFont('Helvetica',8);c.drawString(56,45,'Contenido de demostración. No es una publicación institucional.')
    c.drawRightString(w-56,45,f'{page} / 2')
header(1)
c.setFillColor(navy);c.setFont('Helvetica-Bold',29)
c.drawString(56,h-142,'Un documento para')
c.drawString(56,h-180,'explorar la biblioteca')
y=text('Este archivo fue creado expresamente para probar la apertura y descarga de PDF en los prototipos de la web de Fundación RAMA.',h-224)
y=text('Es una muestra técnica con contenido neutral. No contiene jurisprudencia, asesoramiento jurídico ni el texto de un libro real. Los títulos y autores que aparecen en el catálogo son ficticios y sirven para evaluar la presentación de la información.',y)
c.setFillColor(navy);c.setFont('Helvetica-Bold',15);c.drawString(56,y-12,'Qué permite comprobar')
y=text('1. Abrir un archivo PDF local en el navegador.<br/>2. Descargar una copia del archivo.<br/>3. Revisar el acceso desde un teléfono o un equipo de escritorio.',y-35)
y=text('Todas las fichas del prototipo enlazan este mismo documento de muestra. En una implementación futura, cada ficha tendría la dirección del archivo que la Fundación autorice publicar.',y)
c.showPage();header(2)
c.setFillColor(navy);c.setFont('Helvetica-Bold',26);c.drawString(56,h-142,'Antes de publicar')
y=text('El prototipo es una herramienta para conversar sobre el proyecto. Sus pantallas y funciones no constituyen un alcance de desarrollo aprobado.',h-186)
y=text('Para convertirlo en una biblioteca de producción es necesario definir los documentos reales, sus descripciones, el volumen y peso de los archivos, las condiciones de acceso y la persona responsable de mantener el catálogo.',y)
y=text('La Fundación deberá proporcionar y validar la información institucional y los recursos que se publiquen. También se acordarán el alojamiento, las copias de seguridad y los requisitos de acceso público o restringido.',y)
c.setFillColor(teal);c.setFont('Helvetica-Bold',13);c.drawString(56,y-20,'Leer. Consultar. Explorar.')
c.save()
print(f'PDF creado: {OUT} ({OUT.stat().st_size} bytes)')
