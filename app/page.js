export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="hero-grid" style={{display:'grid',gridTemplateColumns:'1fr 1fr',minHeight:'calc(100vh - 68px)'}}>
        <div className="hero-left" style={{display:'flex',flexDirection:'column',justifyContent:'center',padding:'6rem 5rem 6rem 3rem'}}>
          <span style={{display:'inline-flex',alignItems:'center',gap:'0.6rem',fontSize:'0.62rem',fontWeight:500,letterSpacing:'0.16em',textTransform:'uppercase',color:'#F07987',marginBottom:'2.5rem'}}>
            <span style={{width:'24px',height:'1px',background:'#F07987',display:'inline-block'}}></span>
            Bodas · Comuniones · Bautizos · Eventos
          </span>
          <h1 style={{fontSize:'clamp(3.5rem,5.5vw,6.5rem)',fontWeight:100,lineHeight:1.06,letterSpacing:'-0.03em',marginBottom:'2rem'}}>
            Que nadie llegue<br/>
            <strong style={{fontWeight:700}}>vestida igual.</strong>
          </h1>
          <p style={{fontSize:'0.95rem',fontWeight:300,lineHeight:2,color:'#888884',maxWidth:'420px',marginBottom:'3rem'}}>
            Crea tu evento, comparte el link con tus invitadas y deja que cada una registre su look. El sistema detecta coincidencias al instante.
          </p>
          <div style={{display:'flex',gap:'1rem',flexWrap:'wrap'}}>
            <a href="/register" style={{fontSize:'0.85rem',fontWeight:500,padding:'1rem 2.5rem',background:'#0A0A0A',color:'#FFFFFF',textDecoration:'none',borderRadius:'4px'}}>Crear mi evento</a>
            <a href="/demo/organizadora" style={{fontSize:'0.85rem',fontWeight:500,padding:'1rem 2.5rem',border:'1.5px solid #0A0A0A',color:'#0A0A0A',textDecoration:'none',borderRadius:'4px'}}>Ver demo</a>
          </div>
        </div>
        <div className="hero-img-col" style={{position:'relative',overflow:'hidden'}}>
          <img
            src="https://qhuatexjyxbunotvghjh.supabase.co/storage/v1/object/public/fotos/pexels-ainnnek-251119282-20390920.jpg"
            alt="Invitadas de boda"
            style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:'center top',display:'block'}}
          />
          <div style={{position:'absolute',inset:0,background:'linear-gradient(to top, rgba(10,10,10,0.5) 0%, rgba(10,10,10,0.05) 60%)',display:'flex',flexDirection:'column',justifyContent:'flex-end',padding:'3rem'}}>
            <div style={{background:'rgba(255,255,255,0.92)',padding:'1.25rem 1.5rem',maxWidth:'320px'}}>
              <p style={{fontSize:'1.1rem',fontWeight:300,color:'#0A0A0A',lineHeight:1.5,margin:0}}>
                Cada invitada llega<br/>
                <em style={{fontStyle:'italic',color:'#F07987',fontWeight:400}}>con su look único.</em>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CÓMO FUNCIONA */}
      <section id="como" className="section-pad" style={{padding:'7rem 3rem'}}>
        <span style={{display:'flex',alignItems:'center',gap:'0.6rem',fontSize:'0.6rem',fontWeight:600,letterSpacing:'0.18em',textTransform:'uppercase',color:'#F07987',marginBottom:'1.75rem'}}>
          <span style={{width:'24px',height:'1px',background:'#F07987'}}></span>El proceso
        </span>
        <h2 style={{fontSize:'clamp(2.5rem,4vw,4.5rem)',fontWeight:100,lineHeight:1.08,letterSpacing:'-0.025em',marginBottom:'1.25rem'}}>
          Tres pasos.<br/><strong style={{fontWeight:700}}>Sin complicaciones.</strong>
        </h2>
        <p style={{fontSize:'0.9rem',fontWeight:300,lineHeight:2,color:'#888884',maxWidth:'480px',marginBottom:'4rem'}}>
          Diseñado para que la organizadora no tenga que hacer nada más que compartir un link.
        </p>
        <div className="steps-grid" style={{display:'grid',gridTemplateColumns:'1fr 1fr',border:'1px solid #E0E0DC'}}>
          <div className="steps-img-col" style={{position:'relative',overflow:'hidden',minHeight:'480px'}}>
            <img src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80" alt="Invitadas" style={{width:'100%',height:'100%',objectFit:'cover',position:'absolute',inset:0}}/>
            <div style={{position:'absolute',inset:0,background:'linear-gradient(135deg,rgba(10,10,10,0.5) 0%,rgba(10,10,10,0.15) 100%)',display:'flex',alignItems:'flex-end',padding:'2.5rem'}}>
              <p style={{fontSize:'1.4rem',fontWeight:200,color:'#FFFFFF',lineHeight:1.45}}>
                Sin apps.<br/>Sin cuentas.<br/><em style={{color:'#F07987'}}>Solo el link.</em>
              </p>
            </div>
          </div>
          <div style={{borderLeft:'1px solid #E0E0DC'}}>
            {[
              {n:'01',title:'Crea tu evento',body:'Registra tu boda, comunión, bautizo o cualquier celebración. Elige cuánto tiempo antes quieres abrir el registro y selecciona tu plan.'},
              {n:'02',title:'Comparte el link',body:'Cada evento tiene un link único. Pásalo por WhatsApp, ponlo en tu web de boda o mándalo por email. Tus invitadas entran sin registrarse.'},
              {n:'03',title:'Sin coincidencias',body:'Cada invitada registra su marca, modelo y color. Si alguien elige un look ya registrado, le salta un aviso inmediato.'},
            ].map((s,i)=>(
              <div key={i} style={{padding:'2.5rem',display:'flex',gap:'2rem',borderBottom:i<2?'1px solid #E0E0DC':'none'}}>
                <div style={{fontSize:'2.5rem',fontWeight:100,color:'#E0E0DC',lineHeight:1,flexShrink:0,minWidth:'50px'}}>{s.n}</div>
                <div>
                  <div style={{fontSize:'0.95rem',fontWeight:600,marginBottom:'0.5rem'}}>{s.title}</div>
                  <div style={{fontSize:'0.82rem',fontWeight:300,color:'#888884',lineHeight:1.85}}>{s.body}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="section-pad" style={{padding:'7rem 3rem',background:'#F7F7F5'}}>
        <span style={{display:'flex',alignItems:'center',gap:'0.6rem',fontSize:'0.6rem',fontWeight:600,letterSpacing:'0.18em',textTransform:'uppercase',color:'#F07987',marginBottom:'1.75rem'}}>
          <span style={{width:'24px',height:'1px',background:'#F07987'}}></span>Planes
        </span>
        <h2 style={{fontSize:'clamp(2.5rem,4vw,4.5rem)',fontWeight:100,lineHeight:1.08,letterSpacing:'-0.025em',marginBottom:'1.25rem'}}>
          Un pago único.<br/><strong style={{fontWeight:700}}>Por evento.</strong>
        </h2>
        <p style={{fontSize:'0.9rem',fontWeight:300,lineHeight:2,color:'#888884',maxWidth:'480px',marginBottom:'4rem'}}>
          Sin suscripciones. Sin sorpresas. Pagas una vez y tienes tu evento activo hasta el día de la celebración.
        </p>
        <div className="pricing-grid" style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'1px',background:'#E0E0DC',border:'1px solid #E0E0DC'}}>
          {[
            {plan:'1 mes antes',price:'9',desc:'El registro abre 1 mes antes. Ideal para planificación corta.',feats:['Link único para invitadas','Detección de coincidencias','Prerreserva de looks','Colores bloqueados'],featured:false},
            {plan:'3 meses antes',price:'19',desc:'El registro abre 3 meses antes. Tiempo suficiente para todas.',feats:['Todo lo básico','Recordatorios automáticos','Exportar lista de looks','Soporte prioritario'],featured:true},
            {plan:'6 meses antes',price:'29',desc:'El registro abre 6 meses antes. Para las más organizadas.',feats:['Todo lo anterior','Estadísticas del evento','Marca personalizada','Acceso anticipado'],featured:false},
          ].map((p,i)=>(
            <div key={i} style={{background:p.featured?'#0A0A0A':'#FFFFFF',padding:'2.5rem 2rem',position:'relative'}}>
              {p.featured&&<span style={{fontSize:'0.52rem',fontWeight:600,letterSpacing:'0.15em',textTransform:'uppercase',background:'#F07987',color:'#FFFFFF',padding:'0.22rem 0.65rem',display:'inline-block',marginBottom:'1.25rem'}}>Más popular</span>}
              <div style={{fontSize:'0.6rem',fontWeight:600,letterSpacing:'0.14em',textTransform:'uppercase',color:'#888884',marginBottom:'0.85rem'}}>{p.plan}</div>
              <div style={{fontSize:'4rem',fontWeight:100,lineHeight:1,letterSpacing:'-0.04em',marginBottom:'0.5rem',color:p.featured?'#FFFFFF':'#0A0A0A'}}>
                <sup style={{fontSize:'1.25rem',fontWeight:300,verticalAlign:'super'}}>€</sup>{p.price}
              </div>
              <div style={{fontSize:'0.78rem',fontWeight:300,lineHeight:1.8,color:'#888884',margin:'1.5rem 0',paddingTop:'1.5rem',borderTop:`1px solid ${p.featured?'#3A3A38':'#E0E0DC'}`}}>{p.desc}</div>
              {p.feats.map((f,j)=>(
                <div key={j} style={{display:'flex',gap:'0.55rem',fontSize:'0.78rem',fontWeight:300,color:p.featured?'#888884':'#3A3A38',marginBottom:'0.55rem'}}>
                  <span style={{color:'#F07987',flexShrink:0}}>✓</span>{f}
                </div>
              ))}
              <a href="/register" style={{display:'block',textAlign:'center',marginTop:'2rem',padding:'0.9rem',fontSize:'0.82rem',fontWeight:500,background:p.featured?'#F07987':'transparent',color:p.featured?'#FFFFFF':'#0A0A0A',border:p.featured?'none':'1.5px solid #0A0A0A',textDecoration:'none',borderRadius:'4px'}}>Empezar</a>
            </div>
          ))}
        </div>
      </section>

      {/* MARCAS */}
      <section id="marcas" className="section-pad" style={{padding:'7rem 3rem'}}>
        <span style={{display:'flex',alignItems:'center',gap:'0.6rem',fontSize:'0.6rem',fontWeight:600,letterSpacing:'0.18em',textTransform:'uppercase',color:'#F07987',marginBottom:'1.75rem'}}>
          <span style={{width:'24px',height:'1px',background:'#F07987'}}></span>Marcas populares
        </span>
        <h2 style={{fontSize:'clamp(2.5rem,4vw,4.5rem)',fontWeight:100,lineHeight:1.08,letterSpacing:'-0.025em',marginBottom:'1.25rem'}}>
          Las tiendas que<br/><strong style={{fontWeight:700}}>más se registran.</strong>
        </h2>
        <p style={{fontSize:'0.9rem',fontWeight:300,lineHeight:2,color:'#888884',maxWidth:'480px',marginBottom:'4rem'}}>
          Estas son las marcas favoritas de las invitadas. Pronto podrás enlazar directamente a los modelos.
        </p>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(150px,1fr))',gap:'1px',background:'#E0E0DC',border:'1px solid #E0E0DC'}}>
          {['Zara','Mango','& Other Stories','Sandro','Massimo Dutti','H&M','Stradivarius','Pull&Bear','ASOS','Uterqüe','ba&sh','The Kooples','Maje','Claudie Pierlot','Isabel Marant','Rixo','Reiss','COS','Arket','Jacquemus','Self-Portrait','Ghost','Ted Baker','+ Sugerir marca'].map((brand,i)=>(
            <div key={i} style={{background:'#FFFFFF',padding:'1.75rem 1rem',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.82rem',fontWeight:300,color:'#3A3A38',minHeight:'90px',textAlign:'center',cursor:'default',letterSpacing:'0.02em'}}>
              {brand}
            </div>
          ))}
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
              <span style={{color:'#F07987'}}>support@nowear.es</span>
            </p>
          </div>
          <div>
            {[
              {q:'¿Necesitan registrarse mis invitadas?',a:'No. Tus invitadas entran directamente a través del link que les mandas. No tienen que crearse ninguna cuenta ni descargar ninguna app.'},
              {q:'¿Qué pasa si dos invitadas quieren llevar lo mismo?',a:'El sistema avisa a la segunda invitada al instante cuando intenta registrar un look que ya está cogido. Nadie tiene más derecho que nadie, solo quien registró antes.'},
              {q:'¿Qué es la prerreserva de looks?',a:'Significa que has visto un look pero todavía no lo has comprado. Nadie más puede registrar ese mismo look mientras tengas tu prerreserva activa.'},
              {q:'¿Funciona para otros eventos además de bodas?',a:'Sí. Nowear funciona para bodas, comuniones, bautizos, pedidas, cumpleaños y cualquier evento donde quieras evitar coincidencias.'},
              {q:'¿Puedo bloquear colores específicos?',a:'Sí. Al crear tu evento puedes definir colores bloqueados: blanco para la novia, o el color de algún familiar especial.'},
              {q:'¿Cómo funciona el pago?',a:'Es un pago único por evento. Aceptamos Apple Pay, Google Pay, tarjeta y PayPal. Sin suscripciones ni sorpresas.'},
            ].map((item,i)=>(
              <details key={i} style={{borderBottom:'1px solid #E0E0DC'}}>
                <summary style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'1.5rem 0',fontSize:'0.9rem',fontWeight:400,color:'#0A0A0A',cursor:'pointer',listStyle:'none',letterSpacing:'-0.005em',lineHeight:1.4}}>
                  {item.q}
                  <span style={{fontSize:'1.3rem',fontWeight:100,color:'#BEBEBA',flexShrink:0,marginLeft:'1rem'}}>+</span>
                </summary>
                <p style={{fontSize:'0.82rem',fontWeight:300,color:'#888884',lineHeight:2,paddingBottom:'1.5rem'}}>{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACTO */}
      <section id="contacto" className="contact-grid" style={{display:'grid',gridTemplateColumns:'1fr 1fr'}}>
        <div style={{background:'#0A0A0A',padding:'5rem 4rem',display:'flex',flexDirection:'column',justifyContent:'space-between',minHeight:'400px'}}>
          <div>
            <h2 style={{fontSize:'3.5rem',fontWeight:100,color:'#FFFFFF',lineHeight:1.08,letterSpacing:'-0.025em',marginBottom:'1rem'}}>
              ¿Alguna<br/><strong style={{fontWeight:700}}>pregunta?</strong>
            </h2>
            <p style={{fontSize:'0.85rem',fontWeight:300,color:'#888884',lineHeight:1.9}}>
              Estamos aquí para ayudarte. Te respondemos en menos de 24 horas.
            </p>
          </div>
          <div style={{fontSize:'0.85rem',fontWeight:400,color:'#F07987'}}>support@nowear.es</div>
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
            <div style={{fontSize:'1rem',fontWeight:600,letterSpacing:'0.18em',textTransform:'uppercase',color:'#FFFFFF',marginBottom:'0.5rem'}}>NOWEAR</div>
            <div style={{fontSize:'0.62rem',fontWeight:300,letterSpacing:'0.2em',textTransform:'uppercase',color:'#F07987',marginBottom:'1.25rem'}}>No two looks alike</div>
            <p style={{fontSize:'0.78rem',fontWeight:300,color:'#888884',lineHeight:1.85,maxWidth:'260px'}}>La plataforma para que ninguna invitada llegue vestida igual.</p>
          </div>
          {[
            {title:'Producto',links:['Cómo funciona','Preguntas frecuentes','Marcas','Crear evento']},
            {title:'Soporte',links:['Contacto','Política de privacidad','Términos de uso']},
            {title:'Idioma',links:['🇪🇸 Español','🇬🇧 English','🇵🇹 Português','🇩🇪 Deutsch','🇳🇱 Nederlands']},
          ].map((col,i)=>(
            <div key={i}>
              <div style={{fontSize:'0.58rem',fontWeight:600,letterSpacing:'0.18em',textTransform:'uppercase',color:'#BEBEBA',marginBottom:'1.5rem'}}>{col.title}</div>
              {col.links.map((link,j)=>(
                <div key={j} style={{fontSize:'0.78rem',fontWeight:300,color:'#888884',marginBottom:'0.65rem',cursor:'pointer'}}>{link}</div>
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
