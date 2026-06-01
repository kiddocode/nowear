'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { supabase } from '@/lib/supabase'

const FOTO_FIJA = 'https://qhuatexjyxbunotvghjh.supabase.co/storage/v1/object/public/fotos/pexels-pavel-danilyuk-6405676.jpg'
const PRENDAS_COMPLETAS = ['Vestido corto', 'Vestido midi', 'Vestido largo']

function getPlan(evento) {
  if (!evento) return 'basico'
  const p = (evento.plan || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  if (p.includes('enterprise')) return 'enterprise'
  if (p.includes('premium')) return 'premium'
  if (p.includes('estandar') || p.includes('estándar') || p.includes('standard')) return 'estandar'
  return 'basico'
}

function esPremiumOSuperior(evento) {
  return ['premium','enterprise'].includes(getPlan(evento))
}

function normalizar(texto) {
  if (!texto) return ''
  return texto.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '')
    .trim()
}

function AvisoModal({ icono, titulo, desc, onConfirmar, onCancelar, textoConfirmar, textoCancelar, enviando, colorConfirmar }) {
  return (
    <div style={{position:'fixed',inset:0,background:'rgba(10,10,10,0.6)',zIndex:2000,display:'flex',alignItems:'center',justifyContent:'center',padding:'1.5rem'}}>
      <div style={{background:'#FFFFFF',borderRadius:'12px',padding:'2rem',maxWidth:'420px',width:'100%',boxShadow:'0 8px 32px rgba(0,0,0,0.2)'}}>
        {icono && <div style={{fontSize:'1.75rem',marginBottom:'0.75rem',textAlign:'center'}}>{icono}</div>}
        <h3 style={{fontSize:'1rem',fontWeight:700,color:'#0A0A0A',marginBottom:'0.5rem',textAlign:'center'}}>{titulo}</h3>
        <p style={{fontSize:'0.82rem',fontWeight:300,color:'#555552',lineHeight:1.7,marginBottom:'1.5rem',textAlign:'center'}}>{desc}</p>
        <div style={{display:'flex',gap:'0.75rem'}}>
          {onCancelar && (
            <button onClick={onCancelar}
              style={{flex:1,padding:'0.85rem',fontSize:'0.78rem',fontWeight:600,background:'transparent',color:'#888884',border:'1px solid #E0E0DC',cursor:'pointer',fontFamily:'Poppins,sans-serif',borderRadius:'6px'}}>
              {textoCancelar || 'Cancelar'}
            </button>
          )}
          <button onClick={onConfirmar} disabled={enviando}
            style={{flex:1,padding:'0.85rem',fontSize:'0.78rem',fontWeight:600,background:colorConfirmar||'#0A0A0A',color:'#FFFFFF',border:'none',cursor:'pointer',fontFamily:'Poppins,sans-serif',borderRadius:'6px',opacity:enviando?0.6:1}}>
            {enviando ? '...' : (textoConfirmar || 'Aceptar')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function InvitadaPage() {
  const { slug } = useParams()
  const t = useTranslations('invitada')

  const COLORES = [
    {hex:'#F5C6D0',nombre:t('colores.rosapalo')},
    {hex:'#D4A8D4',nombre:t('colores.lila')},
    {hex:'#6B3FA0',nombre:t('colores.morado')},
    {hex:'#D4006A',nombre:t('colores.fucsia')},
    {hex:'#A8C4E0',nombre:t('colores.azulcielo')},
    {hex:'#8B9DC3',nombre:t('colores.azulmarino')},
    {hex:'#A8D4B4',nombre:t('colores.verdementa')},
    {hex:'#4A7C59',nombre:t('colores.verdebotella')},
    {hex:'#6B7C3A',nombre:t('colores.verdeoliva')},
    {hex:'#F5E6C8',nombre:t('colores.beige')},
    {hex:'#D4B896',nombre:t('colores.camel')},
    {hex:'#C4956A',nombre:t('colores.marronclaro')},
    {hex:'#8B4513',nombre:t('colores.marron')},
    {hex:'#E8E8E4',nombre:t('colores.crudo')},
    {hex:'#F5D6A0',nombre:t('colores.amarillo')},
    {hex:'#E07A5F',nombre:t('colores.terracota')},
    {hex:'#C4917C',nombre:t('colores.teja')},
    {hex:'#D4A8A8',nombre:t('colores.nude')},
    {hex:'#6B1A2A',nombre:t('colores.granate')},
    {hex:'#2C2C2C',nombre:t('colores.negro')},
    {hex:'#888884',nombre:t('colores.gris')},
    {hex:'#FFFFFF',nombre:t('colores.blanco')},
    {hex:'#C8A86B',nombre:t('colores.dorado')},
    {hex:'#C0C0C0',nombre:t('colores.plateado')},
    {hex:'#E0E0DC',nombre:t('colores.otro')},
  ]

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
  const [pedirFoto, setPedirFoto] = useState(false)
  const [marca1, setMarca1] = useState('')
  const [modelo1, setModelo1] = useState('')
  const [tipo1, setTipo1] = useState('')
  const [referencia1, setReferencia1] = useState('')
  const [link1, setLink1] = useState('')
  const [marca2, setMarca2] = useState('')
  const [modelo2, setModelo2] = useState('')
  const [tipo2, setTipo2] = useState('')
  const [referencia2, setReferencia2] = useState('')
  const [link2, setLink2] = useState('')
  const [pedirReferencia, setPedirReferencia] = useState(false)
  const [modal, setModal] = useState(null)

  // Prenda 2 obligatoria si prenda 1 no es vestido completo
  const requierePrenda2 = tipo1 && !PRENDAS_COMPLETAS.includes(tipo1)

  // Fix teclado móvil
  useEffect(() => {
    const handler = (e) => {
      setTimeout(() => {
        e.target.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 350)
    }
    document.addEventListener('focusin', handler)
    return () => document.removeEventListener('focusin', handler)
  }, [])

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
    if (colores.includes(hex)) { setColores(colores.filter(c => c !== hex)) }
    else { if (colores.length >= 2) return; setColores([...colores, hex]) }
  }

  function resetForm() {
    setNombre(''); setColores([])
    setMarca1(''); setModelo1(''); setTipo1(''); setReferencia1(''); setLink1('')
    setMarca2(''); setModelo2(''); setTipo2(''); setReferencia2(''); setLink2('')
    setEstado('confirmado'); setFoto(null); setFotoPreview(null)
    setLookEditando(null); setError(''); setPedirReferencia(false); setPedirFoto(false)
    setModal(null)
  }

  function cerrarModal() { setModal(null) }

  async function enviarEmailAsync(tipo, emailInv, nombreInv, extra = {}) {
    try {
      fetch('/api/email', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tipo, emailInvitada: emailInv, nombreInvitada: nombreInv,
          nombreEvento: evento.nombre,
          nombreOrganizadora: organizadora?.nombre || 'la organizadora',
          marca: marca1, modelo: modelo1,
          color: COLORES.find(c => c.hex === colores[0])?.nombre || colores[0],
          organizadoraId: evento.organizadora_id, eventoId: evento.slug,
          ...extra
        })
      })
    } catch (e) { console.error('Error enviando email:', e) }
  }

  async function buscarLooks() {
    if (!emailGestion) return
    setBuscandoLooks(true)
    const { data } = await supabase.from('looks').select('*')
      .eq('evento_id', evento.id).eq('email_invitada', emailGestion.toLowerCase().trim())
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
    setNombre(look.nombre_invitada); setEmail(look.email_invitada)
    setColores([look.color_hex, look.color_hex_2].filter(Boolean))
    setMarca1(look.marca || ''); setModelo1(look.modelo || '')
    setTipo1(look.tipo || ''); setReferencia1(look.referencia || ''); setLink1(look.link || '')
    setMarca2(look.marca2 || ''); setModelo2(look.modelo2 || '')
    setTipo2(look.tipo2 || ''); setReferencia2(look.referencia2 || ''); setLink2(look.link2 || '')
    setEstado(look.estado || 'confirmado')
    setPedirReferencia(false); setPedirFoto(false); setModal(null)
    setModoGestion(false)
  }

  function tieneIdentificador(val) {
    return val && val.trim().length > 0
  }

  async function comprobarConflicto(excludeId = null) {
    if (!marca1 || !tipo1 || !modelo1 || colores.length === 0) return { tipo: 'ninguno' }

    const identificador1 = referencia1.trim() || link1.trim()

    // 1. LOOK BLOQUEADO DE LA ORGANIZADORA
    if (evento.look_bloqueado_marca1) {
      const colorCoincide = colores[0] === evento.look_bloqueado_color
      const marcaCoincide = normalizar(marca1) === normalizar(evento.look_bloqueado_marca1)
      const tipoCoincide = tipo1.trim().toLowerCase() === (evento.look_bloqueado_tipo1 || '').trim().toLowerCase()
      const modeloCoincide = normalizar(modelo1) === normalizar(evento.look_bloqueado_modelo1)
      if (colorCoincide && marcaCoincide && tipoCoincide && modeloCoincide) {
        const refOrg = evento.look_bloqueado_referencia1
        if (refOrg && tieneIdentificador(identificador1)) {
          if (identificador1.toLowerCase() === refOrg.trim().toLowerCase()) {
            return { tipo: 'bloqueado_organizadora' }
          }
        } else if (!refOrg) {
          return { tipo: 'bloqueado_organizadora' }
        } else {
          return { tipo: 'pedir_referencia_organizadora' }
        }
      }
    }

    // 2. CONFLICTO CON OTRAS INVITADAS
    let query = supabase.from('looks').select('id, nombre_invitada, email_invitada, referencia, link, foto_url, color_hex, marca, modelo')
      .eq('evento_id', evento.id)
      .eq('color_hex', colores[0])
      .eq('marca_normalizada', normalizar(marca1))
      .ilike('tipo', tipo1.trim())
      .eq('modelo_normalizado', normalizar(modelo1))
    if (excludeId) query = query.neq('id', excludeId)
    const { data: candidatos } = await query

    if (candidatos && candidatos.length > 0) {
      if (!tieneIdentificador(identificador1)) return { tipo: 'pedir_referencia', candidatos }

      const conflictoReal = candidatos.find(c => {
        const idCandidato = (c.referencia || '').trim() || (c.link || '').trim()
        return idCandidato && idCandidato.toLowerCase() === identificador1.toLowerCase()
      })
      if (conflictoReal) return { tipo: 'conflicto_real', candidato: conflictoReal }

      // Ambos tienen identificador pero distinto: ambiguedad, pedir foto
      const sinIdentificador = candidatos.filter(c => !tieneIdentificador((c.referencia || '') + (c.link || '')))
      if (sinIdentificador.length > 0) return { tipo: 'pedir_referencia', candidatos: sinIdentificador }

      // Todos tienen identificador distinto: posible ambigüedad visual, pedir foto
      return { tipo: 'ambiguedad_foto', candidatos }
    }

    // 3. MISMO MODELO DISTINTO COLOR
    let queryMismoModelo = supabase.from('looks').select('id, nombre_invitada, color_hex')
      .eq('evento_id', evento.id)
      .eq('marca_normalizada', normalizar(marca1))
      .ilike('tipo', tipo1.trim())
      .eq('modelo_normalizado', normalizar(modelo1))
      .neq('color_hex', colores[0])
    if (excludeId) queryMismoModelo = queryMismoModelo.neq('id', excludeId)
    const { data: mismoModelo } = await queryMismoModelo
    if (mismoModelo && mismoModelo.length > 0) {
      return { tipo: 'mismo_modelo_otro_color' }
    }

    return { tipo: 'ninguno' }
  }

  async function subirFoto() {
    if (!foto) return null
    const ext = foto.name.split('.').pop()
    const fileName = `${evento.id}-${Date.now()}.${ext}`
    const { data: uploadData } = await supabase.storage.from('fotos').upload(fileName, foto, { contentType: foto.type })
    if (uploadData) {
      const { data: urlData } = supabase.storage.from('fotos').getPublicUrl(fileName)
      return urlData.publicUrl
    }
    return null
  }

  async function guardarLook(foto_url = null) {
    setEnviando(true)
    const { data: lookInsertado, error: insertError } = await supabase.from('looks').insert({
      evento_id: evento.id, nombre_invitada: nombre, email_invitada: email.toLowerCase().trim(),
      color_hex: colores[0], color_hex_2: colores[1] || null,
      marca: marca1, modelo: modelo1, tipo: tipo1,
      referencia: referencia1 || null,
      link: link1 || null,
      marca_normalizada: normalizar(marca1), modelo_normalizado: normalizar(modelo1),
      marca2: marca2 || null, modelo2: modelo2 || null, tipo2: tipo2 || null,
      referencia2: referencia2 || null,
      link2: link2 || null,
      estado, foto_url
    }).select().single()

    if (insertError) {
      setEnviando(false)
      setModal({ icono:'❌', titulo: t('errorRegistro'), desc: t('errorRegistro'), textoConfirmar:'OK', onConfirmar: cerrarModal })
      return null
    }
    return lookInsertado
  }

  async function actualizarLook() {
    setEnviando(true)
    await supabase.from('looks').update({
      nombre_invitada: nombre, color_hex: colores[0], color_hex_2: colores[1] || null,
      marca: marca1, modelo: modelo1, tipo: tipo1,
      referencia: referencia1 || null,
      link: link1 || null,
      marca_normalizada: normalizar(marca1), modelo_normalizado: normalizar(modelo1),
      marca2: marca2 || null, modelo2: modelo2 || null, tipo2: tipo2 || null,
      referencia2: referencia2 || null,
      link2: link2 || null,
      estado
    }).eq('id', lookEditando.id)
    const emailGuardado = email.toLowerCase().trim()
    const nombreGuardado = nombre
    const lookActualizado = {
      ...lookEditando, nombre_invitada: nombre, color_hex: colores[0], color_hex_2: colores[1] || null,
      marca: marca1, modelo: modelo1, tipo: tipo1,
      referencia: referencia1 || null, link: link1 || null,
      marca2: marca2 || null, modelo2: modelo2 || null, tipo2: tipo2 || null,
      referencia2: referencia2 || null, link2: link2 || null, estado
    }
    setLooksExistentes(prev => prev ? prev.map(l => l.id === lookEditando.id ? lookActualizado : l) : [lookActualizado])
    setEmailGestion(emailGuardado); setEnviando(false); resetForm(); setModoGestion(true)
    enviarEmailAsync('confirmacion', emailGuardado, nombreGuardado)
  }

  async function procesarConflicto(excludeId, accion) {
    const resultado = await comprobarConflicto(excludeId)

    if (resultado.tipo === 'bloqueado_organizadora') {
      setModal({
        icono: '🚫',
        titulo: t('modalBloqueadoTitulo'),
        desc: t('modalBloqueadoDesc'),
        textoConfirmar: t('modalEntendido'),
        onConfirmar: cerrarModal
      })
      return
    }

    if (resultado.tipo === 'pedir_referencia_organizadora' || resultado.tipo === 'pedir_referencia') {
      setPedirReferencia(true)
      setModal({
        icono: '🔍',
        titulo: t('modalPedirReferenciaTitulo'),
        desc: t('modalPedirReferenciaDesc'),
        textoConfirmar: t('modalAnadirReferencia'),
        onConfirmar: cerrarModal
      })
      return
    }

    if (resultado.tipo === 'ambiguedad_foto') {
      // Si ya tiene foto, crear validación y avisar organizadora
      if (foto) {
        const foto_url = await subirFoto()
        const lookInsertado = await guardarLook(foto_url)
        if (!lookInsertado) return

        const candidato = resultado.candidatos[0]
        const colorNombre = COLORES.find(c => c.hex === colores[0])?.nombre || colores[0]
        const colorCandidato = COLORES.find(c => c.hex === candidato.color_hex)?.nombre || candidato.color_hex

        // Crear registro de validación
        const { data: validacion } = await supabase.from('validaciones').insert({
          evento_id: evento.id,
          look_id: lookInsertado.id,
          candidato_id: candidato.id,
          nombre_invitada: nombre,
          email_invitada: email.toLowerCase().trim(),
          nombre_candidata: candidato.nombre_invitada,
          email_candidata: candidato.email_invitada,
          foto_url: foto_url,
        }).select().single()

        if (validacion) {
          // Email a organizadora con botones aprobar/rechazar
          enviarEmailAsync('ambiguedad_foto', email.toLowerCase().trim(), nombre, {
            fotoUrl: foto_url,
            lookId: lookInsertado.id,
            candidatoId: candidato.id,
            nombreCandidata: candidato.nombre_invitada,
            emailCandidata: candidato.email_invitada,
            marcaCandidata: candidato.marca,
            modeloCandidata: candidato.modelo,
            colorCandidata: colorCandidato,
            fotoCandidataUrl: candidato.foto_url || null,
            token: validacion.token,
          })
        }

        setEnviando(false)
        setEnviado(true)
        return
      }

      // Si no tiene foto, pedirla
      setPedirFoto(true)
      setModal({
        icono: '📸',
        titulo: t('modalPedirFotoTitulo') || 'Necesitamos una foto',
        desc: t('modalPedirFotoDesc') || 'Hay una posible coincidencia con otra invitada. Sube una foto de tu look para que la organizadora pueda validarlo.',
        textoConfirmar: t('modalAnadirFoto') || 'Añadir foto',
        onConfirmar: cerrarModal
      })
      return
    }

    if (resultado.tipo === 'conflicto_real') {
      await supabase.from('conflictos').insert({
        evento_id: evento.id, nombre_invitada: nombre, email_invitada: email.toLowerCase().trim(),
        marca: marca1, modelo: modelo1, color_hex: colores[0], nombre_conflicto_con: resultado.candidato.nombre_invitada
      })
      // Aviso a la invitada que intenta registrar
      enviarEmailAsync('conflicto_invitada', email.toLowerCase().trim(), nombre, {
        emailPrimera: resultado.candidato.email_invitada,
        nombrePrimera: resultado.candidato.nombre_invitada,
      })
      setModal({
        icono: '⚠️',
        titulo: t('modalConflictoTitulo'),
        desc: t('modalConflictoDesc'),
        textoConfirmar: t('modalElegirOtro'),
        onConfirmar: cerrarModal,
        colorConfirmar: '#F07987'
      })
      return
    }

    if (resultado.tipo === 'mismo_modelo_otro_color') {
      setModal({
        icono: '👗',
        titulo: t('modalMismoModeloTitulo'),
        desc: t('modalMismoModeloDesc'),
        textoConfirmar: t('modalElegirOtro'),
        onConfirmar: cerrarModal,
        colorConfirmar: '#F07987'
      })
      return
    }

    // Sin conflicto: guardar normalmente
    if (accion === 'enviar') {
      const foto_url = foto ? await subirFoto() : null
      const lookInsertado = await guardarLook(foto_url)
      if (lookInsertado) {
        setEnviando(false)
        setEnviado(true)
        enviarEmailAsync('confirmacion', email.toLowerCase().trim(), nombre)
      }
    } else {
      await actualizarLook()
    }
  }

  async function handleActualizarLook() {
    setError('')
    if (!nombre || !email || colores.length === 0 || !marca1 || !modelo1 || !tipo1) {
      setError(t('errorCampos')); return
    }
    if (requierePrenda2 && (!marca2 || !tipo2 || !modelo2)) {
      setError(t('errorPrenda2') || 'Tu look es de dos piezas. Por favor completa los datos de la segunda prenda.'); return
    }
    await procesarConflicto(lookEditando.id, 'actualizar')
  }

  async function handleEnviar() {
    setError('')
    if (!nombre || !email || colores.length === 0 || !marca1 || !modelo1 || !tipo1 || !estado) {
      setError(t('errorCampos')); return
    }
    if (requierePrenda2 && (!marca2 || !tipo2 || !modelo2)) {
      setError(t('errorPrenda2') || 'Tu look es de dos piezas. Por favor completa los datos de la segunda prenda.'); return
    }
    if (pedirFoto && !foto) {
      setError(t('errorFotoRequerida') || 'Por favor sube una foto de tu look para continuar.'); return
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) { setError(t('errorEmail')); return }

    const { data: existentes } = await supabase.from('looks').select('estado')
      .eq('evento_id', evento.id).eq('email_invitada', email.toLowerCase().trim())
    if (existentes && existentes.length > 0) {
      const confirmados = existentes.filter(l => l.estado === 'confirmado').length
      const prereservados = existentes.filter(l => l.estado === 'prereservado').length
      if (estado === 'confirmado' && confirmados >= 1) {
        setModal({ icono:'ℹ️', titulo: t('modalMaxConfirmadosTitulo'), desc: t('errorMaxConfirmados'), textoConfirmar: t('modalEntendido'), onConfirmar: cerrarModal })
        return
      }
      if (estado === 'prereservado' && prereservados >= 3) {
        setModal({ icono:'ℹ️', titulo: t('modalMaxPrereservasTitulo'), desc: t('errorMaxPrereservas'), textoConfirmar: t('modalEntendido'), onConfirmar: cerrarModal })
        return
      }
    }

    await procesarConflicto(null, 'enviar')
  }

  if (loading) return <div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'calc(100vh - 68px)',fontSize:'0.75rem',color:'#888884'}}>{t('cargando')}</div>
  if (!evento) return <div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'calc(100vh - 68px)',fontSize:'0.75rem',color:'#888884'}}>{t('noEncontrado')}</div>

  if (enviado) return (
    <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',minHeight:'calc(100vh - 68px)',padding:'2rem',textAlign:'center'}}>
      <div style={{fontSize:'clamp(1.8rem,5vw,2.5rem)',fontWeight:100,color:'#0A0A0A',letterSpacing:'-0.03em',marginBottom:'0.5rem'}}>{t('lookRegistrado')}</div>
      <p style={{fontSize:'0.9rem',fontWeight:300,color:'#888884',marginBottom:'2rem',maxWidth:'400px',lineHeight:1.7}}>
        {t('lookRegistradoDesc')} <strong style={{fontWeight:600,color:'#0A0A0A'}}>{evento.nombre}</strong>. {t('lookRegistradoEmail')}
      </p>
      <button onClick={() => { setEnviado(false); resetForm() }}
        style={{fontSize:'0.78rem',fontWeight:500,padding:'0.75rem 2rem',background:'transparent',color:'#0A0A0A',border:'1px solid #0A0A0A',cursor:'pointer',fontFamily:'Poppins,sans-serif'}}>
        {t('registrarOtro')}
      </button>
    </div>
  )

  const selectStyle = {width:'100%',fontFamily:'Poppins,sans-serif',fontSize:'0.88rem',fontWeight:300,padding:'0.9rem 1rem',border:'1px solid #E0E0DC',background:'#FFFFFF',outline:'none',cursor:'pointer',appearance:'none',backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23888884' stroke-width='1.5' fill='none'/%3E%3C/svg%3E")`,backgroundRepeat:'no-repeat',backgroundPosition:'right 1rem center',boxSizing:'border-box'}
  const inputStyle = {width:'100%',fontFamily:'Poppins,sans-serif',fontSize:'0.88rem',fontWeight:300,padding:'0.9rem 1rem',border:'1px solid #E0E0DC',background:'#FFFFFF',outline:'none',boxSizing:'border-box'}
  const labelStyle = {display:'block',fontSize:'0.65rem',fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase',color:'#555552',marginBottom:'0.55rem'}
  const notaStyle = {fontSize:'0.65rem',fontWeight:300,color:'#BEBEBA',marginTop:'0.35rem',lineHeight:1.5}

  const isPremium = esPremiumOSuperior(evento)
  const fotoPanel = isPremium && evento.foto_evento_url ? evento.foto_evento_url : FOTO_FIJA
  const mensajePanel = isPremium && evento.mensaje_invitada ? evento.mensaje_invitada : t('registraLook')
  const tiposData = t.raw('tipos')

  return (
    <>
      <style>{`
        .invitada-layout { display: grid; grid-template-columns: 1fr 1fr; min-height: calc(100vh - 68px); }
        .invitada-panel { position: sticky; top: 68px; height: calc(100vh - 68px); overflow: hidden; }
        .invitada-panel-mobile { display: none; }
        .invitada-form-col { padding: 3rem; background: #FFFFFF; overflow-y: auto; padding-bottom: 5rem; }
        .prenda-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem; }
        .estado-grid { display: flex; gap: 1rem; }
        .gestion-row { display: flex; gap: 0.75rem; margin-bottom: 1.5rem; }
        @media (max-width: 1024px) {
          .invitada-layout { grid-template-columns: 1fr; }
          .invitada-panel { display: none; }
          .invitada-panel-mobile { display: block; position: relative; height: 220px; overflow: hidden; }
          .invitada-form-col { padding: 2rem; padding-bottom: 6rem; }
        }
        @media (max-width: 768px) {
          .invitada-layout { grid-template-columns: 1fr; }
          .invitada-panel { display: none; }
          .invitada-panel-mobile { display: block; height: 180px; }
          .invitada-form-col { padding: 1.5rem; padding-bottom: 6rem; }
          .prenda-grid { grid-template-columns: 1fr; }
          .estado-grid { flex-direction: column; }
          .gestion-row { flex-direction: column; }
          .gestion-row input { width: 100%; }
        }
      `}</style>

      {modal && (
        <AvisoModal
          icono={modal.icono}
          titulo={modal.titulo}
          desc={modal.desc}
          textoConfirmar={modal.textoConfirmar}
          textoCancelar={modal.textoCancelar}
          onConfirmar={modal.onConfirmar}
          onCancelar={modal.onCancelar}
          enviando={enviando}
          colorConfirmar={modal.colorConfirmar}
        />
      )}

      <div className="invitada-layout">

        <div className="invitada-panel">
          <img src={fotoPanel} alt="Evento" style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}}/>
          <div style={{position:'absolute',inset:0,background:'linear-gradient(to top, rgba(10,10,10,0.85) 0%, rgba(10,10,10,0.2) 60%)',display:'flex',flexDirection:'column',justifyContent:'flex-end',padding:'3rem'}}>
            <div style={{fontSize:'0.65rem',fontWeight:700,letterSpacing:'0.18em',textTransform:'uppercase',color:'rgba(255,255,255,0.6)',marginBottom:'0.75rem'}}>{evento.tipo}</div>
            <h1 style={{fontSize:'clamp(1.8rem,3vw,2.8rem)',fontWeight:700,color:'#FFFFFF',letterSpacing:'-0.025em',lineHeight:1,marginBottom:'0.5rem'}}>{evento.nombre}</h1>
            <p style={{fontSize:'0.85rem',fontWeight:400,color:'rgba(255,255,255,0.75)',marginBottom:'1.5rem'}}>
              {evento.fecha ? new Date(evento.fecha).toLocaleDateString('es-ES',{day:'numeric',month:'long',year:'numeric'}) : ''}
              {evento.lugar ? ` · ${evento.lugar}` : ''}
            </p>
            <p style={{fontSize:'0.85rem',fontWeight:400,color:'rgba(255,255,255,0.8)',lineHeight:1.8,maxWidth:'380px'}}>{mensajePanel}</p>
            {evento.colores_bloqueados && (
              <div style={{marginTop:'1.5rem',padding:'1rem 1.25rem',background:'rgba(196,145,124,0.2)',border:'1px solid rgba(196,145,124,0.4)'}}>
                <p style={{fontSize:'0.62rem',fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase',color:'#F07987',marginBottom:'0.3rem'}}>{t('coloresNoDisponibles')}</p>
                <p style={{fontSize:'0.8rem',fontWeight:400,color:'rgba(255,255,255,0.8)'}}>{evento.colores_bloqueados}</p>
              </div>
            )}
          </div>
        </div>

        <div className="invitada-panel-mobile">
          <img src={fotoPanel} alt="Evento" style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}}/>
          <div style={{position:'absolute',inset:0,background:'linear-gradient(to top, rgba(10,10,10,0.9) 0%, rgba(10,10,10,0.3) 60%)',display:'flex',flexDirection:'column',justifyContent:'flex-end',padding:'1.25rem 1.5rem'}}>
            <div style={{fontSize:'0.55rem',fontWeight:700,letterSpacing:'0.15em',textTransform:'uppercase',color:'rgba(255,255,255,0.6)',marginBottom:'0.3rem'}}>{evento.tipo}</div>
            <h1 style={{fontSize:'1.4rem',fontWeight:700,color:'#FFFFFF',letterSpacing:'-0.02em',lineHeight:1.1,marginBottom:'0.25rem'}}>{evento.nombre}</h1>
            <p style={{fontSize:'0.72rem',fontWeight:300,color:'rgba(255,255,255,0.7)'}}>
              {evento.fecha ? new Date(evento.fecha).toLocaleDateString('es-ES',{day:'numeric',month:'long',year:'numeric'}) : ''}
              {evento.lugar ? ` · ${evento.lugar}` : ''}
            </p>
          </div>
        </div>

        <div className="invitada-form-col">
          {modoGestion ? (
            <div>
              <button onClick={() => { setModoGestion(false); setLooksExistentes(null); setEmailGestion('') }}
                style={{display:'flex',alignItems:'center',gap:'0.5rem',fontSize:'0.65rem',fontWeight:600,letterSpacing:'0.1em',textTransform:'uppercase',color:'#888884',background:'none',border:'none',cursor:'pointer',fontFamily:'Poppins,sans-serif',marginBottom:'2rem',padding:0}}>
                ← {t('volver')}
              </button>
              <h2 style={{fontSize:'clamp(1.4rem,4vw,1.8rem)',fontWeight:700,color:'#0A0A0A',letterSpacing:'-0.02em',marginBottom:'0.4rem'}}>{t('misLooks')}</h2>
              <p style={{fontSize:'0.85rem',fontWeight:400,color:'#555552',marginBottom:'2rem'}}>{t('emailParaGestionar')}</p>
              <div className="gestion-row">
                <input type="email" placeholder="tu@email.com" value={emailGestion} onChange={e => setEmailGestion(e.target.value)}
                  style={{...inputStyle,flex:1}} onKeyDown={e => e.key === 'Enter' && buscarLooks()}/>
                <button onClick={buscarLooks} disabled={buscandoLooks}
                  style={{padding:'0.9rem 1.5rem',fontSize:'0.78rem',fontWeight:600,background:'#0A0A0A',color:'#FFFFFF',border:'none',cursor:'pointer',fontFamily:'Poppins,sans-serif',whiteSpace:'nowrap',opacity:buscandoLooks?0.6:1,borderRadius:'4px'}}>
                  {buscandoLooks ? t('buscando') : t('buscar')}
                </button>
              </div>
              {looksExistentes !== null && (
                looksExistentes.length === 0 ? (
                  <div style={{padding:'2rem',background:'#F7F7F5',border:'1px solid #E0E0DC',textAlign:'center',fontSize:'0.82rem',color:'#888884',borderRadius:'8px'}}>
                    {t('sinLooks')}
                  </div>
                ) : (
                  <div style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
                    {looksExistentes.map((look, i) => (
                      <div key={i} style={{padding:'1.25rem',border:'1px solid #E0E0DC',background:'#FFFFFF',borderRadius:'8px'}}>
                        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'0.75rem',flexWrap:'wrap',gap:'0.5rem'}}>
                          <div style={{display:'flex',alignItems:'center',gap:'0.5rem'}}>
                            <span style={{width:'18px',height:'18px',borderRadius:'50%',background:look.color_hex,border:'1px solid rgba(0,0,0,0.08)',display:'inline-block'}}></span>
                            {look.color_hex_2 && <span style={{width:'18px',height:'18px',borderRadius:'50%',background:look.color_hex_2,border:'1px solid rgba(0,0,0,0.08)',display:'inline-block'}}></span>}
                            <span style={{fontSize:'0.82rem',fontWeight:600,color:'#0A0A0A'}}>{look.marca} · {look.modelo}</span>
                          </div>
                          <span style={{fontSize:'0.58rem',fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',padding:'0.2rem 0.6rem',borderRadius:'20px',background:look.estado==='confirmado'?'#0A0A0A':'#F5EDE8',color:look.estado==='confirmado'?'#FFFFFF':'#C4917C'}}>
                            {look.estado === 'confirmado' ? t('estadoConfirmado') : t('estadoPrereservado')}
                          </span>
                        </div>
                        <div style={{fontSize:'0.75rem',fontWeight:300,color:'#888884',marginBottom:'1rem'}}>{look.tipo}</div>
                        <div style={{display:'flex',gap:'0.75rem'}}>
                          <button onClick={() => handleEditarLook(look)}
                            style={{flex:1,padding:'0.6rem',fontSize:'0.72rem',fontWeight:600,background:'#0A0A0A',color:'#FFFFFF',border:'none',cursor:'pointer',fontFamily:'Poppins,sans-serif',borderRadius:'4px'}}>
                            {t('editar')}
                          </button>
                          <button onClick={() => handleEliminarLook(look.id)} disabled={eliminando === look.id}
                            style={{flex:1,padding:'0.6rem',fontSize:'0.72rem',fontWeight:600,background:'transparent',color:'#F07987',border:'1px solid #F07987',cursor:'pointer',fontFamily:'Poppins,sans-serif',borderRadius:'4px',opacity:eliminando===look.id?0.6:1}}>
                            {eliminando === look.id ? t('eliminando') : t('eliminar')}
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
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'2rem',gap:'1rem',flexWrap:'wrap'}}>
                <div>
                  <h2 style={{fontSize:'clamp(1.5rem,4vw,2rem)',fontWeight:700,color:'#0A0A0A',letterSpacing:'-0.02em',marginBottom:'0.4rem'}}>
                    {lookEditando ? t('editarLook') : t('tuLook')}
                  </h2>
                  <p style={{fontSize:'0.85rem',fontWeight:400,color:'#555552'}}>
                    {lookEditando ? t('modificaTuLookPara') : t('registraOutfit')} <strong style={{fontWeight:700}}>{evento.nombre}</strong>
                  </p>
                </div>
                {!lookEditando && (
                  <button onClick={() => setModoGestion(true)}
                    style={{fontSize:'0.65rem',fontWeight:600,letterSpacing:'0.08em',textTransform:'uppercase',color:'#888884',background:'none',border:'1px solid #E0E0DC',cursor:'pointer',fontFamily:'Poppins,sans-serif',padding:'0.5rem 1rem',borderRadius:'4px',whiteSpace:'nowrap',flexShrink:0}}>
                    {t('modificarLook')}
                  </button>
                )}
              </div>

              {lookEditando && (
                <div style={{padding:'0.75rem 1rem',background:'#F5EDE8',border:'1px solid #F5D6A0',marginBottom:'1.5rem',borderRadius:'4px',fontSize:'0.78rem',fontWeight:400,color:'#C4917C'}}>
                  {t('editandoAviso')}
                </div>
              )}

              {evento.colores_bloqueados && (
                <div style={{padding:'0.75rem 1rem',background:'rgba(240,121,135,0.08)',border:'1px solid rgba(240,121,135,0.3)',marginBottom:'1.5rem',borderRadius:'4px'}}>
                  <p style={{fontSize:'0.62rem',fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase',color:'#F07987',marginBottom:'0.2rem'}}>{t('coloresNoDisponibles')}</p>
                  <p style={{fontSize:'0.78rem',fontWeight:400,color:'#0A0A0A'}}>{evento.colores_bloqueados}</p>
                </div>
              )}

              <div style={{marginBottom:'1.25rem'}}>
                <label style={labelStyle}>{t('tuNombre')} <span style={{color:'#F07987'}}>*</span></label>
                <input type="text" placeholder={t('nombrePlaceholder')} value={nombre} onChange={e => setNombre(e.target.value)} style={inputStyle}/>
              </div>

              <div style={{marginBottom:'1.25rem'}}>
                <label style={labelStyle}>{t('tuEmail')} <span style={{color:'#F07987'}}>*</span></label>
                <input type="email" placeholder={t('emailPlaceholder')} value={email} onChange={e => setEmail(e.target.value)} style={{...inputStyle,background:lookEditando?'#F7F7F5':'#FFFFFF'}} disabled={!!lookEditando}/>
                {!lookEditando && <p style={notaStyle}>{t('emailInfo')}</p>}
              </div>

              <div style={{marginBottom:'1.25rem'}}>
                <label style={{...labelStyle,marginBottom:'0.25rem'}}>{t('colorLook')} <span style={{color:'#F07987'}}>*</span></label>
                <p style={{fontSize:'0.72rem',fontWeight:300,color:'#888884',marginBottom:'0.55rem'}}>{t('hastaColores')}</p>
                <select onChange={e => { if(e.target.value) toggleColor(e.target.value); e.target.value='' }} style={{...selectStyle,marginBottom:'0.75rem'}}>
                  <option value="">{t('seleccionaColor')}</option>
                  {COLORES.filter(c => !colores.includes(c.hex)).map((c, i) => (
                    <option key={i} value={c.hex}>{c.nombre}</option>
                  ))}
                </select>
                {colores.length > 0 && (
                  <div style={{display:'flex',gap:'0.75rem',flexWrap:'wrap'}}>
                    {colores.map((hex, i) => (
                      <div key={i} style={{display:'flex',alignItems:'center',gap:'0.5rem',padding:'0.4rem 0.75rem',border:'1px solid #E0E0DC',background:'#F7F7F5',borderRadius:'4px'}}>
                        <div style={{width:'14px',height:'14px',borderRadius:'50%',background:hex,border:'1px solid #E0E0DC',flexShrink:0}}></div>
                        <span style={{fontSize:'0.78rem',fontWeight:400,color:'#0A0A0A'}}>{COLORES.find(c=>c.hex===hex)?.nombre}</span>
                        <button onClick={() => toggleColor(hex)} style={{background:'none',border:'none',cursor:'pointer',color:'#888884',fontSize:'0.75rem',padding:'0',lineHeight:1,marginLeft:'0.25rem'}}>×</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* PRENDA 1 */}
              <div style={{marginBottom:'1.5rem',padding:'1.5rem',background:'#F7F7F5',border:'1px solid #E0E0DC',borderRadius:'4px'}}>
                <div style={{fontSize:'0.7rem',fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase',color:'#0A0A0A',marginBottom:'1.25rem'}}>
                  {t('prenda1')} <span style={{color:'#F07987'}}>*</span>
                </div>
                <div className="prenda-grid">
                  <div>
                    <label style={labelStyle}>{t('marca')} <span style={{color:'#F07987'}}>*</span></label>
                    <input type="text" placeholder={t('marcaPlaceholder')} value={marca1} onChange={e => { setMarca1(e.target.value); setPedirReferencia(false) }} style={inputStyle}/>
                  </div>
                  <div>
                    <label style={labelStyle}>{t('tipo')} <span style={{color:'#F07987'}}>*</span></label>
                    <select value={tipo1} onChange={e => { setTipo1(e.target.value); setPedirReferencia(false) }} style={selectStyle}>
                      <option value="">{t('selecciona')}</option>
                      {tiposData.map((tipo, i) => <option key={i}>{tipo}</option>)}
                    </select>
                  </div>
                </div>
                <div style={{marginBottom:'1rem'}}>
                  <label style={labelStyle}>{t('modelo')} <span style={{color:'#F07987'}}>*</span></label>
                  <input type="text" placeholder={t('modeloPlaceholder')} value={modelo1} onChange={e => { setModelo1(e.target.value); setPedirReferencia(false) }} style={inputStyle}/>
                  <p style={notaStyle}>{t('modeloNota')}</p>
                </div>
                <div style={{marginBottom:'0.75rem'}}>
                  <label style={labelStyle}>
                    {t('referenciaCodigoLabel')}
                    {pedirReferencia
                      ? <span style={{color:'#F07987',marginLeft:'0.4rem',fontWeight:700}}>{t('referenciaRequerida')}</span>
                      : <span style={{fontSize:'0.6rem',fontWeight:300,color:'#BEBEBA',textTransform:'none',letterSpacing:0,marginLeft:'0.4rem'}}>{t('opcional')}</span>
                    }
                  </label>
                  <input type="text" placeholder={t('referenciaCodigoPlaceholder')} value={referencia1} onChange={e => setReferencia1(e.target.value)}
                    style={{...inputStyle, borderColor: pedirReferencia && !referencia1 && !link1 ? '#F07987' : '#E0E0DC'}}/>
                  <p style={notaStyle}>{t('referenciaCodigoNota')}</p>
                </div>
                <div>
                  <label style={labelStyle}>
                    {t('referenciaLinkLabel')}
                    {pedirReferencia
                      ? <span style={{color:'#F07987',marginLeft:'0.4rem',fontWeight:700}}>{t('referenciaLinkRequerido')}</span>
                      : <span style={{fontSize:'0.6rem',fontWeight:300,color:'#BEBEBA',textTransform:'none',letterSpacing:0,marginLeft:'0.4rem'}}>{t('opcional')}</span>
                    }
                  </label>
                  <input type="url" placeholder={t('referenciaLinkPlaceholder')} value={link1} onChange={e => setLink1(e.target.value)}
                    style={{...inputStyle, borderColor: pedirReferencia && !referencia1 && !link1 ? '#F07987' : '#E0E0DC'}}/>
                  <p style={notaStyle}>{t('referenciaLinkNota')}</p>
                  {pedirReferencia && (
                    <p style={{fontSize:'0.72rem',fontWeight:400,color:'#C4917C',marginTop:'0.5rem',lineHeight:1.5}}>
                      {t('referenciaInfo') || t('errorPedirReferencia')}
                    </p>
                  )}
                </div>
              </div>

              {/* PRENDA 2 */}
              <div style={{marginBottom:'1.5rem',padding:'1.5rem',background:'#F7F7F5',border:`1px solid ${requierePrenda2 ? '#F07987' : '#E0E0DC'}`,borderRadius:'4px'}}>
                <div style={{fontSize:'0.7rem',fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase',color: requierePrenda2 ? '#0A0A0A' : '#888884',marginBottom:'0.5rem'}}>
                  {t('prenda2')} {requierePrenda2 && <span style={{color:'#F07987'}}>*</span>}
                </div>
                <p style={{fontSize:'0.65rem',fontWeight:300,color: requierePrenda2 ? '#F07987' : '#BEBEBA',marginBottom:'1.25rem',lineHeight:1.5}}>
                  {requierePrenda2
                    ? (t('prenda2ObligatoriaDesc') || 'Tu prenda principal no es un vestido. Añade la segunda pieza del look.')
                    : (t('prenda2OpcionaDesc') || 'Para looks de dos piezas: falda + top, pantalón + blusa, etc.')
                  }
                </p>
                <div className="prenda-grid">
                  <div>
                    <label style={labelStyle}>{t('marca')} {requierePrenda2 && <span style={{color:'#F07987'}}>*</span>}</label>
                    <input type="text" placeholder="Ej: Mango" value={marca2} onChange={e => setMarca2(e.target.value)}
                      style={{...inputStyle, borderColor: requierePrenda2 && !marca2 ? '#F07987' : '#E0E0DC'}}/>
                  </div>
                  <div>
                    <label style={labelStyle}>{t('tipo')} {requierePrenda2 && <span style={{color:'#F07987'}}>*</span>}</label>
                    <select value={tipo2} onChange={e => setTipo2(e.target.value)}
                      style={{...selectStyle, borderColor: requierePrenda2 && !tipo2 ? '#F07987' : '#E0E0DC'}}>
                      <option value="">{t('selecciona')}</option>
                      {tiposData.map((tipo, i) => <option key={i}>{tipo}</option>)}
                    </select>
                  </div>
                </div>
                <div style={{marginBottom:'0.75rem'}}>
                  <label style={labelStyle}>{t('modelo')} {requierePrenda2 && <span style={{color:'#F07987'}}>*</span>}</label>
                  <input type="text" placeholder={t('modeloPlaceholder')} value={modelo2} onChange={e => setModelo2(e.target.value)}
                    style={{...inputStyle, borderColor: requierePrenda2 && !modelo2 ? '#F07987' : '#E0E0DC'}}/>
                  <p style={notaStyle}>{t('modeloNota')}</p>
                </div>
                <div style={{marginBottom:'0.75rem'}}>
                  <label style={labelStyle}>{t('referenciaCodigoLabel')} <span style={{fontSize:'0.6rem',fontWeight:300,color:'#BEBEBA',textTransform:'none',letterSpacing:0,marginLeft:'0.4rem'}}>{t('opcional')}</span></label>
                  <input type="text" placeholder={t('referenciaCodigoPlaceholder')} value={referencia2} onChange={e => setReferencia2(e.target.value)} style={inputStyle}/>
                  <p style={notaStyle}>{t('referenciaCodigoNota')}</p>
                </div>
                <div>
                  <label style={labelStyle}>{t('referenciaLinkLabel')} <span style={{fontSize:'0.6rem',fontWeight:300,color:'#BEBEBA',textTransform:'none',letterSpacing:0,marginLeft:'0.4rem'}}>{t('opcional')}</span></label>
                  <input type="url" placeholder={t('referenciaLinkPlaceholder')} value={link2} onChange={e => setLink2(e.target.value)} style={inputStyle}/>
                  <p style={notaStyle}>{t('referenciaLinkNota')}</p>
                </div>
              </div>

              {/* FOTO */}
              <div style={{marginBottom:'1.25rem'}}>
                <label style={labelStyle}>
                  {t('foto')}
                  {pedirFoto
                    ? <span style={{color:'#F07987',marginLeft:'0.4rem',fontWeight:700}}>* {t('referenciaRequerida') || 'requerida'}</span>
                    : <span style={{fontSize:'0.6rem',fontWeight:300,color:'#BEBEBA',textTransform:'none',letterSpacing:0,marginLeft:'0.4rem'}}>{t('opcional')}</span>
                  }
                </label>
                {pedirFoto && (
                  <div style={{padding:'0.75rem 1rem',background:'rgba(240,121,135,0.08)',border:'1px solid rgba(240,121,135,0.3)',marginBottom:'0.75rem',borderRadius:'4px'}}>
                    <p style={{fontSize:'0.78rem',fontWeight:400,color:'#F07987',margin:0,lineHeight:1.6}}>
                      {t('modalPedirFotoDesc') || 'Hay una posible coincidencia con otra invitada. Sube una foto de tu look para que la organizadora pueda validarlo.'}
                    </p>
                  </div>
                )}
                <div onClick={() => document.getElementById('foto-input').click()}
                  style={{border:`1px dashed ${pedirFoto && !foto ? '#F07987' : '#E0E0DC'}`,padding:'1.5rem',textAlign:'center',cursor:'pointer',background:fotoPreview?'transparent':'#F7F7F5',borderRadius:'4px'}}>
                  {fotoPreview ? (
                    <img src={fotoPreview} alt="Preview" style={{maxHeight:'200px',maxWidth:'100%',objectFit:'contain'}}/>
                  ) : (
                    <div>
                      <div style={{fontSize:'0.82rem',fontWeight:300,color: pedirFoto ? '#F07987' : '#888884',marginBottom:'0.25rem'}}>{t('fotoInfo')}</div>
                      <div style={{fontSize:'0.72rem',fontWeight:300,color:'#BEBEBA'}}>JPG, PNG o WEBP</div>
                    </div>
                  )}
                </div>
                <input id="foto-input" type="file" accept="image/*" style={{display:'none'}}
                  onChange={e => { const file=e.target.files[0]; if(file){ setFoto(file); setFotoPreview(URL.createObjectURL(file)) } }}/>
              </div>

              <div style={{marginBottom:'2rem'}}>
                <label style={labelStyle}>{t('estado')} <span style={{color:'#F07987'}}>*</span></label>
                <p style={{fontSize:'0.72rem',fontWeight:300,color:'#888884',marginBottom:'0.75rem',lineHeight:1.6}}>
                  <strong style={{fontWeight:600,color:'#0A0A0A'}}>{t('estadoConfirmado')}:</strong> {t('estadoConfirmadoDesc')}<br/>
                  <strong style={{fontWeight:600,color:'#0A0A0A'}}>{t('estadoPrereservado')}:</strong> {t('estadoPrereservadoDesc')}
                </p>
                <div className="estado-grid">
                  {[{val:'confirmado',label:t('estadoConfirmado')},{val:'prereservado',label:t('estadoPrereservado')}].map(e => (
                    <button key={e.val} onClick={() => setEstado(e.val)}
                      style={{flex:1,padding:'0.85rem',fontSize:'0.78rem',fontWeight:600,fontFamily:'Poppins,sans-serif',cursor:'pointer',border:'1px solid',borderColor:estado===e.val?'#0A0A0A':'#E0E0DC',background:estado===e.val?'#0A0A0A':'#FFFFFF',color:estado===e.val?'#FFFFFF':'#888884',borderRadius:'4px'}}>
                      {e.label}
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <div style={{marginBottom:'1rem',padding:'1rem 1.25rem',background:'#FFFFFF',border:'1px solid #E0E0DC',borderRadius:'8px',boxShadow:'0 2px 8px rgba(0,0,0,0.06)'}}>
                  <p style={{fontSize:'0.82rem',fontWeight:500,color:'#0A0A0A',margin:0}}>{error}</p>
                </div>
              )}

              <div style={{display:'flex',gap:'0.75rem'}}>
                {lookEditando && (
                  <button onClick={() => { resetForm(); setModoGestion(true) }}
                    style={{flex:1,padding:'1rem',fontSize:'0.88rem',fontWeight:600,background:'transparent',color:'#888884',border:'1px solid #E0E0DC',cursor:'pointer',fontFamily:'Poppins,sans-serif',borderRadius:'4px'}}>
                    {t('cancelar')}
                  </button>
                )}
                <button onClick={lookEditando ? handleActualizarLook : handleEnviar} disabled={enviando}
                  style={{flex:1,padding:'1rem',fontSize:'0.88rem',fontWeight:600,background:'#0A0A0A',color:'#FFFFFF',border:'none',cursor:'pointer',fontFamily:'Poppins,sans-serif',opacity:enviando?0.6:1,borderRadius:'4px'}}>
                  {enviando ? t('guardando') : lookEditando ? t('guardarCambios') : t('registrar')}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}