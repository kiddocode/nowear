'use client'
import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { supabase } from '@/lib/supabase'

export default function Sidebar({ activo }) {
  const router = useRouter()
  const pathname = usePathname()
  const t = useTranslations('sidebar')
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)

  const localesPrefix = ['fr','en','pt','de','nl']
  const locale = localesPrefix.find(loc => pathname.startsWith(`/${loc}/`) || pathname === `/${loc}`) || 'es'
  const prefijo = locale !== 'es' ? `/${locale}` : ''

  useEffect(() => {
    async function cargar() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setUser(user)
      const { data: prof } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      setProfile(prof)
    }
    cargar()
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push(prefijo + '/')
  }

  function getNombre() {
    if (user?.user_metadata?.full_name) return user.user_metadata.full_name
    if (user?.user_metadata?.name) return user.user_metadata.name
    return profile?.nombre || user?.email || ''
  }

  function iniciales(n) {
    if (!n) return '?'
    return n.split(' ').map(w => w[0]).join('').toUpperCase().slice(0,2)
  }

  const links = [
    { label: t('misEventos'), href: prefijo + '/dashboard', grupo: 'principal' },
    { label: t('nuevoEvento'), href: prefijo + '/dashboard/nuevo', grupo: 'principal' },
    { label: t('perfil'), href: prefijo + '/dashboard/perfil', grupo: 'cuenta' },
    { label: t('facturacion'), href: prefijo + '/dashboard/facturacion', grupo: 'cuenta' },
    { label: t('ayuda'), href: prefijo + '/dashboard/ayuda', grupo: 'cuenta' },
  ]

  return (
    <aside style={{borderRight:'1px solid #E0E0DC',padding:'2rem 0',display:'flex',flexDirection:'column',background:'#FFFFFF',position:'sticky',top:'68px',height:'calc(100vh - 68px)'}}>
      <div style={{marginBottom:'1.5rem'}}>
        <div style={{fontSize:'0.55rem',fontWeight:700,letterSpacing:'0.2em',textTransform:'uppercase',color:'#BEBEBA',padding:'0 1.5rem',marginBottom:'0.75rem'}}>{t('principal')}</div>
        {links.filter(l=>l.grupo==='principal').map((link,i) => {
          const isActive = activo === link.href || activo === link.href.replace(prefijo,'')
          return (
            <a key={i} href={link.href}
              style={{display:'flex',alignItems:'center',gap:'0.65rem',padding:'0.75rem 1.5rem',fontSize:'0.78rem',fontWeight:isActive?700:400,color:isActive?'#0A0A0A':'#888884',textDecoration:'none',background:isActive?'#F0F0EE':'transparent',borderLeft:isActive?'2px solid #0A0A0A':'2px solid transparent',transition:'all 0.15s'}}
              onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background='#F7F7F5'; e.currentTarget.style.color='#0A0A0A'; e.currentTarget.style.borderLeft='2px solid #E0E0DC' }}}
              onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='#888884'; e.currentTarget.style.borderLeft='2px solid transparent' }}}>
              <span style={{width:'6px',height:'6px',borderRadius:'50%',background:isActive?'#0A0A0A':'#BEBEBA',flexShrink:0,opacity:isActive?1:0.5}}></span>
              {link.label}
            </a>
          )
        })}
      </div>

      <div style={{marginBottom:'1.5rem'}}>
        <div style={{fontSize:'0.55rem',fontWeight:700,letterSpacing:'0.2em',textTransform:'uppercase',color:'#BEBEBA',padding:'0 1.5rem',marginBottom:'0.75rem'}}>{t('cuenta')}</div>
        {links.filter(l=>l.grupo==='cuenta').map((link,i) => {
          const isActive = activo === link.href || activo === link.href.replace(prefijo,'')
          return (
            <a key={i} href={link.href}
              style={{display:'flex',alignItems:'center',gap:'0.65rem',padding:'0.75rem 1.5rem',fontSize:'0.78rem',fontWeight:isActive?700:400,color:isActive?'#0A0A0A':'#888884',textDecoration:'none',background:isActive?'#F0F0EE':'transparent',borderLeft:isActive?'2px solid #0A0A0A':'2px solid transparent',transition:'all 0.15s'}}
              onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background='#F7F7F5'; e.currentTarget.style.color='#0A0A0A'; e.currentTarget.style.borderLeft='2px solid #E0E0DC' }}}
              onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='#888884'; e.currentTarget.style.borderLeft='2px solid transparent' }}}>
              <span style={{width:'6px',height:'6px',borderRadius:'50%',background:isActive?'#0A0A0A':'#BEBEBA',flexShrink:0,opacity:isActive?1:0.5}}></span>
              {link.label}
            </a>
          )
        })}
        <button onClick={handleLogout}
          style={{display:'flex',alignItems:'center',gap:'0.65rem',padding:'0.75rem 1.5rem',fontSize:'0.78rem',fontWeight:400,color:'#888884',background:'none',border:'none',borderLeft:'2px solid transparent',cursor:'pointer',fontFamily:'Poppins,sans-serif',width:'100%',textAlign:'left',transition:'all 0.15s'}}
          onMouseEnter={e => { e.currentTarget.style.background='#F7F7F5'; e.currentTarget.style.color='#0A0A0A'; e.currentTarget.style.borderLeft='2px solid #E0E0DC' }}
          onMouseLeave={e => { e.currentTarget.style.background='none'; e.currentTarget.style.color='#888884'; e.currentTarget.style.borderLeft='2px solid transparent' }}>
          <span style={{width:'6px',height:'6px',borderRadius:'50%',background:'#BEBEBA',flexShrink:0,opacity:0.5}}></span>
          {t('cerrarSesion')}
        </button>
      </div>

      <div style={{marginTop:'auto',padding:'1.25rem 1.5rem',borderTop:'1px solid #E0E0DC'}}>
        <div style={{display:'flex',alignItems:'center',gap:'0.75rem'}}>
          <div style={{width:'34px',height:'34px',borderRadius:'50%',background:'#0A0A0A',color:'#FFFFFF',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.65rem',fontWeight:700,flexShrink:0}}>
            {iniciales(getNombre())}
          </div>
          <div style={{overflow:'hidden'}}>
            <div style={{fontSize:'0.78rem',fontWeight:600,color:'#0A0A0A',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{getNombre()}</div>
            <div style={{fontSize:'0.62rem',fontWeight:300,color:'#888884'}}>{t('miCuenta')}</div>
          </div>
        </div>
      </div>
    </aside>
  )
}