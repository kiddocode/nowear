'use client'
import { useState, useEffect } from 'react'

export default function Home() {
  const [texto, setTexto] = useState('')
  const [fase, setFase] = useState(0)
  const titulo = 'Que nadie llegue\nvestida igual.'

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
  }, [texto, fase])

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
  {name:'Adolfo Domínguez', url:'https://www.adolfodominguez.com', logo:'logo-adolfo.png', zoom:1.8},
  {name:'ASOS', url:'https://www.asos.com/es', logo:'logo-asos.png'},
  {name:'Agua by Agua Bendita', url:'https://www.aguabendita.com', logo:'logo-aguabendita.png'},
  {name:'AVECSTUDIO', url:'https://avec-studio.com', logo:'logo-avec.png'},
  {name:'Basyco Jerez', url:'https://basycojerez.com', logo:'logo-basyco.png'},
  {name:'Baymo', url:'https://www.baymo.com/es', logo:'logo-baymo.png'},
  {name:'Bicolo', url:'https://bicolobrand.com/en', logo:'logo-bicolo.png', zoom:1.6},
  {name:'Bimani', url:'https://www.bimani.es', logo:'logo-bimani.png'},
  {name:'Blanche Vintage', url:'https://www.instagram.com/blanche__vintage/', logo:'logo-blanche.png'},
  {name:'Cardié Moda', url:'https://cardiemoda.com', logo:'logo-cardie.png', zoom:1.6},
  {name:'Caye & Co', url:'https://www.instagram.com/caye.andco/', logo:'logo-caye.png'},
  {name:'Dafonte', url:'https://dafontecollection.com/en', logo:'logo-dafonte.png'},
  {name:'Dahlia Dahlia', url:'https://www.dahliadahlia.com', logo:'logo-dahlia.png'},
  {name:'Dew & Corch', url:'https://www.dewandcorch.com', logo:'logo-dew.png', zoom:1.6},
  {name:'El Corte Inglés', url:'https://www.elcorteingles.es/moda-mujer', logo:'logo-eci.png'},
  {name:'Galü', url:'https://galuathelier.es/en', logo:'logo-galu.png'},
  {name:'Inés Martín Alcalde', url:'https://www.inesmartinalcalde.com', logo:'logo-ines.png', zoom:1.6},
  {name:'Johanna Ortiz', url:'https://www.johannaortiz.com', logo:'logo-johannaortiz.png'},
  {name:'Lozanía', url:'https://lozaniabrand.com', logo:'logo-lozania.png', zoom:1.8},
  {name:'Maje', url:'https://www.maje.com/es', logo:'logo-maje.png'},
  {name:'Mango', url:'https://www.mango.com/es', logo:'logo-mango.png'},
  {name:'Martina Maletti', url:'https://martinamaletti.com/en', logo:'logo-martinamaletti.png'},
  {name:'Massimo Dutti', url:'https://www.massimodutti.com/es', logo:'logo-massimo.png'},
  {name:'Miphai', url:'https://www.miphai.com', logo:'logo-miphai.png'},
  {name:'Nicolett', url:'https://www.nicolettaoficial.com', logo:'logo-nicolett.png', zoom:1.6},
  {name:'Philipa 1970', url:'https://www.philippa1970.com', logo:'logo-philipa.png'},
  {name:'Rental Mode', url:'https://www.rentalmode.com', logo:'logo-rentalmode.png', zoom:1.6},
  {name:'Sandra Rosa', url:'https://www.sandrarosa.es', logo:'logo-sandrarosa.png'},
  {name:'Santa Bato', url:'https://santabato.com', logo:'logo-santabato.png'},
  {name:'Sandro', url:'https://www.sandro-paris.com/es', logo:'logo-sandro.png'},
  {name:'Stradivarius', url:'https://www.stradivarius.com/es', logo:'logo-stradivarius.png'},
  {name:'t.ba', url:'https://www.tbalife.com/en-es', logo:'logo-tba.png'},
  {name:'The IQ Collection', url:'https://theiqcollection.com', logo:'logo-iq.png'},
  {name:'Vogana', url:'https://www.vogana.es', logo:'logo-vogana.png'},
  {name:'Zara', url:'https://www.zara.com/es', logo:'logo-zara.png'},
  {name:'+ Sugerir marca', url:'/#contacto', logo:null},
]

  return (
    <>
      {/* HERO */}
      <section className="hero-grid" style={{display:'grid',gridTemplateColumns:'1fr 1fr',minHeight:'calc(100vh - 68px)'}}>
        <div className="hero-left" style={{display:'flex',flexDirection:'column',justifyContent:'center',padding:'6rem 5rem 6rem 3rem'}}>
          <span style={{display:'inline-flex',alignItems:'center',gap:'0.6rem',fontSize:'0.62rem',fontWeight:500,letterSpacing:'0.16em',textTransform:'uppercase',color:'#F07987',marginBottom:'2.5rem'}}>
            <span style={{width:'24px',height:'1px',background:'#F07987',display:'inline-block'}}></span>
            Bodas · Comuniones · Bautizos · Eventos
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
            Crea tu evento, comparte el link con tus invitadas y deja que cada una registre su look.<br/>
            El sistema detecta coincidencias al instante.
          </p>
          <div style={{display:'flex',gap:'1rem',flexWrap:'wrap',opacity:fase>=1?1:0,transition:'opacity 0.6s ease 0.3s'}}>
            <a href="/register" style={{fontSize:'0.85rem',fontWeight:500,padding:'1rem 2.5rem',background:'#0A0A0A',color:'#FFFFFF',textDecoration:'none',borderRadius:'4px'}}>Crear mi evento</a>
            <a href="/demo/organizadora" style={{fontSize:'0.85rem',fontWeight:500,padding:'1rem 2.5rem',border:'1.5px solid #0A0A0A',color:'#0A0A0A',textDecoration:'none',borderRadius:'4px'}}>Ver demo</a>
          </div>
        </div>
        <div className="hero-img-col" style={{position:'relative',overflow:'hidden'}}>
          <img src="https://qhuatexjyxbunotvghjh.supabase.co/storage/v1/object/public/fotos/pexels-ainnnek-251119282-20390920.jpg" alt="Invitadas de boda" style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:'center top',display:'block'}}/>
          <div style={{position:'absolute',inset:0,background:'linear-gradient(to top, rgba(10,10,10,0.4) 0%, rgba(10,10,10,0.0) 50%)',display:'flex',flexDirection:'column',justifyContent:'flex-end',padding:'3rem'}}>
            <p style={{fontSize:'1.3rem',fontWeight:700,color:'#FFFFFF',lineHeight:1.4,margin:0,textShadow:'0 2px 12px rgba(0,0,0,0.3)'}}>
              Cada invitada llega<br/>
              <em style={{fontStyle:'italic',color:'#F07987',fontWeight:700}}>con su look único.</em>
            </p>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        .marca-card:hover { background: #F7F7F5 !important; }
      `}</style>

      {/* CÓMO FUNCIONA */}
      <section id="como" className="section-pad" style={{padding:'7rem 3rem'}}>
        <span style={{display:'flex',alignItems:'center',gap:'0.6rem',fontSize:'0.6rem',fontWeight:600,letterSpacing:'0.18em',textTransform:'uppercase',color:'#F07987',marginBottom:'1.75rem'}}>
          <span style={{width:'24px',height:'1px',background:'#F07987'}}></span>El proceso
        </span>
        <h2 style={{fontSize:'clamp(2.5rem,4vw,4.5rem)',fontWeight:100,lineHeight:1.08,letterSpacing:'-0.025em',marginBottom:'1.25rem'}}>
          Tres pasos.<br/><strong style={{fontWeight:700}}>Sin complicaciones.</strong>
        </h2>
        <p style={{fontSize:'0.9rem',fontWeight:300,lineHeight:2,color:'#888884',maxWidth:'600px',marginBottom:'4rem'}}>
          Diseñado para que la organizadora no tenga que hacer nada más que compartir un link.
        </p>
        <div className="steps-grid" style={{display:'grid',gridTemplateColumns:'1fr 1fr',border:'1px solid #E0E0DC'}}>
          <div className="steps-img-col" style={{position:'relative',overflow:'hidden',minHeight:'480px'}}>
            <img src="https://qhuatexjyxbunotvghjh.supabase.co/storage/v1/object/public/fotos/samantha-gades-ermkZ9xvhdU-unsplash.jpg" alt="Invitadas" style={{width:'100%',height:'100%',objectFit:'cover',position:'absolute',inset:0}}/>
            <div style={{position:'absolute',inset:0,background:'linear-gradient(135deg,rgba(10,10,10,0.55) 0%,rgba(10,10,10,0.15) 100%)',display:'flex',alignItems:'flex-end',padding:'2.5rem'}}>
              <p style={{fontSize:'1.4rem',fontWeight:700,color:'#FFFFFF',lineHeight:1.45}}>
                Sin apps.<br/>Sin cuentas.<br/><em style={{color:'#F07987',fontStyle:'normal'}}>Solo el link.</em>
              </p>
            </div>
          </div>
          <div style={{borderLeft:'1px solid #E0E0DC'}}>
            {[
              {n:'01',title:'Crea tu evento',body:'Registra tu boda, comunión, bautizo o cualquier celebración. Elige cuándo abrir el registro y selecciona tu plan.'},
              {n:'02',title:'Comparte el link',body:'Cada evento tiene un link único. Pásalo por WhatsApp, ponlo en tu web de boda o mándalo por email. Tus invitadas entran sin registrarse.'},
              {n:'03',title:'Sin coincidencias',body:'Cada invitada registra su marca, modelo y color. Si alguien elige un look ya registrado, le salta un aviso inmediato.'},
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
      </section>

      {/* PRICING */}
      <section id="precios" className="section-pad" style={{padding:'7rem 3rem',background:'#F7F7F5'}}>
        <span style={{display:'flex',alignItems:'center',gap:'0.6rem',fontSize:'0.6rem',fontWeight:600,letterSpacing:'0.18em',textTransform:'uppercase',color:'#F07987',marginBottom:'1.75rem'}}>
          <span style={{width:'24px',height:'1px',background:'#F07987'}}></span>Planes
        </span>
        <h2 style={{fontSize:'clamp(2.5rem,4vw,4.5rem)',fontWeight:100,lineHeight:1.08,letterSpacing:'-0.025em',marginBottom:'1.25rem'}}>
          Un pago único.<br/><strong style={{fontWeight:700}}>Por evento.</strong>
        </h2>
        <p style={{fontSize:'0.9rem',fontWeight:300,lineHeight:1.9,color:'#888884',maxWidth:'540px',marginBottom:'4rem'}}>
          Sin suscripciones. Sin sorpresas. Pagas una vez y tienes tu evento activo hasta el día de la celebración.<br/>
          <span style={{color:'#0A0A0A',fontWeight:400}}>Hazle este regalo a tus invitadas. Ellas llegan seguras, tú disfrutas tranquila. Sin esfuerzo, sin dramas, sin coincidencias.</span>
        </p>
        <div className="pricing-grid" style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'1px',background:'#E0E0DC',border:'1px solid #E0E0DC'}}>
          {[
            {plan:'Básico',planKey:'basico',sub:'1 mes antes',price:'9',desc:'El registro abre 1 mes antes del evento. Ideal para planificación corta.',feats:['Link único para invitadas','Detección de coincidencias','Prerreserva de looks','Colores bloqueados'],featured:false,enterprise:false},
            {plan:'Estándar',planKey:'estandar',sub:'3 meses antes',price:'19',desc:'El registro abre 3 meses antes del evento. Tiempo suficiente para todas.',feats:['Todo lo del plan Básico','Exportar lista de looks','Soporte prioritario por email'],featured:true,enterprise:false},
            {plan:'Premium',planKey:'premium',sub:'Sin límite de tiempo',price:'29',desc:'El registro abre cuando quieras, sin límite de tiempo. Para las más organizadas.',feats:['Todo lo anterior','Acceso anticipado a nuevas funciones','Link de invitada personalizado'],featured:false,enterprise:false},
            {plan:'Enterprise',planKey:null,sub:'A medida',price:null,desc:'Solución personalizada para empresas y eventos recurrentes.',feats:['Múltiples eventos','Cuenta de empresa','Tarifa anual','Desarrollo ad-hoc','Soporte dedicado'],featured:false,enterprise:true},
          ].map((p,i)=>(
            <div key={i} style={{background:p.enterprise?'#F7F7F5':p.featured?'#0A0A0A':'#FFFFFF',padding:'2.5rem 2rem',position:'relative',border:p.enterprise?'2px dashed #C4C4C0':'none',boxSizing:'border-box'}}>
              {p.featured && <span style={{fontSize:'0.52rem',fontWeight:600,letterSpacing:'0.15em',textTransform:'uppercase',background:'#F07987',color:'#FFFFFF',padding:'0.22rem 0.65rem',display:'inline-block',marginBottom:'1.25rem'}}>Más popular</span>}
              {p.enterprise && <span style={{fontSize:'0.52rem',fontWeight:600,letterSpacing:'0.15em',textTransform:'uppercase',background:'#0A0A0A',color:'#FFFFFF',padding:'0.22rem 0.65rem',display:'inline-block',marginBottom:'1.25rem'}}>Enterprise</span>}
              <div style={{fontSize:'0.6rem',fontWeight:600,letterSpacing:'0.14em',textTransform:'uppercase',color:'#888884',marginBottom:'0.25rem'}}>{p.plan}</div>
              <div style={{fontSize:'0.55rem',fontWeight:400,letterSpacing:'0.1em',textTransform:'uppercase',color:'#F07987',marginBottom:'0.85rem'}}>{p.sub}</div>
              {p.price ? (
                <div style={{fontSize:'4rem',fontWeight:100,lineHeight:1,letterSpacing:'-0.04em',marginBottom:'0.5rem',color:p.featured?'#FFFFFF':'#0A0A0A'}}>
                  <sup style={{fontSize:'1.25rem',fontWeight:300,verticalAlign:'super'}}>€</sup>{p.price}
                </div>
              ) : (
                <div style={{fontSize:'2rem',fontWeight:100,lineHeight:1,letterSpacing:'-0.02em',marginBottom:'0.5rem',color:'#0A0A0A',paddingTop:'0.75rem'}}>Contactar</div>
              )}
              <div style={{fontSize:'0.78rem',fontWeight:300,lineHeight:1.8,color:'#888884',margin:'1.5rem 0',paddingTop:'1.5rem',borderTop:`1px solid ${p.featured?'#3A3A38':'#E0E0DC'}`}}>{p.desc}</div>
              {p.feats.map((f,j)=>(
                <div key={j} style={{display:'flex',gap:'0.55rem',fontSize:'0.78rem',fontWeight:300,color:p.featured?'#888884':'#3A3A38',marginBottom:'0.55rem'}}>
                  <span style={{color:'#F07987',flexShrink:0}}>✓</span>{f}
                </div>
              ))}
              {p.enterprise ? (
                <a href="/#contacto" style={{display:'block',textAlign:'center',marginTop:'2rem',padding:'0.9rem',fontSize:'0.82rem',fontWeight:500,background:'transparent',color:'#0A0A0A',border:'1.5px solid #0A0A0A',textDecoration:'none',borderRadius:'4px'}}>Contactar →</a>
              ) : (
                <button onClick={()=>handlePago(p.planKey)} style={{display:'block',width:'100%',textAlign:'center',marginTop:'2rem',padding:'0.9rem',fontSize:'0.82rem',fontWeight:500,background:p.featured?'#F07987':'transparent',color:p.featured?'#FFFFFF':'#0A0A0A',border:p.featured?'none':'1.5px solid #0A0A0A',cursor:'pointer',fontFamily:"'Poppins',sans-serif",borderRadius:'4px'}}>Empezar</button>
              )}
            </div>
          ))}
        </div>
        {/* DISCLAIMER PRECIOS */}
        <p style={{fontSize:'0.65rem',fontWeight:300,color:'#888884',lineHeight:1.7,marginTop:'1.5rem',maxWidth:'640px'}}>
          Pago único por evento, sin suscripciones. No se realizan reembolsos una vez activado el plan. No es posible hacer downgrade a un plan inferior. Puedes mejorar a un plan superior pagando únicamente la diferencia. Consulta nuestros <a href="/terminos" style={{color:'#C4917C',textDecoration:'underline'}}>términos y condiciones</a>.
        </p>
      </section>

      {/* INSPIRACIÓN / MARCAS */}
      <section id="marcas" className="section-pad" style={{padding:'7rem 3rem'}}>
        <span style={{display:'flex',alignItems:'center',gap:'0.6rem',fontSize:'0.6rem',fontWeight:600,letterSpacing:'0.18em',textTransform:'uppercase',color:'#F07987',marginBottom:'1.75rem'}}>
          <span style={{width:'24px',height:'1px',background:'#F07987'}}></span>Inspiración
        </span>
        <h2 style={{fontSize:'clamp(2.5rem,4vw,4.5rem)',fontWeight:100,lineHeight:1.08,letterSpacing:'-0.025em',marginBottom:'1.25rem'}}>
          Tu look perfecto<br/><strong style={{fontWeight:700}}>te está esperando.</strong>
        </h2>
        <p style={{fontSize:'0.9rem',fontWeight:300,lineHeight:2,color:'#888884',maxWidth:'480px',marginBottom:'4rem'}}>
          Estas son las marcas favoritas de las invitadas.
        </p>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))',gap:'1px',background:'#E0E0DC',border:'1px solid #E0E0DC'}}>
          {marcas.map((brand,i)=>{
            const isSuggest = brand.url === '/#contacto'
            return (
              <a key={i} href={brand.url} target={brand.url.startsWith('http')?'_blank':'_self'} rel="noopener noreferrer" className="marca-card" style={{background:'#FFFFFF',padding:'1.5rem 1rem',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:'0.5rem',minHeight:'130px',textAlign:'center',textDecoration:'none',transition:'background 0.15s'}}>
                {isSuggest ? (
                  <>
                    <span style={{width:'36px',height:'36px',borderRadius:'50%',background:'#F07987',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.2rem',color:'#FFFFFF',fontWeight:300}}>+</span>
                    <span style={{fontSize:'0.75rem',fontWeight:500,color:'#F07987'}}>Sugerir marca</span>
                  </>
                ) : (
                  <>
                    <img src={`${SUPABASE}${brand.logo}`} alt={brand.name} style={{height:'60px',maxWidth:'150px',objectFit:'contain',filter:'grayscale(1)',opacity:0.75,transform:`scale(${brand.zoom||1})`,transition:'transform 0.15s'}}/>
                  </>
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
              <span style={{width:'24px',height:'1px',background:'#F07987'}}></span>FAQ
            </span>
            <h2 style={{fontSize:'clamp(2.5rem,4vw,4.5rem)',fontWeight:100,lineHeight:1.08,letterSpacing:'-0.025em',marginBottom:'1rem'}}>
              Todo lo que<br/><strong style={{fontWeight:700}}>necesitas saber.</strong>
            </h2>
            <p style={{fontSize:'0.85rem',fontWeight:300,lineHeight:2,color:'#888884',marginTop:'1rem'}}>
              ¿Más preguntas?<br/>
              <a href="mailto:support@nowear.es" style={{color:'#F07987',textDecoration:'none'}}>support@nowear.es</a>
            </p>
          </div>
          <div>
            {[
              {q:'¿Necesitan registrarse mis invitadas?',a:'No. Tus invitadas entran directamente a través del link que les mandas. No tienen que crearse ninguna cuenta ni descargar ninguna app.'},
              {q:'¿Qué pasa si dos invitadas quieren llevar lo mismo?',a:'El sistema avisa a la segunda invitada al instante cuando intenta registrar un look que ya está cogido. Nadie tiene más derecho que nadie, solo quien registró antes.'},
              {q:'¿Qué es la prerreserva de looks?',a:'Significa que has visto un look pero todavía no lo has comprado. Nadie más puede registrar ese mismo look mientras tengas tu prerreserva activa.'},
              {q:'¿Funciona para otros eventos además de bodas?',a:'Sí. Nowear funciona para bodas, comuniones, bautizos, pedidas, cumpleaños y cualquier evento donde quieras evitar coincidencias.'},
              {q:'¿Puedo bloquear colores específicos?',a:'Sí. Al crear tu evento puedes definir colores bloqueados: blanco para la novia, o el color de algún familiar especial.'},
              {q:'¿Cómo funciona el pago?',a:'Es un pago único por evento. Aceptamos tarjeta, Apple Pay y Google Pay. Sin suscripciones ni sorpresas.'},
            ].map((item,i)=>(
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
              ¿Alguna<br/><strong style={{fontWeight:700}}>pregunta?</strong>
            </h2>
            <p style={{fontSize:'0.85rem',fontWeight:300,color:'#888884',lineHeight:1.9,marginBottom:'1.5rem'}}>
              Estamos aquí para ayudarte. Te respondemos en menos de 24 horas.
            </p>
            <a href="mailto:support@nowear.es" style={{fontSize:'0.85rem',fontWeight:400,color:'#F07987',textDecoration:'none'}}>support@nowear.es</a>
          </div>
        </div>
        <div style={{padding:'5rem 4rem',background:'#F7F7F5'}}>
          {['Tu nombre','Email'].map((label,i)=>(
            <div key={i} style={{marginBottom:'1.25rem'}}>
              <label style={{display:'block',fontSize:'0.6rem',fontWeight:600,letterSpacing:'0.12em',textTransform:'uppercase',color:'#888884',marginBottom:'0.55rem'}}>{label}</label>
              <input type={i===1?'email':'text'} style={{width:'100%',fontFamily:'Poppins,sans-serif',fontSize:'0.85rem',fontWeight:300,padding:'0.9rem 1rem',border:'1px solid #E0E0DC',background:'#FFFFFF',outline:'none',boxSizing:'border-box'}}/>
            </div>
          ))}
          <div style={{marginBottom:'1.25rem'}}>
            <label style={{display:'block',fontSize:'0.6rem',fontWeight:600,letterSpacing:'0.12em',textTransform:'uppercase',color:'#888884',marginBottom:'0.55rem'}}>Mensaje</label>
            <textarea style={{width:'100%',fontFamily:'Poppins,sans-serif',fontSize:'0.85rem',fontWeight:300,padding:'0.9rem 1rem',border:'1px solid #E0E0DC',background:'#FFFFFF',outline:'none',minHeight:'100px',resize:'vertical',boxSizing:'border-box'}}/>
          </div>
          <button style={{width:'100%',padding:'0.9rem',fontSize:'0.85rem',fontWeight:500,background:'#0A0A0A',color:'#FFFFFF',border:'none',cursor:'pointer',fontFamily:'Poppins,sans-serif',borderRadius:'4px'}}>Enviar mensaje</button>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{background:'#0A0A0A',padding:'5rem 3rem 2.5rem'}}>
        <div className="footer-grid" style={{display:'grid',gridTemplateColumns:'2fr 1fr 1fr 1fr',gap:'3rem',marginBottom:'4rem'}}>
          <div>
            <img src="https://qhuatexjyxbunotvghjh.supabase.co/storage/v1/object/public/fotos/nowear_logo_white.png" alt="NOWEAR" style={{height:'36px',marginBottom:'1.25rem',display:'block'}}/>
            <p style={{fontSize:'0.78rem',fontWeight:300,color:'#888884',lineHeight:1.85,maxWidth:'260px',letterSpacing:'0.5px'}}>La plataforma para que ninguna invitada llegue vestida igual.</p>
          </div>
          {[
            {title:'Producto',links:[
              {label:'Cómo funciona',href:'/#como'},
              {label:'Paquetes',href:'/#precios'},
              {label:'Inspiración',href:'/#marcas'},
              {label:'Preguntas frecuentes',href:'/#faq'},
              {label:'Crear evento',href:'/register'},
            ]},
            {title:'Soporte',links:[
              {label:'Contacto',href:'/#contacto'},
              {label:'Política de privacidad',href:'/privacidad'},
              {label:'Términos de uso',href:'/terminos'},
              {label:'Protección de datos',href:'/datos'},
            ]},
            {title:'Idioma',links:[
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
          <span style={{fontSize:'0.65rem',fontWeight:300,color:'#3A3A38'}}>© 2026 Nowear. Todos los derechos reservados.</span>
          <span style={{fontSize:'0.65rem',fontWeight:300,color:'#3A3A38'}}>support@nowear.es</span>
        </div>
      </footer>
    </>
  )
}