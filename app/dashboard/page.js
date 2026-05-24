'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Sidebar from '../components/Sidebar'

const PLAN_COLORES = {
  basico:     { bg: '#F0F0EE', color: '#888884', label: 'Básico' },
  estandar:   { bg: '#EEF2F8', color: '#8B9DC3', label: 'Estándar' },
  premium:    { bg: '#F5EDE8', color: '#C4917C', label: 'Premium' },
  enterprise: { bg: '#FFF0F1', color: '#F07987', label: 'Enterprise' },
}

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
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [eventos, setEventos] = useState([])
  const [conflictosPorEvento, setConflictosPorEvento] = useState({})
  const [loading, setLoading] = useState(true)
  const [eliminando, setEliminando] = useState(null)

  useEffect(() => {
    async function cargarDatos() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setUser(user)

      const { data: prof } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      setProfile(prof)

      const { data: evs } = await supabase
        .from('eventos')
        .select('*, looks(count)')
        .eq('organizadora_id', user.id)
        .order('created_at', { ascending: false })
      setEventos(evs || [])

      // Cargar conflictos reales agrupados por evento
      if (evs && evs.length > 0) {
        const eventoIds = evs.map(e => e.id)
        const { data: cnfs } = await supabase
          .from('conflictos')
          .select('evento_id')
          .in('evento_id', eventoIds)
        const mapa = {}
        ;(cnfs || []).forEach(c => {
          mapa[c.evento_id] = (mapa[c.evento_id] || 0) + 1
        })
        setConflictosPorEvento(mapa)
      }

      setLoading(false)
    }
    cargarDatos()
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/')
  }

  async function handleEliminar(e, eventoId) {
    e.preventDefault()
    e.stopPropagation()
    if (!confirm('¿Segura que quieres eliminar este evento? Esta acción no se puede deshacer.')) return
    setEliminando(eventoId)
    await supabase.from('looks').delete().eq('evento_id', eventoId)
    await supabase.from('eventos').delete().eq('id', eventoId)
    setEventos(prev => prev.filter(ev => ev.id !== eventoId))
    setEliminando(null)
  }

  function diasRestantes(fecha) {
    if (!fecha) return '?'
    const diff = Math.ceil((new Date(fecha) - new Date()) / (1000 * 60 * 60 * 24))
    return diff > 0 ? diff + 'd' : 'Pasado'
  }

  function getNombreCompleto() {
    if (user?.user_metadata?.full_name) return user.user_metadata.full_name
    if (user?.user_metadata?.name) return user.user_metadata.name
    if (profile?.nombre) return profile.nombre
    return user?.email || ''
  }

  const totalLooks = eventos.reduce((acc, e) => acc + (e.looks?.[0]?.count || 0), 0)
  const totalConflictos = Object.values(conflictosPorEvento).reduce((a, b) => a + b, 0)
  const esAdmin = profile?.is_admin

  // Detectar plan más alto del usuario
  const tieneAlgunBasico = eventos.some(e => getPlan(e) === 'basico')
  const tieneAlgunEstandar = eventos.some(e => getPlan(e) === 'estandar')
  const tienePremiumOSuperior = eventos.some(e => ['premium','enterprise'].includes(getPlan(e)))

  if (loading) return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'calc(100vh - 68px)',fontSize:'0.75rem',fontWeight:300,color:'#888884'}}>
      Cargando...
    </div>
  )

  return (
    <div className="dashboard-grid" style={{display:'grid',gridTemplateColumns:'220px 1fr',minHeight:'calc(100vh - 68px)'}}>
      <Sidebar activo="/dashboard" />

      <main style={{padding:'3rem'}}>

        {/* CABECERA */}
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',marginBottom:'2.5rem',paddingBottom:'2rem',borderBottom:'1px solid #E0E0DC'}}>
          <div>
            <h1 style={{fontSize:'2.2rem',fontWeight:200,color:'#0A0A0A',letterSpacing:'-0.025em',lineHeight:1,marginBottom:'0.35rem'}}>Mis eventos</h1>
            <p style={{fontSize:'0.75rem',fontWeight:300,color:'#888884'}}>Gestiona tus eventos y comparte los links con tus invitadas</p>
          </div>
          <a href="/dashboard/nuevo" style={{fontSize:'0.82rem',fontWeight:600,padding:'0.85rem 2rem',background:'#0A0A0A',color:'#FFFFFF',textDecoration:'none',whiteSpace:'nowrap',borderRadius:'4px'}}>+ Nuevo evento</a>
        </div>

        {/* STATS */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'1.5rem',marginBottom: tieneAlgunBasico ? '1.5rem' : '3rem'}}>
          {[
            {num: eventos.length.toString(), label:'Eventos activos'},
            {num: totalLooks.toString(), label:'Looks registrados'},
            {num: totalConflictos.toString(), label:'Conflictos', color: totalConflictos > 0 ? '#F07987' : '#0A0A0A'},
          ].map((s,i) => (
            <div key={i} style={{background:'#FFFFFF',padding:'2rem',borderRadius:'16px',boxShadow:'0 2px 16px rgba(0,0,0,0.06)',border:'1px solid #F0F0EE'}}>
              <div style={{fontSize:'2.5rem',fontWeight:700,color:s.color||'#0A0A0A',lineHeight:1,marginBottom:'0.4rem',letterSpacing:'-0.03em'}}>{s.num}</div>
              <div style={{fontSize:'0.6rem',fontWeight:600,letterSpacing:'0.12em',textTransform:'uppercase',color:'#888884'}}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* BANNER UPGRADE - solo si tiene eventos en plan básico */}
        {tieneAlgunBasico && !tienePremiumOSuperior && (
          <div style={{marginBottom:'3rem',padding:'1rem 1.5rem',background:'#F7F7F5',border:'1px solid #E0E0DC',borderRadius:'12px',display:'flex',justifyContent:'space-between',alignItems:'center',gap:'1rem',flexWrap:'wrap'}}>
            <div style={{display:'flex',alignItems:'center',gap:'0.75rem'}}>
              <span style={{fontSize:'1.1rem'}}>✨</span>
              <div>
                <span style={{fontSize:'0.78rem',fontWeight:600,color:'#0A0A0A'}}>Exporta la lista de looks y añade personalización. </span>
                <span style={{fontSize:'0.78rem',fontWeight:300,color:'#888884'}}>Disponible desde el plan Estándar (19€).</span>
              </div>
            </div>
            <a href="/dashboard/facturacion" style={{fontSize:'0.65rem',fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',padding:'0.6rem 1.25rem',background:'#0A0A0A',color:'#FFFFFF',textDecoration:'none',borderRadius:'4px',whiteSpace:'nowrap'}}>
              Ver planes
            </a>
          </div>
        )}

        {/* BANNER UPGRADE - tiene estándar pero no premium */}
        {tieneAlgunEstandar && !tienePremiumOSuperior && (
          <div style={{marginBottom:'3rem',padding:'1rem 1.5rem',background:'#F5EDE8',border:'1px solid #F0D8CC',borderRadius:'12px',display:'flex',justifyContent:'space-between',alignItems:'center',gap:'1rem',flexWrap:'wrap'}}>
            <div style={{display:'flex',alignItems:'center',gap:'0.75rem'}}>
              <span style={{fontSize:'1.1rem'}}>🎨</span>
              <div>
                <span style={{fontSize:'0.78rem',fontWeight:600,color:'#0A0A0A'}}>Personaliza la foto y el mensaje del link de tus invitadas. </span>
                <span style={{fontSize:'0.78rem',fontWeight:300,color:'#888884'}}>Disponible en el plan Premium (29€).</span>
              </div>
            </div>
            <a href="/dashboard/facturacion" style={{fontSize:'0.65rem',fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',padding:'0.6rem 1.25rem',background:'#C4917C',color:'#FFFFFF',textDecoration:'none',borderRadius:'4px',whiteSpace:'nowrap'}}>
              Ver Premium
            </a>
          </div>
        )}

        {/* TARJETAS EVENTOS */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:'1.5rem'}}>
          {eventos.map((evento) => {
            const planKey = getPlan(evento)
            const planInfo = PLAN_COLORES[planKey]
            const numConflictos = conflictosPorEvento[evento.id] || 0

            return (
              <div key={evento.id} style={{background:'#FFFFFF',padding:'2rem',position:'relative',borderRadius:'16px',boxShadow:'0 2px 16px rgba(0,0,0,0.06)',border:'1px solid #F0F0EE',transition:'transform 0.15s, box-shadow 0.15s',cursor:'pointer'}}
                onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-3px)';e.currentTarget.style.boxShadow='0 8px 32px rgba(0,0,0,0.12)'}}
                onMouseLeave={e=>{e.currentTarget.style.transform='none';e.currentTarget.style.boxShadow='0 2px 16px rgba(0,0,0,0.06)'}}>

                {esAdmin && (
                  <button
                    onClick={(e) => handleEliminar(e, evento.id)}
                    disabled={eliminando === evento.id}
                    style={{position:'absolute',top:'1rem',right:'1rem',background:'none',border:'none',cursor:'pointer',color:'#BEBEBA',fontSize:'0.75rem',fontFamily:'Poppins,sans-serif',padding:'0.25rem 0.5rem'}}>
                    {eliminando === evento.id ? '...' : '×'}
                  </button>
                )}

                <a href={`/evento/${evento.slug}`} style={{textDecoration:'none',display:'block'}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'0.65rem'}}>
                    <div style={{fontSize:'0.58rem',fontWeight:600,letterSpacing:'0.12em',textTransform:'uppercase',color:'#888884'}}>{evento.tipo}</div>
                    {/* Badge plan */}
                    <span style={{fontSize:'0.55rem',fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',padding:'0.2rem 0.6rem',borderRadius:'20px',background:planInfo.bg,color:planInfo.color,flexShrink:0}}>
                      {planInfo.label}
                    </span>
                  </div>

                  <div style={{fontSize:'1.4rem',fontWeight:300,color:'#0A0A0A',letterSpacing:'-0.01em',marginBottom:'0.2rem'}}>{evento.nombre}</div>
                  <div style={{fontSize:'0.72rem',fontWeight:300,color:'#888884',marginBottom:'1.5rem'}}>
                    {evento.fecha ? new Date(evento.fecha).toLocaleDateString('es-ES',{day:'numeric',month:'long',year:'numeric'}) : 'Sin fecha'}
                    {evento.lugar ? ` · ${evento.lugar}` : ''}
                  </div>

                  <div style={{display:'flex',gap:'1.5rem',paddingTop:'1.25rem',borderTop:'1px solid #E0E0DC'}}>
                    {[
                      {n: evento.looks?.[0]?.count?.toString() || '0', l:'Looks'},
                      {n: numConflictos.toString(), l:'Conflictos', color: numConflictos > 0 ? '#F07987' : '#0A0A0A'},
                      {n: diasRestantes(evento.fecha), l:'Restantes'}
                    ].map((s,i) => (
                      <div key={i}>
                        <div style={{fontSize:'2rem',fontWeight:700,color:s.color||'#0A0A0A',lineHeight:1,marginBottom:'0.25rem',letterSpacing:'-0.02em'}}>{s.n}</div>
                        <div style={{fontSize:'0.55rem',fontWeight:600,letterSpacing:'0.1em',textTransform:'uppercase',color:'#888884'}}>{s.l}</div>
                      </div>
                    ))}
                  </div>

                  {/* Features bloqueadas para Básico */}
                  {planKey === 'basico' && (
                    <div style={{marginTop:'1rem',padding:'0.6rem 0.75rem',background:'#F7F7F5',borderRadius:'6px',display:'flex',alignItems:'center',gap:'0.5rem'}}>
                      <span style={{fontSize:'0.7rem'}}>🔒</span>
                      <span style={{fontSize:'0.62rem',fontWeight:400,color:'#888884'}}>Exportar y personalización desde Estándar</span>
                    </div>
                  )}
                  {planKey === 'estandar' && (
                    <div style={{marginTop:'1rem',padding:'0.6rem 0.75rem',background:'#F5EDE8',borderRadius:'6px',display:'flex',alignItems:'center',gap:'0.5rem'}}>
                      <span style={{fontSize:'0.7rem'}}>🎨</span>
                      <span style={{fontSize:'0.62rem',fontWeight:400,color:'#C4917C'}}>Personalización disponible en Premium</span>
                    </div>
                  )}
                </a>
              </div>
            )
          })}

          <a href="/dashboard/nuevo" style={{background:'#FFFFFF',padding:'2rem',border:'2px dashed #E0E0DC',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:'0.6rem',minHeight:'200px',textDecoration:'none',cursor:'pointer',borderRadius:'16px'}}>
            <div style={{fontSize:'2rem',fontWeight:100,color:'#BEBEBA',lineHeight:1}}>+</div>
            <div style={{fontSize:'0.65rem',fontWeight:600,letterSpacing:'0.12em',textTransform:'uppercase',color:'#888884'}}>Nuevo evento</div>
          </a>
        </div>
      </main>
    </div>
  )
}