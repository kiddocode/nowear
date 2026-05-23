'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function EventoDetalle() {
  const { slug } = useParams()
  const router = useRouter()
  const [evento, setEvento] = useState(null)
  const [looks, setLooks] = useState([])
  const [conflictos, setConflictos] = useState([])
  const [loading, setLoading] = useState(true)
  const [tabActiva, setTabActiva] = useState(0)
  const [copiado, setCopiado] = useState(false)
  const [guardandoAjustes, setGuardandoAjustes] = useState(false)
  const [ajustesMensaje, setAjustesMensaje] = useState('')
  const [editNombre, setEditNombre] = useState('')
  const [editFecha, setEditFecha] = useState('')
  const [editLugar, setEditLugar] = useState('')
  const [editColores, setEditColores] = useState('')

  useEffect(() => {
    async function cargar() {
      const { data: ev } = await supabase.from('eventos').select('*').eq('slug', slug).single()
      if (!ev) { router.push('/dashboard'); return }
      setEvento(ev)
      setEditNombre(ev.nombre || '')
      setEditFecha(ev.fecha || '')
      setEditLugar(ev.lugar || '')
      setEditColores(ev.colores_bloqueados || '')

      const { data: lks } = await supabase.from('looks').select('*').eq('evento_id', ev.id).order('created_at', { ascending: false })
      setLooks(lks || [])

      const { data: cnf } = await supabase.from('conflictos').select('*').eq('evento_id', ev.id).order('created_at', { ascending: false })
      setConflictos(cnf || [])

      setLoading(false)
    }
    cargar()
  }, [slug])

  function copiarLink() {
    navigator.clipboard.writeText(`https://nowear.es/${slug}`)
    setCopiado(true)
    setTimeout(() => setCopiado(false), 2000)
  }

  function diasRestantes(fecha) {
    if (!fecha) return '?'
    const diff = Math.ceil((new Date(fecha) - new Date()) / (1000 * 60 * 60 * 24))
    return diff > 0 ? diff : 'Pasado'
  }

  function exportarLista() {
    if (looks.length === 0) return
    const headers = ['Nombre','Email','Color principal','Color secundario','Marca','Modelo','Tipo','Referencia','Estado']
    const rows = looks.map(l => [l.nombre_invitada||'',l.email_invitada||'',l.color_hex||'',l.color_hex_2||'',l.marca||'',l.modelo||'',l.tipo||'',l.referencia||'',l.estado||''])
    const csv = [headers,...rows].map(r=>r.map(c=>`"${c}"`).join(',')).join('\n')
    const blob = new Blob([csv],{type:'text/csv;charset=utf-8;'})
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `looks-${slug}.csv`; a.click()
    URL.revokeObjectURL(url)
  }

  async function handleGuardarAjustes() {
    setGuardandoAjustes(true)
    setAjustesMensaje('')
    await supabase.from('eventos').update({
      nombre: editNombre,
      fecha: editFecha,
      lugar: editLugar,
      colores_bloqueados: editColores || null
    }).eq('id', evento.id)
    setEvento(prev => ({...prev, nombre: editNombre, fecha: editFecha, lugar: editLugar, colores_bloqueados: editColores}))
    setGuardandoAjustes(false)
    setAjustesMensaje('Cambios guardados correctamente.')
    setTimeout(() => setAjustesMensaje(''), 3000)
  }

  if (loading) return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'calc(100vh - 68px)',fontSize:'0.75rem',color:'#888884'}}>Cargando...</div>
  )

  const prereservados = looks.filter(l => l.estado === 'prereservado').length
  const confirmados = looks.filter(l => l.estado === 'confirmado').length

  const inputStyle = {width:'100%',fontFamily:'Poppins,sans-serif',fontSize:'0.82rem',fontWeight:300,padding:'0.9rem 1rem',border:'1px solid #E0E0DC',background:'#FFFFFF',outline:'none',boxSizing:'border-box'}
  const labelStyle = {display:'block',fontSize:'0.6rem',fontWeight:600,letterSpacing:'0.12em',textTransform:'uppercase',color:'#888884',marginBottom:'0.55rem'}

  return (
    <div style={{fontFamily:"'Poppins',sans-serif"}}>

      {/* HERO */}
      <div style={{background:'#0A0A0A',padding:'2.5rem 3rem 3rem',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse at top right, rgba(240,121,135,0.07) 0%, transparent 60%)',pointerEvents:'none'}}></div>
        <button onClick={() => router.push('/dashboard')} style={{display:'inline-flex',alignItems:'center',gap:'0.5rem',fontSize:'0.62rem',fontWeight:600,letterSpacing:'0.12em',textTransform:'uppercase',color:'#888884',background:'none',border:'none',cursor:'pointer',fontFamily:'Poppins,sans-serif',marginBottom:'2rem',padding:0}}>
          <span>←</span> Mis eventos
        </button>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',flexWrap:'wrap',gap:'2rem'}}>
          <div>
            <div style={{fontSize:'0.58rem',fontWeight:600,letterSpacing:'0.18em',textTransform:'uppercase',color:'#888884',marginBottom:'0.5rem'}}>{evento.tipo} · Plan {evento.plan}</div>
            <h1 style={{fontSize:'clamp(2rem,4vw,3.5rem)',fontWeight:700,color:'#FFFFFF',letterSpacing:'-0.025em',lineHeight:1.05,marginBottom:'0.5rem'}}>{evento.nombre}</h1>
            <p style={{fontSize:'0.82rem',fontWeight:300,color:'#888884'}}>
              {evento.fecha ? new Date(evento.fecha).toLocaleDateString('es-ES',{day:'numeric',month:'long',year:'numeric'}) : ''}
              {evento.lugar ? ` · ${evento.lugar}` : ''}
            </p>
          </div>
          <div style={{background:'#FFFFFF',padding:'1.25rem 1.75rem',minWidth:'280px',borderRadius:'4px',flexShrink:0}}>
            <p style={{fontSize:'0.55rem',fontWeight:700,letterSpacing:'0.15em',textTransform:'uppercase',color:'#888884',marginBottom:'0.5rem'}}>Link para invitadas</p>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:'1rem'}}>
              <span style={{fontSize:'0.82rem',fontWeight:500,color:'#0A0A0A'}}>nowear.es/{slug}</span>
              <button onClick={copiarLink} style={{fontSize:'0.65rem',fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',color:copiado?'#4A6B42':'#F07987',background:'none',border:'none',cursor:'pointer',fontFamily:'Poppins,sans-serif',whiteSpace:'nowrap',flexShrink:0}}>
                {copiado ? '✓ Copiado' : 'Copiar'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div style={{display:'flex',padding:'0 3rem',borderBottom:'2px solid #E0E0DC',background:'#FFFFFF',position:'sticky',top:'68px',zIndex:100,overflowX:'auto'}}>
        {['Looks registrados','Conflictos','Colores bloqueados','Ajustes'].map((tab,i) => (
          <button key={i} onClick={() => setTabActiva(i)} style={{padding:'1.1rem 0',marginRight:'2.5rem',fontSize:'0.72rem',fontWeight:tabActiva===i?700:400,color:tabActiva===i?'#0A0A0A':'#888884',cursor:'pointer',background:'none',border:'none',borderBottom:tabActiva===i?'2px solid #0A0A0A':'2px solid transparent',fontFamily:'Poppins,sans-serif',whiteSpace:'nowrap',marginBottom:'-2px'}}>
            {tab}{i===1&&conflictos.length>0&&<span style={{marginLeft:'0.4rem',fontSize:'0.55rem',fontWeight:700,background:'#F07987',color:'#FFFFFF',padding:'0.1rem 0.4rem',borderRadius:'10px'}}>{conflictos.length}</span>}
          </button>
        ))}
      </div>

      {/* CONTENIDO */}
      <div style={{padding:'2.5rem 3rem'}}>

        {/* STATS CON CÍRCULOS */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'1.5rem',marginBottom:'2.5rem'}}>
          {[
            {n: looks.length.toString(), l:'Looks registrados', color:'#0A0A0A'},
            {n: confirmados.toString(), l:'Confirmados', color:'#0A0A0A'},
            {n: prereservados.toString(), l:'Prereservados', color:'#C4917C'},
            {n: diasRestantes(evento.fecha).toString(), l:'Días restantes', color:'#0A0A0A'},
          ].map((s,i) => (
            <div key={i} style={{background:'#FFFFFF',borderRadius:'16px',padding:'1.75rem 2rem',boxShadow:'0 2px 16px rgba(0,0,0,0.06)',border:'1px solid #F0F0EE',display:'flex',flexDirection:'column',gap:'0.5rem'}}>
              <div style={{fontSize:'2.5rem',fontWeight:700,color:s.color,lineHeight:1,letterSpacing:'-0.03em'}}>{s.n}</div>
              <div style={{fontSize:'0.58rem',fontWeight:600,letterSpacing:'0.12em',textTransform:'uppercase',color:'#888884'}}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* TAB LOOKS */}
        {tabActiva === 0 && (
          <>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1.5rem'}}>
              <span style={{fontSize:'0.82rem',fontWeight:400,color:'#888884'}}>
                <strong style={{color:'#0A0A0A',fontWeight:700}}>{looks.length}</strong> looks registrados
              </span>
              <button onClick={exportarLista} style={{fontSize:'0.65rem',fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',padding:'0.65rem 1.5rem',background:'#0A0A0A',color:'#FFFFFF',border:'none',cursor:'pointer',fontFamily:'Poppins,sans-serif',borderRadius:'4px'}}>
                Exportar lista
              </button>
            </div>
            {looks.length === 0 ? (
              <div style={{textAlign:'center',padding:'5rem',color:'#888884',fontSize:'0.78rem',fontWeight:300,border:'1px dashed #E0E0DC',background:'#F7F7F5',lineHeight:2}}>
                Aún no hay looks registrados.<br/>
                <span style={{fontSize:'0.72rem',color:'#BEBEBA'}}>Comparte el link con tus invitadas para empezar.</span>
              </div>
            ) : (
              <div style={{border:'1px solid #E0E0DC',overflowX:'auto',borderRadius:'8px'}}>
                <table style={{width:'100%',borderCollapse:'collapse',minWidth:'600px'}}>
                  <thead>
                    <tr style={{background:'#F7F7F5'}}>
                      {['Color','Nombre','Marca','Modelo','Tipo','Estado'].map((h,i) => (
                        <th key={i} style={{fontSize:'0.58rem',fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase',color:'#555552',textAlign:'left',padding:'0.9rem 1.25rem',borderBottom:'1px solid #E0E0DC'}}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {looks.map((row,i) => (
                      <tr key={i} style={{borderBottom:'1px solid #E0E0DC',background:i%2===0?'#FFFFFF':'#FAFAFA'}}>
                        <td style={{padding:'1rem 1.25rem'}}>
                          <div style={{display:'flex',gap:'4px',alignItems:'center'}}>
                            <span style={{width:'22px',height:'22px',borderRadius:'50%',background:row.color_hex||'#E0E0DC',border:'1px solid rgba(0,0,0,0.08)',display:'inline-block',boxShadow:'0 1px 4px rgba(0,0,0,0.15)'}}></span>
                            {row.color_hex_2&&<span style={{width:'22px',height:'22px',borderRadius:'50%',background:row.color_hex_2,border:'1px solid rgba(0,0,0,0.08)',display:'inline-block',boxShadow:'0 1px 4px rgba(0,0,0,0.15)'}}></span>}
                          </div>
                        </td>
                        <td style={{padding:'1rem 1.25rem',fontSize:'0.82rem',fontWeight:700,color:'#0A0A0A'}}>{row.nombre_invitada}</td>
                        <td style={{padding:'1rem 1.25rem',fontSize:'0.82rem',fontWeight:400,color:'#0A0A0A'}}>{row.marca||'—'}</td>
                        <td style={{padding:'1rem 1.25rem',fontSize:'0.82rem',fontWeight:400,color:'#0A0A0A'}}>{row.modelo||'—'}</td>
                        <td style={{padding:'1rem 1.25rem',fontSize:'0.78rem',fontWeight:300,color:'#888884'}}>{row.tipo||'—'}</td>
                        <td style={{padding:'1rem 1.25rem'}}>
                          <span style={{fontSize:'0.58rem',fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',padding:'0.3rem 0.75rem',borderRadius:'20px',background:row.estado==='confirmado'?'#0A0A0A':'#F5EDE8',color:row.estado==='confirmado'?'#FFFFFF':'#C4917C'}}>
                            {row.estado}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {/* TAB CONFLICTOS */}
        {tabActiva === 1 && (
          conflictos.length === 0 ? (
            <div style={{textAlign:'center',padding:'5rem',color:'#888884',fontSize:'0.78rem',fontWeight:300,border:'1px dashed #E0E0DC',background:'#F7F7F5'}}>
              No hay conflictos detectados.
            </div>
          ) : (
            <div style={{border:'1px solid #E0E0DC',borderRadius:'8px',overflow:'hidden'}}>
              <div style={{background:'#FFF0F1',padding:'1rem 1.5rem',borderBottom:'1px solid #F07987',display:'flex',alignItems:'center',gap:'0.75rem'}}>
                <span style={{fontSize:'0.75rem',fontWeight:700,color:'#F07987'}}>{conflictos.length} conflicto{conflictos.length!==1?'s':''} detectado{conflictos.length!==1?'s':''}</span>
                <span style={{fontSize:'0.72rem',fontWeight:300,color:'#888884'}}>Invitadas que intentaron registrar un look ya ocupado.</span>
              </div>
              <table style={{width:'100%',borderCollapse:'collapse'}}>
                <thead>
                  <tr style={{background:'#F7F7F5'}}>
                    {['Invitada','Email','Marca','Modelo','Color','Ya registrado por','Fecha'].map((h,i) => (
                      <th key={i} style={{fontSize:'0.58rem',fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase',color:'#555552',textAlign:'left',padding:'0.9rem 1.25rem',borderBottom:'1px solid #E0E0DC'}}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {conflictos.map((c,i) => (
                    <tr key={i} style={{borderBottom:'1px solid #E0E0DC',background:i%2===0?'#FFFFFF':'#FAFAFA'}}>
                      <td style={{padding:'1rem 1.25rem',fontSize:'0.82rem',fontWeight:700,color:'#0A0A0A'}}>{c.nombre_invitada}</td>
                      <td style={{padding:'1rem 1.25rem',fontSize:'0.78rem',fontWeight:300,color:'#888884'}}>{c.email_invitada||'—'}</td>
                      <td style={{padding:'1rem 1.25rem',fontSize:'0.82rem',fontWeight:400,color:'#0A0A0A'}}>{c.marca||'—'}</td>
                      <td style={{padding:'1rem 1.25rem',fontSize:'0.82rem',fontWeight:400,color:'#0A0A0A'}}>{c.modelo||'—'}</td>
                      <td style={{padding:'1rem 1.25rem'}}>
                        <span style={{width:'22px',height:'22px',borderRadius:'50%',background:c.color_hex||'#E0E0DC',border:'1px solid rgba(0,0,0,0.08)',display:'inline-block',boxShadow:'0 1px 4px rgba(0,0,0,0.15)'}}></span>
                      </td>
                      <td style={{padding:'1rem 1.25rem',fontSize:'0.82rem',fontWeight:600,color:'#F07987'}}>{c.nombre_conflicto_con||'—'}</td>
                      <td style={{padding:'1rem 1.25rem',fontSize:'0.75rem',fontWeight:300,color:'#888884'}}>
                        {c.created_at ? new Date(c.created_at).toLocaleDateString('es-ES',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'}) : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}

        {/* TAB COLORES */}
        {tabActiva === 2 && (
          <div style={{padding:'2rem',border:'1px solid #E0E0DC',background:'#F7F7F5',borderRadius:'8px'}}>
            <p style={{fontSize:'0.82rem',fontWeight:300,color:'#888884',lineHeight:1.8}}>
              {evento.colores_bloqueados || 'No hay colores bloqueados para este evento.'}
            </p>
          </div>
        )}

        {/* TAB AJUSTES */}
        {tabActiva === 3 && (
          <div style={{maxWidth:'520px'}}>
            <h2 style={{fontSize:'1.2rem',fontWeight:600,color:'#0A0A0A',marginBottom:'0.35rem'}}>Ajustes del evento</h2>
            <p style={{fontSize:'0.75rem',fontWeight:300,color:'#888884',marginBottom:'2rem'}}>Modifica los datos de tu evento.</p>

            <div style={{marginBottom:'1.25rem'}}>
              <label style={labelStyle}>Nombre del evento</label>
              <input type="text" value={editNombre} onChange={e=>setEditNombre(e.target.value)} style={inputStyle}/>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem',marginBottom:'1.25rem'}}>
              <div>
                <label style={labelStyle}>Fecha</label>
                <input type="date" value={editFecha} onChange={e=>setEditFecha(e.target.value)} style={inputStyle}/>
              </div>
              <div>
                <label style={labelStyle}>Lugar</label>
                <input type="text" value={editLugar} onChange={e=>setEditLugar(e.target.value)} style={inputStyle}/>
              </div>
            </div>
            <div style={{marginBottom:'2rem'}}>
              <label style={labelStyle}>Colores bloqueados</label>
              <input type="text" value={editColores} onChange={e=>setEditColores(e.target.value)} placeholder="Ej: blanco, crudo..." style={inputStyle}/>
            </div>

            {ajustesMensaje && <p style={{fontSize:'0.78rem',fontWeight:400,color:'#4A6B42',marginBottom:'1rem',padding:'0.75rem',background:'#EEF4E8',border:'1px solid #C8DFC0',borderRadius:'4px'}}>{ajustesMensaje}</p>}

            <button onClick={handleGuardarAjustes} disabled={guardandoAjustes} style={{padding:'0.9rem 2.5rem',fontSize:'0.78rem',fontWeight:500,background:'#0A0A0A',color:'#FFFFFF',border:'none',cursor:'pointer',fontFamily:'Poppins,sans-serif',borderRadius:'4px',opacity:guardandoAjustes?0.6:1}}>
              {guardandoAjustes ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}