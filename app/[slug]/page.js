'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

const COLORES = [
  {hex:'#F5C6D0',nombre:'Rosa palo'},
  {hex:'#D4A8D4',nombre:'Lila'},
  {hex:'#A8C4E0',nombre:'Azul cielo'},
  {hex:'#A8D4B4',nombre:'Verde menta'},
  {hex:'#F5E6C8',nombre:'Beige'},
  {hex:'#E07A5F',nombre:'Terracota'},
  {hex:'#8B9DC3',nombre:'Azul marino'},
  {hex:'#D4B896',nombre:'Camel'},
  {hex:'#E8E8E4',nombre:'Crudo'},
  {hex:'#2C2C2C',nombre:'Negro'},
  {hex:'#FFFFFF',nombre:'Blanco'},
  {hex:'#C4917C',nombre:'Teja'},
]

export default function InvitadaPage() {
  const { slug } = useParams()
  const [evento, setEvento] = useState(null)
  const [loading, setLoading] = useState(true)
  const [enviado, setEnviado] = useState(false)
  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)

  const [nombre, setNombre] = useState('')
  const [colorHex, setColorHex] = useState('')
  const [marca, setMarca] = useState('')
  const [modelo, setModelo] = useState('')
  const [referencia, setReferencia] = useState('')
  const [tipo, setTipo] = useState('')
  const [estado, setEstado] = useState('confirmado')

  useEffect(() => {
    async function cargar() {
      const { data } = await supabase
        .from('eventos')
        .select('*')
        .eq('slug', slug)
        .single()
      setEvento(data || null)
      setLoading(false)
    }
    cargar()
  }, [slug])

  async function handleEnviar() {
    setError('')
    if (!nombre || !colorHex) {
      setError('Tu nombre y el color son obligatorios')
      return
    }
    setEnviando(true)
    const { error } = await supabase.from('looks').insert({
      evento_id: evento.id,
      nombre_invitada: nombre,
      color_hex: colorHex,
      marca: marca || null,
      modelo: modelo || null,
      referencia: referencia || null,
      tipo: tipo || null,
      estado
    })
    setEnviando(false)
    if (error) { setError('Error al registrar el look. Inténtalo de nuevo.'); return }
    setEnviado(true)
  }

  if (loading) return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'calc(100vh - 68px)',fontSize:'0.75rem',fontWeight:300,color:'#888884'}}>
      Cargando...
    </div>
  )

  if (!evento) return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'calc(100vh - 68px)',fontSize:'0.75rem',fontWeight:300,color:'#888884'}}>
      Evento no encontrado.
    </div>
  )

  if (enviado) return (
    <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',minHeight:'calc(100vh - 68px)',padding:'2rem',textAlign:'center'}}>
      <div style={{fontSize:'2.5rem',fontWeight:100,color:'#0A0A0A',letterSpacing:'-0.03em',marginBottom:'0.5rem'}}>¡Look registrado!</div>
      <p style={{fontSize:'0.85rem',fontWeight:300,color:'#888884',marginBottom:'2rem',maxWidth:'400px',lineHeight:1.7}}>
        Tu look ha sido registrado para <strong style={{fontWeight:500,color:'#0A0A0A'}}>{evento.nombre}</strong>. Si otra invitada elige el mismo color, recibirás una notificación.
      </p>
      <div style={{width:'48px',height:'48px',borderRadius:'50%',background:colorHex,border:'1px solid #E0E0DC',marginBottom:'2rem'}}></div>
      <button
        onClick={() => { setEnviado(false); setNombre(''); setColorHex(''); setMarca(''); setModelo(''); setReferencia(''); setTipo('') }}
        style={{fontSize:'0.72rem',fontWeight:500,padding:'0.75rem 2rem',background:'transparent',color:'#0A0A0A',border:'1px solid #0A0A0A',cursor:'pointer',fontFamily:'Poppins,sans-serif'}}
      >
        Registrar otro look
      </button>
    </div>
  )

  return (
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',minHeight:'calc(100vh - 68px)'}}>

      {/* LADO IZQUIERDO - INFO EVENTO */}
      <div style={{background:'#0A0A0A',padding:'4rem',display:'flex',flexDirection:'column',justifyContent:'flex-end',position:'relative',overflow:'hidden'}}>
        <div style={{position:'relative',zIndex:2}}>
          <div style={{fontSize:'0.6rem',fontWeight:600,letterSpacing:'0.18em',textTransform:'uppercase',color:'#888884',marginBottom:'1rem'}}>{evento.tipo}</div>
          <h1 style={{fontSize:'3rem',fontWeight:200,color:'#FFFFFF',letterSpacing:'-0.025em',lineHeight:1,marginBottom:'0.5rem'}}>{evento.nombre}</h1>
          <p style={{fontSize:'0.78rem',fontWeight:300,color:'#888884',marginBottom:'3rem'}}>
            {evento.fecha ? new Date(evento.fecha).toLocaleDateString('es-ES',{day:'numeric',month:'long',year:'numeric'}) : ''}
            {evento.lugar ? ` · ${evento.lugar}` : ''}
          </p>
          <p style={{fontSize:'0.85rem',fontWeight:300,color:'rgba(255,255,255,0.6)',lineHeight:1.8,maxWidth:'380px'}}>
            Registra tu look para que ninguna invitada llegue vestida igual. El sistema detecta coincidencias automáticamente.
          </p>
          {evento.colores_bloqueados && (
            <div style={{marginTop:'2rem',padding:'1rem 1.25rem',background:'rgba(196,145,124,0.15)',border:'1px solid rgba(196,145,124,0.3)'}}>
              <p style={{fontSize:'0.6rem',fontWeight:600,letterSpacing:'0.12em',textTransform:'uppercase',color:'#C4917C',marginBottom:'0.3rem'}}>Colores no disponibles</p>
              <p style={{fontSize:'0.75rem',fontWeight:300,color:'rgba(255,255,255,0.6)'}}>{evento.colores_bloqueados}</p>
            </div>
          )}
        </div>
      </div>

      {/* LADO DERECHO - FORMULARIO */}
      <div style={{padding:'4rem',background:'#FFFFFF',overflowY:'auto'}}>
        <h2 style={{fontSize:'1.8rem',fontWeight:200,color:'#0A0A0A',letterSpacing:'-0.02em',marginBottom:'0.4rem'}}>Tu look</h2>
        <p style={{fontSize:'0.75rem',fontWeight:300,color:'#888884',marginBottom:'2.5rem'}}>Registra tu outfit para {evento.nombre}</p>

        <div style={{marginBottom:'1.25rem'}}>
          <label style={{display:'block',fontSize:'0.6rem',fontWeight:600,letterSpacing:'0.12em',textTransform:'uppercase',color:'#888884',marginBottom:'0.55rem'}}>
            Tu nombre <span style={{color:'#C4917C'}}>*</span>
          </label>
          <input
            type="text"
            placeholder="Ej: María García"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            style={{width:'100%',fontFamily:'Poppins,sans-serif',fontSize:'0.82rem',fontWeight:300,padding:'0.9rem 1rem',border:'1px solid #E0E0DC',background:'#FFFFFF',outline:'none',boxSizing:'border-box'}}
          />
        </div>

        <div style={{marginBottom:'1.25rem'}}>
          <label style={{display:'block',fontSize:'0.6rem',fontWeight:600,letterSpacing:'0.12em',textTransform:'uppercase',color:'#888884',marginBottom:'0.55rem'}}>
            Color principal <span style={{color:'#C4917C'}}>*</span>
          </label>
          <div style={{display:'grid',gridTemplateColumns:'repeat(6,1fr)',gap:'0.5rem',marginBottom:'0.75rem'}}>
            {COLORES.map((c,i) => (
              <div
                key={i}
                onClick={() => setColorHex(c.hex)}
                title={c.nombre}
                style={{width:'100%',paddingBottom:'100%',position:'relative',cursor:'pointer',borderRadius:'50%',border: colorHex===c.hex ? '3px solid #0A0A0A' : '2px solid #E0E0DC',background:c.hex,outline: colorHex===c.hex ? '2px solid #FFFFFF' : 'none',outlineOffset:'-4px'}}
              />
            ))}
          </div>
          {colorHex && (
            <div style={{display:'flex',alignItems:'center',gap:'0.75rem',fontSize:'0.72rem',fontWeight:300,color:'#888884'}}>
              <span style={{width:'14px',height:'14px',borderRadius:'50%',background:colorHex,border:'1px solid #E0E0DC',flexShrink:0}}></span>
              {COLORES.find(c=>c.hex===colorHex)?.nombre || colorHex}
            </div>
          )}
        </div>

        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem',marginBottom:'1.25rem'}}>
          <div>
            <label style={{display:'block',fontSize:'0.6rem',fontWeight:600,letterSpacing:'0.12em',textTransform:'uppercase',color:'#888884',marginBottom:'0.55rem'}}>Marca</label>
            <input
              type="text"
              placeholder="Ej: Zara"
              value={marca}
              onChange={e => setMarca(e.target.value)}
              style={{width:'100%',fontFamily:'Poppins,sans-serif',fontSize:'0.82rem',fontWeight:300,padding:'0.9rem 1rem',border:'1px solid #E0E0DC',background:'#FFFFFF',outline:'none',boxSizing:'border-box'}}
            />
          </div>
          <div>
            <label style={{display:'block',fontSize:'0.6rem',fontWeight:600,letterSpacing:'0.12em',textTransform:'uppercase',color:'#888884',marginBottom:'0.55rem'}}>Tipo</label>
            <select
              value={tipo}
              onChange={e => setTipo(e.target.value)}
              style={{width:'100%',fontFamily:'Poppins,sans-serif',fontSize:'0.82rem',fontWeight:300,padding:'0.9rem 1rem',border:'1px solid #E0E0DC',background:'#FFFFFF',outline:'none',cursor:'pointer',appearance:'none',boxSizing:'border-box'}}
            >
              <option value="">Selecciona...</option>
              <option>Vestido corto</option>
              <option>Vestido midi</option>
              <option>Vestido largo</option>
              <option>Traje</option>
              <option>Conjunto</option>
              <option>Otro</option>
            </select>
          </div>
        </div>

        <div style={{marginBottom:'1.25rem'}}>
          <label style={{display:'block',fontSize:'0.6rem',fontWeight:600,letterSpacing:'0.12em',textTransform:'uppercase',color:'#888884',marginBottom:'0.55rem'}}>Modelo</label>
          <input
            type="text"
            placeholder="Nombre del vestido o modelo"
            value={modelo}
            onChange={e => setModelo(e.target.value)}
            style={{width:'100%',fontFamily:'Poppins,sans-serif',fontSize:'0.82rem',fontWeight:300,padding:'0.9rem 1rem',border:'1px solid #E0E0DC',background:'#FFFFFF',outline:'none',boxSizing:'border-box'}}
          />
        </div>

        <div style={{marginBottom:'1.25rem'}}>
          <label style={{display:'block',fontSize:'0.6rem',fontWeight:600,letterSpacing:'0.12em',textTransform:'uppercase',color:'#888884',marginBottom:'0.55rem'}}>Referencia o link</label>
          <input
            type="text"
            placeholder="URL o referencia del producto"
            value={referencia}
            onChange={e => setReferencia(e.target.value)}
            style={{width:'100%',fontFamily:'Poppins,sans-serif',fontSize:'0.82rem',fontWeight:300,padding:'0.9rem 1rem',border:'1px solid #E0E0DC',background:'#FFFFFF',outline:'none',boxSizing:'border-box'}}
          />
        </div>

        <div style={{marginBottom:'2rem'}}>
          <label style={{display:'block',fontSize:'0.6rem',fontWeight:600,letterSpacing:'0.12em',textTransform:'uppercase',color:'#888884',marginBottom:'0.55rem'}}>Estado</label>
          <div style={{display:'flex',gap:'1rem'}}>
            {['confirmado','prereservado'].map(e => (
              <button
                key={e}
                onClick={() => setEstado(e)}
                style={{flex:1,padding:'0.75rem',fontSize:'0.72rem',fontWeight:500,fontFamily:'Poppins,sans-serif',cursor:'pointer',border:'1px solid',borderColor: estado===e ? '#0A0A0A' : '#E0E0DC',background: estado===e ? '#0A0A0A' : '#FFFFFF',color: estado===e ? '#FFFFFF' : '#888884',textTransform:'capitalize'}}
              >
                {e === 'confirmado' ? 'Confirmado' : 'Prereservado'}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <p style={{fontSize:'0.72rem',fontWeight:300,color:'#C4917C',marginBottom:'1rem'}}>{error}</p>
        )}

        <button
          onClick={handleEnviar}
          disabled={enviando}
          style={{width:'100%',padding:'0.9rem',fontSize:'0.78rem',fontWeight:500,background:'#0A0A0A',color:'#FFFFFF',border:'none',cursor:'pointer',fontFamily:'Poppins,sans-serif',opacity:enviando?0.6:1}}
        >
          {enviando ? 'Registrando...' : 'Registrar mi look →'}
        </button>
      </div>
    </div>
  )
}