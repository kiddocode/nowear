'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

const ADMIN_EMAIL = 'mnavarretegon@gmail.com'
const PLAN_COLORES = { basico:'#888884', estandar:'#8B9DC3', premium:'#C4917C', enterprise:'#F07987' }

export default function AdminPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [autorizado, setAutorizado] = useState(false)
  const [usuarios, setUsuarios] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [eventoDetalle, setEventoDetalle] = useState(null)
  const [looks, setLooks] = useState([])
  const [conflictos, setConflictos] = useState([])
  const [loadingEvento, setLoadingEvento] = useState(false)
  const [stats, setStats] = useState({ totalUsuarios: 0, totalEventos: 0, totalLooks: 0, totalConflictos: 0 })

  useEffect(() => {
    async function verificar() {
      const { data: { user } } = await supabase.auth.getUser()
      const { data: { session } } = await supabase.auth.getSession()
      if (!user || user.email !== ADMIN_EMAIL) {
        router.push('/')
        return
      }
      setAutorizado(true)
      await cargarDatos(session.access_token)
      setLoading(false)
    }
    verificar()
  }, [])

  async function cargarDatos(token) {
    const res = await fetch('/api/admin/data', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    const data = await res.json()
    if (data.ok) {
      setUsuarios(data.usuarios)
      setStats(data.stats)
    }
  }

  async function verEvento(evento, token) {
    setLoadingEvento(true)
    setEventoDetalle(evento)
    const { data: { session } } = await supabase.auth.getSession()
    const res = await fetch('/api/admin/data', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${session.access_token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventoId: evento.id })
    })
    const data = await res.json()
    if (data.ok) {
      setLooks(data.looks)
      setConflictos(data.conflictos)
    }
    setLoadingEvento(false)
  }

  const usuariosFiltrados = usuarios.filter(u => {
    if (!busqueda) return true
    const q = busqueda.toLowerCase()
    return (u.nombre || '').toLowerCase().includes(q) ||
           (u.email || '').toLowerCase().includes(q) ||
           u.eventos.some(ev => ev.nombre?.toLowerCase().includes(q) || ev.slug?.toLowerCase().includes(q))
  })

  const inputStyle = {fontFamily:'Poppins,sans-serif',fontSize:'0.85rem',fontWeight:300,padding:'0.85rem 1rem',border:'1px solid #E0E0DC',background:'#FFFFFF',outline:'none',boxSizing:'border-box',width:'100%'}
  const labelStyle = {fontSize:'0.58rem',fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase',color:'#888884'}

  if (loading) return <div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'100vh',fontSize:'0.75rem',color:'#888884'}}>Verificando acceso...</div>
  if (!autorizado) return null

  return (
    <div style={{fontFamily:"'Poppins',sans-serif",minHeight:'100vh',background:'#F7F7F5'}}>

      {/* HEADER */}
      <div style={{background:'#0A0A0A',padding:'1.5rem 3rem',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div>
          <div style={{fontSize:'0.55rem',fontWeight:700,letterSpacing:'0.2em',textTransform:'uppercase',color:'#F07987',marginBottom:'0.25rem'}}>NOWEAR ADMIN</div>
          <h1 style={{fontSize:'1.5rem',fontWeight:700,color:'#FFFFFF',letterSpacing:'-0.02em',margin:0}}>Dashboard</h1>
        </div>
        <button onClick={() => router.push('/dashboard')}
          style={{fontSize:'0.65rem',fontWeight:600,letterSpacing:'0.1em',textTransform:'uppercase',color:'#888884',background:'none',border:'1px solid #333',cursor:'pointer',fontFamily:'Poppins,sans-serif',padding:'0.5rem 1rem',borderRadius:'4px'}}>
          Mi panel
        </button>
      </div>

      <div style={{padding:'2.5rem 3rem'}}>

        {/* STATS */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'1.5rem',marginBottom:'2.5rem'}}>
          {[
            {n: stats.totalUsuarios, l: 'Usuarias'},
            {n: stats.totalEventos, l: 'Eventos'},
            {n: stats.totalLooks, l: 'Looks registrados'},
            {n: stats.totalConflictos, l: 'Conflictos'},
          ].map((s,i) => (
            <div key={i} style={{background:'#FFFFFF',borderRadius:'12px',padding:'1.5rem',border:'1px solid #E0E0DC'}}>
              <div style={{fontSize:'2rem',fontWeight:700,color:'#0A0A0A',lineHeight:1,letterSpacing:'-0.03em'}}>{s.n}</div>
              <div style={{fontSize:'0.58rem',fontWeight:600,letterSpacing:'0.12em',textTransform:'uppercase',color:'#888884',marginTop:'0.4rem'}}>{s.l}</div>
            </div>
          ))}
        </div>

        <div style={{display:'grid',gridTemplateColumns:eventoDetalle?'1fr 1fr':'1fr',gap:'2rem'}}>

          {/* LISTA USUARIOS */}
          <div>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1.25rem',gap:'1rem'}}>
              <h2 style={{fontSize:'1rem',fontWeight:600,color:'#0A0A0A',margin:0}}>Usuarias</h2>
              <input type="text" placeholder="Buscar por nombre, email o evento..." value={busqueda} onChange={e => setBusqueda(e.target.value)}
                style={{...inputStyle,width:'280px'}}/>
            </div>

            <div style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
              {usuariosFiltrados.map((u, i) => (
                <div key={i} style={{background:'#FFFFFF',border:`1px solid ${u.pending_deletion_at ? '#F07987' : '#E0E0DC'}`,borderRadius:'8px',padding:'1.25rem'}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'0.75rem'}}>
                    <div>
                      <div style={{fontSize:'0.88rem',fontWeight:600,color:'#0A0A0A',marginBottom:'0.15rem'}}>{u.nombre || 'Sin nombre'}</div>
                      <div style={{fontSize:'0.72rem',fontWeight:300,color:'#888884'}}>{u.email}</div>
                    </div>
                    <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:'0.25rem'}}>
                      <span style={{fontSize:'0.55rem',fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',color:'#888884'}}>
                        {new Date(u.created_at).toLocaleDateString('es-ES',{day:'numeric',month:'short',year:'numeric'})}
                      </span>
                      {u.pending_deletion_at && (
                        <span style={{fontSize:'0.55rem',fontWeight:700,letterSpacing:'0.08em',textTransform:'uppercase',color:'#F07987',background:'#FFF0F1',padding:'0.15rem 0.5rem',borderRadius:'10px'}}>
                          Pendiente eliminación
                        </span>
                      )}
                    </div>
                  </div>

                  {u.eventos.length === 0 ? (
                    <p style={{fontSize:'0.72rem',fontWeight:300,color:'#BEBEBA',margin:0}}>Sin eventos</p>
                  ) : (
                    <div style={{display:'flex',flexDirection:'column',gap:'0.5rem'}}>
                      {u.eventos.map((ev, j) => (
                        <button key={j} onClick={() => verEvento(ev)}
                          style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'0.65rem 0.85rem',background:eventoDetalle?.id===ev.id?'#0A0A0A':'#F7F7F5',border:`1px solid ${eventoDetalle?.id===ev.id?'#0A0A0A':'#E0E0DC'}`,borderRadius:'4px',cursor:'pointer',fontFamily:'Poppins,sans-serif',width:'100%'}}>
                          <div style={{display:'flex',alignItems:'center',gap:'0.5rem'}}>
                            {!ev.activo && <span style={{fontSize:'0.55rem',color:'#F07987'}}>●</span>}
                            <span style={{fontSize:'0.78rem',fontWeight:500,color:eventoDetalle?.id===ev.id?'#FFFFFF':'#0A0A0A',textAlign:'left'}}>{ev.nombre}</span>
                          </div>
                          <div style={{display:'flex',alignItems:'center',gap:'0.5rem'}}>
                            <span style={{fontSize:'0.55rem',fontWeight:700,letterSpacing:'0.08em',textTransform:'uppercase',color:eventoDetalle?.id===ev.id?'rgba(255,255,255,0.6)':PLAN_COLORES[ev.plan?.toLowerCase()] || '#888884'}}>
                              {ev.plan}
                            </span>
                            <span style={{fontSize:'0.65rem',color:eventoDetalle?.id===ev.id?'rgba(255,255,255,0.5)':'#888884'}}>›</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {usuariosFiltrados.length === 0 && (
                <div style={{padding:'3rem',textAlign:'center',color:'#888884',fontSize:'0.78rem',background:'#FFFFFF',border:'1px solid #E0E0DC',borderRadius:'8px'}}>
                  No se encontraron resultados.
                </div>
              )}
            </div>
          </div>

          {/* DETALLE EVENTO */}
          {eventoDetalle && (
            <div>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1.25rem'}}>
                <h2 style={{fontSize:'1rem',fontWeight:600,color:'#0A0A0A',margin:0}}>{eventoDetalle.nombre}</h2>
                <div style={{display:'flex',gap:'0.5rem'}}>
                  <a href={`/evento/${eventoDetalle.slug}`} target="_blank" rel="noopener noreferrer"
                    style={{fontSize:'0.65rem',fontWeight:600,letterSpacing:'0.08em',textTransform:'uppercase',color:'#0A0A0A',background:'none',border:'1px solid #E0E0DC',cursor:'pointer',fontFamily:'Poppins,sans-serif',padding:'0.4rem 0.75rem',borderRadius:'4px',textDecoration:'none'}}>
                    Ver como org ↗
                  </a>
                  <a href={`/${eventoDetalle.slug}`} target="_blank" rel="noopener noreferrer"
                    style={{fontSize:'0.65rem',fontWeight:600,letterSpacing:'0.08em',textTransform:'uppercase',color:'#FFFFFF',background:'#0A0A0A',border:'none',cursor:'pointer',fontFamily:'Poppins,sans-serif',padding:'0.4rem 0.75rem',borderRadius:'4px',textDecoration:'none'}}>
                    Link invitadas ↗
                  </a>
                  <button onClick={() => { setEventoDetalle(null); setLooks([]); setConflictos([]) }}
                    style={{fontSize:'0.75rem',color:'#888884',background:'none',border:'none',cursor:'pointer',fontFamily:'Poppins,sans-serif',padding:'0.4rem'}}>
                    ✕
                  </button>
                </div>
              </div>

              {loadingEvento ? (
                <div style={{padding:'3rem',textAlign:'center',color:'#888884',fontSize:'0.78rem'}}>Cargando...</div>
              ) : (
                <>
                  {/* Info evento */}
                  <div style={{background:'#FFFFFF',border:'1px solid #E0E0DC',borderRadius:'8px',padding:'1.25rem',marginBottom:'1.25rem'}}>
                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.75rem'}}>
                      {[
                        {l:'Tipo', v: eventoDetalle.tipo},
                        {l:'Plan', v: eventoDetalle.plan},
                        {l:'Fecha', v: eventoDetalle.fecha ? new Date(eventoDetalle.fecha).toLocaleDateString('es-ES',{day:'numeric',month:'long',year:'numeric'}) : 'Sin fecha'},
                        {l:'Slug', v: eventoDetalle.slug},
                        {l:'Looks', v: looks.length},
                        {l:'Conflictos', v: conflictos.length},
                        {l:'Estado', v: eventoDetalle.activo ? 'Activo' : 'Inactivo'},
                        {l:'Creado', v: new Date(eventoDetalle.created_at).toLocaleDateString('es-ES',{day:'numeric',month:'short',year:'numeric'})},
                      ].map((item,i) => (
                        <div key={i}>
                          <div style={{fontSize:'0.55rem',fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',color:'#888884',marginBottom:'0.15rem'}}>{item.l}</div>
                          <div style={{fontSize:'0.82rem',fontWeight:400,color:'#0A0A0A'}}>{item.v}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Looks */}
                  <div style={{background:'#FFFFFF',border:'1px solid #E0E0DC',borderRadius:'8px',marginBottom:'1.25rem',overflow:'hidden'}}>
                    <div style={{padding:'0.85rem 1.25rem',borderBottom:'1px solid #E0E0DC',display:'flex',justifyContent:'space-between'}}>
                      <span style={{fontSize:'0.65rem',fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',color:'#0A0A0A'}}>Looks registrados</span>
                      <span style={{fontSize:'0.65rem',fontWeight:700,color:'#888884'}}>{looks.length}</span>
                    </div>
                    {looks.length === 0 ? (
                      <div style={{padding:'1.5rem',textAlign:'center',fontSize:'0.75rem',color:'#888884'}}>Sin looks</div>
                    ) : (
                      <div style={{overflowX:'auto'}}>
                        <table style={{width:'100%',borderCollapse:'collapse',minWidth:'400px'}}>
                          <thead>
                            <tr style={{background:'#F7F7F5'}}>
                              {['Color','Nombre','Marca','Modelo','Estado'].map((h,i) => (
                                <th key={i} style={{fontSize:'0.55rem',fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',color:'#888884',textAlign:'left',padding:'0.65rem 0.85rem',borderBottom:'1px solid #E0E0DC'}}>{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {looks.map((l,i) => (
                              <tr key={i} style={{borderBottom:'1px solid #E0E0DC',background:i%2===0?'#FFFFFF':'#FAFAFA'}}>
                                <td style={{padding:'0.65rem 0.85rem'}}>
                                  <span style={{width:'16px',height:'16px',borderRadius:'50%',background:l.color_hex,border:'1px solid rgba(0,0,0,0.08)',display:'inline-block'}}></span>
                                </td>
                                <td style={{padding:'0.65rem 0.85rem',fontSize:'0.75rem',fontWeight:600,color:'#0A0A0A'}}>{l.nombre_invitada}</td>
                                <td style={{padding:'0.65rem 0.85rem',fontSize:'0.75rem',color:'#0A0A0A'}}>{l.marca||'—'}</td>
                                <td style={{padding:'0.65rem 0.85rem',fontSize:'0.75rem',color:'#0A0A0A'}}>{l.modelo||'—'}</td>
                                <td style={{padding:'0.65rem 0.85rem'}}>
                                  <span style={{fontSize:'0.55rem',fontWeight:700,letterSpacing:'0.08em',textTransform:'uppercase',padding:'0.15rem 0.5rem',borderRadius:'10px',
                                    background:l.estado==='confirmado'?'#0A0A0A':l.estado==='pendiente'?'#FFF8F0':l.estado==='rechazado'?'#FFF0F1':'#F5EDE8',
                                    color:l.estado==='confirmado'?'#FFFFFF':l.estado==='pendiente'?'#C4917C':l.estado==='rechazado'?'#F07987':'#C4917C'}}>
                                    {l.estado}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                  {/* Conflictos */}
                  {conflictos.length > 0 && (
                    <div style={{background:'#FFFFFF',border:'1px solid #F07987',borderRadius:'8px',overflow:'hidden'}}>
                      <div style={{padding:'0.85rem 1.25rem',borderBottom:'1px solid #F07987',background:'#FFF0F1',display:'flex',justifyContent:'space-between'}}>
                        <span style={{fontSize:'0.65rem',fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',color:'#F07987'}}>Conflictos</span>
                        <span style={{fontSize:'0.65rem',fontWeight:700,color:'#F07987'}}>{conflictos.length}</span>
                      </div>
                      <div style={{overflowX:'auto'}}>
                        <table style={{width:'100%',borderCollapse:'collapse',minWidth:'300px'}}>
                          <thead>
                            <tr style={{background:'#F7F7F5'}}>
                              {['Invitada','Marca','Modelo','Conflicto con'].map((h,i) => (
                                <th key={i} style={{fontSize:'0.55rem',fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',color:'#888884',textAlign:'left',padding:'0.65rem 0.85rem',borderBottom:'1px solid #E0E0DC'}}>{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {conflictos.map((c,i) => (
                              <tr key={i} style={{borderBottom:'1px solid #E0E0DC',background:i%2===0?'#FFFFFF':'#FAFAFA'}}>
                                <td style={{padding:'0.65rem 0.85rem',fontSize:'0.75rem',fontWeight:600,color:'#0A0A0A'}}>{c.nombre_invitada}</td>
                                <td style={{padding:'0.65rem 0.85rem',fontSize:'0.75rem',color:'#0A0A0A'}}>{c.marca||'—'}</td>
                                <td style={{padding:'0.65rem 0.85rem',fontSize:'0.75rem',color:'#0A0A0A'}}>{c.modelo||'—'}</td>
                                <td style={{padding:'0.65rem 0.85rem',fontSize:'0.75rem',fontWeight:600,color:'#F07987'}}>{c.nombre_conflicto_con||'—'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}