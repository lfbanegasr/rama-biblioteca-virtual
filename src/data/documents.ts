export const categories = ['Derecho y ciudadanía', 'Lectura e investigación', 'Organización documental', 'Participación ciudadana'] as const;
export const documentTypes = ['Libro', 'Jurisprudencia', 'Guía', 'Investigación'] as const;
export type DocumentType = typeof documentTypes[number];
export interface LibraryDocument {
  id: string; title: string; description: string; author: string;
  category: typeof categories[number]; type: DocumentType; year: number;
  pages: number; pdfUrl: string; sizeLabel: string; code: string;
}
const entries: Array<[string, string, DocumentType, number, number, string]> = [
  ['Orientaciones para la consulta de jurisprudencia', 'Una introducción de muestra para reconocer los elementos de una resolución y organizar su consulta.', 'Guía', 0, 2026, 'Equipo de demostración'],
  ['Derechos y participación ciudadana', 'Ejemplo de una publicación organizada en torno a derechos, ciudadanía y espacios de participación.', 'Libro', 3, 2026, 'Colección de muestra'],
  ['Ficha de análisis de una resolución', 'Modelo ficticio para mostrar la clasificación de jurisprudencia. No corresponde a una sentencia real.', 'Jurisprudencia', 0, 2025, 'Archivo de demostración'],
  ['Herramientas para una lectura crítica', 'Una muestra de cómo presentar recursos que acompañen la lectura y la consulta de documentos.', 'Libro', 1, 2025, 'Colección de muestra'],
  ['Cómo organizar un archivo digital', 'Ejemplo de guía sobre nombres de archivo, categorías y descripción de documentos.', 'Guía', 2, 2026, 'Equipo de demostración'],
  ['Acceso y consulta de información', 'Registro ficticio para explorar una ficha de investigación y sus datos descriptivos.', 'Investigación', 1, 2024, 'Área de demostración'],
  ['Estructura de una ficha jurisprudencial', 'Segundo registro de prueba para comparar títulos, años y categorías. Sin contenido judicial real.', 'Jurisprudencia', 0, 2024, 'Archivo de demostración'],
  ['Participación y espacios de diálogo', 'Documento de muestra para presentar una publicación y sus temas de consulta.', 'Libro', 3, 2025, 'Colección de muestra'],
  ['Referencias para el trabajo de investigación', 'Ejemplo de recurso para organizar referencias bibliográficas durante una consulta.', 'Guía', 1, 2023, 'Equipo de demostración'],
  ['Descripción de colecciones documentales', 'Registro demostrativo de una investigación sobre la organización de una colección.', 'Investigación', 2, 2025, 'Área de demostración'],
  ['Lectura y clasificación de resoluciones', 'Ficha ficticia para probar la búsqueda y el filtrado por tipo de documento.', 'Jurisprudencia', 0, 2026, 'Archivo de demostración'],
  ['Primeros pasos en la biblioteca virtual', 'Ejemplo de una guía breve para explorar categorías, consultar fichas y abrir un PDF.', 'Guía', 2, 2026, 'Equipo de demostración'],
  ['Cuaderno de consulta ciudadana', 'Una publicación ficticia para representar otra forma de consultar recursos por tema.', 'Libro', 3, 2024, 'Colección de muestra'],
  ['Prácticas de búsqueda documental', 'Ejemplo de ficha de investigación que combina información descriptiva y acceso a un archivo.', 'Investigación', 1, 2026, 'Área de demostración'],
];
export const documents: LibraryDocument[] = entries.map(([title, description, type, category, year, author], index) => ({
  id: `muestra-${String(index + 1).padStart(2, '0')}`, title, description, type, category: categories[category], year, author,
  pages: 2, pdfUrl: `${import.meta.env.BASE_URL}documents/documento-demostracion.pdf`,
  sizeLabel: '3,8 KB', code: `RAMA · ${String(index + 1).padStart(3, '0')}`,
}));
export function normalize(value: string) { return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('es'); }
