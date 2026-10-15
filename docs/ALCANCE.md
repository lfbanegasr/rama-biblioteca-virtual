# Alcance de la demostración

## Qué se implementó

Una aplicación estática con dos alternativas visuales y cinco vistas por alternativa. Comparten datos, componentes y filtros. El catálogo contiene 14 muestras con título, descripción, autor ficticio, categoría, tipo y año. Cada ficha tiene apertura en otra pestaña y descarga de un PDF neutral local de dos páginas.

La alternativa A da prioridad a la información institucional. La B prioriza la búsqueda documental. Los diseños difieren en jerarquía, portada y forma inicial de presentar el catálogo; no son solo dos paletas de color.

Las secciones y funciones se presentan para evaluar la experiencia. No deben interpretarse como requisitos ya aprobados o como alcance comercial contratado.

## Identidad y fuentes de recursos

Referencia consultada el 15 de octubre de 2026: https://fundacion-rama.com/

- **Logo:** recurso público de la cabecera, conservado con sus proporciones, sin modificaciones. Origen: https://fundacion-rama.com/wp-content/uploads/2024/03/cropped-Fundacion-RAMA-scaled-1.jpg. Su uso definitivo y la versión de mayor calidad deben confirmarse con RAMA.
- **Colores:** azul `#00215E` identificado en los estilos del sitio. Se combina con blanco y grises; el verde y el turquesa se adaptan a acentos de contraste legible. No se reproduce la estructura de la web existente.
- **Tipografía:** Raleway, confirmada como fuente aplicada a cuerpo y navegación mediante navegador. Se incluye una copia local obtenida de Google Fonts. Licencia SIL Open Font License en `public/fonts/OFL-Raleway.txt`.
- **Ilustraciones, portadas e iconos:** realizados en CSS y SVG para este prototipo; son recursos de demostración, no portadas de libros reales ni un nuevo logotipo.
- **PDF:** creado expresamente para verificar la apertura y descarga. No se descargaron libros ni se importó el catálogo real del sitio.

El sitio actual menciona una biblioteca privada y más de 30.000 libros. Esa información requiere validación institucional y no se adoptó como volumen confirmado ni como requisito de autenticación. Tampoco se copiaron estadísticas, trayectoria, testimonios, contactos o misión como datos aprobados para esta nueva propuesta.

## Decisiones pendientes para producción

1. Confirmar si se reemplazará, ampliará o conservará el sitio actual, sus accesos y dominio.
2. Aprobar secciones, textos, imágenes y datos de contacto con la persona designada por RAMA.
3. Definir el inventario real, metadatos, peso de los PDF y crecimiento esperado.
4. Decidir acceso público o restringido y, si corresponde, cuentas, permisos y condiciones de acceso. El prototipo no aporta autenticación ni protección de documentos.
5. Determinar si se necesita búsqueda de texto completo u OCR; no se incluye en esta demostración.
6. Elegir plataforma definitiva, mecanismo de carga y actualización y responsables de administración.
7. Confirmar hosting, modalidad de pago y almacenamiento de PDF dentro del hosting o en un servicio externo, como R2. El modelo de datos ya separa URL de archivo y ficha, pero no hay integración con servicios reales.
8. Acordar respaldo de web, base de datos y originales, recuperación y seguimiento del consumo.
9. Concretar formulario real, tratamiento de datos y canales institucionales antes de habilitar comunicaciones.
10. Definir entregables, revisiones, orientación a administradores, plazo y presupuesto de desarrollo.

El resultado no se ha desplegado ni conecta cuentas, servicios de pago, analítica o almacenamiento externo.
