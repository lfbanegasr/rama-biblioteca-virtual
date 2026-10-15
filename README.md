# Prototipos web de Fundación RAMA

Dos alternativas locales y navegables para definir el proyecto de web institucional y biblioteca virtual. Son demostraciones frontend, no un sistema de producción. No se ha publicado el sitio ni conectado servicios externos.

## Abrir los prototipos en este equipo

Haz doble clic en **Ver prototipos.cmd**. Iniciará una vista previa local y abrirá el navegador. Mantén abierta la ventana que aparece mientras revisas; ciérrala para detener la vista previa.

También puedes iniciar manualmente:

```powershell
pnpm install
pnpm dev
```

Abre las direcciones siguientes. El selector superior permite cambiar de propuesta conservando la vista actual.

| Propuesta | Inicio en desarrollo | Catálogo |
|---|---|---|
| A Institucional | http://127.0.0.1:5173/#/a/inicio | http://127.0.0.1:5173/#/a/biblioteca |
| B Biblioteca | http://127.0.0.1:5173/#/b/inicio | http://127.0.0.1:5173/#/b/biblioteca |

El acceso por doble clic utiliza el puerto **4173**. En ese caso reemplaza 5173 por 4173 en las direcciones. No abras `dist/index.html` directamente como archivo: requiere el servidor local para cargar los módulos.

## Diferencias entre las propuestas

- **A Institucional:** portada amplia, introducción a RAMA, selección de documentos en tarjetas y acceso a la información institucional. Predomina el fondo blanco, con azul institucional y acentos verdes.
- **B Biblioteca:** portada centrada en el buscador, accesos por tipo de documento, categorías y documentos en lista. El catálogo abre por defecto en una vista más compacta. Mantiene la misma identidad y los mismos contenidos de muestra.

Ambas incluyen inicio, catálogo, ficha de documento, información institucional y contacto. El catálogo tiene búsqueda sin distinción de tildes, filtros combinables, ordenación, paginación, cambio entre tarjetas y lista y estado sin resultados. Las direcciones del catálogo conservan los criterios de consulta, por lo que se pueden copiar para volver a esa búsqueda.

## Compilar y revisar

Requisitos para desarrollo: Node.js compatible con Vite 8 y pnpm. Las versiones resueltas están fijadas en `pnpm-lock.yaml`.

```powershell
pnpm build
pnpm preview
```

`dist/` contiene el resultado estático, preparado para evaluar posteriormente en DreamHost o Hostinger. La navegación usa fragmentos de URL, por lo que no requiere reglas de reescritura de un servidor. La plataforma de producción todavía debe acordarse; este prototipo no determina que el sitio definitivo use React.

Para repetir las pruebas automatizadas, inicia primero la vista previa en 4173 y luego:

```powershell
pnpm test:e2e
node scripts/accessibility.mjs
node scripts/verify-static.mjs
```

Las pruebas utilizan Google Chrome instalado en su ruta habitual de Windows. Si está en otra ubicación, configura `CHROME_PATH`. `RAMA_URL` permite cambiar la dirección del servidor bajo prueba. Las capturas y el informe se guardan en `qa/`.

La revisión de accesibilidad comprueba reglas WCAG A/AA con axe en las cinco vistas de ambas propuestas, a 390 y 1440 px; no sustituye una auditoría completa con usuarios. La verificación estática prueba también 768 px y la carga desde una subcarpeta en un servidor local básico, sin Vite ni reglas especiales de rutas.

## Contenido y PDF

Los **14 registros son ficticios** y están identificados como muestras. No representan el inventario de RAMA ni contienen jurisprudencia real. Todas las fichas abren y descargan el mismo PDF local de dos páginas, creado para esta demostración.

El formulario de contacto comprueba los campos en el navegador y muestra una confirmación explícita de demostración. **No envía ni guarda mensajes**. No se incluyen usuarios, membresías, cargas de archivos, backend, OCR, búsqueda dentro del PDF, pagos ni administración de contenidos.

El logo y la fuente se guardaron localmente. Durante el uso del prototipo no se requieren solicitudes a otras páginas.

## Archivos principales

```text
src/App.tsx                Vistas y navegación de ambas propuestas
src/components.tsx         Componentes compartidos e ilustración editorial
src/data/documents.ts      Datos ficticios y URLs de PDF
src/styles.css             Identidad visual y adaptación responsive
public/assets/             Logotipo institucional de referencia
public/fonts/              Raleway y su licencia
public/documents/          PDF de demostración
scripts/                   Inicio local, preparación y verificaciones
qa/screenshots/            Capturas de las propuestas
qa/verification.json       Resultado de los recorridos automatizados
docs/ALCANCE.md             Alcance y decisiones pendientes
```

Los datos comerciales de las prepropuestas no se muestran en la web. Los archivos de propuestas originales se conservaron sin modificaciones.
