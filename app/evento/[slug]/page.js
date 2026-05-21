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
      const { data: ev } = await supabase
        .from('eventos')
        .select('*')
        .eq('slug', slug)
        .single()

      if (!ev) { router.push('/dashboard'); return }
      setEvento(ev)

      const { data: lks } = await supabase
        .from('looks')
        .select('*')
        .eq('evento_id', ev.id)
        .order('created_at', { ascending: false })

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

  if (loading) return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'calc(100vh - 68px)',fontSize:'0.75rem',fontWeight:300,color:'#888884'}}>
      Cargando...
    </div>
  )

  const prereservados = looks.filter(l => l.estado === 'prereservado').length
  const conflictos = 0

  return (
    <div>
      {/* HERO */}
      <div style={{background:'#0A0A0A',padding:'4rem 3rem 3rem',display:'flex',justifyContent:'space-between',alignItems:'flex-end',flexWrap:'wrap',gap:'2rem'}}>
        <div>
          <div style={{fontSize:'0.6rem',fontWeight:600,letterSpacing:'0.18em',textTransform:'uppercase',color:'#888884',marginBottom:'0.65rem'}}>
            {evento.tipo} · Plan {evento.plan}
          </div>
          <h1 style={{fontSize:'3rem',fontWeight:200,color:'#FFFFFF',letterSpacing:'-0.025em',lineHeight:1,marginBottom:'0.4rem'}}>{evento.nombre}</h1>
          <p style={{fontSize:'0.75rem',fontWeight:300,color:'#888884'}}>
            {evento.fecha ? new Date(evento.fecha).toLocaleDateString('es-ES',{day:'numeric',month:'long',year:'numeric'}) : ''}
            {evento.lugar ? ` · ${evento.lugar}` : ''}
          </p>
        </div>
        <div style={{background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',padding:'1.25rem 1.5rem',minWidth:'280px'}}>
          <p style={{fontSize:'0.56rem',fontWeight:600,letterSpacing:'0.15em',textTransform:'uppercase',color:'#888884',marginBottom:'0.5rem'}}>Link para invitadas</p>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:'1rem'}}>
            <span style={{fontSize:'0.8rem',fontWeight:300,color:'#FFFFFF'}}>nowear.es/{slug}</span>
            <button
              onClick={copiarLink}
              style={{fontSize:'0.58rem',fontWeight:600,letterSpacing:'0.1em',textTransform:'uppercase',color:'#C4917C',background:'none',border:'none',cursor:'pointer',fontFamily:'Poppins,sans-serif'}}
            >
              {copiado ? 'Copiado' : 'Copiar'}
            </button>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div style={{display:'flex',padding:'0 3rem',borderBottom:'1px solid #E0E0DC',background:'#FFFFFF',position:'sticky',top:'68px',zIndex:100,overflowX:'auto'}}>
        {['Looks registrados','Conflictos','Colores bloqueados','Ajustes'].map((tab,i) => (
          <button
            key={i}
            onClick={() => setTabActiva(i)}
            style={{padding:'1.25rem 0',marginRight:'2rem',fontSize:'0.7rem',fontWeight:tabActiva===i?600:400,color:tabActiva===i?'#0A0A0A':'#888884',cursor:'pointer',background:'none',border:'none',borderBottom:tabActiva===i?'2px solid #0A0A0A':'2px solid transparent',fontFamily:'Poppins,sans-serif',whiteSpace:'nowrap'}}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* CONTENIDO */}
      <div style={{padding:'2.5rem 3rem'}}>

        {/* STATS */}
        <div className="evento-stats" style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'1px',background:'#E0E0DC',border:'1px solid #E0E0DC',marginBottom:'2.5rem'}}>
          {[
            {n: looks.length.toString(), l:'Looks registrados'},
            {n: prereservados.toString(), l:'Prereservados'},
            {n: conflictos.toString(), l:'Conflictos'},
            {n: diasRestantes(evento.fecha).toString(), l:'Días restantes'},
          ].map((s,i) => (
            <div key={i} style={{background:'#F7F7F5',padding:'1.5rem 2rem'}}>
              <div style={{fontSize:'2rem',fontWeight:100,color:'#0A0A0A',lineHeight:1,marginBottom:'0.3rem',letterSpacing:'-0.03em'}}>{s.n}</div>
              <div style={{fontSize:'0.58rem',fontWeight:600,letterSpacing:'0.12em',textTransform:'uppercase',color:'#888884'}}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* TAB: LOOKS */}
        {tabActiva === 0 && (
          <>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1.5rem'}}>
              <span style={{fontSize:'0.75rem',fontWeight:300,color:'#888884'}}>{looks.length} looks registrados</span>
              <button style={{fontSize:'0.62rem',fontWeight:500,padding:'0.5rem 1.25rem',background:'transparent',color:'#0A0A0A',border:'1px solid #0A0A0A',cursor:'pointer',fontFamily:'Poppins,sans-serif'}}>Exportar lista</button>
            </div>

            {looks.length === 0 ? (
              <div style={{textAlign:'center',padding:'4rem',color:'#888884',fontSize:'0.75rem',fontWeight:300,border:'1px dashed #E0E0DC'}}>
                Aún no hay looks registrados. Comparte el link con tus invitadas.
              </div>
            ) : (
              <div className="evento-tabla" style={{overflowX:'auto'}}>
                <table style={{width:'100%',borderCollapse:'collapse',minWidth:'600px'}}>
                  <thead>
                    <tr>
                      {['Color','Nombre','Marca','Modelo','Referencia','Tipo','Estado'].map((h,i) => (
                        <th key={i} style={{fontSize:'0.58rem',fontWeight:600,letterSpacing:'0.12em',textTransform:'uppercase',color:'#888884',textAlign:'left',padding:'0.75rem 1rem',borderBottom:'1px solid #E0E0DC'}}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {looks.map((row,i) => (
                      <tr key={i} style={{borderBottom:'1px solid #E0E0DC'}}>
                        <td style={{padding:'0.9rem 1rem'}}>
                          <span style={{width:'18px',height:'18px',borderRadius:'50%',background:row.color_hex||'#E0E0DC',border:'1px solid #E0E0DC',display:'inline-block',verticalAlign:'middle'}}></span>
                        </td>
                        <td style={{padding:'0.9rem 1rem',fontSize:'0.78rem',fontWeight:400,color:'#0A0A0A'}}>{row.nombre_invitada}</td>
                        <td style={{padding:'0.9rem 1rem',fontSize:'0.78rem',fontWeight:300,color:'#0A0A0A'}}>{row.marca || '—'}</td>
                        <td style={{padding:'0.9rem 1rem',fontSize:'0.78rem',fontWeight:300,color:'#0A0A0A'}}>{row.modelo || '—'}</td>
                        <td style={{padding:'0.9rem 1rem',fontSize:'0.78rem',fontWeight:300,color:'#888884'}}>{row.referencia || '—'}</td>
                        <td style={{padding:'0.9rem 1rem',fontSize:'0.78rem',fontWeight:300,color:'#888884'}}>{row.tipo || '—'}</td>
                        <td style={{padding:'0.9rem 1rem'}}>
                          <span style={{fontSize:'0.58rem',fontWeight:600,letterSpacing:'0.1em',textTransform:'uppercase',padding:'0.2rem 0.6rem',background:row.estado==='confirmado'?'#EEF4E8':'#F5EDE8',color:row.estado==='confirmado'?'#4A6B42':'#C4917C'}}>
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

        {/* TAB: CONFLICTOS */}
        {tabActiva === 1 && (
          <div style={{textAlign:'center',padding:'4rem',color:'#888884',fontSize:'0.75rem',fontWeight:300,border:'1px dashed #E0E0DC'}}>
            No hay conflictos de color detectados.
          </div>
        )}

        {/* TAB: COLORES BLOQUEADOS */}
        {tabActiva === 2 && (
          <div style={{padding:'2rem',border:'1px solid #E0E0DC'}}>
            <p style={{fontSize:'0.75rem',fontWeight:300,color:'#888884'}}>
              {evento.colores_bloqueados || 'No hay colores bloqueados para este evento.'}
            </p>
          </div>
        )}

        {/* TAB: AJUSTES */}
        {tabActiva === 3 && (
          <div style={{padding:'2rem',border:'1px solid #E0E0DC'}}>
            <p style={{fontSize:'0.75rem',fontWeight:300,color:'#888884',marginBottom:'1rem'}}>Ajustes del evento próximamente.</p>
          </div>
        )}
      </div>
    </div>
  )
}