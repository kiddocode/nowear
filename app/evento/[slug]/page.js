'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function EventoDetalle() {
  const { slug } = useParams()
  const router = useRouter()
  const [evento, setEvento] = useState(null)
  const [looks, setLooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [tabActiva, setTabActiva] = useState(0)
  const [copiado, setCopiado] = useState(false)

  useEffect(() => {
    async function cargar() {
      const { data: ev } = await supabase.from('eventos').select('*').eq('slug', slug).single()
      if (!ev) { router.push('/dashboard'); return }
      setEvento(ev)
      const { data: lks } = await supabase.from('looks').select('*').eq('evento_id', ev.id).order('created_at', { ascending: false })
      setLooks(lks || [])
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
    const rows = looks.map(l => [
      l.nombre_invitada||'', l.email_invitada||'', l.color_hex||'', l.color_hex_2||'',
      l.marca||'', l.modelo||'', l.tipo||'', l.referencia||'', l.estado||''
    ])
    const csv = [headers,...rows].map(r=>r.map(c=>`"${c}"`).join(',')).join('\n')
    const blob = new Blob([csv],{type:'text/csv;charset=utf-8;'})
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `looks-${slug}.csv`; a.click()
    URL.revokeObjectURL(url)
  }

  if (loading) return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'calc(100vh - 68px)',fontSize:'0.75rem',color:'#888884'}}>Cargando...</div>
  )

  const prereservados = looks.filter(l => l.estado === 'prereservado').length
  const confirmados = looks.filter(l => l.estado === 'confirmado').length

  return (
    <div style={{fontFamily:"'Poppins',sans-serif"}}>

      {/* HERO BANNER */}
      <div style={{background:'#0A0A0A',padding:'2.5rem 3rem 3rem',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse at top right, rgba(240,121,135,0.07) 0%, transparent 60%)',pointerEvents:'none'}}></div>

        {/* BOTÓN VOLVER */}
        <button onClick={() => router.push('/dashboard')} style={{display:'inline-flex',alignItems:'center',gap:'0.5rem',fontSize:'0.62rem',fontWeight:600,letterSpacing:'0.12em',textTransform:'uppercase',color:'#888884',background:'none',border:'none',cursor:'pointer',fontFamily:'Poppins,sans-serif',marginBottom:'2rem',padding:0,transition:'color 0.15s'}}>
          <span>←</span> Mis eventos
        </button>

        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',flexWrap:'wrap',gap:'2rem'}}>
          <div>
            <div style={{fontSize:'0.58rem',fontWeight:600,letterSpacing:'0.18em',textTransform:'uppercase',color:'#888884',marginBottom:'0.5rem'}}>
              {evento.tipo} · Plan {evento.plan}
            </div>
            <h1 style={{fontSize:'clamp(2rem,4vw,3.5rem)',fontWeight:700,color:'#FFFFFF',letterSpacing:'-0.025em',lineHeight:1.05,marginBottom:'0.5rem'}}>{evento.nombre}</h1>
            <p style={{fontSize:'0.82rem',fontWeight:300,color:'#888884'}}>
              {evento.fecha ? new Date(evento.fecha).toLocaleDateString('es-ES',{day:'numeric',month:'long',year:'numeric'}) : ''}
              {evento.lugar ? ` · ${evento.lugar}` : ''}
            </p>
          </div>

          {/* LINK BOX BLANCO */}
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
          <button key={i} onClick={() => setTabActiva(i)} style={{padding:'1.1rem 0',marginRight:'2.5rem',fontSize:'0.72rem',fontWeight:tabActiva===i?700:400,color:tabActiva===i?'#0A0A0A':'#888884',cursor:'pointer',background:'none',border:'none',borderBottom:tabActiva===i?'2px solid #0A0A0A':'2px solid transparent',fontFamily:'Poppins,sans-serif',whiteSpace:'nowrap',letterSpacing:'0.01em',marginBottom:'-2px'}}>
            {tab}
          </button>
        ))}
      </div>

      {/* CONTENIDO */}
      <div style={{padding:'2.5rem 3rem'}}>

        {/* STATS */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'1px',background:'#E0E0DC',border:'1px solid #E0E0DC',marginBottom:'2.5rem'}}>
          {[
            {n: looks.length.toString(), l:'Looks registrados'},
            {n: confirmados.toString(), l:'Confirmados'},
            {n: prereservados.toString(), l:'Prereservados'},
            {n: diasRestantes(evento.fecha).toString(), l:'Días restantes'},
          ].map((s,i) => (
            <div key={i} style={{background:'#F7F7F5',padding:'1.5rem 2rem'}}>
              <div style={{fontSize:'2.5rem',fontWeight:700,color:'#0A0A0A',lineHeight:1,marginBottom:'0.3rem',letterSpacing:'-0.03em'}}>{s.n}</div>
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
              <div style={{border:'1px solid #E0E0DC',overflowX:'auto'}}>
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
                            {row.color_hex_2 && <span style={{width:'22px',height:'22px',borderRadius:'50%',background:row.color_hex_2,border:'1px solid rgba(0,0,0,0.08)',display:'inline-block',boxShadow:'0 1px 4px rgba(0,0,0,0.15)'}}></span>}
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

        {tabActiva === 1 && (
          <div style={{textAlign:'center',padding:'5rem',color:'#888884',fontSize:'0.78rem',fontWeight:300,border:'1px dashed #E0E0DC',background:'#F7F7F5'}}>
            No hay conflictos detectados.
          </div>
        )}

        {tabActiva === 2 && (
          <div style={{padding:'2rem',border:'1px solid #E0E0DC',background:'#F7F7F5'}}>
            <p style={{fontSize:'0.82rem',fontWeight:300,color:'#888884',lineHeight:1.8}}>
              {evento.colores_bloqueados || 'No hay colores bloqueados para este evento.'}
            </p>
          </div>
        )}

        {tabActiva === 3 && (
          <div style={{padding:'2rem',border:'1px solid #E0E0DC',background:'#F7F7F5'}}>
            <p style={{fontSize:'0.82rem',fontWeight:300,color:'#888884'}}>Ajustes del evento próximamente.</p>
          </div>
        )}
      </div>
    </div>
  )
}