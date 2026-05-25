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
    descripcion: 'Cuando tu invitada abra el link, verá este formulario completo. Elegirá su color, marca, modelo, tipo de prenda y podrá subir una foto. Tú lo verás al instante.',
    target: 'invitada'
  },
  {
    id: 4,
    titulo: 'La tabla de looks',
    descripcion: 'Aquí verás todos los looks registrados en tiempo real. Si dos invitadas eligen el mismo color, aparece un conflicto marcado en rojo.',
    target: 'tabla'
  },
]

const LOOKS_DEMO = [
  {hex:'#F5C6D0',nombre:'Ana P.',marca:'Mango',modelo:'Vestido Rosalía',tipo:'Midi',estado:'confirmado',conflicto:false},
  {hex:'#D4A8D4',nombre:'Laura M.',marca:'Zara',modelo:'Col. Primavera',tipo:'Largo',estado:'confirmado',conflicto:false},
  {hex:'#E07A5F',nombre:'Sofía R.',marca:'Sandro',modelo:'Vestido Cannes',tipo:'Midi',estado:'prereservado',conflicto:false},
  {hex:'#A8C4E0',nombre:'María G.',marca:'& Other Stories',modelo:'Blue Haze Dress',tipo:'Largo',estado:'confirmado',conflicto:false},
  {hex:'#F5C6D0',nombre:'Carmen L.',marca:'Massimo Dutti',modelo:'Vestido Rosa',tipo:'Midi',estado:'confirmado',conflicto:true},
]

const COLORES_DEMO = [
  {hex:'#F5C6D0',nombre:'Rosa palo'},
  {hex:'#D4A8D4',nombre:'Lila'},
  {hex:'#E07A5F',nombre:'Terracota'},
  {hex:'#A8C4E0',nombre:'Azul celeste'},
  {hex:'#F0D080',nombre:'Amarillo'},
  {hex:'#8BC4A8',nombre:'Verde salvia'},
  {hex:'#E8C4A0',nombre:'Nude'},
  {hex:'#C4917C',nombre:'Camel'},
  {hex:'#3A3A38',nombre:'Negro'},
  {hex:'#FFFFFF',nombre:'Blanco'},
  {hex:'#E0E0DC',nombre:'Marfil'},
  {hex:'#D4A080',nombre:'Coral'},
]

export default function DemoOrganizadora() {
  const [paso, setPaso] = useState(0)
  const [tab, setTab] = useState(0)
  const [colorSeleccionado, setColorSeleccionado] = useState(null)
  const invitadaRef = useRef(null)
  const statsRef = useRef(null)
  const tablaRef = useRef(null)
  const linkRef = useRef(null)

  const pasoActual = PASOS[paso]
  const conflictos = LOOKS_DEMO.filter(l => l.conflicto).length

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
      outlineOffset: '6px',
      borderRadius: '4px',
      position: 'relative',
      zIndex: 10
    }
  }

  return (
    <div style={{background:'#F7F7F5',minHeight:'calc(100vh - 68px)'}}>

      <style>{`
        .demo-tab:hover { color: #0A0A0A !important; }
        .color-pill:hover { transform: scale(1.15); }
        .color-pill { transition: transform 0.15s; cursor: pointer; }
        .look-row:hover { background: #FAFAF8 !important; }
      `}</style>

      {/* BANNER DEMO */}
      <div style={{background:'#0A0A0A',padding:'0.75rem 3rem',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div style={{display:'flex',alignItems:'center',gap:'1rem'}}>
          <span style={{fontSize:'0.58rem',fontWeight:600,letterSpacing:'0.15em',textTransform:'uppercase',color:'#C4917C',border:'1px solid rgba(196,145,124,0.4)',padding:'0.2rem 0.6rem',borderRadius:'20px'}}>Demo interactiva</span>
          <span style={{fontSize:'0.72rem',fontWeight:300,color:'rgba(255,255,255,0.6)'}}>Esto es lo que verás cuando crees tu evento</span>
        </div>
        <a href="/register" style={{fontSize:'0.72rem',fontWeight:500,padding:'0.5rem 1.25rem',background:'#FFFFFF',color:'#0A0A0A',textDecoration:'none',borderRadius:'4px'}}>
          Crear mi evento →
        </a>
      </div>

      {/* TOUR OVERLAY */}
      <div style={{position:'fixed',bottom:'2rem',left:'50%',transform:'translateX(-50%)',zIndex:1000,background:'#0A0A0A',color:'#FFFFFF',padding:'1.5rem 2rem',maxWidth:'500px',width:'calc(100% - 3rem)',boxShadow:'0 8px 40px rgba(0,0,0,0.35)',borderRadius:'12px',border:'1px solid rgba(255,255,255,0.08)'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'0.75rem'}}>
          <div style={{display:'flex',alignItems:'center',gap:'0.75rem'}}>
            <div style={{width:'28px',height:'28px',borderRadius:'50%',background:'#C4917C',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.7rem',fontWeight:700,flexShrink:0}}>
              {pasoActual.id}
            </div>
            <span style={{fontSize:'0.88rem',fontWeight:600,letterSpacing:'-0.01em'}}>{pasoActual.titulo}</span>
          </div>
          <span style={{fontSize:'0.6rem',fontWeight:300,color:'#888884',whiteSpace:'nowrap',marginLeft:'1rem',background:'rgba(255,255,255,0.06)',padding:'0.2rem 0.5rem',borderRadius:'20px'}}>
            {paso + 1} / {PASOS.length}
          </span>
        </div>
        <p style={{fontSize:'0.78rem',fontWeight:300,color:'rgba(255,255,255,0.7)',lineHeight:1.75,marginBottom:'1.25rem'}}>
          {pasoActual.descripcion}
        </p>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div style={{display:'flex',gap:'0.4rem'}}>
            {PASOS.map((_,i) => (
              <div key={i} onClick={() => setPaso(i)} style={{width:i===paso?'24px':'6px',height:'6px',borderRadius:'3px',background:i===paso?'#C4917C':'rgba(255,255,255,0.15)',cursor:'pointer',transition:'all 0.25s'}}></div>
            ))}
          </div>
          <div style={{display:'flex',gap:'0.75rem'}}>
            {paso > 0 && (
              <button onClick={() => setPaso(paso - 1)}
                style={{fontSize:'0.72rem',fontWeight:400,padding:'0.55rem 1.25rem',background:'transparent',color:'rgba(255,255,255,0.5)',border:'1px solid rgba(255,255,255,0.12)',cursor:'pointer',fontFamily:'Poppins,sans-serif',borderRadius:'6px'}}>
                Anterior
              </button>
            )}
            {paso < PASOS.length - 1 ? (
              <button onClick={() => setPaso(paso + 1)}
                style={{fontSize:'0.72rem',fontWeight:600,padding:'0.55rem 1.5rem',background:'#FFFFFF',color:'#0A0A0A',border:'none',cursor:'pointer',fontFamily:'Poppins,sans-serif',borderRadius:'6px'}}>
                Siguiente →
              </button>
            ) : (
              <a href="/register"
                style={{fontSize:'0.72rem',fontWeight:600,padding:'0.55rem 1.5rem',background:'#C4917C',color:'#FFFFFF',border:'none',cursor:'pointer',fontFamily:'Poppins,sans-serif',textDecoration:'none',borderRadius:'6px'}}>
                Crear mi evento →
              </a>
            )}
          </div>
        </div>
      </div>

      {/* CONTENIDO DEMO */}
      <div style={{paddingBottom:'160px'}}>

        {/* HERO EVENTO */}
        <div style={{background:'#0A0A0A',padding:'4rem 3rem 3rem',display:'flex',justifyContent:'space-between',alignItems:'flex-end',flexWrap:'wrap',gap:'2rem'}}>
          <div>
            <div style={{display:'flex',alignItems:'center',gap:'0.75rem',marginBottom:'0.75rem'}}>
              <span style={{fontSize:'0.55rem',fontWeight:600,letterSpacing:'0.14em',textTransform:'uppercase',color:'#888884'}}>Boda</span>
              <span style={{width:'4px',height:'4px',borderRadius:'50%',background:'#3A3A38',display:'inline-block'}}></span>
              <span style={{fontSize:'0.55rem',fontWeight:600,letterSpacing:'0.14em',textTransform:'uppercase',color:'#C4917C',border:'1px solid rgba(196,145,124,0.3)',padding:'0.15rem 0.5rem',borderRadius:'20px'}}>Plan Estándar</span>
            </div>
            <h1 style={{fontSize:'3rem',fontWeight:100,color:'#FFFFFF',letterSpacing:'-0.03em',lineHeight:1,marginBottom:'0.5rem'}}>Cris & Pablo</h1>
            <p style={{fontSize:'0.75rem',fontWeight:300,color:'#888884'}}>10 de octubre de 2026 · Zahara de los Atunes</p>
          </div>

          <div ref={linkRef} style={{...highlightStyle('link'),background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',padding:'1.25rem 1.5rem',minWidth:'300px',borderRadius:'8px'}}>
            <p style={{fontSize:'0.55rem',fontWeight:600,letterSpacing:'0.15em',textTransform:'uppercase',color:'#888884',marginBottom:'0.65rem'}}>Link para invitadas</p>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:'1rem'}}>
              <span style={{fontSize:'0.82rem',fontWeight:300,color:'#FFFFFF',letterSpacing:'-0.01em'}}>nowear.es/cris-pablo</span>
              <button style={{fontSize:'0.58rem',fontWeight:600,letterSpacing:'0.1em',textTransform:'uppercase',color:'#C4917C',background:'none',border:'1px solid rgba(196,145,124,0.3)',cursor:'pointer',fontFamily:'Poppins,sans-serif',padding:'0.3rem 0.75rem',borderRadius:'4px'}}>Copiar</button>
            </div>
            {isHighlighted('link') && (
              <div style={{marginTop:'0.75rem',padding:'0.6rem 0.85rem',background:'rgba(196,145,124,0.15)',border:'1px solid rgba(196,145,124,0.3)',borderRadius:'4px'}}>
                <p style={{fontSize:'0.62rem',fontWeight:300,color:'#C4917C'}}>👆 Copia y comparte por WhatsApp o email</p>
              </div>
            )}
          </div>
        </div>

        {/* TABS */}
        <div style={{display:'flex',padding:'0 3rem',borderBottom:'1px solid #E0E0DC',background:'#FFFFFF',overflowX:'auto'}}>
          {['Looks registrados','Conflictos','Colores bloqueados','Personalización','Ajustes'].map((t,i) => (
            <button key={i} onClick={() => setTab(i)} className="demo-tab"
              style={{padding:'1.25rem 0',marginRight:'2rem',fontSize:'0.7rem',fontWeight:tab===i?600:400,color:tab===i?'#0A0A0A':'#888884',cursor:'pointer',background:'none',border:'none',borderBottom:tab===i?'2px solid #0A0A0A':'2px solid transparent',fontFamily:'Poppins,sans-serif',whiteSpace:'nowrap',transition:'color 0.15s'}}>
              {t}
              {i===1 && conflictos > 0 && <span style={{marginLeft:'0.4rem',fontSize:'0.55rem',fontWeight:700,background:'#F07987',color:'#FFFFFF',padding:'0.1rem 0.4rem',borderRadius:'10px'}}>{conflictos}</span>}
            </button>
          ))}
        </div>

        <div style={{padding:'2.5rem 3rem'}}>

          {/* STATS */}
          <div ref={statsRef} style={{...highlightStyle('stats'),display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'1px',background:'#E0E0DC',border:'1px solid #E0E0DC',marginBottom:'2.5rem'}}>
            {[
              {n:'5',l:'Looks registrados',color:'#0A0A0A'},
              {n:'1',l:'Prereservados',color:'#0A0A0A'},
              {n:'1',l:'Conflictos',color:'#F07987'},
              {n:'137',l:'Días restantes',color:'#0A0A0A'},
            ].map((s,i) => (
              <div key={i} style={{background:'#FFFFFF',padding:'1.75rem 2rem'}}>
                <div style={{fontSize:'2.5rem',fontWeight:100,color:s.color,lineHeight:1,marginBottom:'0.4rem',letterSpacing:'-0.04em'}}>{s.n}</div>
                <div style={{fontSize:'0.58rem',fontWeight:600,letterSpacing:'0.12em',textTransform:'uppercase',color:'#888884'}}>{s.l}</div>
              </div>
            ))}
            {isHighlighted('stats') && (
              <div style={{gridColumn:'1/-1',padding:'0.75rem 2rem',background:'#FFF8F5',borderTop:'1px solid #E0E0DC'}}>
                <p style={{fontSize:'0.65rem',fontWeight:300,color:'#C4917C'}}>👆 De un vistazo sabes el estado de tu evento en tiempo real</p>
              </div>
            )}
          </div>

          {/* FORMULARIO INVITADA */}
          <div ref={invitadaRef} style={{...highlightStyle('invitada'),marginBottom:'2.5rem',border:isHighlighted('invitada')?'3px solid #C4917C':'1px solid #E0E0DC',borderRadius:'8px',overflow:'hidden'}}>
            {isHighlighted('invitada') && (
              <div style={{background:'#C4917C',padding:'0.75rem 1.5rem'}}>
                <p style={{fontSize:'0.62rem',fontWeight:600,letterSpacing:'0.12em',textTransform:'uppercase',color:'#FFFFFF'}}>👆 Esto es exactamente lo que verá tu invitada cuando abra el link</p>
              </div>
            )}
            <div style={{display:'grid',gridTemplateColumns:'1fr 1.4fr'}}>
              {/* Panel izquierdo */}
              <div style={{background:'#0A0A0A',padding:'3rem',display:'flex',flexDirection:'column',justifyContent:'flex-end',minHeight:'520px'}}>
                <div style={{fontSize:'0.55rem',fontWeight:600,letterSpacing:'0.18em',textTransform:'uppercase',color:'#888884',marginBottom:'0.5rem'}}>Boda</div>
                <h2 style={{fontSize:'2.2rem',fontWeight:100,color:'#FFFFFF',letterSpacing:'-0.03em',lineHeight:1.05,marginBottom:'0.4rem'}}>Cris & Pablo</h2>
                <p style={{fontSize:'0.72rem',fontWeight:300,color:'#888884',marginBottom:'2rem'}}>10 de octubre de 2026 · Zahara de los Atunes</p>
                <div style={{height:'1px',background:'rgba(255,255,255,0.08)',marginBottom:'2rem'}}></div>
                <p style={{fontSize:'0.82rem',fontWeight:300,color:'rgba(255,255,255,0.45)',lineHeight:1.8}}>
                  Registra tu look para que<br/>ninguna invitada llegue vestida igual.
                </p>
              </div>
              {/* Formulario */}
              <div style={{padding:'3rem',background:'#FFFFFF'}}>
                <h3 style={{fontSize:'1.5rem',fontWeight:100,color:'#0A0A0A',marginBottom:'0.3rem',letterSpacing:'-0.02em'}}>Tu look</h3>
                <p style={{fontSize:'0.72rem',fontWeight:300,color:'#888884',marginBottom:'2rem'}}>Registra tu outfit para Cris & Pablo</p>

                {/* Nombre */}
                <div style={{marginBottom:'1.25rem'}}>
                  <label style={{display:'block',fontSize:'0.55rem',fontWeight:600,letterSpacing:'0.12em',textTransform:'uppercase',color:'#888884',marginBottom:'0.45rem'}}>
                    Tu nombre <span style={{color:'#C4917C'}}>*</span>
                  </label>
                  <div style={{padding:'0.75rem 1rem',border:'1px solid #E0E0DC',fontSize:'0.8rem',fontWeight:300,color:'#BEBEBA',borderRadius:'4px'}}>Ej: María García</div>
                </div>

                {/* Color */}
                <div style={{marginBottom:'1.25rem'}}>
                  <label style={{display:'block',fontSize:'0.55rem',fontWeight:600,letterSpacing:'0.12em',textTransform:'uppercase',color:'#888884',marginBottom:'0.45rem'}}>
                    Color del look <span style={{color:'#C4917C'}}>*</span>
                  </label>
                  <div style={{display:'flex',flexWrap:'wrap',gap:'0.5rem',padding:'0.75rem',border:'1px solid #E0E0DC',borderRadius:'4px'}}>
                    {COLORES_DEMO.map((c,i) => (
                      <div key={i} className="color-pill"
                        onClick={() => setColorSeleccionado(c.hex)}
                        title={c.nombre}
                        style={{
                          width:'28px',height:'28px',borderRadius:'50%',
                          background:c.hex,
                          border:colorSeleccionado===c.hex?'3px solid #C4917C':'2px solid #E0E0DC',
                          boxShadow:colorSeleccionado===c.hex?'0 0 0 2px white inset':'none',
                        }}>
                      </div>
                    ))}
                  </div>
                  {colorSeleccionado && (
                    <div style={{display:'flex',alignItems:'center',gap:'0.5rem',marginTop:'0.5rem',fontSize:'0.72rem',fontWeight:300,color:'#888884'}}>
                      <div style={{width:'12px',height:'12px',borderRadius:'50%',background:colorSeleccionado,border:'1px solid #E0E0DC'}}></div>
                      {COLORES_DEMO.find(c=>c.hex===colorSeleccionado)?.nombre}
                    </div>
                  )}
                </div>

                {/* Marca */}
                <div style={{marginBottom:'1.25rem'}}>
                  <label style={{display:'block',fontSize:'0.55rem',fontWeight:600,letterSpacing:'0.12em',textTransform:'uppercase',color:'#888884',marginBottom:'0.45rem'}}>
                    Marca <span style={{color:'#C4917C'}}>*</span>
                  </label>
                  <div style={{padding:'0.75rem 1rem',border:'1px solid #E0E0DC',fontSize:'0.8rem',fontWeight:300,color:'#BEBEBA',borderRadius:'4px'}}>Ej: Zara, Mango, Massimo Dutti...</div>
                </div>

                {/* Modelo */}
                <div style={{marginBottom:'1.25rem'}}>
                  <label style={{display:'block',fontSize:'0.55rem',fontWeight:600,letterSpacing:'0.12em',textTransform:'uppercase',color:'#888884',marginBottom:'0.45rem'}}>
                    Modelo / Referencia
                  </label>
                  <div style={{padding:'0.75rem 1rem',border:'1px solid #E0E0DC',fontSize:'0.8rem',fontWeight:300,color:'#BEBEBA',borderRadius:'4px'}}>Ej: Vestido Rosalía, ref. 1234...</div>
                </div>

                {/* Tipo de prenda */}
                <div style={{marginBottom:'1.25rem'}}>
                  <label style={{display:'block',fontSize:'0.55rem',fontWeight:600,letterSpacing:'0.12em',textTransform:'uppercase',color:'#888884',marginBottom:'0.45rem'}}>
                    Tipo de prenda
                  </label>
                  <div style={{display:'flex',gap:'0.5rem',flexWrap:'wrap'}}>
                    {['Vestido corto','Vestido midi','Vestido largo','Mono','Falda y top','Traje'].map((t,i) => (
                      <div key={i} style={{padding:'0.4rem 0.85rem',border:'1px solid #E0E0DC',fontSize:'0.68rem',fontWeight:300,color:'#888884',borderRadius:'20px',cursor:'pointer'}}>{t}</div>
                    ))}
                  </div>
                </div>

                {/* Foto */}
                <div style={{marginBottom:'1.5rem'}}>
                  <label style={{display:'block',fontSize:'0.55rem',fontWeight:600,letterSpacing:'0.12em',textTransform:'uppercase',color:'#888884',marginBottom:'0.45rem'}}>
                    Foto del look (opcional)
                  </label>
                  <div style={{padding:'1.25rem',border:'1.5px dashed #E0E0DC',borderRadius:'4px',textAlign:'center',cursor:'pointer'}}>
                    <div style={{fontSize:'0.75rem',fontWeight:300,color:'#BEBEBA'}}>Arrastra una foto o haz clic para subir</div>
                    <div style={{fontSize:'0.6rem',fontWeight:300,color:'#D0D0CC',marginTop:'0.25rem'}}>JPG, PNG · máx 5MB</div>
                  </div>
                </div>

                {/* Prerreserva */}
                <div style={{marginBottom:'1.5rem',display:'flex',alignItems:'flex-start',gap:'0.75rem',padding:'0.85rem',background:'#F7F7F5',borderRadius:'4px'}}>
                  <div style={{width:'16px',height:'16px',border:'1.5px solid #E0E0DC',borderRadius:'3px',flexShrink:0,marginTop:'1px'}}></div>
                  <div>
                    <div style={{fontSize:'0.75rem',fontWeight:500,color:'#0A0A0A',marginBottom:'0.2rem'}}>Prerreservar este look</div>
                    <div style={{fontSize:'0.68rem',fontWeight:300,color:'#888884',lineHeight:1.6}}>Todavía no lo he comprado pero quiero reservarlo. Nadie más podrá registrar este mismo look.</div>
                  </div>
                </div>

                <button style={{width:'100%',padding:'0.9rem',background:'#0A0A0A',color:'#FFFFFF',border:'none',cursor:'pointer',fontFamily:'Poppins,sans-serif',fontSize:'0.8rem',fontWeight:600,borderRadius:'4px',letterSpacing:'0.02em'}}>
                  Registrar mi look →
                </button>
              </div>
            </div>
          </div>

          {/* TABLA */}
          <div ref={tablaRef} style={{...highlightStyle('tabla'),background:'#FFFFFF',border:'1px solid #E0E0DC',borderRadius:'8px',overflow:'hidden'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'1.5rem 2rem',borderBottom:'1px solid #E0E0DC'}}>
              <div>
                <span style={{fontSize:'0.88rem',fontWeight:600,color:'#0A0A0A'}}>5 looks registrados</span>
                {conflictos > 0 && <span style={{marginLeft:'0.75rem',fontSize:'0.6rem',fontWeight:600,background:'#FEE2E5',color:'#F07987',padding:'0.2rem 0.6rem',borderRadius:'20px'}}>{conflictos} conflicto</span>}
              </div>
              <button style={{fontSize:'0.62rem',fontWeight:500,padding:'0.5rem 1.25rem',background:'transparent',color:'#0A0A0A',border:'1px solid #0A0A0A',cursor:'pointer',fontFamily:'Poppins,sans-serif',borderRadius:'4px'}}>
                Exportar CSV
              </button>
            </div>
            <div style={{overflowX:'auto'}}>
              <table style={{width:'100%',borderCollapse:'collapse',minWidth:'600px'}}>
                <thead>
                  <tr style={{background:'#F7F7F5'}}>
                    {['Color','Nombre','Marca','Modelo','Tipo','Estado'].map((h,i) => (
                      <th key={i} style={{fontSize:'0.55rem',fontWeight:600,letterSpacing:'0.12em',textTransform:'uppercase',color:'#888884',textAlign:'left',padding:'0.75rem 1.25rem',borderBottom:'1px solid #E0E0DC'}}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {LOOKS_DEMO.map((row,i) => (
                    <tr key={i} className="look-row" style={{borderBottom:'1px solid #E0E0DC',background:row.conflicto?'#FFF5F6':'#FFFFFF',transition:'background 0.15s'}}>
                      <td style={{padding:'1rem 1.25rem'}}>
                        <div style={{display:'flex',alignItems:'center',gap:'0.5rem'}}>
                          <span style={{width:'20px',height:'20px',borderRadius:'50%',background:row.hex,border:'1px solid #E0E0DC',display:'inline-block',flexShrink:0}}></span>
                          {row.conflicto && <span style={{fontSize:'0.55rem',color:'#F07987'}}>⚠</span>}
                        </div>
                      </td>
                      <td style={{padding:'1rem 1.25rem',fontSize:'0.78rem',fontWeight:500,color:row.conflicto?'#F07987':'#0A0A0A'}}>{row.nombre}</td>
                      <td style={{padding:'1rem 1.25rem',fontSize:'0.78rem',fontWeight:300,color:'#0A0A0A'}}>{row.marca}</td>
                      <td style={{padding:'1rem 1.25rem',fontSize:'0.78rem',fontWeight:300,color:'#0A0A0A'}}>{row.modelo}</td>
                      <td style={{padding:'1rem 1.25rem',fontSize:'0.78rem',fontWeight:300,color:'#888884'}}>{row.tipo}</td>
                      <td style={{padding:'1rem 1.25rem'}}>
                        {row.conflicto ? (
                          <span style={{fontSize:'0.55rem',fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',padding:'0.25rem 0.65rem',background:'#FEE2E5',color:'#F07987',borderRadius:'20px'}}>Conflicto</span>
                        ) : (
                          <span style={{fontSize:'0.55rem',fontWeight:600,letterSpacing:'0.1em',textTransform:'uppercase',padding:'0.25rem 0.65rem',background:row.estado==='confirmado'?'#EEF4E8':'#F5EDE8',color:row.estado==='confirmado'?'#4A6B42':'#C4917C',borderRadius:'20px'}}>{row.estado}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {isHighlighted('tabla') && (
              <div style={{padding:'0.75rem 1.25rem',background:'#FFF8F5',borderTop:'1px solid #E0E0DC'}}>
                <p style={{fontSize:'0.65rem',fontWeight:300,color:'#C4917C'}}>👆 Los conflictos aparecen marcados en rojo. Puedes exportar la lista completa en cualquier momento.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}