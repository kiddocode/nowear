export default function NuevoEvento() {
  return (
    <div style={{display:'grid',gridTemplateColumns:'220px 1fr',minHeight:'calc(100vh - 68px)'}}>

      {/* SIDEBAR */}
      <aside style={{borderRight:'1px solid #E0E0DC',padding:'2rem 0',display:'flex',flexDirection:'column',background:'#FFFFFF',position:'sticky',top:'68px',height:'calc(100vh - 68px)'}}>
        <div style={{marginBottom:'1.5rem'}}>
          <div style={{fontSize:'0.55rem',fontWeight:600,letterSpacing:'0.2em',textTransform:'uppercase',color:'#BEBEBA',padding:'0 1.5rem',marginBottom:'0.5rem'}}>Principal</div>
          <a href="/dashboard" style={{display:'flex',alignItems:'center',gap:'0.65rem',padding:'0.7rem 1.5rem',fontSize:'0.75rem',fontWeight:300,color:'#888884',textDecoration:'none'}}>
            <span style={{width:'5px',height:'5px',borderRadius:'50%',background:'currentColor',flexShrink:0,opacity:0.4}}></span>Mis eventos
          </a>
          <a href="/dashboard/nuevo" style={{display:'flex',alignItems:'center',gap:'0.65rem',padding:'0.7rem 1.5rem',fontSize:'0.75rem',fontWeight:500,color:'#0A0A0A',background:'#F0F0EE',borderLeft:'2px solid #0A0A0A',textDecoration:'none'}}>
            <span style={{width:'5px',height:'5px',borderRadius:'50%',background:'#0A0A0A',flexShrink:0}}></span>Nuevo evento
          </a>
        </div>
        <div style={{marginBottom:'1.5rem'}}>
          <div style={{fontSize:'0.55rem',fontWeight:600,letterSpacing:'0.2em',textTransform:'uppercase',color:'#BEBEBA',padding:'0 1.5rem',marginBottom:'0.5rem'}}>Cuenta</div>
          {['Perfil','Facturación','Ayuda'].map((item,i)=>(
            <a key={i} href="#" style={{display:'flex',alignItems:'center',gap:'0.65rem',padding:'0.7rem 1.5rem',fontSize:'0.75rem',fontWeight:300,color:'#888884',textDecoration:'none'}}>
              <span style={{width:'5px',height:'5px',borderRadius:'50%',background:'currentColor',flexShrink:0,opacity:0.4}}></span>{item}
            </a>
          ))}
        </div>
        <div style={{marginTop:'auto',padding:'1.25rem 1.5rem',borderTop:'1px solid #E0E0DC'}}>
          <div style={{display:'flex',alignItems:'center',gap:'0.75rem'}}>
            <div style={{width:'32px',height:'32px',borderRadius:'50%',background:'#0A0A0A',color:'#FFFFFF',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.62rem',fontWeight:600,flexShrink:0}}>MT</div>
            <div>
              <div style={{fontSize:'0.75rem',fontWeight:500,color:'#0A0A0A'}}>Maria Teresa</div>
              <div style={{fontSize:'0.62rem',fontWeight:300,color:'#888884'}}>1 evento activo</div>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN */}
<main className="nuevo-grid" style={{display:'grid',gridTemplateColumns:'1fr 1fr',minHeight:'calc(100vh - 68px)'}}>
        {/* FORMULARIO */}
<div className="nuevo-form" style={{padding:'3rem',borderRight:'1px solid #E0E0DC'}}>          <div style={{marginBottom:'2.5rem',paddingBottom:'2rem',borderBottom:'1px solid #E0E0DC'}}>
            <h1 style={{fontSize:'2.2rem',fontWeight:200,color:'#0A0A0A',letterSpacing:'-0.025em',lineHeight:1,marginBottom:'0.35rem'}}>Nuevo evento</h1>
            <p style={{fontSize:'0.75rem',fontWeight:300,color:'#888884'}}>Configura tu evento y elige tu plan</p>
          </div>

          <div style={{marginBottom:'1.25rem'}}>
            <label style={{display:'block',fontSize:'0.6rem',fontWeight:600,letterSpacing:'0.12em',textTransform:'uppercase',color:'#888884',marginBottom:'0.55rem'}}>
              Tipo de evento <span style={{color:'#C4917C'}}>*</span>
            </label>
            <select style={{width:'100%',fontFamily:'Poppins,sans-serif',fontSize:'0.82rem',fontWeight:300,padding:'0.9rem 1rem',border:'1px solid #E0E0DC',background:'#FFFFFF',outline:'none',cursor:'pointer',appearance:'none',backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23888884' stroke-width='1.5' fill='none'/%3E%3C/svg%3E")`,backgroundRepeat:'no-repeat',backgroundPosition:'right 1rem center'}}>
              <option value="">Selecciona el tipo...</option>
              <option>Boda</option>
              <option>Bautizo</option>
              <option>Comunión</option>
              <option>Pedida de mano</option>
              <option>Cumpleaños</option>
              <option>Cena de empresa</option>
              <option>Otro</option>
            </select>
          </div>

          <div style={{marginBottom:'1.25rem'}}>
            <label style={{display:'block',fontSize:'0.6rem',fontWeight:600,letterSpacing:'0.12em',textTransform:'uppercase',color:'#888884',marginBottom:'0.55rem'}}>
              Nombre del evento <span style={{color:'#C4917C'}}>*</span>
            </label>
            <input type="text" placeholder="Ej: Boda de Ana & Carlos" style={{width:'100%',fontFamily:'Poppins,sans-serif',fontSize:'0.82rem',fontWeight:300,padding:'0.9rem 1rem',border:'1px solid #E0E0DC',background:'#FFFFFF',outline:'none'}}/>
          </div>

          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem',marginBottom:'1.25rem'}}>
            <div>
              <label style={{display:'block',fontSize:'0.6rem',fontWeight:600,letterSpacing:'0.12em',textTransform:'uppercase',color:'#888884',marginBottom:'0.55rem'}}>
                Fecha <span style={{color:'#C4917C'}}>*</span>
              </label>
              <input type="date" style={{width:'100%',fontFamily:'Poppins,sans-serif',fontSize:'0.82rem',fontWeight:300,padding:'0.9rem 1rem',border:'1px solid #E0E0DC',background:'#FFFFFF',outline:'none'}}/>
            </div>
            <div>
              <label style={{display:'block',fontSize:'0.6rem',fontWeight:600,letterSpacing:'0.12em',textTransform:'uppercase',color:'#888884',marginBottom:'0.55rem'}}>
                Lugar <span style={{color:'#C4917C'}}>*</span>
              </label>
              <input type="text" placeholder="Ciudad o venue" style={{width:'100%',fontFamily:'Poppins,sans-serif',fontSize:'0.82rem',fontWeight:300,padding:'0.9rem 1rem',border:'1px solid #E0E0DC',background:'#FFFFFF',outline:'none'}}/>
            </div>
          </div>

          <div style={{marginBottom:'1.25rem'}}>
            <label style={{display:'block',fontSize:'0.6rem',fontWeight:600,letterSpacing:'0.12em',textTransform:'uppercase',color:'#888884',marginBottom:'0.55rem'}}>
              Número de invitadas <span style={{color:'#C4917C'}}>*</span>
            </label>
            <input type="number" placeholder="Aproximado" style={{width:'100%',fontFamily:'Poppins,sans-serif',fontSize:'0.82rem',fontWeight:300,padding:'0.9rem 1rem',border:'1px solid #E0E0DC',background:'#FFFFFF',outline:'none'}}/>
          </div>

          <div style={{marginBottom:'2.5rem'}}>
            <label style={{display:'block',fontSize:'0.6rem',fontWeight:600,letterSpacing:'0.12em',textTransform:'uppercase',color:'#888884',marginBottom:'0.25rem'}}>
              Colores bloqueados <span style={{fontSize:'0.58rem',fontWeight:300,color:'#BEBEBA',textTransform:'none',letterSpacing:0}}> — opcional</span>
            </label>
            <p style={{fontSize:'0.72rem',fontWeight:300,color:'#BEBEBA',marginBottom:'0.75rem',lineHeight:1.6}}>
              Colores que ninguna invitada podrá registrar.
            </p>
            <input type="text" placeholder="Ej: blanco, crudo, verde botella..." style={{width:'100%',fontFamily:'Poppins,sans-serif',fontSize:'0.82rem',fontWeight:300,padding:'0.9rem 1rem',border:'1px solid #E0E0DC',background:'#FFFFFF',outline:'none'}}/>
          </div>

          <button style={{padding:'0.9rem 2.5rem',fontSize:'0.78rem',fontWeight:500,background:'#0A0A0A',color:'#FFFFFF',border:'none',cursor:'pointer',fontFamily:'Poppins,sans-serif',letterSpacing:'0.03em'}}>
            Continuar y elegir plan →
          </button>
        </div>

        {/* IMAGEN LATERAL */}
<div className="nuevo-img" style={{position:'relative',overflow:'hidden'}}>
            <img
            src="https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=900&q=80"
            alt="Evento"
            style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}}
          />
          <div style={{position:'absolute',inset:0,background:'linear-gradient(to top,rgba(10,10,10,0.75) 0%,rgba(10,10,10,0.1) 60%)',display:'flex',flexDirection:'column',justifyContent:'flex-end',padding:'3rem'}}>
            <p style={{fontSize:'1.3rem',fontWeight:200,color:'#FFFFFF',lineHeight:1.5,letterSpacing:'-0.01em',marginBottom:'1.5rem'}}>
              Cada evento merece<br/>
              <em style={{fontStyle:'italic',color:'#C4917C'}}>su propio vestidor.</em>
            </p>
            <div style={{display:'flex',flexDirection:'column',gap:'0.75rem'}}>
              {['Un link único para tus invitadas','Detección de coincidencias automática','Prerreserva de looks antes de comprar'].map((item,i)=>(
                <div key={i} style={{display:'flex',alignItems:'center',gap:'0.75rem',fontSize:'0.75rem',fontWeight:300,color:'rgba(255,255,255,0.7)'}}>
                  <span style={{width:'4px',height:'4px',borderRadius:'50%',background:'#C4917C',flexShrink:0}}></span>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}