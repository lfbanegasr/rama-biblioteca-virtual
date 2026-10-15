# Revisión de los prototipos RAMA

Fecha: 15 de octubre de 2026. Navegador: Google Chrome en Windows, ejecución local.

- Compilación de TypeScript y Vite completada.
- **114 comprobaciones de uso aprobadas:** navegación, búsqueda por metadatos sin distinguir tildes, filtros combinados, ordenación, paginación, cambio de vista y variante, resultados vacíos, limpieza, fichas, rutas inexistentes, formulario de demostración y acceso por teclado al contenido.
- Se verificaron la respuesta del PDF, su firma de archivo válida, la apertura en otra pestaña y la descarga real en escritorio y móvil.
- **20 pantallas revisadas con axe**, usando reglas WCAG A/AA: ninguna incidencia automática pendiente. Esta revisión no constituye una certificación de accesibilidad.
- **10 comprobaciones adicionales** a 768 px sobre una copia estática servida desde una subcarpeta: recursos y PDF disponibles, sin desbordamiento horizontal.
- **40 comprobaciones del rediseño** a 390, 768 y 1440 px: imágenes locales, entradas de sección, cabecera fija, progreso de lectura, retorno al inicio, respuesta de las portadas al cursor y desactivación de animaciones, inclinación y paralaje con movimiento reducido.
- Revisión visual de ambas alternativas a 390 y 1440 px, además de la vista institucional a 768 px. Se corrigieron el contraste de textos secundarios y la sincronización inmediata de los filtros.
- Sin errores de JavaScript, archivos ausentes ni solicitudes externas durante los recorridos principales.
- Se probó el servidor del acceso de apertura, con la apertura automática del navegador desactivada durante la prueba. El archivo `Ver prototipos.cmd` lo ejecuta y abre el navegador para el usuario.

Informes reproducibles: `verification.json`, `accessibility.json`, `static-verification.json` y `presentation-verification.json`. Capturas completas en `screenshots/`. El script `verify.mjs` requiere iniciar antes la vista previa en 4173; `verify-static.mjs` crea y cierra su propio servidor local.

El servidor utilizado para las verificaciones se detuvo al entregar. Para revisar los prototipos, abrir el acceso indicado en el README de la carpeta principal. Esta revisión se preparó localmente: el enlace de Vercel conservará la versión anterior hasta que el usuario actualice GitHub y termine el despliegue. No se contrataron servicios. No se han probado Safari ni Firefox.
