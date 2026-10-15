import { useRef, useState, type FormEvent, type PointerEvent } from 'react';
import { BookCover, DocumentCard, Icon } from './components';
import { categories, documents, documentTypes } from './data/documents';

type Href = (target: string, suffix?: string) => string;
const asset = (name: string) => `${import.meta.env.BASE_URL}assets/${name}`;

function SearchForm({ href, navigate }: { href: Href; navigate: (hash: string) => void }) {
  const [value, setValue] = useState('');
  function submit(event: FormEvent) {
    event.preventDefault();
    navigate(href('biblioteca', value.trim() ? `?q=${encodeURIComponent(value.trim())}` : ''));
  }
  return <form className="hero-search large-search" onSubmit={submit} role="search">
    <label htmlFor="busqueda-inicio" className="sr-only">Buscar documentos por título, autor o tema</label>
    <Icon name="search" size={24}/>
    <input id="busqueda-inicio" value={value} onChange={event => setValue(event.target.value)} placeholder="Título, autor o tema que te interesa"/>
    <button type="submit">Buscar <Icon name="arrow" size={20}/></button>
  </form>;
}

function BookExhibit({ href }: { href: Href }) {
  const exhibit = useRef<HTMLDivElement>(null);
  function move(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== 'mouse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const box = event.currentTarget.getBoundingClientRect();
    exhibit.current?.style.setProperty('--turn', `${((event.clientX - box.left) / box.width - 0.5) * 9}deg`);
  }
  return <div className="collection-exhibit" ref={exhibit} onPointerMove={move} onPointerLeave={() => exhibit.current?.style.setProperty('--turn', '0deg')}>
    <div className="exhibit-top"><Icon name="book" size={23}/><span>COLECCIÓN DE MUESTRA</span><span>RAMA</span></div>
    <div className="exhibit-books" aria-hidden="true">
      {[documents[2], documents[1], documents[0]].map((doc, index) => <div className={`exhibit-book exhibit-book-${index}`} key={doc.id}><BookCover document={doc}/></div>)}
    </div>
    <div className="exhibit-bottom"><span>Una lectura puede ser<br/>un nuevo punto de partida.</span><a href={href('biblioteca')} aria-label="Explorar el catálogo de muestra"><Icon name="arrow" size={24}/></a></div>
  </div>;
}

function Categories({ href, variant }: { href: Href; variant: 'a' | 'b' }) {
  return <section className={`container category-section categories-${variant}`} data-reveal>
    <div className="section-heading">
      <div><p className="eyebrow dark">EXPLORA POR TEMA</p><h2>Distintas miradas.<br/><em>Un mismo lugar.</em></h2></div>
      <p className="section-intro">Encuentra un punto de partida entre las categorías propuestas para esta biblioteca.</p>
    </div>
    <div className="category-tiles">
      {categories.map((category, index) => <a key={category} href={href('biblioteca', `?categoria=${encodeURIComponent(category)}`)} data-reveal>
        <div className="category-tile-top"><span className="category-number">0{index + 1}</span><Icon name={index % 2 ? 'book' : 'file'} size={30}/></div>
        <h3>{category}</h3>
        <span className="category-tile-bottom">{documents.filter(doc => doc.category === category).length} documentos de muestra <Icon name="arrow" size={20}/></span>
      </a>)}
    </div>
  </section>;
}

function LibraryStory({ href }: { href: Href }) {
  return <section className="library-story" data-reveal>
    <div className="container story-layout">
      <div className="story-photographs">
        <div className="story-photo-main"><img src={asset('rama-lectura.webp')} alt="Imagen de referencia de una lectora en una biblioteca" loading="lazy" width="626" height="939"/></div>
        <div className="story-photo-small"><img src={asset('rama-consulta.webp')} alt="Imagen de referencia de una consulta compartida de documentos" loading="lazy" width="626" height="417"/></div>
        <div className="story-photo-label"><Icon name="book" size={27}/><span>Un espacio para<br/><strong>leer y consultar.</strong></span></div>
      </div>
      <div className="story-copy">
        <p className="eyebrow dark">BIBLIOTECA VIRTUAL RAMA</p>
        <h2>El siguiente paso<br/>empieza con<br/><em>una lectura.</em></h2>
        <p>Una propuesta para reunir libros, jurisprudencia y documentos, y facilitar su consulta desde un solo lugar.</p>
        <div className="reading-steps">
          <div><span>01</span><p><strong>Encuentra un tema</strong>Explora las categorías y los tipos de documento.</p></div>
          <div><span>02</span><p><strong>Conoce el documento</strong>Revisa su descripción y sus datos de referencia.</p></div>
          <div><span>03</span><p><strong>Abre una nueva lectura</strong>Consulta o descarga el PDF de demostración.</p></div>
        </div>
        <a className="text-link" href={href('biblioteca')}>Entrar a la biblioteca <Icon name="arrow"/></a>
      </div>
    </div>
  </section>;
}

function Featured({ href, compact = false }: { href: Href; compact?: boolean }) {
  return <section className={`container featured-section ${compact ? 'featured-library' : ''}`} data-reveal>
    <div className="section-heading">
      <div><p className="eyebrow dark">UNA SELECCIÓN PARA EMPEZAR</p><h2>Documentos que invitan<br/>a <em>seguir explorando.</em></h2></div>
      <a href={href('biblioteca')} className="text-link">Ver los {documents.length} documentos <Icon name="arrow"/></a>
    </div>
    <div className={compact ? 'home-document-list' : 'featured-grid'}>{documents.slice(0, 4).map(doc => <DocumentCard key={doc.id} document={doc} href={href(`documento/${doc.id}`)} compact={compact}/>)}</div>
  </section>;
}

export function Home({ variant, href, navigate }: { variant: 'a' | 'b'; href: Href; navigate: (hash: string) => void }) {
  if (variant === 'b') return <>
    <section className="search-hero">
      <div className="container search-hero-inner">
        <div className="search-hero-copy">
          <p className="eyebrow"><span/> BIBLIOTECA VIRTUAL RAMA</p>
          <h1>Tu próxima<br/>consulta empieza<br/><em>aquí.</em></h1>
          <p>Libros, jurisprudencia y nuevas perspectivas.<br/>Encuentra la lectura para tu próxima pregunta.</p>
          <SearchForm href={href} navigate={navigate}/>
          <div className="search-hints"><span>Explora por tipo</span>{documentTypes.map(type => <a key={type} href={href('biblioteca', `?tipo=${encodeURIComponent(type)}`)}>{type}<Icon name="arrow" size={14}/></a>)}</div>
        </div>
        <BookExhibit href={href}/>
      </div>
      <div className="container search-hero-bottom"><span>LECTURA · CONSULTA · INVESTIGACIÓN</span><span>Documentos y contenidos de demostración <Icon name="book" size={17}/></span></div>
    </section>
    <Categories href={href} variant={variant}/>
    <Featured href={href} compact/>
    <LibraryStory href={href}/>
    <section className="container institution-strip" data-reveal><div><span className="eyebrow dark">MÁS ALLÁ DEL CATÁLOGO</span><h2>La Fundación también<br/>tiene un espacio aquí.</h2><p>Información institucional organizada y validada por RAMA.</p></div><a className="button secondary" href={href('institucion')}>Conocer esta sección <Icon name="arrow"/></a></section>
  </>;

  return <>
    <section className="hero-institutional">
      <img className="hero-photograph" src={asset('rama-encuentro.webp')} alt="" width="1620" height="1080" fetchPriority="high"/>
      <div className="hero-shade"/>
      <div className="container institutional-content">
        <div className="institutional-copy">
          <p className="eyebrow"><span/> FUNDACIÓN RAMA</p>
          <h1>Un lugar para<br/>encontrar <em>nuevas<br/>perspectivas.</em></h1>
          <p className="hero-intro">Información institucional y una biblioteca virtual para acompañar la lectura, la consulta y la investigación.</p>
          <div className="hero-actions"><a className="button primary" href={href('biblioteca')}>Explorar biblioteca <Icon name="arrow"/></a><a className="button plain" href={href('institucion')}>La Fundación <Icon name="arrow" size={18}/></a></div>
        </div>
        <a className="hero-library-note" href={href('biblioteca')}><span className="hero-note-icon"><Icon name="book" size={30}/></span><span><small>UN ESPACIO POR DESCUBRIR</small><strong>Biblioteca<br/>{' '}virtual RAMA</strong><span>Leer. Consultar. Explorar.</span></span><Icon name="arrow" size={25}/></a>
      </div>
      <div className="container institutional-bottom"><span>UNA PROPUESTA DE WEB PARA FUNDACIÓN RAMA</span><a href={href('biblioteca')}>Descubrir la colección <Icon name="arrow" size={18}/></a></div>
    </section>
    <div className="collection-band"><div className="container"><span>ENCUENTRA TU PRÓXIMA LECTURA</span><div>{documentTypes.map(type => <a key={type} href={href('biblioteca', `?tipo=${encodeURIComponent(type)}`)}><Icon name="book" size={20}/>{type}<Icon name="arrow" size={15}/></a>)}</div></div></div>
    <section className="container institutional-intro" data-reveal><p className="eyebrow dark">UN ESPACIO QUE CONECTA</p><div><h2>Información para conocer.<br/><em>Documentos para explorar.</em></h2><p>Una propuesta que reúne la presentación de la Fundación y el acceso a una biblioteca de PDF. Dos formas de acercarse a RAMA desde una experiencia clara y accesible.</p></div></section>
    <LibraryStory href={href}/>
    <Featured href={href}/>
    <Categories href={href} variant={variant}/>
    <section className="institution-feature" data-reveal><div className="container institution-feature-inner"><div><p className="eyebrow">INFORMACIÓN INSTITUCIONAL</p><h2>La Fundación,<br/>en sus propias palabras.</h2><p>Un espacio para compartir la presentación y la información que RAMA proporcione y valide.</p><a className="button light" href={href('institucion')}>Conocer esta sección <Icon name="arrow"/></a></div><span className="institution-feature-mark" aria-hidden="true">RAMA<span>LECTURA Y NUEVAS PERSPECTIVAS</span></span></div></section>
    <section className="container end-cta" data-reveal><div><p className="eyebrow dark">SIGUE EXPLORANDO</p><h2>Una pregunta.<br/><em>Muchas lecturas posibles.</em></h2></div><a className="button primary" href={href('biblioteca')}>Consultar documentos <Icon name="arrow"/></a></section>
  </>;
}
