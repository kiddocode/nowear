'use client'
import { useState, useEffect, useRef } from 'react'

const PASOS = [
  {
    id: 1,
    titulo: 'Tu panel de evento',
    descripcion: 'Aquí verás todo de un vistazo: cuántas invitadas han registrado su look, si hay conflictos de color y cuántos días quedan para el evento.',
    target: 'stats'
  },
  {
    id: 2,
    titulo: 'El link de tu evento',
    descripcion: 'Este es el link único que tienes que compartir con tus invitadas. Solo con este link podrán registrar su look, sin necesidad de crear una cuenta.',
    target: 'link'
  },
  {
    id: 3,
    titulo: 'Lo que verá tu invitada',
    descripcion: 'Cuando tu invitada abra el link, verá este formulario. Elegirá su color, marca, modelo y subirá una foto si quiere. Tú lo verás al instante.',
    target: 'invitada'
  },
  {
    id: 4,
    titulo: 'La tabla de looks',
    descripcion: 'Aquí verás todos los looks registrados. Si dos invitadas eligen el mismo color, aparecerá un conflicto y podrás gestionarlo.',
    target: 'tabla'
  },
]

const LOOKS_DEMO = [
  {hex:'#F5C6D0',nombre:'Ana P.',marca:'Mango',modelo:'Vestido Rosalía',tipo:'Midi',estado:'confirmado'},
  {hex:'#D4A8D4',nombre:'Laura M.',marca:'Zara',modelo:'Col. Primavera',tipo:'Largo',estado:'confirmado'},
  {hex:'#E07A5F',nombre:'Sofía R.',marca:'Sandro',modelo:'Vestido Cannes',tipo:'Midi',estado:'prereservado'},
  {hex:'#A8C4E0',nombre:'María G.',marca:'& Other Stories',modelo:'Blue Haze Dress',tipo:'Largo',estado:'confirmado'},
]

export default function DemoOrganizadora() {
  const [paso, setPaso] = useState(0)
  const [tab, setTab] = useState(0)
  const invitadaRef = useRef(null)
  const statsRef = useRef(null)
  const tablaRef = useRef(null)
  const linkRef = useRef(null)

  const pasoActual = PASOS[paso]

  useEffect(() => {
    const refs = { stats: statsRef, link: linkRef, invitada: invitadaRef, tabla: tablaRef }
    const ref = refs[pasoActual.target]
    if (ref?.current) {
      setTimeout(() => {
        ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 100)
    }
  }, [paso])

  function isHighlighted(target) {
    return pasoActual.target === target
  }

  function highlightStyle(target) {
    if (!isHighlighted(target)) return {}
    return {
      outline: '3px solid #C4917C',
      outlineOffset: '4px',
      borderRadius: '2px',
      position: 'relative',
      zIndex: 10
    }
  }

  return (
    <div style={{background:'#F7F7F5',minHeight:'calc(100vh - 68px)'}}>

      {/* BANNER DEMO */}
      <div style={{background:'#C4917C',padding:'0.75rem 3rem',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div style={{display:'flex',alignItems:'center',gap:'1rem'}}>
          <span style={{fontSize:'0.6rem',fontWeight:600,letterSpacing:'0.15em',textTransform:'uppercase',color:'#FFFFFF'}}>Demo interactiva</span>
          <span style={{fontSize:'0.72rem',fontWeight:300,color:'rgba(255,255,255,0.8)'}}>Esto es lo que verás cuando crees tu evento</span>
        </div>
        <a href="/register" style={{fontSize:'0.72rem',fontWeight:500,padding:'0.5rem 1.25rem',background:'#FFFFFF',color:'#C4917C',textDecoration:'none'}}>
          Crear mi evento →
        </a>
      </div>

      {/* TOUR OVERLAY */}
      <div style={{position:'fixed',bottom:'2rem',left:'50%',transform:'translateX(-50%)',zIndex:1000,background:'#0A0A0A',color:'#FFFFFF',padding:'1.5rem 2rem',maxWidth:'480px',width:'calc(100% - 3rem)',boxShadow:'0 8px 40px rgba(0,0,0,0.3)'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'0.75rem'}}>
          <div style={{display:'flex',alignItems:'center',gap:'0.75rem'}}>
            <div style={{width:'28px',height:'28px',borderRadius:'50%',background:'#C4917C',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.7rem',fontWeight:600,flexShrink:0}}>
              {pasoActual.id}
            </div>
            <span style={{fontSize:'0.9rem',fontWeight:400,letterSpacing:'-0.01em'}}>{pasoActual.titulo}</span>
          </div>
          <span style={{fontSize:'0.62rem',fontWeight:300,color:'#888884',whiteSpace:'nowrap',marginLeft:'1rem'}}>
            {paso + 1} / {PASOS.length}
          </span>
        </div>
        <p style={{fontSize:'0.78rem',fontWeight:300,color:'rgba(255,255,255,0.75)',lineHeight:1.7,marginBottom:'1.25rem'}}>
          {pasoActual.descripcion}
        </p>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div style={{display:'flex',gap:'0.4rem'}}>
            {PASOS.map((_,i) => (
              <div key={i} onClick={() => setPaso(i)} style={{width:i===paso?'20px':'6px',height:'6px',borderRadius:'3px',background:i===paso?'#C4917C':'rgba(255,255,255,0.2)',cursor:'pointer',transition:'all 0.2s'}}></div>
            ))}
          </div>
          <div style={{display:'flex',gap:'0.75rem'}}>
            {paso > 0 && (
              <button onClick={() => setPaso(paso - 1)}
                style={{fontSize:'0.72rem',fontWeight:400,padding:'0.5rem 1.25rem',background:'transparent',color:'rgba(255,255,255,0.6)',border:'1px solid rgba(255,255,255,0.15)',cursor:'pointer',fontFamily:'Poppins,sans-serif'}}>
                Anterior
              </button>
            )}
            {paso < PASOS.length - 1 ? (
              <button onClick={() => setPaso(paso + 1)}
                style={{fontSize:'0.72rem',fontWeight:500,padding:'0.5rem 1.5rem',background:'#FFFFFF',color:'#0A0A0A',border:'none',cursor:'pointer',fontFamily:'Poppins,sans-serif'}}>
                Siguiente →
              </button>
            ) : (
              <a href="/register"
                style={{fontSize:'0.72rem',fontWeight:500,padding:'0.5rem 1.5rem',background:'#C4917C',color:'#FFFFFF',border:'none',cursor:'pointer',fontFamily:'Poppins,sans-serif',textDecoration:'none'}}>
                Crear mi evento →
              </a>
            )}
          </div>
        </div>
      </div>

      {/* CONTENIDO DEMO */}
      <div style={{paddingBottom:'140px'}}>

        {/* HERO EVENTO */}
        <div style={{background:'#0A0A0A',padding:'4rem 3rem 3rem',display:'flex',justifyContent:'space-between',alignItems:'flex-end',flexWrap:'wrap',gap:'2rem'}}>
          <div>
            <div style={{fontSize:'0.6rem',fontWeight:600,letterSpacing:'0.18em',textTransform:'uppercase',color:'#888884',marginBottom:'0.65rem'}}>Boda · Plan Estándar</div>
            <h1 style={{fontSize:'3rem',fontWeight:200,color:'#FFFFFF',letterSpacing:'-0.025em',lineHeight:1,marginBottom:'0.4rem'}}>Cris & Pablo</h1>
            <p style={{fontSize:'0.75rem',fontWeight:300,color:'#888884'}}>10 de octubre de 2026 · Zahara de los Atunes</p>
          </div>

          <div ref={linkRef} id="link-demo" style={{...highlightStyle('link'),background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',padding:'1.25rem 1.5rem',minWidth:'280px'}}>
            <p style={{fontSize:'0.56rem',fontWeight:600,letterSpacing:'0.15em',textTransform:'uppercase',color:'#888884',marginBottom:'0.5rem'}}>Link para invitadas</p>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:'1rem'}}>
              <span style={{fontSize:'0.8rem',fontWeight:300,color:'#FFFFFF'}}>nowear.es/cris-pablo</span>
              <button style={{fontSize:'0.58rem',fontWeight:600,letterSpacing:'0.1em',textTransform:'uppercase',color:'#C4917C',background:'none',border:'none',cursor:'pointer',fontFamily:'Poppins,sans-serif'}}>Copiar</button>
            </div>
            {isHighlighted('link') && (
              <div style={{marginTop:'0.75rem',padding:'0.5rem 0.75rem',background:'rgba(196,145,124,0.2)',border:'1px solid rgba(196,145,124,0.4)'}}>
                <p style={{fontSize:'0.62rem',fontWeight:300,color:'#C4917C'}}>👆 Copia este link y compártelo con tus invitadas por WhatsApp o email</p>
              </div>
            )}
          </div>
        </div>

        {/* TABS */}
        <div style={{display:'flex',padding:'0 3rem',borderBottom:'1px solid #E0E0DC',background:'#FFFFFF',overflowX:'auto'}}>
          {['Looks registrados','Conflictos','Colores bloqueados','Ajustes'].map((t,i) => (
            <button key={i} onClick={() => setTab(i)}
              style={{padding:'1.25rem 0',marginRight:'2rem',fontSize:'0.7rem',fontWeight:tab===i?600:400,color:tab===i?'#0A0A0A':'#888884',cursor:'pointer',background:'none',border:'none',borderBottom:tab===i?'2px solid #0A0A0A':'2px solid transparent',fontFamily:'Poppins,sans-serif',whiteSpace:'nowrap'}}>
              {t}
            </button>
          ))}
        </div>

        <div style={{padding:'2.5rem 3rem'}}>

          {/* STATS */}
          <div ref={statsRef} style={{...highlightStyle('stats'),display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'1px',background:'#E0E0DC',border:'1px solid #E0E0DC',marginBottom:'2.5rem'}}>
            {[
              {n:'4',l:'Looks registrados'},
              {n:'1',l:'Prereservados'},
              {n:'0',l:'Conflictos'},
              {n:'142',l:'Días restantes'},
            ].map((s,i) => (
              <div key={i} style={{background:'#F7F7F5',padding:'1.5rem 2rem'}}>
                <div style={{fontSize:'2rem',fontWeight:100,color:'#0A0A0A',lineHeight:1,marginBottom:'0.3rem',letterSpacing:'-0.03em'}}>{s.n}</div>
                <div style={{fontSize:'0.58rem',fontWeight:600,letterSpacing:'0.12em',textTransform:'uppercase',color:'#888884'}}>{s.l}</div>
              </div>
            ))}
            {isHighlighted('stats') && (
              <div style={{gridColumn:'1/-1',padding:'0.75rem 2rem',background:'#FFF8F5',borderTop:'1px solid #E0E0DC'}}>
                <p style={{fontSize:'0.65rem',fontWeight:300,color:'#C4917C'}}>👆 De un vistazo sabes cuántas invitadas han registrado su look y si hay algún conflicto</p>
              </div>
            )}
          </div>

          {/* FORMULARIO INVITADA - siempre visible */}
          <div ref={invitadaRef} style={{...highlightStyle('invitada'),marginBottom:'2.5rem',border: isHighlighted('invitada') ? '3px solid #C4917C' : '1px solid #E0E0DC',borderRadius:'2px',overflow:'hidden'}}>
            {isHighlighted('invitada') && (
              <div style={{background:'#C4917C',padding:'0.75rem 1.5rem'}}>
                <p style={{fontSize:'0.62rem',fontWeight:600,letterSpacing:'0.12em',textTransform:'uppercase',color:'#FFFFFF'}}>👆 Esto es lo que verá tu invitada cuando abra el link</p>
              </div>
            )}
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr'}}>
              <div style={{background:'#0A0A0A',padding:'3rem',display:'flex',flexDirection:'column',justifyContent:'flex-end'}}>
                <div style={{fontSize:'0.6rem',fontWeight:600,letterSpacing:'0.18em',textTransform:'uppercase',color:'#888884',marginBottom:'0.5rem'}}>Boda</div>
                <h2 style={{fontSize:'2rem',fontWeight:200,color:'#FFFFFF',letterSpacing:'-0.025em',lineHeight:1,marginBottom:'0.35rem'}}>Cris & Pablo</h2>
                <p style={{fontSize:'0.72rem',fontWeight:300,color:'#888884',marginBottom:'1.5rem'}}>10 de octubre de 2026 · Zahara de los Atunes</p>
                <p style={{fontSize:'0.78rem',fontWeight:300,color:'rgba(255,255,255,0.5)',lineHeight:1.7}}>Registra tu look para que ninguna invitada llegue vestida igual.</p>
              </div>
              <div style={{padding:'3rem',background:'#FFFFFF'}}>
                <h3 style={{fontSize:'1.4rem',fontWeight:200,color:'#0A0A0A',marginBottom:'0.3rem'}}>Tu look</h3>
                <p style={{fontSize:'0.72rem',fontWeight:300,color:'#888884',marginBottom:'1.5rem'}}>Registra tu outfit para Cris & Pablo</p>
                {[
                  {label:'Tu nombre', placeholder:'Ej: María García', obligatorio:true},
                  {label:'Color del look', placeholder:'Selecciona el color...', obligatorio:true},
                  {label:'Marca', placeholder:'Ej: Zara', obligatorio:true},
                ].map((f,i) => (
                  <div key={i} style={{marginBottom:'1rem'}}>
                    <label style={{display:'block',fontSize:'0.55rem',fontWeight:600,letterSpacing:'0.12em',textTransform:'uppercase',color:'#888884',marginBottom:'0.4rem'}}>
                      {f.label} {f.obligatorio && <span style={{color:'#C4917C'}}>*</span>}
                    </label>
                    <div style={{padding:'0.7rem 0.85rem',border:'1px solid #E0E0DC',fontSize:'0.75rem',fontWeight:300,color:'#BEBEBA'}}>{f.placeholder}</div>
                  </div>
                ))}
                <div style={{padding:'0.7rem',background:'#0A0A0A',textAlign:'center',fontSize:'0.72rem',fontWeight:500,color:'#FFFFFF',marginTop:'1rem'}}>
                  Registrar mi look →
                </div>
              </div>
            </div>
          </div>

          {/* TABLA */}
          <div ref={tablaRef} style={highlightStyle('tabla')}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1.5rem'}}>
              <span style={{fontSize:'0.75rem',fontWeight:300,color:'#888884'}}>4 looks registrados</span>
              <button style={{fontSize:'0.62rem',fontWeight:500,padding:'0.5rem 1.25rem',background:'transparent',color:'#0A0A0A',border:'1px solid #0A0A0A',cursor:'pointer',fontFamily:'Poppins,sans-serif'}}>Exportar lista</button>
            </div>
            <div style={{overflowX:'auto'}}>
              <table style={{width:'100%',borderCollapse:'collapse',minWidth:'600px'}}>
                <thead>
                  <tr>
                    {['Color','Nombre','Marca','Modelo','Tipo','Estado'].map((h,i) => (
                      <th key={i} style={{fontSize:'0.58rem',fontWeight:600,letterSpacing:'0.12em',textTransform:'uppercase',color:'#888884',textAlign:'left',padding:'0.75rem 1rem',borderBottom:'1px solid #E0E0DC'}}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {LOOKS_DEMO.map((row,i) => (
                    <tr key={i} style={{borderBottom:'1px solid #E0E0DC'}}>
                      <td style={{padding:'0.9rem 1rem'}}>
                        <span style={{width:'18px',height:'18px',borderRadius:'50%',background:row.hex,border:'1px solid #E0E0DC',display:'inline-block',verticalAlign:'middle'}}></span>
                      </td>
                      <td style={{padding:'0.9rem 1rem',fontSize:'0.78rem',fontWeight:400,color:'#0A0A0A'}}>{row.nombre}</td>
                      <td style={{padding:'0.9rem 1rem',fontSize:'0.78rem',fontWeight:300,color:'#0A0A0A'}}>{row.marca}</td>
                      <td style={{padding:'0.9rem 1rem',fontSize:'0.78rem',fontWeight:300,color:'#0A0A0A'}}>{row.modelo}</td>
                      <td style={{padding:'0.9rem 1rem',fontSize:'0.78rem',fontWeight:300,color:'#888884'}}>{row.tipo}</td>
                      <td style={{padding:'0.9rem 1rem'}}>
                        <span style={{fontSize:'0.58rem',fontWeight:600,letterSpacing:'0.1em',textTransform:'uppercase',padding:'0.2rem 0.6rem',background:row.estado==='confirmado'?'#EEF4E8':'#F5EDE8',color:row.estado==='confirmado'?'#4A6B42':'#C4917C'}}>{row.estado}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {isHighlighted('tabla') && (
              <div style={{padding:'0.75rem 1rem',background:'#FFF8F5',border:'1px solid #E0E0DC',borderTop:'none'}}>
                <p style={{fontSize:'0.65rem',fontWeight:300,color:'#C4917C'}}>👆 Cada look queda registrado aquí en tiempo real. Puedes exportar la lista cuando quieras</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}