'use client'
import './globals.css'
import { useState } from 'react'

const IDIOMAS = [
  { code: 'ES', flag: '🇪🇸', label: 'Español' },
  { code: 'FR', flag: '🇫🇷', label: 'Français' },
  { code: 'EN', flag: '🇬🇧', label: 'English' },
  { code: 'PT', flag: '🇵🇹', label: 'Português' },
  { code: 'DE', flag: '🇩🇪', label: 'Deutsch' },
  { code: 'NL', flag: '🇳🇱', label: 'Nederlands' },
]

export default function RootLayout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [idiomaOpen, setIdiomaOpen] = useState(false)
  const [idiomaActual, setIdiomaActual] = useState('ES')
  const [hoveredNav, setHoveredNav] = useState(null)

  const idiomaInfo = IDIOMAS.find(i => i.code === idiomaActual)

  return (
    <html lang="es">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>NOWEAR — No two looks alike</title>
        <meta name="description" content="La plataforma para que ninguna invitada llegue vestida igual." />
        <link rel="icon" type="image/png" sizes="32x32" href="https://qhuatexjyxbunotvghjh.supabase.co/storage/v1/object/public/fotos/favicon.png" type="image/png"/>
        <link rel="apple-touch-icon" href="https://qhuatexjyxbunotvghjh.supabase.co/storage/v1/object/public/fotos/favicon.png"/>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,200;1,300;1,400&display=swap" rel="stylesheet" />
      </head>
      <body style={{fontFamily:"'Poppins', sans-serif"}}>
        <nav style={{position:'fixed',top:0,left:0,right:0,height:'68px',display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 3rem',background:'#FFFFFF',borderBottom:'1px solid #E0E0DC',zIndex:1000}}>

          {/* LOGO */}
          <a href="/" style={{textDecoration:'none',flexShrink:0}}>
            <img src="https://qhuatexjyxbunotvghjh.supabase.co/storage/v1/object/public/fotos/nowear_logo_transparent.png" alt="NOWEAR" style={{height:'36px',display:'block'}}/>
          </a>

          {/* LINKS CENTRO */}
          <div className="nav-center" style={{display:'flex',gap:'0.25rem',alignItems:'center'}}>
            {[
              {label:'Cómo funciona', href:'/#como'},
              {label:'Paquetes', href:'/#precios'},
              {label:'Inspiración', href:'/#marcas'},
              {label:'FAQ', href:'/#faq'},
              {label:'Contacto', href:'/#contacto'},
            ].map((item,i) => (
              <a
                key={i}
                href={item.href}
                onMouseEnter={() => setHoveredNav(i)}
                onMouseLeave={() => setHoveredNav(null)}
                style={{
                  fontSize:'0.82rem',
                  fontWeight:600,
                  color: hoveredNav === i ? '#C4917C' : '#0A0A0A',
                  textDecoration:'none',
                  padding:'0.5rem 1.1rem',
                  borderRadius:'6px',
                  background: hoveredNav === i ? '#F5EDE8' : 'transparent',
                  transition:'color 0.15s, background 0.15s',
                  letterSpacing:'0.01em',
                }}
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* ACCIONES DERECHA */}
          <div className="nav-actions" style={{display:'flex',gap:'0.5rem',alignItems:'center',flexShrink:0}}>

            {/* Selector idioma */}
            <div style={{position:'relative'}}>
              <button
                onClick={() => setIdiomaOpen(!idiomaOpen)}
                onBlur={() => setTimeout(() => setIdiomaOpen(false), 150)}
                style={{display:'flex',alignItems:'center',gap:'0.4rem',fontSize:'0.75rem',fontWeight:600,color:'#0A0A0A',background:'none',border:'1px solid #E0E0DC',borderRadius:'6px',cursor:'pointer',fontFamily:'Poppins,sans-serif',padding:'0.45rem 0.75rem'}}>
                <span style={{fontSize:'1rem'}}>{idiomaInfo?.flag}</span>
                <span style={{letterSpacing:'0.05em'}}>{idiomaActual}</span>
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" style={{transition:'transform 0.15s',transform:idiomaOpen?'rotate(180deg)':'none'}}>
                  <path d="M1 1l4 4 4-4" stroke="#888884" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
              {idiomaOpen && (
                <div style={{position:'absolute',top:'calc(100% + 6px)',right:0,background:'#FFFFFF',border:'1px solid #E0E0DC',borderRadius:'8px',minWidth:'150px',boxShadow:'0 4px 16px rgba(0,0,0,0.08)',overflow:'hidden',zIndex:10}}>
                  {IDIOMAS.map((idioma,i) => (
                    <button key={i}
                      onClick={() => { setIdiomaActual(idioma.code); setIdiomaOpen(false) }}
                      style={{display:'flex',alignItems:'center',gap:'0.6rem',width:'100%',padding:'0.65rem 1rem',fontSize:'0.78rem',fontWeight: idiomaActual===idioma.code ? 600 : 400,color: idiomaActual===idioma.code ? '#C4917C' : '#0A0A0A',background: idiomaActual===idioma.code ? '#F5EDE8' : 'none',border:'none',cursor:'pointer',fontFamily:'Poppins,sans-serif',textAlign:'left',borderBottom:i<IDIOMAS.length-1?'1px solid #F0F0EE':'none'}}>
                      <span style={{fontSize:'1rem'}}>{idioma.flag}</span>
                      <span>{idioma.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <a href="/login"
              style={{fontSize:'0.82rem',fontWeight:600,color:'#0A0A0A',padding:'0.65rem 1.1rem',textDecoration:'none',borderRadius:'8px',border:'1px solid transparent',transition:'border-color 0.15s'}}
              onMouseEnter={e => e.currentTarget.style.borderColor='#E0E0DC'}
              onMouseLeave={e => e.currentTarget.style.borderColor='transparent'}>
              Entrar
            </a>
            <a href="/register"
              style={{fontSize:'0.82rem',fontWeight:600,padding:'0.65rem 1.5rem',background:'#0A0A0A',color:'#FFFFFF',textDecoration:'none',borderRadius:'50px',transition:'background 0.15s'}}
              onMouseEnter={e => e.currentTarget.style.background='#2C2C2C'}
              onMouseLeave={e => e.currentTarget.style.background='#0A0A0A'}>
              Empezar
            </a>
          </div>

          {/* HAMBURGER MÓVIL */}
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

        {/* MENÚ MÓVIL */}
        {menuOpen && (
          <div style={{position:'fixed',top:'68px',left:0,right:0,background:'#FFFFFF',borderBottom:'1px solid #E0E0DC',zIndex:999,padding:'1.5rem'}}>
            {[
              {label:'Cómo funciona', href:'/#como'},
              {label:'Paquetes', href:'/#precios'},
              {label:'Inspiración', href:'/#marcas'},
              {label:'FAQ', href:'/#faq'},
              {label:'Contacto', href:'/#contacto'},
            ].map((item,i) => (
              <a key={i} href={item.href} onClick={() => setMenuOpen(false)}
                style={{display:'block',fontSize:'0.88rem',fontWeight:600,color:'#0A0A0A',padding:'0.85rem 0',borderBottom:'1px solid #F0F0EE',textDecoration:'none'}}>
                {item.label}
              </a>
            ))}
            <div style={{display:'flex',flexDirection:'column',gap:'0.75rem',marginTop:'1.25rem'}}>
              <a href="/login" style={{fontSize:'0.82rem',fontWeight:600,color:'#0A0A0A',padding:'0.75rem',border:'1px solid #E0E0DC',textAlign:'center',textDecoration:'none',borderRadius:'8px'}}>Entrar</a>
              <a href="/register" style={{fontSize:'0.82rem',fontWeight:600,padding:'0.75rem',background:'#0A0A0A',color:'#FFFFFF',textAlign:'center',textDecoration:'none',borderRadius:'50px'}}>Empezar</a>
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