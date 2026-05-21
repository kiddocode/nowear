export default function Login() {
  return (
<div className="auth-grid" style={{display:'grid',gridTemplateColumns:'1fr 1fr',minHeight:'calc(100vh - 68px)'}}>      
<div className="auth-visual" style={{background:'#0A0A0A',position:'relative',overflow:'hidden'}}>        <img
          src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=900&q=80"
          alt=""
          style={{width:'100%',height:'100%',objectFit:'cover',position:'absolute',inset:0,opacity:0.4}}
        />
        <div style={{position:'relative',zIndex:2,padding:'5rem 4rem',height:'100%',display:'flex',flexDirection:'column',justifyContent:'flex-end'}}>
          <h2 style={{fontSize:'3rem',fontWeight:100,color:'#FFFFFF',lineHeight:1.05,letterSpacing:'-0.025em',marginBottom:'1rem'}}>
            Bienvenida<br/><em style={{fontStyle:'italic',color:'#C4917C'}}>de nuevo.</em>
          </h2>
          <p style={{fontSize:'0.8rem',fontWeight:300,color:'#888884',lineHeight:1.85,maxWidth:'340px'}}>
            Tu evento te espera. Entra para gestionar los looks y compartir el link con tus invitadas.
          </p>
        </div>
      </div>
      <div style={{display:'flex',flexDirection:'column',justifyContent:'center',padding:'5rem 4rem',background:'#FFFFFF'}}>
        <h2 style={{fontSize:'1.8rem',fontWeight:200,color:'#0A0A0A',letterSpacing:'-0.02em',marginBottom:'0.4rem'}}>Iniciar sesión</h2>
        <p style={{fontSize:'0.75rem',fontWeight:300,color:'#888884',marginBottom:'2.5rem'}}>Accede a tu cuenta de nowear</p>

        {['Email','Contraseña'].map((label,i)=>(
          <div key={i} style={{marginBottom:'1.25rem'}}>
            <label style={{display:'block',fontSize:'0.6rem',fontWeight:600,letterSpacing:'0.12em',textTransform:'uppercase',color:'#888884',marginBottom:'0.55rem'}}>{label}</label>
            <input
              type={i===0?'email':'password'}
              style={{width:'100%',fontFamily:'Poppins,sans-serif',fontSize:'0.82rem',fontWeight:300,padding:'0.9rem 1rem',border:'1px solid #E0E0DC',background:'#FFFFFF',outline:'none'}}
            />
          </div>
        ))}

        <button style={{width:'100%',padding:'0.9rem',fontSize:'0.78rem',fontWeight:500,background:'#0A0A0A',color:'#FFFFFF',border:'none',cursor:'pointer',fontFamily:'Poppins,sans-serif',marginTop:'0.5rem'}}>
          Entrar
        </button>

        <div style={{display:'flex',alignItems:'center',gap:'1rem',margin:'1.5rem 0',fontSize:'0.62rem',fontWeight:300,color:'#BEBEBA'}}>
          <span style={{flex:1,height:'1px',background:'#E0E0DC'}}></span>
          o
          <span style={{flex:1,height:'1px',background:'#E0E0DC'}}></span>
        </div>

        <button style={{width:'100%',padding:'0.9rem',fontSize:'0.78rem',fontWeight:500,background:'transparent',color:'#0A0A0A',border:'1px solid #0A0A0A',cursor:'pointer',fontFamily:'Poppins,sans-serif'}}>
          Continuar con Google
        </button>

        <p style={{marginTop:'1.5rem',fontSize:'0.75rem',fontWeight:300,color:'#888884'}}>
          ¿No tienes cuenta? <a href="/register" style={{color:'#0A0A0A',fontWeight:500,textDecoration:'underline',textUnderlineOffset:'3px'}}>Crear cuenta gratis</a>
        </p>
      </div>
    </div>
  )
}
