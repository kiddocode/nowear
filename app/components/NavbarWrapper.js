'use client'
import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'

const IDIOMAS = [
  { code: 'es', flag: '🇪🇸', label: 'Español' },
  { code: 'fr', flag: '🇫🇷', label: 'Français' },
  { code: 'en', flag: '🇬🇧', label: 'English' },
  { code: 'pt', flag: '🇵🇹', label: 'Português' },
  { code: 'de', flag: '🇩🇪', label: 'Deutsch' },
  { code: 'nl', flag: '🇳🇱', label: 'Nederlands' },
]

export default function NavbarWrapper({ locale }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [idiomaOpen, setIdiomaOpen] = useState(false)
  const [hoveredNav, setHoveredNav] = useState(null)
  const router = useRouter()
  const pathname = usePathname()
  const t = useTranslations('nav')

  const idiomaActual = IDIOMAS.find(i => i.code === locale) || IDIOMAS[0]

  function cambiarIdioma(code) {
  setIdiomaOpen(false)
  const localesPrefix = ['fr','en','pt','de','nl']
  let pathSinLocale = pathname
  for (const loc of localesPrefix) {
    if (pathname === `/${loc}`) { pathSinLocale = '/'; break }
    if (pathname.startsWith(`/${loc}/`)) { pathSinLocale = pathname.slice(loc.length + 1); break }
  }
  if (!pathSinLocale) pathSinLocale = '/'
  const nuevaRuta = code === 'es' ? pathSinLocale : `/${code}${pathSinLocale === '/' ? '' : pathSinLocale}`
  window.location.href = nuevaRuta
}

  const prefijo = locale && locale !== 'es' ? `/${locale}` : ''

  const navLinks = [
    {label: t('comoFunciona'), href:`${prefijo}/#como`},
    {label: t('casosDeUso'), href:`${prefijo}/#casos`},
    {label: t('paquetes'), href:`${prefijo}/#precios`},
    {label: t('inspiracion'), href:`${prefijo}/#marcas`},
    {label: t('faq'), href:`${prefijo}/#faq`},
    {label: t('contacto'), href:`${prefijo}/#contacto`},
  ]

  return (
    <>
      <nav style={{position:'fixed',top:0,left:0,right:0,height:'68px',display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 3rem',background:'#FFFFFF',borderBottom:'1px solid #E0E0DC',zIndex:1000}}>

        <a href="/" style={{textDecoration:'none',flexShrink:0}}>
          <img src="https://qhuatexjyxbunotvghjh.supabase.co/storage/v1/object/public/fotos/nowear_logo_transparent.png" alt="NOWEAR" style={{height:'36px',display:'block'}}/>
        </a>

        <div className="nav-center" style={{display:'flex',gap:'0.25rem',alignItems:'center'}}>
          {navLinks.map((item,i) => (
            <a key={i} href={item.href}
              onMouseEnter={() => setHoveredNav(i)}
              onMouseLeave={() => setHoveredNav(null)}
              style={{
                fontSize:'0.78rem',fontWeight:600,
                color: hoveredNav===i ? '#C4917C' : '#0A0A0A',
                textDecoration:'none',padding:'0.5rem 0.9rem',borderRadius:'6px',
                background: hoveredNav===i ? '#F5EDE8' : 'transparent',
                transition:'color 0.15s, background 0.15s',letterSpacing:'0.01em',
              }}>
              {item.label}
            </a>
          ))}
        </div>

        <div className="nav-actions" style={{display:'flex',gap:'0.5rem',alignItems:'center',flexShrink:0}}>
          <div style={{position:'relative'}}>
            <button
              onClick={() => setIdiomaOpen(!idiomaOpen)}
              onBlur={() => setTimeout(() => setIdiomaOpen(false), 150)}
              style={{display:'flex',alignItems:'center',gap:'0.4rem',fontSize:'0.75rem',fontWeight:600,color:'#0A0A0A',background:'none',border:'1px solid #E0E0DC',borderRadius:'6px',cursor:'pointer',fontFamily:'Poppins,sans-serif',padding:'0.45rem 0.75rem'}}>
              <span style={{fontSize:'1rem'}}>{idiomaActual.flag}</span>
              <span style={{letterSpacing:'0.05em'}}>{idiomaActual.code.toUpperCase()}</span>
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none" style={{transition:'transform 0.15s',transform:idiomaOpen?'rotate(180deg)':'none'}}>
                <path d="M1 1l4 4 4-4" stroke="#888884" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
            {idiomaOpen && (
              <div style={{position:'absolute',top:'calc(100% + 6px)',right:0,background:'#FFFFFF',border:'1px solid #E0E0DC',borderRadius:'8px',minWidth:'150px',boxShadow:'0 4px 16px rgba(0,0,0,0.08)',overflow:'hidden',zIndex:10}}>
                {IDIOMAS.map((idioma,i) => (
                  <button key={i}
                    onClick={() => cambiarIdioma(idioma.code)}
                    style={{display:'flex',alignItems:'center',gap:'0.6rem',width:'100%',padding:'0.65rem 1rem',fontSize:'0.78rem',fontWeight:idioma.code===locale?600:400,color:idioma.code===locale?'#C4917C':'#0A0A0A',background:idioma.code===locale?'#F5EDE8':'none',border:'none',cursor:'pointer',fontFamily:'Poppins,sans-serif',textAlign:'left',borderBottom:i<IDIOMAS.length-1?'1px solid #F0F0EE':'none'}}>
                    <span style={{fontSize:'1rem'}}>{idioma.flag}</span>
                    <span>{idioma.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <a href={`${prefijo}/login`}
            style={{fontSize:'0.82rem',fontWeight:600,color:'#0A0A0A',padding:'0.65rem 1.1rem',textDecoration:'none',borderRadius:'8px',border:'1px solid transparent',transition:'border-color 0.15s'}}
            onMouseEnter={e => e.currentTarget.style.borderColor='#E0E0DC'}
            onMouseLeave={e => e.currentTarget.style.borderColor='transparent'}>
            {t('entrar')}
          </a>
          <a href={`${prefijo}/register`}
            style={{fontSize:'0.82rem',fontWeight:600,padding:'0.65rem 1.5rem',background:'#0A0A0A',color:'#FFFFFF',textDecoration:'none',borderRadius:'50px',transition:'background 0.15s'}}
            onMouseEnter={e => e.currentTarget.style.background='#2C2C2C'}
            onMouseLeave={e => e.currentTarget.style.background='#0A0A0A'}>
            {t('empezar')}
          </a>
        </div>

        <button className="nav-hamburger" onClick={() => setMenuOpen(!menuOpen)}
          style={{display:'none',background:'none',border:'none',cursor:'pointer',padding:'0.5rem',flexDirection:'column',gap:'5px'}}>
          <span style={{width:'22px',height:'1.5px',background:'#0A0A0A',display:'block',transition:'all 0.2s',transform:menuOpen?'rotate(45deg) translate(4px,4px)':'none'}}></span>
          <span style={{width:'22px',height:'1.5px',background:'#0A0A0A',display:'block',opacity:menuOpen?0:1,transition:'all 0.2s'}}></span>
          <span style={{width:'22px',height:'1.5px',background:'#0A0A0A',display:'block',transition:'all 0.2s',transform:menuOpen?'rotate(-45deg) translate(4px,-4px)':'none'}}></span>
        </button>
      </nav>

      {menuOpen && (
        <div style={{position:'fixed',top:'68px',left:0,right:0,background:'#FFFFFF',borderBottom:'1px solid #E0E0DC',zIndex:999,padding:'1.5rem'}}>
          {navLinks.map((item,i) => (
            <a key={i} href={item.href} onClick={() => setMenuOpen(false)}
              style={{display:'block',fontSize:'0.88rem',fontWeight:600,color:'#0A0A0A',padding:'0.85rem 0',borderBottom:'1px solid #F0F0EE',textDecoration:'none'}}>
              {item.label}
            </a>
          ))}
          <div style={{display:'flex',flexDirection:'column',gap:'0.75rem',marginTop:'1.25rem'}}>
            <a href={`${prefijo}/login`} style={{fontSize:'0.82rem',fontWeight:600,color:'#0A0A0A',padding:'0.75rem',border:'1px solid #E0E0DC',textAlign:'center',textDecoration:'none',borderRadius:'8px'}}>{t('entrar')}</a>
            <a href={`${prefijo}/register`} style={{fontSize:'0.82rem',fontWeight:600,padding:'0.75rem',background:'#0A0A0A',color:'#FFFFFF',textAlign:'center',textDecoration:'none',borderRadius:'50px'}}>{t('empezar')}</a>
          </div>
        </div>
      )}
    </>
  )
}