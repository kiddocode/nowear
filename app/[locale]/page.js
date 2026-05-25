'use client'
import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'

const ICONOS = [
  // particular
  <svg key={0} width="32" height="32" viewBox="0 0 32 32" fill="none"><path d="M16 4C13.8 4 12 5.8 12 8s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4zM8 28c0-4.4 3.6-8 8-8s8 3.6 8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M6 14c0-1.1.9-2 2-2s2 .9 2 2-2 4-2 4-2-2.9-2-4zM26 14c0-1.1-.9-2-2-2s-2 .9-2 2 2 4 2 4 2-2.9 2-4z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  // galas
  <svg key={1} width="32" height="32" viewBox="0 0 32 32" fill="none"><path d="M16 4l2.5 7.5H26l-6.5 4.5 2.5 7.5L16 19l-6 4.5 2.5-7.5L6 11.5h7.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M10 28h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M16 23v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  // protocolo
  <svg key={2} width="32" height="32" viewBox="0 0 32 32" fill="none"><path d="M4 28V14l12-10 12 10v14" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><rect x="12" y="18" width="8" height="10" rx="1" stroke="currentColor" strokeWidth="1.5"/><path d="M16 8v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  // marcas
  <svg key={3} width="32" height="32" viewBox="0 0 32 32" fill="none"><path d="M11 6l-3 6h16l-3-6" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><rect x="6" y="12" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M13 12v3a3 3 0 006 0v-3" stroke="currentColor" strokeWidth="1.5"/></svg>,
  // productoras
  <svg key={4} width="32" height="32" viewBox="0 0 32 32" fill="none"><rect x="4" y="8" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M22 13l6-3v12l-6-3" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M9 14h8M9 18h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  // hoteles
  <svg key={5} width="32" height="32" viewBox="0 0 32 32" fill="none"><path d="M4 28V10l12-6 12 6v18" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M12 28v-8h8v8" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M16 4v4M8 14h2M22 14h2M8 20h2M22 20h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  // agencias
  <svg key={6} width="32" height="32" viewBox="0 0 32 32" fill="none"><rect x="4" y="8" width="24" height="18" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M4 13h24M11 6v4M21 6v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M9 18h4M19 18h4M9 22h4M19 22h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  // tiendas
  <svg key={7} width="32" height="32" viewBox="0 0 32 32" fill="none"><path d="M6 8h20l-2 14H8L6 8z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M4 8H2M30 8h-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M12 8V6a4 4 0 018 0v2" stroke="currentColor" strokeWidth="1.5"/><path d="M11 16h10M11 20h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  // personal shoppers
  <svg key={8} width="32" height="32" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="10" r="4" stroke="currentColor" strokeWidth="1.5"/><path d="M8 28c0-4.4 3.6-8 8-8s8 3.6 8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M24 14l2 2-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  // restaurantes
  <svg key={9} width="32" height="32" viewBox="0 0 32 32" fill="none"><path d="M10 4v10c0 2.2 1.8 4 4 4h0c2.2 0 4-1.8 4-4V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M14 18v10M18 28H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M22 4v24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M22 4c0 0 4 2 4 7s-4 7-4 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  // corporativos
  <svg key={10} width="32" height="32" viewBox="0 0 32 32" fill="none"><rect x="4" y="14" width="10" height="14" rx="1" stroke="currentColor" strokeWidth="1.5"/><rect x="18" y="8" width="10" height="20" rx="1" stroke="currentColor" strokeWidth="1.5"/><path d="M4 10V6h10v8" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M8 18h2M8 22h2M22 12h2M22 16h2M22 20h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
]

const TIPOS = ['particular','enterprise','enterprise','enterprise','enterprise','enterprise','enterprise','enterprise','enterprise','enterprise','enterprise']
const PLAN_KEYS = ['basico','estandar','premium']

export default function Home() {
  const t = useTranslations()
  const [texto, setTexto] = useState('')
  const [fase, setFase] = useState(0)
  const [tabComo, setTabComo] = useState('particulares')
  const titulo = t('hero.titulo')

  useEffect(() => {
    if (fase === 0) {
      if (texto.length < titulo.length) {
        const timeout = setTimeout(() => {
          setTexto(titulo.slice(0, texto.length + 1))
        }, 45)
        return () => clearTimeout(timeout)
      } else {
        setTimeout(() => setFase(1), 300)
      }
    }
  }, [texto, fase, titulo])

  const handlePago = async (plan) => {
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({plan, eventoData: {}})
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } catch(e) {
      alert('Error al procesar el pago. Inténtalo de nuevo.')
    }
  }

  const SUPABASE = 'https://qhuatexjyxbunotvghjh.supabase.co/storage/v1/object/public/fotos/'

  const marcas = [
    {name:'Adolfo Domínguez', url:'https://www.adolfodominguez.com', logo:'logo-adolfo.png', zoom:2.5},
    {name:'ASOS', url:'https://www.asos.com/es', logo:'logo-asos.png', zoom:1.8},
    {name:'Agua by Agua Bendita', url:'https://www.aguabendita.com', logo:'logo-aguabendita.png', zoom:1.2},
    {name:'AVECSTUDIO', url:'https://avec-studio.com', logo:'logo-avec.png'},
    {name:'Basyco Jerez', url:'https://basycojerez.com', logo:'logo-basyco.png'},
    {name:'Baymo', url:'https://www.baymo.com/es', logo:'logo-baymo.png'},
    {name:'Bicolo', url:'https://bicolobrand.com/en', logo:'logo-bicolo.png', zoom:2.5},
    {name:'Bimani', url:'https://www.bimani.es', logo:'logo-bimani.png'},
    {name:'Blanche Vintage', url:'https://www.instagram.com/blanche__vintage/', logo:'logo-blanche.png', zoom:2},
    {name:'Cardié Moda', url:'https://cardiemoda.com', logo:'logo-cardie.png', zoom:2.5},
    {name:'Caye & Co', url:'https://www.instagram.com/caye.andco/', logo:'logo-caye.png', zoom:2.5},
    {name:'Dafonte', url:'https://dafontecollection.com/en', logo:'logo-dafonte.png', zoom:2.5},
    {name:'Dahlia Dahlia', url:'https://www.dahliadahlia.com', logo:'logo-dahlia.png', zoom:2.5},
    {name:'Dew & Corch', url:'https://www.dewandcorch.com', logo:'logo-dew.png', zoom:2.5},
    {name:'El Corte Inglés', url:'https://www.elcorteingles.es/moda-mujer', logo:'logo-eci.png'},
    {name:'Galü', url:'https://galuathelier.es/en', logo:'logo-galu.png'},
    {name:'Inés Martín Alcalde', url:'https://www.inesmartinalcalde.com', logo:'logo-ines.png', zoom:2.5},
    {name:'Johanna Ortiz', url:'https://www.johannaortiz.com', logo:'logo-johannaortiz.png'},
    {name:'Lozanía', url:'https://lozaniabrand.com', logo:'logo-lozania.png', zoom:2.5},
    {name:'Maje', url:'https://www.maje.com/es', logo:'logo-maje.png'},
    {name:'Mango', url:'https://www.mango.com/es', logo:'logo-mango.png'},
    {name:'Martina Maletti', url:'https://martinamaletti.com/en', logo:'logo-martinamaletti.png', zoom:2.5},
    {name:'Massimo Dutti', url:'https://www.massimodutti.com/es', logo:'logo-massimo.png'},
    {name:'Miphai', url:'https://www.miphai.com', logo:'logo-miphai.png'},
    {name:'Nicolett', url:'https://www.nicolettaoficial.com', logo:'logo-nicolett.png', zoom:2.5},
    {name:'Philipa 1970', url:'https://www.philippa1970.com', logo:'logo-philipa.png'},
    {name:'Rental Mode', url:'https://www.rentalmode.com', logo:'logo-rentalmode.png', zoom:2.5},
    {name:'Sandra Rosa', url:'https://www.sandrarosa.es', logo:'logo-sandrarosa.png', zoom:2.5},
    {name:'Santa Bato', url:'https://santabato.com', logo:'logo-santabato.png', zoom:2},
    {name:'Sandro', url:'https://www.sandro-paris.com/es', logo:'logo-sandro.png'},
    {name:'Stradivarius', url:'https://www.stradivarius.com/es', logo:'logo-stradivarius.png'},
    {name:'t.ba', url:'https://www.tbalife.com/en-es', logo:'logo-tba.png', zoom:2.5},
    {name:'The IQ Collection', url:'https://theiqcollection.com', logo:'logo-iq.png'},
    {name:'Vogana', url:'https://www.vogana.es', logo:'logo-vogana.png'},
    {name:'Zara', url:'https://www.zara.com/es', logo:'logo-zara.png', zoom:2.5},
  ]

  const casosData = t.raw('casos.casos')
  const planesData = t.raw('precios.planes')
  const faqData = t.raw('faq.preguntas')
  const planKeys = ['basico','estandar','premium',null]

  return (
    <>
      {/* HERO */}
      <section className="hero-grid" style={{display:'grid',gridTemplateColumns:'1fr 1fr',minHeight:'calc(100vh - 68px)'}}>
        <div className="hero-left" style={{display:'flex',flexDirection:'column',justifyContent:'center',padding:'6rem 5rem 6rem 3rem'}}>
          <span style={{display:'inline-flex',alignItems:'center',gap:'0.6rem',fontSize:'0.62rem',fontWeight:500,letterSpacing:'0.16em',textTransform:'uppercase',color:'#F07987',marginBottom:'2.5rem'}}>
            <span style={{width:'24px',height:'1px',background:'#F07987',display:'inline-block'}}></span>
            {t('hero.badge')}
          </span>
          <h1 style={{fontSize:'clamp(3rem,4.8vw,5.5rem)',fontWeight:100,lineHeight:1.06,letterSpacing:'-0.03em',marginBottom:'2rem',whiteSpace:'pre-line'}}>
            {texto.split('\n').map((line,i) => (
              <span key={i} style={{display:'block'}}>
                {i===1 ? <strong style={{fontWeight:700}}>{line}</strong> : line}
              </span>
            ))}
            {fase===0 && <span style={{borderRight:'2px solid #0A0A0A',marginLeft:'2px',animation:'blink 0.7s infinite'}}></span>}
          </h1>
          <p style={{fontSize:'0.95rem',fontWeight:300,lineHeight:2,color:'#888884',maxWidth:'420px',marginBottom:'3rem',opacity:fase>=1?1:0,transition:'opacity 0.6s ease'}}>
            {t('hero.subtitulo')}
          </p>
          <div style={{display:'flex',gap:'1rem',flexWrap:'wrap',opacity:fase>=1?1:0,transition:'opacity 0.6s ease 0.3s'}}>
            <a href="/register" style={{fontSize:'0.85rem',fontWeight:500,padding:'1rem 2.5rem',background:'#0A0A0A',color:'#FFFFFF',textDecoration:'none',borderRadius:'4px'}}>{t('hero.cta')}</a>
          </div>
        </div>
        <div className="hero-img-col" style={{position:'relative',overflow:'hidden'}}>
          <video src={`${SUPABASE}video-inicio.mp4`} autoPlay muted loop playsInline style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:'center top',display:'block'}}/>
          <div style={{position:'absolute',inset:0,background:'linear-gradient(to top, rgba(10,10,10,0.4) 0%, rgba(10,10,10,0.0) 50%)',display:'flex',flexDirection:'column',justifyContent:'flex-end',padding:'3rem'}}>
            <p style={{fontSize:'1.3rem',fontWeight:700,color:'#FFFFFF',lineHeight:1.4,margin:0,textShadow:'0 2px 12px rgba(0,0,0,0.3)'}}>
              {t('hero.tagline')}<br/>
              <em style={{fontStyle:'italic',color:'#F07987',fontWeight:700}}>{t('hero.taglineEmphasis')}</em>
            </p>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        .marca-card:hover { background: #F7F7F5 !important; }
        .caso-card:hover { background: rgba(255,255,255,0.12) !important; transform: translateY(-4px); }
        .caso-card { transition: background 0.2s, transform 0.2s; }
        .tab-como { transition: color 0.15s, border-color 0.15s; cursor: pointer; }
        .casos-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 1.5rem; }
        .casos-grid > :nth-child(7) { grid-column: 2; }
        .casos-grid > :nth-child(8) { grid-column: 3; }
        .casos-grid > :nth-child(9) { grid-column: 4; }
        .casos-grid > :nth-child(10) { grid-column: 5; }
        .casos-grid > :nth-child(11) { grid-column: 6; }
      `}</style>

      {/* CÓMO FUNCIONA */}
      <section id="como" className="section-pad" style={{padding:'7rem 3rem'}}>
        <span style={{display:'flex',alignItems:'center',gap:'0.6rem',fontSize:'0.6rem',fontWeight:600,letterSpacing:'0.18em',textTransform:'uppercase',color:'#F07987',marginBottom:'1.75rem'}}>
          <span style={{width:'24px',height:'1px',background:'#F07987'}}></span>{t('como.badge')}
        </span>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',flexWrap:'wrap',gap:'2rem',marginBottom:'3rem'}}>
          <h2 style={{fontSize:'clamp(2.5rem,4vw,4.5rem)',fontWeight:100,lineHeight:1.08,letterSpacing:'-0.025em'}}>
            {t('como.titulo')}<br/><strong style={{fontWeight:700}}>{t('como.tituloEmphasis')}</strong>
          </h2>
          <div style={{display:'flex',gap:'0',border:'1px solid #E0E0DC',borderRadius:'8px',overflow:'hidden',flexShrink:0}}>
            {[
              {key:'particulares', label:t('como.tabParticulares')},
              {key:'empresas', label:t('como.tabEmpresas')},
            ].map(tab => (
              <button key={tab.key} onClick={() => setTabComo(tab.key)}
                className="tab-como"
                style={{padding:'0.75rem 1.5rem',fontSize:'0.75rem',fontWeight:tabComo===tab.key?700:400,color:tabComo===tab.key?'#FFFFFF':'#888884',background:tabComo===tab.key?'#0A0A0A':'#FFFFFF',border:'none',fontFamily:'Poppins,sans-serif',letterSpacing:'0.01em'}}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {tabComo === 'particulares' && (
          <div className="steps-grid" style={{display:'grid',gridTemplateColumns:'1fr 1fr',border:'1px solid #E0E0DC'}}>
            <div className="steps-img-col" style={{position:'relative',overflow:'hidden',minHeight:'480px'}}>
              <video src={`${SUPABASE}video-particular.mp4`} autoPlay muted loop playsInline style={{width:'100%',height:'100%',objectFit:'cover',position:'absolute',inset:0}}/>
              <div style={{position:'absolute',inset:0,background:'linear-gradient(135deg,rgba(10,10,10,0.55) 0%,rgba(10,10,10,0.15) 100%)',display:'flex',alignItems:'flex-end',padding:'2.5rem'}}>
                <p style={{fontSize:'1.4rem',fontWeight:700,color:'#FFFFFF',lineHeight:1.45}}>
                  {t('como.particulares.tagline').split('\n').map((line,i,arr) => (
                    <span key={i} style={{display:'block'}}>
                      {i===arr.length-1 ? <em style={{color:'#F07987',fontStyle:'normal'}}>{line}</em> : line}
                    </span>
                  ))}
                </p>
              </div>
            </div>
            <div style={{borderLeft:'1px solid #E0E0DC'}}>
              {[
                {n:'01',title:t('como.particulares.paso1titulo'),body:t('como.particulares.paso1body')},
                {n:'02',title:t('como.particulares.paso2titulo'),body:t('como.particulares.paso2body')},
                {n:'03',title:t('como.particulares.paso3titulo'),body:t('como.particulares.paso3body')},
              ].map((s,i)=>(
                <div key={i} style={{padding:'2.5rem',display:'flex',gap:'2rem',borderBottom:i<2?'1px solid #E0E0DC':'none'}}>
                  <div style={{fontSize:'3rem',fontWeight:700,color:'#E0E0DC',lineHeight:1,flexShrink:0,minWidth:'60px',fontFamily:"'Poppins',sans-serif"}}>{s.n}</div>
                  <div>
                    <div style={{fontSize:'1.25rem',fontWeight:700,marginBottom:'0.65rem',letterSpacing:'-0.01em'}}>{s.title}</div>
                    <div style={{fontSize:'0.92rem',fontWeight:300,color:'#888884',lineHeight:1.85}}>{s.body}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tabComo === 'empresas' && (
          <div className="steps-grid" style={{display:'grid',gridTemplateColumns:'1fr 1fr',border:'1px solid #E0E0DC'}}>
            <div className="steps-img-col" style={{position:'relative',overflow:'hidden',minHeight:'480px'}}>
              <video src={`${SUPABASE}video-empresa.mp4`} autoPlay muted loop playsInline style={{width:'100%',height:'100%',objectFit:'cover',position:'absolute',inset:0}}/>
              <div style={{position:'absolute',inset:0,background:'linear-gradient(135deg,rgba(10,10,10,0.65) 0%,rgba(10,10,10,0.2) 100%)',display:'flex',alignItems:'flex-end',padding:'2.5rem'}}>
                <p style={{fontSize:'1.4rem',fontWeight:700,color:'#FFFFFF',lineHeight:1.45}}>
                  {t('como.empresas.tagline')}<br/>
                  <em style={{color:'#C4917C',fontStyle:'normal'}}>{t('como.empresas.taglineEmphasis')}</em>
                </p>
              </div>
            </div>
            <div style={{borderLeft:'1px solid #E0E0DC'}}>
              {[
                {n:'01',title:t('como.empresas.sol1titulo'),body:t('como.empresas.sol1body')},
                {n:'02',title:t('como.empresas.sol2titulo'),body:t('como.empresas.sol2body')},
                {n:'03',title:t('como.empresas.sol3titulo'),body:t('como.empresas.sol3body')},
                {n:'04',title:t('como.empresas.sol4titulo'),body:t('como.empresas.sol4body')},
              ].map((s,i)=>(
                <div key={i} style={{padding:'2rem 2.5rem',display:'flex',gap:'2rem',borderBottom:i<3?'1px solid #E0E0DC':'none'}}>
                  <div style={{fontSize:'2.5rem',fontWeight:700,color:'#E0E0DC',lineHeight:1,flexShrink:0,minWidth:'60px',fontFamily:"'Poppins',sans-serif"}}>{s.n}</div>
                  <div>
                    <div style={{fontSize:'1.1rem',fontWeight:700,marginBottom:'0.5rem',letterSpacing:'-0.01em'}}>{s.title}</div>
                    <div style={{fontSize:'0.88rem',fontWeight:300,color:'#888884',lineHeight:1.85}}>{s.body}</div>
                  </div>
                </div>
              ))}
              <div style={{padding:'1.5rem 2.5rem'}}>
                <a href="/#contacto" style={{display:'inline-flex',alignItems:'center',gap:'0.5rem',fontSize:'0.82rem',fontWeight:600,color:'#FFFFFF',background:'#C4917C',padding:'0.85rem 2rem',textDecoration:'none',borderRadius:'4px'}}>
                  {t('como.empresas.cta')}
                </a>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* CASOS DE USO */}
      <section id="casos" className="section-pad" style={{padding:'7rem 3rem',position:'relative',overflow:'hidden',background:'#0A0A0A'}}>
        <div style={{position:'absolute',inset:0,zIndex:0}}>
          <video src={`${SUPABASE}video-casos.mp4`} autoPlay muted loop playsInline style={{width:'100%',height:'100%',objectFit:'cover',opacity:0.25}}/>
          <div style={{position:'absolute',inset:0,background:'linear-gradient(to bottom, rgba(10,10,10,0.6) 0%, rgba(10,10,10,0.85) 100%)'}}></div>
        </div>
        <div style={{position:'relative',zIndex:1}}>
          <span style={{display:'flex',alignItems:'center',gap:'0.6rem',fontSize:'0.6rem',fontWeight:600,letterSpacing:'0.18em',textTransform:'uppercase',color:'#C4917C',marginBottom:'1.75rem'}}>
            <span style={{width:'24px',height:'1px',background:'#C4917C'}}></span>{t('casos.badge')}
          </span>
          <h2 style={{fontSize:'clamp(2.5rem,4vw,4.5rem)',fontWeight:100,lineHeight:1.08,letterSpacing:'-0.025em',marginBottom:'1.25rem',color:'#FFFFFF'}}>
            {t('casos.titulo')}<br/><strong style={{fontWeight:700}}>{t('casos.tituloEmphasis')}</strong>
          </h2>
          <p style={{fontSize:'0.9rem',fontWeight:300,lineHeight:1.9,color:'rgba(255,255,255,0.6)',maxWidth:'540px',marginBottom:'4rem'}}>
            {t('casos.subtitulo')}
          </p>
          <div className="casos-grid" style={{gap:'1.5rem'}}>
            {casosData.map((caso, i) => {
              const tipo = TIPOS[i]
              return (
                <div key={i} className="caso-card"
                  style={{
                    background: tipo==='particular' ? 'rgba(196,145,124,0.15)' : 'rgba(255,255,255,0.06)',
                    border: tipo==='particular' ? '1px solid rgba(196,145,124,0.4)' : '1px solid rgba(255,255,255,0.1)',
                    borderRadius:'16px',padding:'2rem 1.5rem',display:'flex',flexDirection:'column',alignItems:'flex-start',gap:'1rem',cursor:'default',
                    gridRow: tipo==='particular' ? 'span 2' : 'auto',
                  }}>
                  <div style={{width:'56px',height:'56px',borderRadius:'50%',
                    background: tipo==='particular' ? 'rgba(196,145,124,0.25)' : 'rgba(255,255,255,0.08)',
                    border: tipo==='particular' ? '1px solid rgba(196,145,124,0.5)' : '1px solid rgba(255,255,255,0.15)',
                    display:'flex',alignItems:'center',justifyContent:'center',
                    color: tipo==='particular' ? '#C4917C' : 'rgba(255,255,255,0.7)',flexShrink:0}}>
                    {ICONOS[i]}
                  </div>
                  <div>
                    <div style={{fontSize:'0.88rem',fontWeight:700,color:'#FFFFFF',marginBottom:'0.4rem',lineHeight:1.3}}>
                      {caso.titulo}
                      {tipo==='particular' && (
                        <span style={{marginLeft:'0.5rem',fontSize:'0.5rem',fontWeight:600,letterSpacing:'0.1em',textTransform:'uppercase',background:'#C4917C',color:'#FFFFFF',padding:'0.1rem 0.4rem',borderRadius:'10px',verticalAlign:'middle'}}>{t('casos.tuBadge')}</span>
                      )}
                    </div>
                    <div style={{fontSize:'0.78rem',fontWeight:300,color:'rgba(255,255,255,0.55)',lineHeight:1.6}}>{caso.desc}</div>
                  </div>
                </div>
              )
            })}
          </div>
          <div style={{marginTop:'3rem',textAlign:'center'}}>
            <a href="/#contacto" style={{display:'inline-flex',alignItems:'center',gap:'0.5rem',fontSize:'0.82rem',fontWeight:600,color:'#0A0A0A',background:'#FFFFFF',padding:'1rem 2.5rem',textDecoration:'none',borderRadius:'4px'}}>
              {t('casos.cta')}
            </a>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="precios" className="section-pad" style={{padding:'7rem 3rem',background:'#F7F7F5'}}>
        <span style={{display:'flex',alignItems:'center',gap:'0.6rem',fontSize:'0.6rem',fontWeight:600,letterSpacing:'0.18em',textTransform:'uppercase',color:'#F07987',marginBottom:'1.75rem'}}>
          <span style={{width:'24px',height:'1px',background:'#F07987'}}></span>{t('precios.badge')}
        </span>
        <h2 style={{fontSize:'clamp(2.5rem,4vw,4.5rem)',fontWeight:100,lineHeight:1.08,letterSpacing:'-0.025em',marginBottom:'1.25rem'}}>
          {t('precios.titulo')}<br/><strong style={{fontWeight:700}}>{t('precios.tituloEmphasis')}</strong>
        </h2>
        <p style={{fontSize:'0.9rem',fontWeight:300,lineHeight:1.9,color:'#888884',maxWidth:'540px',marginBottom:'4rem'}}>
          {t('precios.subtitulo').split('\n').map((line,i) => <span key={i} style={{display:'block'}}>{line}</span>)}
          <span style={{color:'#0A0A0A',fontWeight:400}}>{t('precios.subtituloEmphasis')}</span>
        </p>
        <div className="pricing-grid" style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'1px',background:'#E0E0DC',border:'1px solid #E0E0DC'}}>
          {planesData.map((p,i)=>{
            const isEnterprise = p.price === null
            const isFeatured = i === 1
            return (
              <div key={i} style={{background:isEnterprise?'#F7F7F5':isFeatured?'#0A0A0A':'#FFFFFF',padding:'2.5rem 2rem',position:'relative',border:isEnterprise?'2px dashed #C4C4C0':'none',boxSizing:'border-box'}}>
                {isFeatured && <span style={{fontSize:'0.52rem',fontWeight:600,letterSpacing:'0.15em',textTransform:'uppercase',background:'#F07987',color:'#FFFFFF',padding:'0.22rem 0.65rem',display:'inline-block',marginBottom:'1.25rem'}}>{t('precios.masPopular')}</span>}
                {isEnterprise && <span style={{fontSize:'0.52rem',fontWeight:600,letterSpacing:'0.15em',textTransform:'uppercase',background:'#0A0A0A',color:'#FFFFFF',padding:'0.22rem 0.65rem',display:'inline-block',marginBottom:'1.25rem'}}>{t('precios.enterprise')}</span>}
                <div style={{fontSize:'0.6rem',fontWeight:600,letterSpacing:'0.14em',textTransform:'uppercase',color:'#888884',marginBottom:'0.25rem'}}>{p.plan}</div>
                <div style={{fontSize:'0.55rem',fontWeight:400,letterSpacing:'0.1em',textTransform:'uppercase',color:'#F07987',marginBottom:'0.85rem'}}>{p.sub}</div>
                {p.price ? (
                  <div style={{fontSize:'4rem',fontWeight:100,lineHeight:1,letterSpacing:'-0.04em',marginBottom:'0.5rem',color:isFeatured?'#FFFFFF':'#0A0A0A'}}>
                    <sup style={{fontSize:'1.25rem',fontWeight:300,verticalAlign:'super'}}>€</sup>{p.price}
                  </div>
                ) : (
                  <div style={{fontSize:'2rem',fontWeight:100,lineHeight:1,letterSpacing:'-0.02em',marginBottom:'0.5rem',color:'#0A0A0A',paddingTop:'0.75rem'}}>{t('precios.contactar')}</div>
                )}
                <div style={{fontSize:'0.78rem',fontWeight:300,lineHeight:1.8,color:'#888884',margin:'1.5rem 0',paddingTop:'1.5rem',borderTop:`1px solid ${isFeatured?'#3A3A38':'#E0E0DC'}`}}>{p.desc}</div>
                {p.feats.map((f,j)=>(
                  <div key={j} style={{display:'flex',gap:'0.55rem',fontSize:'0.78rem',fontWeight:300,color:isFeatured?'#888884':'#3A3A38',marginBottom:'0.55rem'}}>
                    <span style={{color:'#F07987',flexShrink:0}}>✓</span>{f}
                  </div>
                ))}
                {isEnterprise ? (
                  <a href="/#contacto" style={{display:'block',textAlign:'center',marginTop:'2rem',padding:'0.9rem',fontSize:'0.82rem',fontWeight:500,background:'transparent',color:'#0A0A0A',border:'1.5px solid #0A0A0A',textDecoration:'none',borderRadius:'4px'}}>{t('precios.contactarCta')}</a>
                ) : (
                  <button onClick={()=>handlePago(PLAN_KEYS[i])} style={{display:'block',width:'100%',textAlign:'center',marginTop:'2rem',padding:'0.9rem',fontSize:'0.82rem',fontWeight:500,background:isFeatured?'#F07987':'transparent',color:isFeatured?'#FFFFFF':'#0A0A0A',border:isFeatured?'none':'1.5px solid #0A0A0A',cursor:'pointer',fontFamily:"'Poppins',sans-serif",borderRadius:'4px'}}>{t('precios.empezar')}</button>
                )}
              </div>
            )
          })}
        </div>
        <p style={{fontSize:'0.65rem',fontWeight:300,color:'#888884',lineHeight:1.7,marginTop:'1.5rem',maxWidth:'640px'}}>
          {t('precios.disclaimer')} <a href="/terminos" style={{color:'#C4917C',textDecoration:'underline'}}>{t('precios.terminosLink')}</a>.
        </p>
      </section>

      {/* MARCAS */}
      <section id="marcas" className="section-pad" style={{padding:'7rem 3rem'}}>
        <span style={{display:'flex',alignItems:'center',gap:'0.6rem',fontSize:'0.6rem',fontWeight:600,letterSpacing:'0.18em',textTransform:'uppercase',color:'#F07987',marginBottom:'1.75rem'}}>
          <span style={{width:'24px',height:'1px',background:'#F07987'}}></span>{t('marcas.badge')}
        </span>
        <h2 style={{fontSize:'clamp(2.5rem,4vw,4.5rem)',fontWeight:100,lineHeight:1.08,letterSpacing:'-0.025em',marginBottom:'1.25rem'}}>
          {t('marcas.titulo')}<br/><strong style={{fontWeight:700}}>{t('marcas.tituloEmphasis')}</strong>
        </h2>
        <p style={{fontSize:'0.9rem',fontWeight:300,lineHeight:2,color:'#888884',maxWidth:'480px',marginBottom:'4rem'}}>
          {t('marcas.subtitulo')}
        </p>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))',gap:'1px',background:'#E0E0DC',border:'1px solid #E0E0DC'}}>
          {[...marcas, {name:'+ Sugerir marca', url:'/#contacto', logo:null}].map((brand,i)=>{
            const isSuggest = brand.url === '/#contacto'
            return (
              <a key={i} href={brand.url} target={brand.url.startsWith('http')?'_blank':'_self'} rel="noopener noreferrer" className="marca-card" style={{background:'#FFFFFF',padding:'1.5rem 1rem',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:'0.5rem',minHeight:'130px',textAlign:'center',textDecoration:'none',transition:'background 0.15s'}}>
                {isSuggest ? (
                  <>
                    <span style={{width:'36px',height:'36px',borderRadius:'50%',background:'#F07987',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.2rem',color:'#FFFFFF',fontWeight:300}}>+</span>
                    <span style={{fontSize:'0.75rem',fontWeight:500,color:'#F07987'}}>{t('marcas.sugerir')}</span>
                  </>
                ) : (
                  <img src={`${SUPABASE}${brand.logo}`} alt={brand.name} style={{height:'50px',maxWidth:'130px',objectFit:'contain',filter:'grayscale(1)',opacity:0.75,transform:`scale(${brand.zoom||1})`,transition:'transform 0.15s'}}/>
                )}
              </a>
            )
          })}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="section-pad" style={{padding:'7rem 3rem',background:'#F7F7F5'}}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'5rem',alignItems:'start'}}>
          <div style={{position:'sticky',top:'100px'}}>
            <span style={{display:'flex',alignItems:'center',gap:'0.6rem',fontSize:'0.6rem',fontWeight:600,letterSpacing:'0.18em',textTransform:'uppercase',color:'#F07987',marginBottom:'1.75rem'}}>
              <span style={{width:'24px',height:'1px',background:'#F07987'}}></span>{t('faq.badge')}
            </span>
            <h2 style={{fontSize:'clamp(2.5rem,4vw,4.5rem)',fontWeight:100,lineHeight:1.08,letterSpacing:'-0.025em',marginBottom:'1rem'}}>
              {t('faq.titulo')}<br/><strong style={{fontWeight:700}}>{t('faq.tituloEmphasis')}</strong>
            </h2>
            <p style={{fontSize:'0.85rem',fontWeight:300,lineHeight:2,color:'#888884',marginTop:'1rem'}}>
              {t('faq.masPreguntas')}<br/>
              <a href="mailto:support@nowear.es" style={{color:'#F07987',textDecoration:'none'}}>support@nowear.es</a>
            </p>
          </div>
          <div>
            {faqData.map((item,i)=>(
              <details key={i} style={{borderBottom:'1px solid #D0D0CC'}}>
                <summary style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'1.5rem 0',fontSize:'1rem',fontWeight:500,color:'#0A0A0A',cursor:'pointer',listStyle:'none',letterSpacing:'-0.01em',lineHeight:1.4}}>
                  {item.q}
                  <span style={{fontSize:'1.3rem',fontWeight:100,color:'#BEBEBA',flexShrink:0,marginLeft:'1rem'}}>+</span>
                </summary>
                <p style={{fontSize:'0.9rem',fontWeight:300,color:'#555552',lineHeight:2,paddingBottom:'1.5rem'}}>{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACTO */}
      <section id="contacto" className="contact-grid" style={{display:'grid',gridTemplateColumns:'1fr 1fr'}}>
        <div style={{background:'#0A0A0A',padding:'5rem 4rem',display:'flex',flexDirection:'column',justifyContent:'center',gap:'1.5rem',minHeight:'400px'}}>
          <div>
            <h2 style={{fontSize:'3.5rem',fontWeight:100,color:'#FFFFFF',lineHeight:1.08,letterSpacing:'-0.025em',marginBottom:'1rem'}}>
              {t('contacto.titulo')}<br/><strong style={{fontWeight:700}}>{t('contacto.tituloEmphasis')}</strong>
            </h2>
            <p style={{fontSize:'0.85rem',fontWeight:300,color:'#888884',lineHeight:1.9,marginBottom:'1.5rem'}}>
              {t('contacto.subtitulo')}
            </p>
            <a href="mailto:support@nowear.es" style={{fontSize:'0.85rem',fontWeight:400,color:'#F07987',textDecoration:'none'}}>support@nowear.es</a>
          </div>
        </div>
        <div style={{padding:'5rem 4rem',background:'#F7F7F5'}}>
          {[t('contacto.nombre'), t('contacto.email')].map((label,i)=>(
            <div key={i} style={{marginBottom:'1.25rem'}}>
              <label style={{display:'block',fontSize:'0.6rem',fontWeight:600,letterSpacing:'0.12em',textTransform:'uppercase',color:'#888884',marginBottom:'0.55rem'}}>{label}</label>
              <input type={i===1?'email':'text'} style={{width:'100%',fontFamily:'Poppins,sans-serif',fontSize:'0.85rem',fontWeight:300,padding:'0.9rem 1rem',border:'1px solid #E0E0DC',background:'#FFFFFF',outline:'none',boxSizing:'border-box'}}/>
            </div>
          ))}
          <div style={{marginBottom:'1.25rem'}}>
            <label style={{display:'block',fontSize:'0.6rem',fontWeight:600,letterSpacing:'0.12em',textTransform:'uppercase',color:'#888884',marginBottom:'0.55rem'}}>{t('contacto.mensaje')}</label>
            <textarea style={{width:'100%',fontFamily:'Poppins,sans-serif',fontSize:'0.85rem',fontWeight:300,padding:'0.9rem 1rem',border:'1px solid #E0E0DC',background:'#FFFFFF',outline:'none',minHeight:'100px',resize:'vertical',boxSizing:'border-box'}}/>
          </div>
          <button style={{width:'100%',padding:'0.9rem',fontSize:'0.85rem',fontWeight:500,background:'#0A0A0A',color:'#FFFFFF',border:'none',cursor:'pointer',fontFamily:'Poppins,sans-serif',borderRadius:'4px'}}>{t('contacto.enviar')}</button>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{background:'#0A0A0A',padding:'5rem 3rem 2.5rem'}}>
        <div className="footer-grid" style={{display:'grid',gridTemplateColumns:'2fr 1fr 1fr 1fr',gap:'3rem',marginBottom:'4rem'}}>
          <div>
            <img src={`${SUPABASE}nowear_logo_white.png`} alt="NOWEAR" style={{height:'36px',marginBottom:'1.25rem',display:'block'}}/>
            <p style={{fontSize:'0.78rem',fontWeight:300,color:'#888884',lineHeight:1.85,maxWidth:'260px',letterSpacing:'0.5px'}}>{t('footer.tagline')}</p>
          </div>
          {[
            {title:t('footer.producto'),links:[
              {label:t('footer.comoFunciona'),href:'/#como'},
              {label:t('footer.casosDeUso'),href:'/#casos'},
              {label:t('footer.paquetes'),href:'/#precios'},
              {label:t('footer.inspiracion'),href:'/#marcas'},
              {label:t('footer.preguntasFrecuentes'),href:'/#faq'},
              {label:t('footer.crearEvento'),href:'/register'},
            ]},
            {title:t('footer.soporte'),links:[
              {label:t('footer.contacto'),href:'/#contacto'},
              {label:t('footer.privacidad'),href:'/privacidad'},
              {label:t('footer.terminos'),href:'/terminos'},
              {label:t('footer.datos'),href:'/datos'},
            ]},
            {title:t('footer.idioma'),links:[
              {label:'🇪🇸 Español',href:'#'},
              {label:'🇫🇷 Français',href:'#'},
              {label:'🇬🇧 English',href:'#'},
              {label:'🇵🇹 Português',href:'#'},
              {label:'🇩🇪 Deutsch',href:'#'},
              {label:'🇳🇱 Nederlands',href:'#'},
            ]},
          ].map((col,i)=>(
            <div key={i}>
              <div style={{fontSize:'0.58rem',fontWeight:600,letterSpacing:'0.18em',textTransform:'uppercase',color:'#BEBEBA',marginBottom:'1.5rem'}}>{col.title}</div>
              {col.links.map((link,j)=>(
                <a key={j} href={link.href} style={{display:'block',fontSize:'0.78rem',fontWeight:300,color:'#888884',marginBottom:'0.65rem',textDecoration:'none'}}>{link.label}</a>
              ))}
            </div>
          ))}
        </div>
        <div style={{borderTop:'1px solid #3A3A38',paddingTop:'2rem',display:'flex',justifyContent:'space-between',flexWrap:'wrap',gap:'1rem'}}>
          <span style={{fontSize:'0.65rem',fontWeight:300,color:'#3A3A38'}}>{t('footer.copyright')}</span>
          <span style={{fontSize:'0.65rem',fontWeight:300,color:'#3A3A38'}}>support@nowear.es</span>
        </div>
      </footer>
    </>
  )
}