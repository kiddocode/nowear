'use client'
import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function Sidebar({ activo }) {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)

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
    router.push('/')
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
    { label: 'Mis eventos', href: '/dashboard', grupo: 'principal' },
    { label: 'Nuevo evento', href: '/dashboard/nuevo', grupo: 'principal' },
    { label: 'Perfil', href: '/dashboard/perfil', grupo: 'cuenta' },
    { label: 'Facturación', href: '/dashboard/facturacion', grupo: 'cuenta' },
    { label: 'Ayuda', href: '/dashboard/ayuda', grupo: 'cuenta' },
  ]

  return (
    <aside style={{borderRight:'1px solid #E0E0DC',padding:'2rem 0',display:'flex',flexDirection:'column',background:'#FFFFFF',position:'sticky',top:'68px',height:'calc(100vh - 68px)'}}>
      <style>{`
        .sidebar-link { transition: background 0.15s, color 0.15s; }
        .sidebar-link:hover { background: #F7F7F5 !important; color: #0A0A0A !important; }
        .sidebar-link:hover span { opacity: 1 !important; background: #F07987 !important; }
      `}</style>

      {/* PRINCIPAL */}
      <div style={{marginBottom:'1.5rem'}}>
        <div style={{fontSize:'0.55rem',fontWeight:700,letterSpacing:'0.2em',textTransform:'uppercase',color:'#BEBEBA',padding:'0 1.5rem',marginBottom:'0.75rem'}}>Principal</div>
        {links.filter(l=>l.grupo==='principal').map((link,i) => {
          const isActive = activo === link.href
          return (
            <a key={i} href={link.href} className="sidebar-link" style={{display:'flex',alignItems:'center',gap:'0.65rem',padding:'0.75rem 1.5rem',fontSize:'0.78rem',fontWeight:isActive?700:400,color:isActive?'#0A0A0A':'#888884',textDecoration:'none',background:isActive?'#F0F0EE':'transparent',borderLeft:isActive?'2px solid #0A0A0A':'2px solid transparent'}}>
              <span style={{width:'6px',height:'6px',borderRadius:'50%',background:isActive?'#0A0A0A':'#BEBEBA',flexShrink:0,opacity:isActive?1:0.5}}></span>
              {link.label}
            </a>
          )
        })}
      </div>

      {/* CUENTA */}
      <div style={{marginBottom:'1.5rem'}}>
        <div style={{fontSize:'0.55rem',fontWeight:700,letterSpacing:'0.2em',textTransform:'uppercase',color:'#BEBEBA',padding:'0 1.5rem',marginBottom:'0.75rem'}}>Cuenta</div>
        {links.filter(l=>l.grupo==='cuenta').map((link,i) => {
          const isActive = activo === link.href
          return (
            <a key={i} href={link.href} className="sidebar-link" style={{display:'flex',alignItems:'center',gap:'0.65rem',padding:'0.75rem 1.5rem',fontSize:'0.78rem',fontWeight:isActive?700:400,color:isActive?'#0A0A0A':'#888884',textDecoration:'none',background:isActive?'#F0F0EE':'transparent',borderLeft:isActive?'2px solid #0A0A0A':'2px solid transparent'}}>
              <span style={{width:'6px',height:'6px',borderRadius:'50%',background:isActive?'#0A0A0A':'#BEBEBA',flexShrink:0,opacity:isActive?1:0.5}}></span>
              {link.label}
            </a>
          )
        })}
        <button onClick={handleLogout} className="sidebar-link" style={{display:'flex',alignItems:'center',gap:'0.65rem',padding:'0.75rem 1.5rem',fontSize:'0.78rem',fontWeight:400,color:'#888884',background:'none',border:'none',cursor:'pointer',fontFamily:'Poppins,sans-serif',width:'100%',textAlign:'left',borderLeft:'2px solid transparent'}}>
          <span style={{width:'6px',height:'6px',borderRadius:'50%',background:'#BEBEBA',flexShrink:0,opacity:0.5}}></span>
          Cerrar sesión
        </button>
      </div>

      {/* USUARIO */}
      <div style={{marginTop:'auto',padding:'1.25rem 1.5rem',borderTop:'1px solid #E0E0DC'}}>
        <div style={{display:'flex',alignItems:'center',gap:'0.75rem'}}>
          <div style={{width:'34px',height:'34px',borderRadius:'50%',background:'#0A0A0A',color:'#FFFFFF',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.65rem',fontWeight:700,flexShrink:0}}>
            {iniciales(getNombre())}
          </div>
          <div style={{overflow:'hidden'}}>
            <div style={{fontSize:'0.78rem',fontWeight:600,color:'#0A0A0A',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{getNombre()}</div>
            <div style={{fontSize:'0.62rem',fontWeight:300,color:'#888884'}}>Mi cuenta</div>
          </div>
        </div>
      </div>
    </aside>
  )
}