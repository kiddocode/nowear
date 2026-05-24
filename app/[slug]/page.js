'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

const COLORES = [
  {hex:'#F5C6D0',nombre:'Rosa palo'},
  {hex:'#D4A8D4',nombre:'Lila'},
  {hex:'#6B3FA0',nombre:'Morado'},
  {hex:'#D4006A',nombre:'Fucsia'},
  {hex:'#A8C4E0',nombre:'Azul cielo'},
  {hex:'#8B9DC3',nombre:'Azul marino'},
  {hex:'#A8D4B4',nombre:'Verde menta'},
  {hex:'#4A7C59',nombre:'Verde botella'},
  {hex:'#6B7C3A',nombre:'Verde oliva'},
  {hex:'#F5E6C8',nombre:'Beige'},
  {hex:'#D4B896',nombre:'Camel'},
  {hex:'#C4956A',nombre:'Marrón claro'},
  {hex:'#8B4513',nombre:'Marrón'},
  {hex:'#E8E8E4',nombre:'Crudo'},
  {hex:'#F5D6A0',nombre:'Amarillo mostaza'},
  {hex:'#E07A5F',nombre:'Terracota'},
  {hex:'#C4917C',nombre:'Teja'},
  {hex:'#D4A8A8',nombre:'Nude'},
  {hex:'#6B1A2A',nombre:'Granate'},
  {hex:'#2C2C2C',nombre:'Negro'},
  {hex:'#888884',nombre:'Gris'},
  {hex:'#FFFFFF',nombre:'Blanco'},
  {hex:'#C8A86B',nombre:'Dorado'},
  {hex:'#C0C0C0',nombre:'Plateado'},
  {hex:'#E0E0DC',nombre:'Otro'},
]

const FOTO_FIJA = 'https://qhuatexjyxbunotvghjh.supabase.co/storage/v1/object/public/fotos/pexels-pavel-danilyuk-6405676.jpg'

export default function InvitadaPage() {
  const { slug } = useParams()
  const [evento, setEvento] = useState(null)
  const [organizadora, setOrganizadora] = useState(null)
  const [loading, setLoading] = useState(true)
  const [enviado, setEnviado] = useState(false)
  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)

  const [modoGestion, setModoGestion] = useState(false)
  const [emailGestion, setEmailGestion] = useState('')
  const [buscandoLooks, setBuscandoLooks] = useState(false)
  const [looksExistentes, setLooksExistentes] = useState(null)
  const [lookEditando, setLookEditando] = useState(null)
  const [eliminando, setEliminando] = useState(null)

  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [colores, setColores] = useState([])
  const [estado, setEstado] = useState('confirmado')
  const [foto, setFoto] = useState(null)
  const [fotoPreview, setFotoPreview] = useState(null)
  const [marca1, setMarca1] = useState('')
  const [modelo1, setModelo1] = useState('')
  const [tipo1, setTipo1] = useState('')
  const [referencia1, setReferencia1] = useState('')
  const [marca2, setMarca2] = useState('')
  const [modelo2, setModelo2] = useState('')
  const [tipo2, setTipo2] = useState('')
  const [referencia2, setReferencia2] = useState('')

  useEffect(() => {
  async function cargar() {
      const { data: ev } = await supabase.from('eventos').select('*').eq('slug', slug).single()
      if (!ev) { setLoading(false); return }
      setEvento(ev)
      const { data: prof } = await supabase.from('profiles').select('nombre, id').eq('id', ev.organizadora_id).single()
      setOrganizadora(prof)
      setLoading(false)
    }
    cargar()
    const interval = setInterval(cargar, 30000)
return () => clearInterval(interval)
  }, [slug])

  function toggleColor(hex) {
    if (colores.includes(hex)) {
      setColores(colores.filter(c => c !== hex))
    } else {
      if (colores.length >= 2) return
      setColores([...colores, hex])
    }
  }

  async function enviarEmail(tipo, extras = {}) {
    try {
      await fetch('/api/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tipo,
          emailInvitada: email.toLowerCase().trim(),
          nombreInvitada: nombre,
          nombreEvento: evento.nombre,
          nombreOrganizadora: organizadora?.nombre || 'la organizadora',
          marca: marca1,
          modelo: modelo1,
          color: COLORES.find(c => c.hex === colores[0])?.nombre || colores[0],
          organizadoraId: evento.organizadora_id,
          eventoId: evento.slug,
          ...extras
        })
      })
    } catch (e) {
      console.error('Error enviando email:', e)
    }
  }

  async function buscarLooks() {
    if (!emailGestion) return
    setBuscandoLooks(true)
    const { data } = await supabase
      .from('looks').select('*')
      .eq('evento_id', evento.id)
      .eq('email_invitada', emailGestion.toLowerCase().trim())
    setLooksExistentes(data || [])
    setBuscandoLooks(false)
  }

  async function handleEliminarLook(lookId) {
    setEliminando(lookId)
    await supabase.from('looks').delete().eq('id', lookId)
    setLooksExistentes(prev => prev.filter(l => l.id !== lookId))
    setEliminando(null)
  }

  function handleEditarLook(look) {
    setLookEditando(look)
    setNombre(look.nombre_invitada)
    setEmail(look.email_invitada)
    setColores([look.color_hex, look.color_hex_2].filter(Boolean))
    setMarca1(look.marca || '')
    setModelo1(look.modelo || '')
    setTipo1(look.tipo || '')
    setReferencia1(look.referencia || '')
    setMarca2(look.marca2 || '')
    setModelo2(look.modelo2 || '')
    setTipo2(look.tipo2 || '')
    setReferencia2(look.referencia2 || '')
    setEstado(look.estado || 'confirmado')
    setModoGestion(false)
  }

 async function handleActualizarLook() {
  setError('')
  if (!nombre || !email || colores.length === 0 || !marca1 || !modelo1 || !tipo1) {
    setError('Por favor, rellena todos los campos obligatorios marcados con *')
    return
  }
  setEnviando(true)

  const { data: looksConflicto } = await supabase
    .from('looks').select('nombre_invitada, id')
    .eq('evento_id', evento.id)
    .eq('color_hex', colores[0])
    .ilike('marca', marca1.trim())
    .ilike('modelo', modelo1.trim())
    .neq('id', lookEditando.id)

  if (looksConflicto && looksConflicto.length > 0) {
    setEnviando(false)
    await supabase.from('conflictos').insert({
      evento_id: evento.id,
      nombre_invitada: nombre,
      email_invitada: email.toLowerCase().trim(),
      marca: marca1, modelo: modelo1,
      color_hex: colores[0],
      nombre_conflicto_con: looksConflicto[0].nombre_invitada
    })
    await enviarEmail('conflicto_invitada')
    setError(`Este look ya está registrado por ${looksConflicto[0].nombre_invitada}. Por favor elige otro.`)
    return
  }

  await supabase.from('looks').update({
    nombre_invitada: nombre,
    color_hex: colores[0], color_hex_2: colores[1] || null,
    marca: marca1, modelo: modelo1, tipo: tipo1, referencia: referencia1 || null,
    marca2: marca2 || null, modelo2: modelo2 || null, tipo2: tipo2 || null, referencia2: referencia2 || null,
    estado
  }).eq('id', lookEditando.id)

 await enviarEmail('confirmacion')

  // Actualizar estado local directamente sin re-fetch
  const lookActualizado = {
    ...lookEditando,
    nombre_invitada: nombre,
    color_hex: colores[0],
    color_hex_2: colores[1] || null,
    marca: marca1, modelo: modelo1, tipo: tipo1, referencia: referencia1 || null,
    marca2: marca2 || null, modelo2: modelo2 || null, tipo2: tipo2 || null, referencia2: referencia2 || null,
    estado
  }
  setLooksExistentes(prev => prev ? prev.map(l => l.id === lookEditando.id ? lookActualizado : l) : [lookActualizado])
  setEmailGestion(email.toLowerCase().trim())
  setEnviando(false)
  setLookEditando(null)
  resetForm()
  setModoGestion(true)
}

  async function handleEnviar() {
    setError('')
    if (!nombre || !email || colores.length === 0 || !marca1 || !modelo1 || !tipo1 || !estado) {
      setError('Por favor, rellena todos los campos obligatorios marcados con *')
      return
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Por favor, introduce un email válido.')
      return
    }

    const { data: existentes } = await supabase
      .from('looks').select('estado')
      .eq('evento_id', evento.id)
      .eq('email_invitada', email.toLowerCase().trim())

    if (existentes && existentes.length > 0) {
      const confirmados = existentes.filter(l => l.estado === 'confirmado').length
      const prereservados = existentes.filter(l => l.estado === 'prereservado').length
      if (estado === 'confirmado' && confirmados >= 1) {
        setError('Ya tienes un look confirmado en este evento. Solo se permite 1 look confirmado por persona.')
        return
      }
      if (estado === 'prereservado' && prereservados >= 3) {
        setError('Ya tienes 3 prerreservas activas en este evento. Ese es el máximo permitido.')
        return
      }
    }

    const { data: looksConflicto } = await supabase
      .from('looks').select('nombre_invitada, estado')
      .eq('evento_id', evento.id)
      .eq('color_hex', colores[0])
      .ilike('marca', marca1.trim())
      .ilike('modelo', modelo1.trim())

    if (looksConflicto && looksConflicto.length > 0) {
      const conflicto = looksConflicto[0]
      await supabase.from('conflictos').insert({
        evento_id: evento.id,
        nombre_invitada: nombre,
        email_invitada: email.toLowerCase().trim(),
        marca: marca1, modelo: modelo1,
        color_hex: colores[0],
        nombre_conflicto_con: conflicto.nombre_invitada
      })
      await enviarEmail('conflicto_invitada')
      setError(`Este look (${marca1}, ${modelo1}, ${COLORES.find(c=>c.hex===colores[0])?.nombre}) ya está registrado por ${conflicto.nombre_invitada}. Por favor elige otro look.`)
      return
    }

    setEnviando(true)

    let foto_url = null
    if (foto) {
      const ext = foto.name.split('.').pop()
      const fileName = `${evento.id}-${Date.now()}.${ext}`
      const { data: uploadData } = await supabase.storage.from('fotos').upload(fileName, foto, { contentType: foto.type })
      if (uploadData) {
        const { data: urlData } = supabase.storage.from('fotos').getPublicUrl(fileName)
        foto_url = urlData.publicUrl
      }
    }

    const { error: insertError } = await supabase.from('looks').insert({
      evento_id: evento.id,
      nombre_invitada: nombre,
      email_invitada: email.toLowerCase().trim(),
      color_hex: colores[0], color_hex_2: colores[1] || null,
      marca: marca1, modelo: modelo1, tipo: tipo1, referencia: referencia1 || null,
      marca2: marca2 || null, modelo2: modelo2 || null, tipo2: tipo2 || null, referencia2: referencia2 || null,
      estado, foto_url
    })

    if (insertError) {
      setEnviando(false)
      setError('Error al registrar el look. Inténtalo de nuevo.')
      return
    }

    await enviarEmail('confirmacion')
    setEnviando(false)
    setEnviado(true)
  }

  function resetForm() {
    setNombre(''); setEmail(''); setColores([]); setMarca1(''); setModelo1('');
    setTipo1(''); setReferencia1(''); setMarca2(''); setModelo2(''); setTipo2('');
    setReferencia2(''); setEstado('confirmado'); setFoto(null); setFotoPreview(null);
    setLookEditando(null); setError('')
  }

  if (loading) return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'calc(100vh - 68px)',fontSize:'0.75rem',color:'#888884'}}>Cargando...</div>
  )
  if (!evento) return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'calc(100vh - 68px)',fontSize:'0.75rem',color:'#888884'}}>Evento no encontrado.</div>
  )

  if (enviado) return (
    <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',minHeight:'calc(100vh - 68px)',padding:'2rem',textAlign:'center'}}>
      <div style={{fontSize:'2.5rem',fontWeight:100,color:'#0A0A0A',letterSpacing:'-0.03em',marginBottom:'0.5rem'}}>
        {lookEditando ? '¡Look actualizado!' : '¡Look registrado!'}
      </div>
      <p style={{fontSize:'0.9rem',fontWeight:300,color:'#888884',marginBottom:'2rem',maxWidth:'400px',lineHeight:1.7}}>
        Tu look ha sido {lookEditando ? 'actualizado' : 'registrado'} para <strong style={{fontWeight:600,color:'#0A0A0A'}}>{evento.nombre}</strong>.
        {!lookEditando && <> Te hemos enviado un email de confirmación a <strong style={{fontWeight:600,color:'#0A0A0A'}}>{email}</strong>.</>}
      </p>
      <div style={{display:'flex',gap:'0.5rem',marginBottom:'2rem'}}>
        {colores.map((c,i) => (
          <div key={i} style={{width:'32px',height:'32px',borderRadius:'50%',background:c,border:'1px solid #E0E0DC'}}></div>
        ))}
      </div>
      <button onClick={() => { setEnviado(false); resetForm() }}
        style={{fontSize:'0.78rem',fontWeight:500,padding:'0.75rem 2rem',background:'transparent',color:'#0A0A0A',border:'1px solid #0A0A0A',cursor:'pointer',fontFamily:'Poppins,sans-serif'}}>
        Registrar otro look
      </button>
    </div>
  )

  const selectStyle = {width:'100%',fontFamily:'Poppins,sans-serif',fontSize:'0.88rem',fontWeight:300,padding:'0.9rem 1rem',border:'1px solid #E0E0DC',background:'#FFFFFF',outline:'none',cursor:'pointer',appearance:'none',backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23888884' stroke-width='1.5' fill='none'/%3E%3C/svg%3E")`,backgroundRepeat:'no-repeat',backgroundPosition:'right 1rem center',boxSizing:'border-box'}
  const inputStyle = {width:'100%',fontFamily:'Poppins,sans-serif',fontSize:'0.88rem',fontWeight:300,padding:'0.9rem 1rem',border:'1px solid #E0E0DC',background:'#FFFFFF',outline:'none',boxSizing:'border-box'}
  const labelStyle = {display:'block',fontSize:'0.65rem',fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase',color:'#555552',marginBottom:'0.55rem'}

  return (
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',minHeight:'calc(100vh - 68px)'}}>

      <div style={{position:'sticky',top:'68px',height:'calc(100vh - 68px)',overflow:'hidden'}}>
        <img src={FOTO_FIJA} alt="Evento" style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}}/>
        <div style={{position:'absolute',inset:0,background:'linear-gradient(to top, rgba(10,10,10,0.85) 0%, rgba(10,10,10,0.2) 60%)',display:'flex',flexDirection:'column',justifyContent:'flex-end',padding:'3rem'}}>
          <div style={{fontSize:'0.65rem',fontWeight:700,letterSpacing:'0.18em',textTransform:'uppercase',color:'rgba(255,255,255,0.6)',marginBottom:'0.75rem'}}>{evento.tipo}</div>
          <h1 style={{fontSize:'2.8rem',fontWeight:700,color:'#FFFFFF',letterSpacing:'-0.025em',lineHeight:1,marginBottom:'0.5rem'}}>{evento.nombre}</h1>
          <p style={{fontSize:'0.85rem',fontWeight:400,color:'rgba(255,255,255,0.75)',marginBottom:'2rem'}}>
            {evento.fecha ? new Date(evento.fecha).toLocaleDateString('es-ES',{day:'numeric',month:'long',year:'numeric'}) : ''}
            {evento.lugar ? ` · ${evento.lugar}` : ''}
          </p>
          <p style={{fontSize:'0.85rem',fontWeight:400,color:'rgba(255,255,255,0.8)',lineHeight:1.8,maxWidth:'380px'}}>
            Registra tu look para que ninguna invitada llegue vestida igual.
          </p>
          {evento.colores_bloqueados && (
            <div style={{marginTop:'1.5rem',padding:'1rem 1.25rem',background:'rgba(196,145,124,0.2)',border:'1px solid rgba(196,145,124,0.4)'}}>
              <p style={{fontSize:'0.62rem',fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase',color:'#F07987',marginBottom:'0.3rem'}}>Colores no disponibles</p>
              <p style={{fontSize:'0.8rem',fontWeight:400,color:'rgba(255,255,255,0.8)'}}>{evento.colores_bloqueados}</p>
            </div>
          )}
        </div>
      </div>

      <div style={{padding:'3rem',background:'#FFFFFF',overflowY:'auto'}}>
        {modoGestion ? (
          <div>
            <button onClick={() => { setModoGestion(false); setLooksExistentes(null); setEmailGestion('') }}
              style={{display:'flex',alignItems:'center',gap:'0.5rem',fontSize:'0.65rem',fontWeight:600,letterSpacing:'0.1em',textTransform:'uppercase',color:'#888884',background:'none',border:'none',cursor:'pointer',fontFamily:'Poppins,sans-serif',marginBottom:'2rem',padding:0}}>
              ← Volver
            </button>
            <h2 style={{fontSize:'1.8rem',fontWeight:700,color:'#0A0A0A',letterSpacing:'-0.02em',marginBottom:'0.4rem'}}>Mis looks</h2>
            <p style={{fontSize:'0.85rem',fontWeight:400,color:'#555552',marginBottom:'2rem'}}>Introduce tu email para ver y gestionar tus looks registrados.</p>
            <div style={{display:'flex',gap:'0.75rem',marginBottom:'1.5rem'}}>
              <input type="email" placeholder="tu@email.com" value={emailGestion} onChange={e => setEmailGestion(e.target.value)}
                style={{...inputStyle,flex:1}} onKeyDown={e => e.key === 'Enter' && buscarLooks()}/>
              <button onClick={buscarLooks} disabled={buscandoLooks}
                style={{padding:'0.9rem 1.5rem',fontSize:'0.78rem',fontWeight:600,background:'#0A0A0A',color:'#FFFFFF',border:'none',cursor:'pointer',fontFamily:'Poppins,sans-serif',whiteSpace:'nowrap',opacity:buscandoLooks?0.6:1}}>
                {buscandoLooks ? 'Buscando...' : 'Buscar'}
              </button>
            </div>
            {looksExistentes !== null && (
              looksExistentes.length === 0 ? (
                <div style={{padding:'2rem',background:'#F7F7F5',border:'1px solid #E0E0DC',textAlign:'center',fontSize:'0.82rem',color:'#888884'}}>
                  No hay looks registrados con ese email en este evento.
                </div>
              ) : (
                <div style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
                  {looksExistentes.map((look,i) => (
                    <div key={i} style={{padding:'1.25rem',border:'1px solid #E0E0DC',background:'#FFFFFF',borderRadius:'8px'}}>
                      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'0.75rem'}}>
                        <div style={{display:'flex',alignItems:'center',gap:'0.5rem'}}>
                          <span style={{width:'18px',height:'18px',borderRadius:'50%',background:look.color_hex,border:'1px solid rgba(0,0,0,0.08)',display:'inline-block'}}></span>
                          {look.color_hex_2 && <span style={{width:'18px',height:'18px',borderRadius:'50%',background:look.color_hex_2,border:'1px solid rgba(0,0,0,0.08)',display:'inline-block'}}></span>}
                          <span style={{fontSize:'0.82rem',fontWeight:600,color:'#0A0A0A'}}>{look.marca} · {look.modelo}</span>
                        </div>
                        <span style={{fontSize:'0.58rem',fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',padding:'0.2rem 0.6rem',borderRadius:'20px',background:look.estado==='confirmado'?'#0A0A0A':'#F5EDE8',color:look.estado==='confirmado'?'#FFFFFF':'#C4917C'}}>
                          {look.estado}
                        </span>
                      </div>
                      <div style={{fontSize:'0.75rem',fontWeight:300,color:'#888884',marginBottom:'1rem'}}>{look.tipo}</div>
                      <div style={{display:'flex',gap:'0.75rem'}}>
                        <button onClick={() => handleEditarLook(look)}
                          style={{flex:1,padding:'0.6rem',fontSize:'0.72rem',fontWeight:600,background:'#0A0A0A',color:'#FFFFFF',border:'none',cursor:'pointer',fontFamily:'Poppins,sans-serif',borderRadius:'4px'}}>
                          Editar
                        </button>
                        <button onClick={() => handleEliminarLook(look.id)} disabled={eliminando === look.id}
                          style={{flex:1,padding:'0.6rem',fontSize:'0.72rem',fontWeight:600,background:'transparent',color:'#F07987',border:'1px solid #F07987',cursor:'pointer',fontFamily:'Poppins,sans-serif',borderRadius:'4px',opacity:eliminando===look.id?0.6:1}}>
                          {eliminando === look.id ? 'Eliminando...' : 'Eliminar'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}
          </div>
        ) : (
          <>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'2.5rem'}}>
              <div>
                <h2 style={{fontSize:'2rem',fontWeight:700,color:'#0A0A0A',letterSpacing:'-0.02em',marginBottom:'0.4rem'}}>
                  {lookEditando ? 'Editar look' : 'Tu look'}
                </h2>
                <p style={{fontSize:'0.85rem',fontWeight:400,color:'#555552'}}>
                  {lookEditando ? 'Modifica tu look para ' : 'Registra tu outfit para '}
                  <strong style={{fontWeight:700}}>{evento.nombre}</strong>
                </p>
              </div>
              {!lookEditando && (
                <button onClick={() => setModoGestion(true)}
                  style={{fontSize:'0.65rem',fontWeight:600,letterSpacing:'0.08em',textTransform:'uppercase',color:'#888884',background:'none',border:'1px solid #E0E0DC',cursor:'pointer',fontFamily:'Poppins,sans-serif',padding:'0.5rem 1rem',borderRadius:'4px',whiteSpace:'nowrap'}}>
                  Modificar look
                </button>
              )}
            </div>

            {lookEditando && (
              <div style={{padding:'0.75rem 1rem',background:'#F5EDE8',border:'1px solid #F5D6A0',marginBottom:'1.5rem',borderRadius:'4px',fontSize:'0.78rem',fontWeight:400,color:'#C4917C'}}>
                Estás editando tu look. Los cambios reemplazarán el registro anterior.
              </div>
            )}

            <div style={{marginBottom:'1.25rem'}}>
              <label style={labelStyle}>Tu nombre <span style={{color:'#F07987'}}>*</span></label>
              <input type="text" placeholder="Ej: María García" value={nombre} onChange={e => setNombre(e.target.value)} style={inputStyle}/>
            </div>

            <div style={{marginBottom:'1.25rem'}}>
              <label style={labelStyle}>Tu email <span style={{color:'#F07987'}}>*</span></label>
              <input type="email" placeholder="Ej: maria@gmail.com" value={email} onChange={e => setEmail(e.target.value)} style={{...inputStyle, background: lookEditando ? '#F7F7F5' : '#FFFFFF'}} disabled={!!lookEditando}/>
              {!lookEditando && <p style={{fontSize:'0.65rem',fontWeight:300,color:'#BEBEBA',marginTop:'0.4rem'}}>Solo para enviarte la confirmación. No lo verán otras invitadas.</p>}
            </div>

            <div style={{marginBottom:'1.25rem'}}>
              <label style={{...labelStyle,marginBottom:'0.25rem'}}>Color del look <span style={{color:'#F07987'}}>*</span></label>
              <p style={{fontSize:'0.72rem',fontWeight:300,color:'#888884',marginBottom:'0.55rem'}}>Selecciona hasta 2 colores</p>
              <select onChange={e => { if(e.target.value) toggleColor(e.target.value); e.target.value='' }} style={{...selectStyle,marginBottom:'0.75rem'}}>
                <option value="">Selecciona un color...</option>
                {COLORES.filter(c => !colores.includes(c.hex)).map((c,i) => (
                  <option key={i} value={c.hex}>{c.nombre}</option>
                ))}
              </select>
              {colores.length > 0 && (
                <div style={{display:'flex',gap:'0.75rem',flexWrap:'wrap'}}>
                  {colores.map((hex,i) => (
                    <div key={i} style={{display:'flex',alignItems:'center',gap:'0.5rem',padding:'0.4rem 0.75rem',border:'1px solid #E0E0DC',background:'#F7F7F5'}}>
                      <div style={{width:'14px',height:'14px',borderRadius:'50%',background:hex,border:'1px solid #E0E0DC',flexShrink:0}}></div>
                      <span style={{fontSize:'0.78rem',fontWeight:400,color:'#0A0A0A'}}>{COLORES.find(c=>c.hex===hex)?.nombre}</span>
                      <button onClick={() => toggleColor(hex)} style={{background:'none',border:'none',cursor:'pointer',color:'#888884',fontSize:'0.75rem',padding:'0',lineHeight:1,marginLeft:'0.25rem'}}>✕</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{marginBottom:'1.5rem',padding:'1.5rem',background:'#F7F7F5',border:'1px solid #E0E0DC'}}>
              <div style={{fontSize:'0.7rem',fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase',color:'#0A0A0A',marginBottom:'1.25rem'}}>
                Prenda 1 <span style={{color:'#F07987'}}>*</span>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem',marginBottom:'1rem'}}>
                <div>
                  <label style={labelStyle}>Marca <span style={{color:'#F07987'}}>*</span></label>
                  <input type="text" placeholder="Ej: Zara" value={marca1} onChange={e => setMarca1(e.target.value)} style={inputStyle}/>
                </div>
                <div>
                  <label style={labelStyle}>Tipo <span style={{color:'#F07987'}}>*</span></label>
                  <select value={tipo1} onChange={e => setTipo1(e.target.value)} style={selectStyle}>
                    <option value="">Selecciona...</option>
                    <option>Vestido corto</option><option>Vestido midi</option><option>Vestido largo</option>
                    <option>Falda</option><option>Pantalón</option><option>Top</option><option>Blusa</option>
                    <option>Traje</option><option>Conjunto</option><option>Otro</option>
                  </select>
                </div>
              </div>
              <div style={{marginBottom:'1rem'}}>
                <label style={labelStyle}>Modelo <span style={{color:'#F07987'}}>*</span></label>
                <input type="text" placeholder="Nombre del vestido o modelo" value={modelo1} onChange={e => setModelo1(e.target.value)} style={inputStyle}/>
              </div>
              <div>
                <label style={labelStyle}>Referencia o link <span style={{fontSize:'0.6rem',fontWeight:300,color:'#BEBEBA',textTransform:'none',letterSpacing:0}}>opcional</span></label>
                <input type="text" placeholder="URL o referencia del producto" value={referencia1} onChange={e => setReferencia1(e.target.value)} style={inputStyle}/>
              </div>
            </div>

            <div style={{marginBottom:'1.5rem',padding:'1.5rem',background:'#F7F7F5',border:'1px solid #E0E0DC'}}>
              <div style={{fontSize:'0.7rem',fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase',color:'#888884',marginBottom:'1.25rem'}}>
                Prenda 2 <span style={{fontSize:'0.6rem',fontWeight:300,color:'#BEBEBA',textTransform:'none',letterSpacing:0}}>opcional</span>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem',marginBottom:'1rem'}}>
                <div>
                  <label style={labelStyle}>Marca</label>
                  <input type="text" placeholder="Ej: Mango" value={marca2} onChange={e => setMarca2(e.target.value)} style={inputStyle}/>
                </div>
                <div>
                  <label style={labelStyle}>Tipo</label>
                  <select value={tipo2} onChange={e => setTipo2(e.target.value)} style={selectStyle}>
                    <option value="">Selecciona...</option>
                    <option>Vestido corto</option><option>Vestido midi</option><option>Vestido largo</option>
                    <option>Falda</option><option>Pantalón</option><option>Top</option><option>Blusa</option>
                    <option>Traje</option><option>Conjunto</option><option>Otro</option>
                  </select>
                </div>
              </div>
              <div style={{marginBottom:'1rem'}}>
                <label style={labelStyle}>Modelo</label>
                <input type="text" placeholder="Nombre del vestido o modelo" value={modelo2} onChange={e => setModelo2(e.target.value)} style={inputStyle}/>
              </div>
              <div>
                <label style={labelStyle}>Referencia o link</label>
                <input type="text" placeholder="URL o referencia del producto" value={referencia2} onChange={e => setReferencia2(e.target.value)} style={inputStyle}/>
              </div>
            </div>

            <div style={{marginBottom:'1.25rem'}}>
              <label style={labelStyle}>Foto del look <span style={{fontSize:'0.6rem',fontWeight:300,color:'#BEBEBA',textTransform:'none',letterSpacing:0}}>opcional</span></label>
              <div onClick={() => document.getElementById('foto-input').click()}
                style={{border:'1px dashed #E0E0DC',padding:'1.5rem',textAlign:'center',cursor:'pointer',background:fotoPreview?'transparent':'#F7F7F5'}}>
                {fotoPreview ? (
                  <img src={fotoPreview} alt="Preview" style={{maxHeight:'200px',maxWidth:'100%',objectFit:'contain'}}/>
                ) : (
                  <div>
                    <div style={{fontSize:'0.82rem',fontWeight:300,color:'#888884',marginBottom:'0.25rem'}}>Toca para subir una foto de tu look</div>
                    <div style={{fontSize:'0.72rem',fontWeight:300,color:'#BEBEBA'}}>JPG, PNG o WEBP</div>
                  </div>
                )}
              </div>
              <input id="foto-input" type="file" accept="image/*" style={{display:'none'}}
                onChange={e => { const file=e.target.files[0]; if(file){ setFoto(file); setFotoPreview(URL.createObjectURL(file)) } }}/>
            </div>

            <div style={{marginBottom:'2rem'}}>
              <label style={labelStyle}>Estado <span style={{color:'#F07987'}}>*</span></label>
              <p style={{fontSize:'0.72rem',fontWeight:300,color:'#888884',marginBottom:'0.75rem',lineHeight:1.6}}>
                <strong style={{fontWeight:600,color:'#0A0A0A'}}>Confirmado:</strong> ya tienes el look comprado.<br/>
                <strong style={{fontWeight:600,color:'#0A0A0A'}}>Prereservado:</strong> lo has visto pero aún no lo has comprado. Máximo 3 prerreservas.
              </p>
              <div style={{display:'flex',gap:'1rem'}}>
                {[{val:'confirmado',label:'Confirmado'},{val:'prereservado',label:'Prereservado'}].map(e => (
                  <button key={e.val} onClick={() => setEstado(e.val)}
                    style={{flex:1,padding:'0.85rem',fontSize:'0.78rem',fontWeight:600,fontFamily:'Poppins,sans-serif',cursor:'pointer',border:'1px solid',borderColor:estado===e.val?'#0A0A0A':'#E0E0DC',background:estado===e.val?'#0A0A0A':'#FFFFFF',color:estado===e.val?'#FFFFFF':'#888884'}}>
                    {e.label}
                  </button>
                ))}
              </div>
            </div>

            {error && <p style={{fontSize:'0.82rem',fontWeight:600,color:'#F07987',marginBottom:'1rem',padding:'0.75rem',background:'#FFF0F1',border:'1px solid #F07987'}}>{error}</p>}

            <div style={{display:'flex',gap:'0.75rem'}}>
              {lookEditando && (
                <button onClick={() => { resetForm(); setModoGestion(true) }}
                  style={{flex:1,padding:'1rem',fontSize:'0.88rem',fontWeight:600,background:'transparent',color:'#888884',border:'1px solid #E0E0DC',cursor:'pointer',fontFamily:'Poppins,sans-serif',borderRadius:'4px'}}>
                  Cancelar
                </button>
              )}
              <button onClick={lookEditando ? handleActualizarLook : handleEnviar} disabled={enviando}
                style={{flex:1,padding:'1rem',fontSize:'0.88rem',fontWeight:600,background:'#0A0A0A',color:'#FFFFFF',border:'none',cursor:'pointer',fontFamily:'Poppins,sans-serif',opacity:enviando?0.6:1,borderRadius:'4px'}}>
                {enviando ? 'Guardando...' : lookEditando ? 'Guardar cambios →' : 'Registrar mi look →'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}