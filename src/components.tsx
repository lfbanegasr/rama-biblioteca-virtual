import type { ReactNode } from 'react';
import type { LibraryDocument } from './data/documents';
export type IconName = 'arrow' | 'search' | 'book' | 'download' | 'external' | 'chevron' | 'close' | 'menu' | 'filter' | 'file' | 'grid' | 'list' | 'check';
const paths: Record<IconName, ReactNode> = {
  arrow: <><path d="M4 12h15M13 5l7 7-7 7" /></>,
  search: <><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 4.5 4.5"/></>,
  book: <><path d="M3 4h6l3 2 3-2h6v15h-6l-3 2-3-2H3zM12 6v15"/></>,
  download: <><path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"/></>,
  external: <><path d="M14 3h7v7M21 3 10 14M10 4H4v16h16v-6"/></>,
  chevron: <path d="m9 5 7 7-7 7"/>, close: <path d="m6 6 12 12M6 18 18 6"/>,
  menu: <path d="M4 6h16M4 12h16M4 18h16"/>,
  filter: <><path d="M4 7h16M4 17h16"/><circle cx="8" cy="7" r="2" fill="currentColor"/><circle cx="16" cy="17" r="2" fill="currentColor"/></>,
  file: <><path d="M5 3h9l5 5v13H5zM14 3v6h5M8 14h8M8 17h6"/></>,
  grid: <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
  list: <path d="M8 5h13M8 12h13M8 19h13M3 5h.1M3 12h.1M3 19h.1"/>,
  check: <path d="m5 12 4 4L19 6"/>,
};
export function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}
export function BookCover({ document: doc, small = false }: { document: LibraryDocument; small?: boolean }) {
  return <div className={`book-cover cover-${doc.type.toLowerCase()} ${small ? 'small-cover' : ''}`} aria-hidden="true">
    <div className="cover-top"><span>RAMA</span><Icon name="book" size={small ? 16 : 22}/></div>
    <div className="cover-art"><span/><span/><span/></div>
    <div className="cover-type">{doc.type}</div><div className="cover-title">{doc.title}</div>
    <div className="cover-bottom"><span>EDICIÓN DE MUESTRA</span><span>{doc.year}</span></div>
  </div>;
}
export function DocumentCard({ document: doc, href, compact = false }: { document: LibraryDocument; href: string; compact?: boolean }) {
  return <article className={`document-card ${compact ? 'document-row' : ''}`} data-reveal>
    <a href={href} className="cover-link" tabIndex={-1} aria-hidden="true"><BookCover document={doc} small={compact}/></a>
    <div className="document-info"><div className="document-meta"><span className="type-label">{doc.type}</span><span>{doc.year}</span></div>
      <h3><a href={href}>{doc.title}</a></h3><p className="document-description">{doc.description}</p>
      <p className="document-author">{doc.author}</p><div className="document-bottom"><span><Icon name="file" size={15}/> PDF de muestra</span><a className="text-link" href={href}>Ver ficha <Icon name="arrow" size={17}/></a></div>
    </div>
  </article>;
}
export function LibraryIllustration() {
  return <div className="library-illustration" aria-hidden="true">
    <div className="illustration-grid"/><div className="illustration-label">UNA BIBLIOTECA<br/>POR DESCUBRIR</div>
    <div className="hero-book book-back"><span>Lectura<br/>& consulta</span><div className="book-lines"/><small>FUNDACIÓN RAMA</small></div>
    <div className="hero-book book-front"><Icon name="book" size={34}/><span>Un espacio<br/>para el<br/><em>conocimiento.</em></span><small>COLECCIÓN DE MUESTRA</small></div>
    <div className="illustration-caption"><span className="caption-line"/> Leer. Consultar. Explorar.</div>
  </div>;
}
