import { useEffect, useRef, useState, type FormEvent } from 'react';
import { categories, documents, documentTypes, normalize } from './data/documents';
import { BookCover, DocumentCard, Icon, LibraryIllustration } from './components';

type Variant = 'a' | 'b';
function navigate(hash: string) {
  window.location.hash = hash;
  // Keep controlled filters and same-page links in sync within the interaction.
  window.dispatchEvent(new HashChangeEvent('hashchange'));
}
function getRoute() {
  const [path, query = ''] = window.location.hash.replace(/^#\/?/, '').split('?');
  const [variant, page, id] = path.split('/');
  return { variant: (variant === 'b' ? 'b' : 'a') as Variant, page: page || 'inicio', id, query };
}
export default function App() {
  const [route, setRoute] = useState(getRoute);
  const [menuOpen, setMenuOpen] = useState(false);
  const previousPath = useRef('');
  useEffect(() => {
    function update() { setRoute(getRoute()); setMenuOpen(false); }
    window.addEventListener('hashchange', update);
    return () => window.removeEventListener('hashchange', update);
  }, []);
  const { variant, page, id, query } = route;
  const href = (target: string, suffix = '') => `#/${variant}/${target}${suffix}`;
  useEffect(() => {
    const currentPath = `${variant}/${page}/${id || ''}`;
    const names: Record<string,string> = { inicio: 'Inicio', biblioteca: 'Biblioteca', documento: 'Ficha del documento', institucion: 'La Fundación', contacto: 'Contacto' };
    document.title = `${names[page] || 'Página no encontrada'} · Fundación RAMA · Propuesta ${variant.toUpperCase()}`;
    if (previousPath.current && previousPath.current !== currentPath) {
      window.scrollTo({ top: 0, behavior: 'instant' });
      document.getElementById('contenido')?.focus({ preventScroll: true });
    }
    previousPath.current = currentPath;
  }, [variant, page, id]);
  const switchVariant = (target: Variant) => `#/${target}/${page}${id ? `/${id}` : ''}${query ? `?${query}` : ''}`;
  return <div className={`app variant-${variant}`} onClick={event => {
    const link = (event.target as Element).closest<HTMLAnchorElement>('a[href^="#/"]');
    if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    navigate(link.hash);
  }}>
    <a className="skip-link" href="#contenido" onClick={event => { event.preventDefault(); document.getElementById('contenido')?.focus(); }}>Saltar al contenido</a>
    <div className="prototype-bar"><div className="container prototype-inner"><span><span className="demo-dot"/> Prototipo <span className="demo-description">· Contenido de muestra</span></span><div className="variant-switch" aria-label="Cambiar propuesta">
      <a href={switchVariant('a')} aria-current={variant === 'a' ? 'true' : undefined}><span>A</span> Institucional</a>
      <a href={switchVariant('b')} aria-current={variant === 'b' ? 'true' : undefined}><span>B</span> Biblioteca</a>
    </div></div></div>
    <header className="site-header"><div className="container header-inner">
      <a className="brand" href={href('inicio')} aria-label="Fundación RAMA, inicio"><img src={`${import.meta.env.BASE_URL}assets/rama-logo.jpg`} alt="Fundación RAMA"/><span className="brand-separator"/><span className="brand-label">Un espacio para<br/><strong>leer y consultar</strong></span></a>
      <button className="menu-toggle" aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={menuOpen} aria-controls="navegacion" onClick={() => setMenuOpen(!menuOpen)}><Icon name={menuOpen ? 'close' : 'menu'}/></button>
      <nav id="navegacion" className={menuOpen ? 'navigation open' : 'navigation'} aria-label="Navegación principal">
        {[['inicio','Inicio'], ['institucion','La Fundación'], ['biblioteca','Biblioteca'], ['contacto','Contacto']].map(([target,label]) => <a key={target} href={href(target)} aria-current={page === target || (target === 'biblioteca' && page === 'documento') ? 'page' : undefined}>{label}</a>)}
        <a className="header-cta" href={href('biblioteca')}>Explorar biblioteca <Icon name="arrow" size={17}/></a>
      </nav>
    </div></header>
    <main id="contenido" tabIndex={-1}>
      {page === 'inicio' ? <Home variant={variant} href={href}/> : page === 'biblioteca' ? <Catalog variant={variant} href={href} query={query}/> : page === 'documento' ? <DocumentDetail id={id} href={href}/> : page === 'institucion' ? <Institution href={href}/> : page === 'contacto' ? <Contact/> : <NotFound href={href}/>}
    </main>
    <footer className="site-footer"><div className="container footer-main"><div><a className="footer-brand" href={href('inicio')}>Fundación <strong>RAMA</strong><span/></a><p>Información institucional y una biblioteca<br/>para explorar documentos.</p></div><div className="footer-links"><a href={href('institucion')}>La Fundación</a><a href={href('biblioteca')}>Biblioteca virtual</a><a href={href('contacto')}>Contacto</a></div><div className="footer-note"><Icon name="book" size={25}/><p>Una propuesta para conversar.<br/><span>Textos y documentos de demostración.</span></p></div></div><div className="container footer-bottom"><span>Fundación RAMA · Propuesta de sitio web</span><span>Diseño y funciones sujetos a validación institucional</span></div></footer>
  </div>;
}
type Href = (target: string, suffix?: string) => string;
function SearchForm({ href, large = false }: { href: Href; large?: boolean }) {
  const [value, setValue] = useState('');
  function submit(event: FormEvent) { event.preventDefault(); navigate(href('biblioteca', value.trim() ? `?q=${encodeURIComponent(value.trim())}` : '')); }
  return <form className={`hero-search ${large ? 'large-search' : ''}`} onSubmit={submit} role="search"><label htmlFor="busqueda-inicio" className="sr-only">Buscar documentos por título, autor o tema</label><Icon name="search" size={24}/><input id="busqueda-inicio" value={value} onChange={e => setValue(e.target.value)} placeholder="¿Qué te gustaría consultar?"/><button type="submit">Buscar <Icon name="arrow" size={19}/></button></form>;
}
function Home({ variant, href }: { variant: Variant; href: Href }) {
  if (variant === 'b') return <>
    <section className="search-hero"><div className="container"><div className="eyebrow"><span/> BIBLIOTECA VIRTUAL RAMA</div><h1>Tu próxima consulta<br/>empieza <em>aquí.</em></h1><p>Explora libros, guías y documentos en un solo lugar.</p><SearchForm href={href} large/><div className="search-hints"><span>Explora por tipo</span>{documentTypes.map(type => <a key={type} href={href('biblioteca',`?tipo=${encodeURIComponent(type)}`)}>{type}<Icon name="arrow" size={14}/></a>)}</div></div><div className="hero-index" aria-hidden="true">R<br/>A<br/>M<br/>A</div></section>
    <section className="library-home container"><div className="section-heading"><div><p className="eyebrow dark">PARA EMPEZAR</p><h2>Una colección, distintas miradas.</h2></div><a href={href('biblioteca')} className="text-link">Ver los {documents.length} documentos <Icon name="arrow"/></a></div><div className="category-tiles">{categories.map((category,i)=><a key={category} href={href('biblioteca',`?categoria=${encodeURIComponent(category)}`)}><span className="category-number">0{i+1}</span><Icon name={i%2 ? 'book' : 'file'} size={26}/><h3>{category}</h3><span>{documents.filter(doc=>doc.category===category).length} documentos de muestra <Icon name="arrow" size={18}/></span></a>)}</div>
    <div className="section-heading latest-heading"><div><p className="eyebrow dark">CATÁLOGO DE DEMOSTRACIÓN</p><h2>Documentos para explorar</h2></div><span className="sample-pill">Selección de muestra</span></div><div className="home-document-list">{documents.slice(0,4).map(doc=><DocumentCard key={doc.id} document={doc} compact href={href(`documento/${doc.id}`)}/>)}</div>
    <div className="institution-strip"><div><span className="eyebrow dark">MÁS ALLÁ DEL CATÁLOGO</span><h2>Conoce el espacio institucional.</h2><p>Una sección para presentar la información que RAMA comparta y valide.</p></div><a className="button secondary" href={href('institucion')}>La Fundación <Icon name="arrow"/></a></div></section>
  </>;
  return <>
    <section className="institutional-hero container"><div className="hero-copy"><p className="eyebrow dark"><span/> FUNDACIÓN RAMA</p><h1>Un lugar para<br/>encontrar <em>nuevas<br/>perspectivas.</em></h1><p className="hero-intro">Información institucional y documentos para acompañar la lectura, la consulta y la investigación.</p><div className="hero-actions"><a className="button primary" href={href('biblioteca')}>Explorar biblioteca <Icon name="arrow"/></a><a className="button plain" href={href('institucion')}>Conocer la propuesta <Icon name="arrow" size={18}/></a></div><div className="hero-footnote"><span className="small-rule"/> Una propuesta de biblioteca virtual para Fundación RAMA.</div></div><LibraryIllustration/></section>
    <div className="collection-band"><div className="container"><span>UN PUNTO DE ENCUENTRO CON LOS DOCUMENTOS</span><div>{['Libros','Jurisprudencia','Investigaciones','Guías de consulta'].map(label=><span key={label}><Icon name="book" size={18}/>{label}</span>)}</div></div></div>
    <section className="featured-section container"><div className="section-heading"><div><p className="eyebrow dark">BIBLIOTECA VIRTUAL</p><h2>Una invitación a explorar.</h2><p>Descubre cómo podrías consultar la colección documental.</p></div><a href={href('biblioteca')} className="text-link">Ver catálogo completo <Icon name="arrow"/></a></div><div className="featured-grid">{documents.slice(0,4).map(doc=><DocumentCard key={doc.id} document={doc} href={href(`documento/${doc.id}`)}/>)}</div></section>
    <section className="reading-section"><div className="container reading-inner"><div className="reading-mark" aria-hidden="true"><Icon name="book" size={92}/><span>RAMA</span></div><div><p className="eyebrow dark">INFORMACIÓN INSTITUCIONAL</p><h2>La Fundación,<br/>en sus propias palabras.</h2><p>Este espacio está pensado para presentar a RAMA, su información y sus actividades. Los textos se elaborarán con una persona designada por la institución y se publicarán después de su validación.</p><a className="text-link" href={href('institucion')}>Conocer esta sección <Icon name="arrow"/></a></div></div></section>
    <section className="container end-cta"><div><p className="eyebrow dark">ENCUENTRA UN PUNTO DE PARTIDA</p><h2>¿Qué te gustaría leer hoy?</h2></div><a className="button primary" href={href('biblioteca')}>Consultar documentos <Icon name="arrow"/></a></section>
  </>;
}
function Catalog({ variant, href, query }: { variant: Variant; href: Href; query: string }) {
  const params = new URLSearchParams(query);
  const search=params.get('q') || '', category=params.get('categoria') || '', type=params.get('tipo') || '', sort=params.get('orden') || 'recientes';
  const [filtersOpen,setFiltersOpen]=useState(false);
  const [view,setView]=useState<'grid'|'list'>(variant==='b'?'list':'grid');
  const [currentPage,setCurrentPage]=useState(1);
  useEffect(()=>{setView(variant==='b'?'list':'grid');},[variant]);
  useEffect(()=>{setCurrentPage(1);},[query]);
  function update(key:string,value:string) {
    const next=new URLSearchParams(query);
    if(value) next.set(key,value); else next.delete(key);
    navigate(href('biblioteca',next.size?`?${next}`:''));
  }
  const filtered=documents.filter(doc=>(!category || doc.category===category) && (!type || doc.type===type) && normalize(`${doc.title} ${doc.author} ${doc.description} ${doc.category}`).includes(normalize(search))).sort((a,b)=>sort==='titulo'?a.title.localeCompare(b.title,'es'):sort==='antiguos'?a.year-b.year:b.year-a.year);
  const pageCount=Math.ceil(filtered.length/6), safePage=Math.min(currentPage,Math.max(pageCount,1));
  const visible=filtered.slice((safePage-1)*6,safePage*6);
  const active=!!(search||category||type);
  return <>
    <section className="catalog-heading"><div className="container"><Breadcrumb href={href} current="Biblioteca"/><p className="eyebrow dark">BIBLIOTECA VIRTUAL</p><h1>Un documento.<br className="mobile-break"/> Un nuevo punto de partida.</h1><p>Explora el catálogo de muestra y encuentra una lectura para tu consulta.</p></div></section>
    <section className="container catalog-layout"><aside className="catalog-sidebar"><button className="mobile-filters" onClick={()=>setFiltersOpen(!filtersOpen)} aria-expanded={filtersOpen} aria-controls="filtros"><Icon name="filter"/> Filtrar documentos <Icon name="chevron"/></button><div id="filtros" className={`filter-panel ${filtersOpen?'expanded':''}`}><div className="filter-heading"><h2>Explorar por</h2>{active&&<a href={href('biblioteca')} className="clear-link">Limpiar</a>}</div><fieldset><legend>Categoría</legend>{[['','Todas las categorías'],...categories.map(c=>[c,c])].map(([value,label])=><label className="filter-radio" key={value}><input type="radio" name="categoria" value={value} checked={category===value} onChange={()=>update('categoria',value)}/><span>{label}</span><small>{value?documents.filter(doc=>doc.category===value).length:documents.length}</small></label>)}</fieldset><fieldset><legend>Tipo de documento</legend><label className="sr-only" htmlFor="tipo">Tipo de documento</label><select id="tipo" value={type} onChange={e=>update('tipo',e.target.value)}><option value="">Todos los tipos</option>{documentTypes.map(t=><option key={t}>{t}</option>)}</select></fieldset><div className="sidebar-note"><Icon name="book" size={25}/><p>Una colección de muestra</p><span>Los documentos permiten explorar el diseño y las funciones propuestas.</span></div></div></aside>
      <div className="catalog-content"><form className="catalog-search" role="search" onSubmit={e=>e.preventDefault()}><Icon name="search" size={23}/><label className="sr-only" htmlFor="buscar-catalogo">Buscar en el catálogo</label><input id="buscar-catalogo" placeholder="Buscar por título, autor o tema…" value={search} onChange={e=>update('q',e.target.value)}/>{search&&<button type="button" aria-label="Borrar búsqueda" onClick={()=>update('q','')}><Icon name="close" size={19}/></button>}</form>
        <div className="catalog-toolbar"><p role="status" aria-live="polite"><strong>{filtered.length}</strong> {filtered.length===1?'documento encontrado':'documentos encontrados'} <span>· de muestra</span></p><div className="catalog-controls"><label className="sr-only" htmlFor="orden">Ordenar documentos</label><select id="orden" value={sort} onChange={e=>update('orden',e.target.value)}><option value="recientes">Más recientes</option><option value="antiguos">Más antiguos</option><option value="titulo">Título A–Z</option></select><div className="view-switch" aria-label="Vista del catálogo"><button aria-label="Vista de tarjetas" aria-pressed={view==='grid'} onClick={()=>setView('grid')}><Icon name="grid" size={18}/></button><button aria-label="Vista de lista" aria-pressed={view==='list'} onClick={()=>setView('list')}><Icon name="list" size={18}/></button></div></div></div>
        {active&&<div className="active-filters">{category&&<button onClick={()=>update('categoria','')}>{category}<Icon name="close" size={13}/></button>}{type&&<button onClick={()=>update('tipo','')}>{type}<Icon name="close" size={13}/></button>}<a href={href('biblioteca')}>Limpiar filtros</a></div>}
        {filtered.length?<><div className={`catalog-results ${view==='list'?'list-results':'grid-results'}`}>{visible.map(doc=><DocumentCard key={doc.id} document={doc} href={href(`documento/${doc.id}`)} compact={view==='list'}/>)}</div><nav className="pagination" aria-label="Páginas del catálogo"><span>Mostrando {(safePage-1)*6+1}–{Math.min(safePage*6,filtered.length)} de {filtered.length}</span><div><button aria-label="Página anterior" disabled={safePage===1} onClick={()=>setCurrentPage(safePage-1)}><span className="reverse"><Icon name="chevron" size={18}/></span></button>{Array.from({length:pageCount},(_,i)=><button key={i} aria-label={`Página ${i+1}`} aria-current={safePage===i+1?'page':undefined} onClick={()=>setCurrentPage(i+1)}>{i+1}</button>)}<button aria-label="Página siguiente" disabled={safePage===pageCount} onClick={()=>setCurrentPage(safePage+1)}><Icon name="chevron" size={18}/></button></div></nav></>:<div className="empty-state"><Icon name="search" size={40}/><h2>No encontramos documentos</h2><p>Prueba otra palabra o elimina algún filtro para explorar la colección de muestra.</p><a className="button secondary" href={href('biblioteca')}>Limpiar búsqueda y filtros <Icon name="arrow"/></a></div>}
      </div>
    </section>
  </>;
}
function Breadcrumb({href,current}:{href:Href;current:string}) {return <nav className="breadcrumb" aria-label="Ruta de navegación"><a href={href('inicio')}>Inicio</a><Icon name="chevron" size={12}/>{current!=='Biblioteca'&&<><a href={href('biblioteca')}>Biblioteca</a><Icon name="chevron" size={12}/></>}<span aria-current="page">{current}</span></nav>;}
function DocumentDetail({id,href}:{id?:string;href:Href}) {
  const doc=documents.find(d=>d.id===id);
  if(!doc) return <NotFound href={href}/>;
  return <div className="container detail-page"><Breadcrumb href={href} current="Ficha del documento"/><a className="back-link" href={href('biblioteca')}><span className="reverse"><Icon name="arrow" size={17}/></span> Volver al catálogo</a><div className="detail-layout"><div className="detail-cover"><BookCover document={doc}/><p>Portada de demostración</p></div><article className="detail-info"><div className="document-meta"><span className="type-label">{doc.type}</span><span className="sample-pill">Contenido de muestra</span></div><h1>{doc.title}</h1><p className="detail-description">{doc.description}</p><dl className="detail-data"><div><dt>Autor o entidad de ejemplo</dt><dd>{doc.author}</dd></div><div><dt>Categoría</dt><dd>{doc.category}</dd></div><div><dt>Año de referencia</dt><dd>{doc.year}</dd></div><div><dt>Archivo disponible</dt><dd>PDF de demostración · {doc.pages} páginas · {doc.sizeLabel}</dd></div></dl><div className="detail-actions"><a href={doc.pdfUrl} target="_blank" rel="noopener" className="button primary">Abrir PDF de muestra <Icon name="external" size={19}/><span className="sr-only"> (en una pestaña nueva)</span></a><a href={doc.pdfUrl} download="RAMA-documento-demostracion.pdf" className="button secondary">Descargar <Icon name="download" size={19}/></a></div><p className="file-explanation"><Icon name="file" size={18}/><span>Las fichas de este prototipo abren el mismo PDF local de demostración. No contiene un libro ni una resolución judicial real.</span></p></article></div><section className="related-section"><div className="section-heading"><div><p className="eyebrow dark">CONTINÚA EXPLORANDO</p><h2>Más documentos de muestra</h2></div><a className="text-link" href={href('biblioteca')}>Ir a la biblioteca <Icon name="arrow"/></a></div><div className="featured-grid related-grid">{documents.filter(d=>d.id!==id).slice(0,3).map(d=><DocumentCard key={d.id} document={d} href={href(`documento/${d.id}`)}/>)}</div></section></div>;
}
function Institution({href}:{href:Href}) {return <><section className="information-hero container"><p className="eyebrow dark">LA FUNDACIÓN</p><h1>Una identidad que se cuenta<br/>con información <em>propia.</em></h1><p>Propuesta de sección institucional para Fundación RAMA.</p></section><section className="container institution-content"><div className="institution-lead"><Icon name="book" size={38}/><h2>Un espacio para<br/>presentar a RAMA.</h2></div><div><p>La web puede reunir la presentación de la Fundación, sus líneas de trabajo y la información que desee compartir. Esta propuesta de navegación permite conversar sobre qué contenidos son necesarios y cómo organizarlos.</p><p>La reseña, los objetivos, las actividades y los datos de contacto serán proporcionados y validados por una persona designada por RAMA. Este prototipo no atribuye a la Fundación una misión, trayectoria ni cifras de actividad.</p><p className="inline-note">Contenido institucional pendiente de validación.</p><a className="text-link" href={href('contacto')}>Ver la propuesta de contacto <Icon name="arrow"/></a></div></section><section className="institution-library"><div className="container"><div><p className="eyebrow">BIBLIOTECA VIRTUAL</p><h2>Los documentos también<br/>forman parte de la experiencia.</h2><p>Explora una colección ficticia que muestra cómo podría funcionar la consulta de PDF.</p></div><a className="button light" href={href('biblioteca')}>Explorar catálogo <Icon name="arrow"/></a></div></section></>;}
function Contact() {
  const [sent,setSent]=useState(false);
  return <><section className="information-hero container"><p className="eyebrow dark">CONTACTO</p><h1>Un canal para<br/>estar más <em>cerca.</em></h1><p>Propuesta de contacto institucional para Fundación RAMA.</p></section><section className="container contact-layout"><div className="contact-copy"><h2>Conversemos sobre<br/>lo que necesitas.</h2><p>Este formulario permite explorar la experiencia de contacto. Los canales reales se incorporarán cuando la Fundación confirme sus datos.</p><dl className="contact-details"><div><dt>Correo institucional</dt><dd>Pendiente de confirmar</dd></div><div><dt>Teléfono y dirección</dt><dd>Pendientes de confirmar</dd></div></dl><p className="inline-note">Formulario demostrativo. No envía mensajes ni guarda datos.</p></div><form className="contact-form" onSubmit={event=>{event.preventDefault();setSent(true);}} onChange={()=>setSent(false)}><label htmlFor="nombre">Nombre<input id="nombre" name="nombre" autoComplete="name" placeholder="Tu nombre" required maxLength={100}/></label><label htmlFor="correo">Correo electrónico<input id="correo" name="correo" type="email" autoComplete="email" placeholder="Tu correo electrónico" required maxLength={150}/></label><label htmlFor="mensaje">Mensaje<textarea id="mensaje" name="mensaje" rows={4} placeholder="¿Sobre qué te gustaría consultar?" required maxLength={1500}/></label><button className="button primary" type="submit">Probar formulario <Icon name="arrow"/></button>{sent&&<p className="form-success" role="status"><Icon name="check"/> Demostración completada. No se ha enviado ni guardado ningún mensaje.</p>}</form></section></>;
}
function NotFound({href}:{href:Href}) {return <section className="container empty-state not-found"><p className="eyebrow dark">PÁGINA NO DISPONIBLE</p><h1>Volvamos a la biblioteca.</h1><p>La página o el documento que buscas no está en este prototipo.</p><a className="button primary" href={href('biblioteca')}>Ir al catálogo <Icon name="arrow"/></a></section>;}
