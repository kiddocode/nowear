'use client'
import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { supabase } from '@/lib/supabase'
import Sidebar from '../../components/Sidebar'
import ModalPlanes from '../../components/ModalPlanes'

function getPlan(evento) {
  if (!evento) return 'basico'
  const p = (evento.plan || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  if (p.includes('enterprise')) return 'enterprise'
  if (p.includes('premium')) return 'premium'
  if (p.includes('estandar') || p.includes('estándar') || p.includes('standard')) return 'estandar'
  return 'basico'
}

export default function Dashboard() {
  const router = useRouter()
  const pathname = usePathname()
  const t = useTranslations('dashboard')
  const ts = useTranslations('sidebar')

  const localesPrefix = ['fr','en','pt','de','nl']
  const locale = localesPrefix.find(loc => pathname.startsWith(`/${loc}/`) || pathname === `/${loc}`) || 'es'
  const prefijo = locale !== 'es' ? `/${locale}` : ''

  const PLAN_COLORES = {
    basico:     { bg: '#F0F0EE', color: '#888884', label: t('planBasico') },
    estandar:   { bg: '#EEF2F8', color: '#8B9DC3', label: t('planEstandar') },
    premium:    { bg: '#F5EDE8', color: '#C4917C', label: t('planPremium') },
    enterprise: { bg: '#FFF0F1', color: '#F07987', label: t('planEnterprise') },
  }

  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [eventos, setEventos] = useState([])
  const [conflictosPorEvento, setConflictosPorEvento] = useState({})
  const [loading, setLoading] = useState(true)
  const [eliminando, setEliminando] = useState(null)
  const [modalPlanes, setModalPlanes] = useState(false)
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null)
  const [menuMobileOpen, setMenuMobileOpen] = useState(false)

  useEffect(() => {
    async function cargarDatos() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push(prefijo + '/login'); return }
      setUser(user)
      const { data: prof } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      setProfile(prof)
      const { data: evs } = await supabase
        .from('eventos').select('*, looks(count)')
        .eq('organizadora_id', user.id).order('created_at', { ascending: false })
      setEventos(evs || [])
      if (evs && evs.length > 0) {
        const eventoIds = evs.map(e => e.id)
        const { data: cnfs } = await supabase.from('conflictos').select('evento_id').in('evento_id', eventoIds)
        const mapa = {}
        ;(cnfs || []).forEach(c => { mapa[c.evento_id] = (mapa[c.evento_id] || 0) + 1 })
        setConflictosPorEvento(mapa)
      }
      setLoading(false)
    }
    cargarDatos()
  }, [])

  async function handleEliminar(e, eventoId) {
    e.preventDefault(); e.stopPropagation()
    if (!confirm(t('confirmarEliminar'))) return
    setEliminando(eventoId)
    await supabase.from('looks').delete().eq('evento_id', eventoId)
    await supabase.from('eventos').delete().eq('id', eventoId)
    setEventos(prev => prev.filter(ev => ev.id !== eventoId))
    setEliminando(null)
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push(prefijo + '/')
  }

  function diasRestantes(fecha) {
    if (!fecha) return '?'
    const diff = Math.ceil((new Date(fecha) - new Date()) / (1000 * 60 * 60 * 24))
    return diff > 0 ? diff + 'd' : t('pasado')
  }

  function abrirModal(evento = null) { setEventoSeleccionado(evento); setModalPlanes(true) }

  function getNombre() {
    if (user?.user_metadata?.full_name) return user.user_metadata.full_name
    if (user?.user_metadata?.name) return user.user_metadata.name
    return profile?.nombre || user?.email || ''
  }

  const totalLooks = eventos.reduce((acc, e) => acc + (e.looks?.[0]?.count || 0), 0)
  const totalConflictos = Object.values(conflictosPorEvento).reduce((a, b) => a + b, 0)
  const esAdmin = profile?.is_admin
  const tieneAlgunBasico = eventos.some(e => getPlan(e) === 'basico')
  const tieneAlgunEstandar = eventos.some(e => getPlan(e) === 'estandar')
  const tienePremiumOSuperior = eventos.some(e => ['premium','enterprise'].includes(getPlan(e)))

  if (loading) return <div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'calc(100vh - 68px)',fontSize:'0.75rem',color:'#888884'}}>...</div>

  const mobileLinks = [
    { label: ts('misEventos'), href: prefijo + '/dashboard' },
    { label: ts('nuevoEvento'), href: prefijo + '/dashboard/nuevo' },
    { label: ts('perfil'), href: prefijo + '/dashboard/perfil' },
    { label: ts('facturacion'), href: prefijo + '/dashboard/facturacion' },
    { label: ts('ayuda'), href: prefijo + '/dashboard/ayuda' },
  ]

  return (
    <div className="dashboard-grid" style={{display:'grid',gridTemplateColumns:'220px 1fr',minHeight:'calc(100vh - 68px)'}}>
      <div className="dashboard-sidebar"><Sidebar activo="/dashboard" /></div>

      {/* BARRA MÓVIL */}
<div className="dashboard-mobile-nav" style={{display:'none',position:'fixed',bottom:0,left:0,right:0,zIndex:200,background:'#FFFFFF',borderTop:'1px solid #E0E0DC',padding:'0.6rem 0',justifyContent:'space-around',alignItems:'center'}}>
  <a href={prefijo + '/dashboard'} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'0.2rem',fontSize:'0.52rem',fontWeight:600,letterSpacing:'0.08em',textTransform:'uppercase',color:'#0A0A0A',textDecoration:'none',flex:1,justifyContent:'center'}}>
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><polyline points="9 16 11 18 15 14"/></svg>
    {ts('misEventos')}
  </a>
  <a href={prefijo + '/dashboard/nuevo'} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'0.2rem',fontSize:'0.52rem',fontWeight:600,letterSpacing:'0.08em',textTransform:'uppercase',color:'#888884',textDecoration:'none',flex:1,justifyContent:'center'}}>
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
    {ts('nuevoEvento')}
  </a>
  <a href={prefijo + '/dashboard/perfil'} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'0.2rem',fontSize:'0.52rem',fontWeight:600,letterSpacing:'0.08em',textTransform:'uppercase',color:'#888884',textDecoration:'none',flex:1,justifyContent:'center'}}>
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
    {ts('perfil')}
  </a>
  <button onClick={() => setMenuMobileOpen(!menuMobileOpen)} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'0.2rem',fontSize:'0.52rem',fontWeight:600,letterSpacing:'0.08em',textTransform:'uppercase',color:'#888884',background:'none',border:'none',cursor:'pointer',fontFamily:'Poppins,sans-serif',flex:1,justifyContent:'center',alignItems:'center'}}>
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
    {ts('cuenta')}
  </button>
</div>

      {/* MENU MÓVIL DESPLEGABLE */}
      {menuMobileOpen && (
        <div style={{position:'fixed',bottom:'68px',left:0,right:0,zIndex:199,background:'#FFFFFF',borderTop:'1px solid #E0E0DC',padding:'1rem 1.5rem',boxShadow:'0 -4px 20px rgba(0,0,0,0.1)'}}>
          {[
            { label: ts('facturacion'), href: prefijo + '/dashboard/facturacion' },
            { label: ts('ayuda'), href: prefijo + '/dashboard/ayuda' },
          ].map((link,i) => (
            <a key={i} href={link.href} style={{display:'block',padding:'0.75rem 0',fontSize:'0.82rem',fontWeight:400,color:'#0A0A0A',borderBottom:'1px solid #F0F0EE'}}>{link.label}</a>
          ))}
          <button onClick={handleLogout} style={{display:'block',width:'100%',textAlign:'left',padding:'0.75rem 0',fontSize:'0.82rem',fontWeight:400,color:'#F07987',background:'none',border:'none',cursor:'pointer',fontFamily:'Poppins,sans-serif',marginTop:'0.25rem'}}>
            {ts('cerrarSesion')}
          </button>
        </div>
      )}

      <main className="dashboard-main" style={{padding:'3rem',paddingBottom:'6rem'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',marginBottom:'2.5rem',paddingBottom:'2rem',borderBottom:'1px solid #E0E0DC',gap:'1rem',flexWrap:'wrap'}}>
          <div>
            <h1 style={{fontSize:'clamp(1.6rem,4vw,2.2rem)',fontWeight:200,color:'#0A0A0A',letterSpacing:'-0.025em',lineHeight:1,marginBottom:'0.35rem'}}>{t('titulo')}</h1>
            <p style={{fontSize:'0.75rem',fontWeight:300,color:'#888884'}}>{t('subtitulo')}</p>
          </div>
          <a href={prefijo + '/dashboard/nuevo'} style={{fontSize:'0.78rem',fontWeight:600,padding:'0.75rem 1.5rem',background:'#0A0A0A',color:'#FFFFFF',textDecoration:'none',whiteSpace:'nowrap',borderRadius:'4px',flexShrink:0}}>{t('nuevoEvento')}</a>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'1rem',marginBottom:(tieneAlgunBasico||tieneAlgunEstandar)&&!tienePremiumOSuperior?'1.5rem':'3rem'}}>
          {[
            {num: eventos.length.toString(), label: t('eventosActivos')},
            {num: totalLooks.toString(), label: t('looksRegistrados')},
            {num: totalConflictos.toString(), label: t('conflictos'), color: totalConflictos > 0 ? '#F07987' : '#0A0A0A'},
          ].map((s,i) => (
            <div key={i} style={{background:'#FFFFFF',padding:'1.5rem',borderRadius:'16px',boxShadow:'0 2px 16px rgba(0,0,0,0.06)',border:'1px solid #F0F0EE'}}>
              <div style={{fontSize:'clamp(1.8rem,5vw,2.5rem)',fontWeight:700,color:s.color||'#0A0A0A',lineHeight:1,marginBottom:'0.4rem',letterSpacing:'-0.03em'}}>{s.num}</div>
              <div style={{fontSize:'0.58rem',fontWeight:600,letterSpacing:'0.12em',textTransform:'uppercase',color:'#888884'}}>{s.label}</div>
            </div>
          ))}
        </div>

        {tieneAlgunBasico && !tienePremiumOSuperior && (
          <div style={{marginBottom:'1rem',padding:'1rem 1.25rem',background:'#F7F7F5',border:'1px solid #E0E0DC',borderRadius:'12px',display:'flex',justifyContent:'space-between',alignItems:'center',gap:'1rem',flexWrap:'wrap'}}>
            <div style={{display:'flex',alignItems:'center',gap:'0.75rem',flex:1,minWidth:0}}>
              <span style={{fontSize:'1.1rem',flexShrink:0}}>✨</span>
              <div style={{minWidth:0}}>
                <span style={{fontSize:'0.78rem',fontWeight:600,color:'#0A0A0A'}}>{t('bannerEstandarTitulo')} </span>
                <span style={{fontSize:'0.75rem',fontWeight:300,color:'#888884'}}>{t('bannerEstandarSub')}</span>
              </div>
            </div>
            <button onClick={() => abrirModal()} style={{fontSize:'0.65rem',fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',padding:'0.6rem 1.25rem',background:'#0A0A0A',color:'#FFFFFF',border:'none',cursor:'pointer',fontFamily:'Poppins,sans-serif',borderRadius:'4px',whiteSpace:'nowrap',flexShrink:0}}>
              {t('verPlanes')}
            </button>
          </div>
        )}

        {tieneAlgunEstandar && !tienePremiumOSuperior && (
          <div style={{marginBottom:'3rem',padding:'1rem 1.25rem',background:'#F5EDE8',border:'1px solid #F0D8CC',borderRadius:'12px',display:'flex',justifyContent:'space-between',alignItems:'center',gap:'1rem',flexWrap:'wrap'}}>
            <div style={{display:'flex',alignItems:'center',gap:'0.75rem',flex:1,minWidth:0}}>
              <span style={{fontSize:'1.1rem',flexShrink:0}}>🎨</span>
              <div style={{minWidth:0}}>
                <span style={{fontSize:'0.78rem',fontWeight:600,color:'#0A0A0A'}}>{t('bannerPremiumTitulo')} </span>
                <span style={{fontSize:'0.75rem',fontWeight:300,color:'#888884'}}>{t('bannerPremiumSub')}</span>
              </div>
            </div>
            <button onClick={() => abrirModal()} style={{fontSize:'0.65rem',fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',padding:'0.6rem 1.25rem',background:'#C4917C',color:'#FFFFFF',border:'none',cursor:'pointer',fontFamily:'Poppins,sans-serif',borderRadius:'4px',whiteSpace:'nowrap',flexShrink:0}}>
              {t('verPremium')}
            </button>
          </div>
        )}

        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))',gap:'1.25rem'}}>
          {eventos.map((evento) => {
            const planKey = getPlan(evento)
            const planInfo = PLAN_COLORES[planKey]
            const numConflictos = conflictosPorEvento[evento.id] || 0
            return (
              <div key={evento.id} style={{background:'#FFFFFF',padding:'1.5rem',position:'relative',borderRadius:'16px',boxShadow:'0 2px 16px rgba(0,0,0,0.06)',border:'1px solid #F0F0EE',transition:'transform 0.15s, box-shadow 0.15s',cursor:'pointer'}}
                onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-3px)';e.currentTarget.style.boxShadow='0 8px 32px rgba(0,0,0,0.12)'}}
                onMouseLeave={e=>{e.currentTarget.style.transform='none';e.currentTarget.style.boxShadow='0 2px 16px rgba(0,0,0,0.06)'}}>
                {esAdmin && (
                  <button onClick={(e) => handleEliminar(e, evento.id)} disabled={eliminando === evento.id}
                    style={{position:'absolute',top:'1rem',right:'1rem',background:'none',border:'none',cursor:'pointer',color:'#BEBEBA',fontSize:'0.75rem',fontFamily:'Poppins,sans-serif',padding:'0.25rem 0.5rem'}}>
                    {eliminando === evento.id ? '...' : '×'}
                  </button>
                )}
                <a href={prefijo + `/evento/${evento.slug}`} style={{textDecoration:'none',display:'block'}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'0.65rem'}}>
                    <div style={{fontSize:'0.58rem',fontWeight:600,letterSpacing:'0.12em',textTransform:'uppercase',color:'#888884'}}>{evento.tipo}</div>
                    <span style={{fontSize:'0.55rem',fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',padding:'0.2rem 0.6rem',borderRadius:'20px',background:planInfo.bg,color:planInfo.color,flexShrink:0,marginLeft:'0.5rem'}}>
                      {planInfo.label}
                    </span>
                  </div>
                  <div style={{fontSize:'1.25rem',fontWeight:300,color:'#0A0A0A',letterSpacing:'-0.01em',marginBottom:'0.2rem',lineHeight:1.3}}>{evento.nombre}</div>
                  <div style={{fontSize:'0.72rem',fontWeight:300,color:'#888884',marginBottom:'1.25rem'}}>
                    {evento.fecha ? new Date(evento.fecha).toLocaleDateString('es-ES',{day:'numeric',month:'long',year:'numeric'}) : t('sinFecha')}
                    {evento.lugar ? ` · ${evento.lugar}` : ''}
                  </div>
                  <div style={{display:'flex',gap:'1.25rem',paddingTop:'1rem',borderTop:'1px solid #E0E0DC'}}>
                    {[
                      {n: evento.looks?.[0]?.count?.toString() || '0', l: t('looks')},
                      {n: numConflictos.toString(), l: t('conflictos'), color: numConflictos > 0 ? '#F07987' : '#0A0A0A'},
                      {n: diasRestantes(evento.fecha), l: t('restantes')}
                    ].map((s,i) => (
                      <div key={i}>
                        <div style={{fontSize:'1.75rem',fontWeight:700,color:s.color||'#0A0A0A',lineHeight:1,marginBottom:'0.25rem',letterSpacing:'-0.02em'}}>{s.n}</div>
                        <div style={{fontSize:'0.52rem',fontWeight:600,letterSpacing:'0.1em',textTransform:'uppercase',color:'#888884'}}>{s.l}</div>
                      </div>
                    ))}
                  </div>
                </a>
                {planKey === 'basico' && (
                  <button onClick={(e) => { e.preventDefault(); abrirModal(evento) }}
                    style={{marginTop:'1rem',width:'100%',padding:'0.6rem',fontSize:'0.62rem',fontWeight:600,letterSpacing:'0.08em',textTransform:'uppercase',background:'#F7F7F5',color:'#888884',border:'1px solid #E0E0DC',cursor:'pointer',fontFamily:'Poppins,sans-serif',borderRadius:'6px',boxSizing:'border-box'}}>
                    {t('mejorarPlan')}
                  </button>
                )}
                {planKey === 'estandar' && (
                  <button onClick={(e) => { e.preventDefault(); abrirModal(evento) }}
                    style={{marginTop:'1rem',width:'100%',padding:'0.6rem',fontSize:'0.62rem',fontWeight:600,letterSpacing:'0.08em',textTransform:'uppercase',background:'#F5EDE8',color:'#C4917C',border:'1px solid #F0D8CC',cursor:'pointer',fontFamily:'Poppins,sans-serif',borderRadius:'6px',boxSizing:'border-box'}}>
                    {t('mejorarPremium')}
                  </button>
                )}
              </div>
            )
          })}
          <a href={prefijo + '/dashboard/nuevo'} style={{background:'#FFFFFF',padding:'1.5rem',border:'2px dashed #E0E0DC',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:'0.6rem',minHeight:'180px',textDecoration:'none',cursor:'pointer',borderRadius:'16px'}}>
            <div style={{fontSize:'2rem',fontWeight:100,color:'#BEBEBA',lineHeight:1}}>+</div>
            <div style={{fontSize:'0.65rem',fontWeight:600,letterSpacing:'0.12em',textTransform:'uppercase',color:'#888884'}}>{t('nuevoEvento')}</div>
          </a>
        </div>
      </main>

      {modalPlanes && (
        <ModalPlanes
          onClose={() => { setModalPlanes(false); setEventoSeleccionado(null) }}
          planActual={eventoSeleccionado?.plan}
          evento={eventoSeleccionado}
        />
      )}
    </div>
  )
}