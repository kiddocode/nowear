'use client'
import './globals.css'
import { useState } from 'react'

export default function RootLayout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <html lang="es">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>NOWEAR — No two looks alike</title>
        <meta name="description" content="La plataforma para que ninguna invitada llegue vestida igual." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;1,200;1,300;1,400&display=swap" rel="stylesheet" />
      </head>
      <body style={{fontFamily:"'Poppins', sans-serif"}}>
        <nav style={{position:'fixed',top:0,left:0,right:0,height:'68px',display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 3rem',background:'rgba(255,255,255,0.96)',backdropFilter:'blur(16px)',borderBottom:'1px solid #E0E0DC',zIndex:1000}}>
          <a href="/" style={{textDecoration:'none'}}>
  <img src="https://qhuatexjyxbunotvghjh.supabase.co/storage/v1/object/public/fotos/No_Wear%20logo.png" alt="NOWEAR" style={{height:'28px',display:'block'}}/>
</a>
          {/* NAV DESKTOP */}
<div className="nav-center" style={{display:'flex',gap:'0',background:'#F0F0EE',borderRadius:'50px',padding:'0.35rem 0.5rem'}}>
  {['Cómo funciona','Marcas','FAQ','Contacto'].map((item,i) => (
    <a key={i} href={`/#${['como','marcas','faq','contacto'][i]}`} style={{fontSize:'0.72rem',fontWeight:300,color:'#3A3A38',textDecoration:'none',padding:'0.5rem 1.1rem',borderRadius:'50px'}}>
      {item}
    </a>
  ))}
</div>

          {/* BOTONES DESKTOP */}
          <div className="nav-actions" style={{display:'flex',gap:'0.75rem',alignItems:'center'}}>
            <a href="/login" style={{fontSize:'0.72rem',fontWeight:300,color:'#3A3A38',padding:'0.65rem 1rem',textDecoration:'none'}}>Entrar</a>
            <a href="/register" style={{fontSize:'0.72rem',fontWeight:500,padding:'0.65rem 1.5rem',background:'#0A0A0A',color:'#FFFFFF',textDecoration:'none'}}>Empezar</a>
          </div>

          {/* HAMBURGUESA MOBILE */}
          <button
            className="nav-hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{display:'none',background:'none',border:'none',cursor:'pointer',padding:'0.5rem',flexDirection:'column',gap:'5px'}}
          >
            <span style={{width:'22px',height:'1.5px',background:'#0A0A0A',display:'block',transition:'all 0.2s',transform:menuOpen?'rotate(45deg) translate(4px,4px)':'none'}}></span>
            <span style={{width:'22px',height:'1.5px',background:'#0A0A0A',display:'block',opacity:menuOpen?0:1,transition:'all 0.2s'}}></span>
            <span style={{width:'22px',height:'1.5px',background:'#0A0A0A',display:'block',transition:'all 0.2s',transform:menuOpen?'rotate(-45deg) translate(4px,-4px)':'none'}}></span>
          </button>
        </nav>

        {/* MENÚ MOBILE DESPLEGABLE */}
        {menuOpen && (
          <div style={{position:'fixed',top:'68px',left:0,right:0,background:'#FFFFFF',borderBottom:'1px solid #E0E0DC',zIndex:999,padding:'1.5rem'}}>
            {['Cómo funciona','Marcas','FAQ','Contacto'].map((item,i) => (
              <a key={i} href={`/#${['como','marcas','faq','contacto'][i]}`} onClick={() => setMenuOpen(false)} style={{display:'block',fontSize:'0.85rem',fontWeight:300,color:'#3A3A38',padding:'0.75rem 0',borderBottom:'1px solid #F0F0EE',textDecoration:'none'}}>{item}</a>
            ))}
            <div style={{display:'flex',flexDirection:'column',gap:'0.75rem',marginTop:'1.25rem'}}>
              <a href="/login" style={{fontSize:'0.78rem',fontWeight:300,color:'#3A3A38',padding:'0.75rem',border:'1px solid #E0E0DC',textAlign:'center',textDecoration:'none'}}>Entrar</a>
              <a href="/register" style={{fontSize:'0.78rem',fontWeight:500,padding:'0.75rem',background:'#0A0A0A',color:'#FFFFFF',textAlign:'center',textDecoration:'none'}}>Empezar</a>
            </div>
          </div>
        )}

        <div style={{paddingTop:'68px'}}>
          {children}
        </div>
      </body>
    </html>
  )
}