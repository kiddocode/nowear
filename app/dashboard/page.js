'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [eventos, setEventos] = useState([])
  const [loading, setLoading] = useState(true)
  const [menuAbierto, setMenuAbierto] = useState(false)

  useEffect(() => {
    async function cargarDatos() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setUser(user)

      const { data: prof } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      setProfile(prof)

      const { data: evs } = await supabase
        .from('eventos')
        .select('*, looks(count)')
        .eq('organizadora_id', user.id)
        .order('created_at', { ascending: false })
      setEventos(evs || [])
      setLoading(false)
    }
    cargarDatos()
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/')
  }

  function diasRestantes(fecha) {
    if (!fecha) return '?'
    const diff = Math.ceil((new Date(fecha) - new Date()) / (1000 * 60 * 60 * 24))
    return diff > 0 ? diff + 'd' : 'Pasado'
  }

  function iniciales(nombre) {
    if (!nombre) return '?'
    return nombre.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  const totalLooks = eventos.reduce((acc, e) => acc + (e.looks?.[0]?.count || 0), 0)

  if (loading) return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'calc(100vh - 68px)',fontSize:'0.75rem',fontWeight:300,color:'#888884'}}>
      Cargando...
    </div>
  )

  const Sidebar = () => (
    <aside className="dashboard-sidebar" style={{borderRight:'1px solid #E0E0DC',padding:'2rem 0',display:'flex',flexDirection:'column',background:'#FFFFFF',position:'sticky',top:'68px',height:'calc(100vh - 68px)'}}>
      <div style={{marginBottom:'1.5rem'}}>
        <div style={{fontSize:'0.55rem',fontWeight:600,letterSpacing:'0.2em',textTransform:'uppercase',color:'#BEBEBA',padding:'0 1.5rem',marginBottom:'0.5rem'}}>Principal</div>
        <a href="/dashboard" style={{display:'flex',alignItems:'center',gap:'0.65rem',padding:'0.7rem 1.5rem',fontSize:'0.75rem',fontWeight:500,color:'#0A0A0A',background:'#F0F0EE',borderLeft:'2px solid #0A0A0A',textDecoration:'none'}}>
          <span style={{width:'5px',height:'5px',borderRadius:'50%',background:'#0A0A0A',flexShrink:0}}></span>Mis eventos
        </a>
        <a href="/dashboard/nuevo" style={{display:'flex',alignItems:'center',gap:'0.65rem',padding:'0.7rem 1.5rem',fontSize:'0.75rem',fontWeight:300,color:'#888884',textDecoration:'none'}}>
          <span style={{width:'5px',height:'5px',borderRadius:'50%',background:'currentColor',flexShrink:0,opacity:0.4}}></span>Nuevo evento
        </a>
      </div>
      <div style={{marginBottom:'1.5rem'}}>
        <div style={{fontSize:'0.55rem',fontWeight:600,letterSpacing:'0.2em',textTransform:'uppercase',color:'#BEBEBA',padding:'0 1.5rem',marginBottom:'0.5rem'}}>Cuenta</div>
        {['Perfil','Facturación','Ayuda'].map((item,i) => (
          <a key={i} href="#" style={{display:'flex',alignItems:'center',gap:'0.65rem',padding:'0.7rem 1.5rem',fontSize:'0.75rem',fontWeight:300,color:'#888884',textDecoration:'none'}}>
            <span style={{width:'5px',height:'5px',borderRadius:'50%',background:'currentColor',flexShrink:0,opacity:0.4}}></span>{item}
          </a>
        ))}
        <button onClick={handleLogout} style={{display:'flex',alignItems:'center',gap:'0.65rem',padding:'0.7rem 1.5rem',fontSize:'0.75rem',fontWeight:300,color:'#888884',background:'none',border:'none',cursor:'pointer',fontFamily:'Poppins,sans-serif',width:'100%',textAlign:'left'}}>
          <span style={{width:'5px',height:'5px',borderRadius:'50%',background:'currentColor',flexShrink:0,opacity:0.4}}></span>Cerrar sesión
        </button>
      </div>
      <div style={{marginTop:'auto',padding:'1.25rem 1.5rem',borderTop:'1px solid #E0E0DC'}}>
        <div style={{display:'flex',alignItems:'center',gap:'0.75rem'}}>
          <div style={{width:'32px',height:'32px',borderRadius:'50%',background:'#0A0A0A',color:'#FFFFFF',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.62rem',fontWeight:600,flexShrink:0}}>
            {iniciales(profile?.nombre || user?.email)}
          </div>
          <div>
            <div style={{fontSize:'0.75rem',fontWeight:500,color:'#0A0A0A'}}>{profile?.nombre || user?.email}</div>
            <div style={{fontSize:'0.62rem',fontWeight:300,color:'#888884'}}>{eventos.length} evento{eventos.length !== 1 ? 's' : ''}</div>
          </div>
        </div>
      </div>
    </aside>
  )

  return (
    <div className="dashboard-grid" style={{display:'grid',gridTemplateColumns:'220px 1fr',minHeight:'calc(100vh - 68px)'}}>

      <Sidebar />

      {/* MENÚ MÓVIL */}
      <div className="dashboard-mobile-nav" style={{display:'none',padding:'1rem 1.5rem',borderBottom:'1px solid #E0E0DC',background:'#FFFFFF',alignItems:'center',justifyContent:'space-between'}}>
        <div style={{display:'flex',alignItems:'center',gap:'0.75rem'}}>
          <div style={{width:'28px',height:'28px',borderRadius:'50%',background:'#0A0A0A',color:'#FFFFFF',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.55rem',fontWeight:600}}>
            {iniciales(profile?.nombre || user?.email)}
          </div>
          <span style={{fontSize:'0.75rem',fontWeight:500,color:'#0A0A0A'}}>{profile?.nombre || user?.email}</span>
        </div>
        <button onClick={() => setMenuAbierto(!menuAbierto)} style={{background:'none',border:'none',cursor:'pointer',padding:'0.25rem',display:'flex',flexDirection:'column',gap:'4px'}}>
          <span style={{width:'20px',height:'1.5px',background:'#0A0A0A',display:'block'}}></span>
          <span style={{width:'20px',height:'1.5px',background:'#0A0A0A',display:'block'}}></span>
          <span style={{width:'20px',height:'1.5px',background:'#0A0A0A',display:'block'}}></span>
        </button>
      </div>

      {menuAbierto && (
        <div className="dashboard-mobile-menu" style={{display:'none',position:'fixed',top:'68px',left:0,right:0,background:'#FFFFFF',zIndex:500,borderBottom:'1px solid #E0E0DC',padding:'1rem 0'}}>
          <a href="/dashboard" style={{display:'block',padding:'0.75rem 1.5rem',fontSize:'0.82rem',fontWeight:500,color:'#0A0A0A',textDecoration:'none'}}>Mis eventos</a>
          <a href="/dashboard/nuevo" style={{display:'block',padding:'0.75rem 1.5rem',fontSize:'0.82rem',fontWeight:300,color:'#888884',textDecoration:'none'}}>Nuevo evento</a>
          <a href="#" style={{display:'block',padding:'0.75rem 1.5rem',fontSize:'0.82rem',fontWeight:300,color:'#888884',textDecoration:'none'}}>Perfil</a>
          <a href="#" style={{display:'block',padding:'0.75rem 1.5rem',fontSize:'0.82rem',fontWeight:300,color:'#888884',textDecoration:'none'}}>Facturación</a>
          <button onClick={handleLogout} style={{display:'block',padding:'0.75rem 1.5rem',fontSize:'0.82rem',fontWeight:300,color:'#888884',background:'none',border:'none',cursor:'pointer',fontFamily:'Poppins,sans-serif',width:'100%',textAlign:'left'}}>Cerrar sesión</button>
        </div>
      )}

      <main style={{padding:'3rem'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',marginBottom:'2.5rem',paddingBottom:'2rem',borderBottom:'1px solid #E0E0DC'}}>
          <div>
            <h1 style={{fontSize:'2.2rem',fontWeight:200,color:'#0A0A0A',letterSpacing:'-0.025em',lineHeight:1,marginBottom:'0.35rem'}}>Mis eventos</h1>
            <p style={{fontSize:'0.75rem',fontWeight:300,color:'#888884'}}>Gestiona tus eventos y comparte los links con tus invitadas</p>
          </div>
          <a href="/dashboard/nuevo" style={{fontSize:'0.72rem',fontWeight:500,padding:'0.65rem 1.5rem',background:'#0A0A0A',color:'#FFFFFF',textDecoration:'none',whiteSpace:'nowrap'}}>+ Nuevo evento</a>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'1px',background:'#E0E0DC',border:'1px solid #E0E0DC',marginBottom:'3rem'}}>
          {[
            {num: eventos.length.toString(), label:'Eventos activos'},
            {num: totalLooks.toString(), label:'Looks registrados'},
            {num:'0', label:'Conflictos'},
          ].map((s,i) => (
            <div key={i} style={{background:'#F7F7F5',padding:'2rem'}}>
              <div style={{fontSize:'2.5rem',fontWeight:100,color:'#0A0A0A',lineHeight:1,marginBottom:'0.4rem',letterSpacing:'-0.03em'}}>{s.num}</div>
              <div style={{fontSize:'0.6rem',fontWeight:600,letterSpacing:'0.12em',textTransform:'uppercase',color:'#888884'}}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:'1px',background:'#E0E0DC',border:'1px solid #E0E0DC'}}>
          {eventos.map((evento) => (
            <a key={evento.id} href={`/evento/${evento.slug}`} style={{background:'#FFFFFF',padding:'2rem',cursor:'pointer',textDecoration:'none',display:'block'}}>
              <div style={{fontSize:'0.58rem',fontWeight:600,letterSpacing:'0.12em',textTransform:'uppercase',color:'#888884',marginBottom:'0.65rem'}}>{evento.tipo}</div>
              <div style={{fontSize:'1.4rem',fontWeight:300,color:'#0A0A0A',letterSpacing:'-0.01em',marginBottom:'0.2rem'}}>{evento.nombre}</div>
              <div style={{fontSize:'0.72rem',fontWeight:300,color:'#888884',marginBottom:'1.5rem'}}>
                {evento.fecha ? new Date(evento.fecha).toLocaleDateString('es-ES',{day:'numeric',month:'long',year:'numeric'}) : 'Sin fecha'}
                {evento.lugar ? ` · ${evento.lugar}` : ''}
              </div>
              <div style={{display:'flex',gap:'1.5rem',paddingTop:'1.25rem',borderTop:'1px solid #E0E0DC'}}>
                {[
                  {n: evento.looks?.[0]?.count?.toString() || '0', l:'Looks'},
                  {n:'0', l:'Conflictos'},
                  {n: diasRestantes(evento.fecha), l:'Restantes'}
                ].map((s,i) => (
                  <div key={i}>
                    <div style={{fontSize:'1.4rem',fontWeight:200,color:'#0A0A0A',lineHeight:1,marginBottom:'0.15rem'}}>{s.n}</div>
                    <div style={{fontSize:'0.55rem',fontWeight:600,letterSpacing:'0.1em',textTransform:'uppercase',color:'#BEBEBA'}}>{s.l}</div>
                  </div>
                ))}
              </div>
              <span style={{display:'inline-block',fontSize:'0.55rem',fontWeight:600,letterSpacing:'0.1em',textTransform:'uppercase',padding:'0.2rem 0.6rem',marginTop:'1rem',background:'#F5EDE8',color:'#C4917C'}}>● {evento.plan}</span>
            </a>
          ))}

          <a href="/dashboard/nuevo" style={{background:'#FFFFFF',padding:'2rem',border:'2px dashed #E0E0DC',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:'0.6rem',minHeight:'200px',textDecoration:'none',cursor:'pointer'}}>
            <div style={{fontSize:'2rem',fontWeight:100,color:'#BEBEBA',lineHeight:1}}>+</div>
            <div style={{fontSize:'0.65rem',fontWeight:600,letterSpacing:'0.12em',textTransform:'uppercase',color:'#888884'}}>Nuevo evento</div>
          </a>
        </div>
      </main>
    </div>
  )
}
