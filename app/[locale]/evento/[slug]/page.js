'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter, usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { supabase } from '@/lib/supabase'
import ModalPlanes from '@/app/components/ModalPlanes'
import * as XLSX from 'xlsx'

const PLAN_NIVEL = { 'basico': 1, 'estandar': 2, 'premium': 3, 'enterprise': 4 }

function getPlan(evento) {
  if (!evento) return 'basico'
  const p = (evento.plan || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  if (p.includes('enterprise')) return 'enterprise'
  if (p.includes('premium')) return 'premium'
  if (p.includes('estandar') || p.includes('estándar') || p.includes('standard')) return 'estandar'
  return 'basico'
}

function puedeExportar(evento) { return PLAN_NIVEL[getPlan(evento)] >= PLAN_NIVEL['estandar'] }
function esPremiumOSuperior(evento) { return PLAN_NIVEL[getPlan(evento)] >= PLAN_NIVEL['premium'] }
function esEnterprise(evento) { return getPlan(evento) === 'enterprise' }

function normalizarStrict(texto) {
  if (!texto) return ''
  return texto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]/g,'').trim()
}

function similitudPalabras(a, b) {
  if (!a || !b) return 0
  const pa = a.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9\s]/g,'').trim().split(/\s+/).filter(p => p.length > 2)
  const pb = b.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9\s]/g,'').trim().split(/\s+/).filter(p => p.length > 2)
  if (pa.length === 0) return 0
  return pa.filter(p => pb.includes(p)).length / pa.length
}

const COLORES_LISTA = [
  {hex:'#F5C6D0',nombre:'Rosa palo'},{hex:'#D4A8D4',nombre:'Lila'},{hex:'#6B3FA0',nombre:'Morado'},
  {hex:'#D4006A',nombre:'Fucsia'},{hex:'#A8C4E0',nombre:'Azul cielo'},{hex:'#8B9DC3',nombre:'Azul marino'},
  {hex:'#A8D4B4',nombre:'Verde menta'},{hex:'#4A7C59',nombre:'Verde botella'},{hex:'#6B7C3A',nombre:'Verde oliva'},
  {hex:'#F5E6C8',nombre:'Beige'},{hex:'#D4B896',nombre:'Camel'},{hex:'#C4956A',nombre:'Marrón claro'},
  {hex:'#8B4513',nombre:'Marrón'},{hex:'#E8E8E4',nombre:'Crudo'},{hex:'#F5D6A0',nombre:'Amarillo'},
  {hex:'#E07A5F',nombre:'Terracota'},{hex:'#C4917C',nombre:'Teja'},{hex:'#D4A8A8',nombre:'Nude'},
  {hex:'#6B1A2A',nombre:'Granate'},{hex:'#2C2C2C',nombre:'Negro'},{hex:'#888884',nombre:'Gris'},
  {hex:'#FFFFFF',nombre:'Blanco'},{hex:'#C8A86B',nombre:'Dorado'},{hex:'#C0C0C0',nombre:'Plateado'},
  {hex:'#E0E0DC',nombre:'Otro'},
]
const TIPOS_PRENDA = ['Vestido corto','Vestido midi','Vestido largo','Traje','Conjunto','Falda','Pantalón','Top','Blusa','Mono','Jumpsuit','Otro']

export default function EventoDetalle() {
  const { slug } = useParams()
  const router = useRouter()
  const pathname = usePathname()
  const t = useTranslations('evento')

  const localesPrefix = ['fr','en','pt','de','nl']
  const locale = localesPrefix.find(loc => pathname.startsWith(`/${loc}/`) || pathname === `/${loc}`) || 'es'
  const prefijo = locale !== 'es' ? `/${locale}` : ''

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
  const [modalPlanes, setModalPlanes] = useState(false)
  const [editFotoEvento, setEditFotoEvento] = useState('')
  const [editMensajeInvitada, setEditMensajeInvitada] = useState('')
  const [fotoEventoFile, setFotoEventoFile] = useState(null)
  const [fotoEventoPreview, setFotoEventoPreview] = useState(null)
  const [guardandoPersonalizacion, setGuardandoPersonalizacion] = useState(false)
  const [personalizacionMensaje, setPersonalizacionMensaje] = useState('')
  const [organizadores, setOrganizadores] = useState([])
  const [emailNuevoOrg, setEmailNuevoOrg] = useState('')
  const [añadiendoOrg, setAñadiendoOrg] = useState(false)
  const [orgMensaje, setOrgMensaje] = useState('')
  const [fotoModal, setFotoModal] = useState(null)
  const [invitadasArchivo, setInvitadasArchivo] = useState([])
  const [nombreArchivo, setNombreArchivo] = useState('')
  const [enviandoRecordatorios, setEnviandoRecordatorios] = useState(false)
  const [recordatorioMensaje, setRecordatorioMensaje] = useState('')
  const [pendientesConEmail, setPendientesConEmail] = useState([])
  const [pendientesSinEmail, setPendientesSinEmail] = useState([])
  const [recordatorioWhatsapp, setRecordatorioWhatsapp] = useState('')
  const [errorArchivo, setErrorArchivo] = useState('')

  const [editLookBloqueadoColor, setEditLookBloqueadoColor] = useState('')
  const [editLookBloqueadoMarca1, setEditLookBloqueadoMarca1] = useState('')
  const [editLookBloqueadoTipo1, setEditLookBloqueadoTipo1] = useState('')
  const [editLookBloqueadoModelo1, setEditLookBloqueadoModelo1] = useState('')
  const [editLookBloqueadoReferencia1, setEditLookBloqueadoReferencia1] = useState('')
  const [editLookBloqueadoLink1, setEditLookBloqueadoLink1] = useState('')
  const [editLookBloqueadoMarca2, setEditLookBloqueadoMarca2] = useState('')
  const [editLookBloqueadoTipo2, setEditLookBloqueadoTipo2] = useState('')
  const [editLookBloqueadoModelo2, setEditLookBloqueadoModelo2] = useState('')
  const [editLookBloqueadoReferencia2, setEditLookBloqueadoReferencia2] = useState('')
  const [editLookBloqueadoLink2, setEditLookBloqueadoLink2] = useState('')
  const [tieneLookBloqueado, setTieneLookBloqueado] = useState(false)
  const [guardandoBloqueos, setGuardandoBloqueos] = useState(false)
  const [bloqueosMensaje, setBloqueosMensaje] = useState('')
  const [conflictoLookMsg, setConflictoLookMsg] = useState('')

  useEffect(() => {
    async function cargar() {
      const { data: ev } = await supabase.from('eventos').select('*').eq('slug', slug).single()
      if (!ev) { router.push(prefijo + '/dashboard'); return }
      setEvento(ev)
      setEditNombre(ev.nombre || '')
      setEditFecha(ev.fecha || '')
      setEditLugar(ev.lugar || '')
      setEditColores(ev.colores_bloqueados || '')
      setEditMensajeInvitada(ev.mensaje_invitada || '')
      setEditFotoEvento(ev.foto_evento_url || '')
      if (ev.foto_evento_url) setFotoEventoPreview(ev.foto_evento_url)
      // Cargar lista de invitadas guardada
      if (ev.lista_invitadas && Array.isArray(ev.lista_invitadas)) {
        setInvitadasArchivo(ev.lista_invitadas)
        setNombreArchivo('Lista guardada (' + ev.lista_invitadas.length + ' invitadas)')
        setRecordatorioMensaje(t('recArchivoCargado').replace('{n}', ev.lista_invitadas.length))
      }
      const tieneL = !!(ev.look_bloqueado_marca1)
      setTieneLookBloqueado(tieneL)
      setEditLookBloqueadoColor(ev.look_bloqueado_color || '')
      setEditLookBloqueadoMarca1(ev.look_bloqueado_marca1 || '')
      setEditLookBloqueadoTipo1(ev.look_bloqueado_tipo1 || '')
      setEditLookBloqueadoModelo1(ev.look_bloqueado_modelo1 || '')
      setEditLookBloqueadoReferencia1(ev.look_bloqueado_referencia1 || '')
      setEditLookBloqueadoLink1(ev.look_bloqueado_link1 || '')
      setEditLookBloqueadoMarca2(ev.look_bloqueado_marca2 || '')
      setEditLookBloqueadoTipo2(ev.look_bloqueado_tipo2 || '')
      setEditLookBloqueadoModelo2(ev.look_bloqueado_modelo2 || '')
      setEditLookBloqueadoReferencia2(ev.look_bloqueado_referencia2 || '')
      setEditLookBloqueadoLink2(ev.look_bloqueado_link2 || '')

      const { data: lks } = await supabase.from('looks').select('*').eq('evento_id', ev.id).order('created_at', { ascending: false })
      setLooks(lks || [])
      const { data: cnf } = await supabase.from('conflictos').select('*').eq('evento_id', ev.id).order('created_at', { ascending: false })
      setConflictos(cnf || [])
      if (esEnterprise(ev)) {
        const { data: orgs } = await supabase.from('evento_organizadores').select('*, profiles(nombre)').eq('evento_id', ev.id)
        setOrganizadores(orgs || [])
      }
      setLoading(false)
    }
    cargar()
    const interval = setInterval(cargar, 30000)
    return () => clearInterval(interval)
  }, [slug])

  useEffect(() => {
    if (!evento || !tieneLookBloqueado || !editLookBloqueadoMarca1 || !editLookBloqueadoTipo1 || !editLookBloqueadoModelo1 || !editLookBloqueadoColor) {
      setConflictoLookMsg(''); return
    }
    const marcaNorm = normalizarStrict(editLookBloqueadoMarca1)
    const modeloNorm = normalizarStrict(editLookBloqueadoModelo1)
    const tipoNorm = editLookBloqueadoTipo1.trim().toLowerCase()
    const colorHex = editLookBloqueadoColor

    const coincidentes = looks.filter(l => {
      const lMarca = normalizarStrict(l.marca)
      const lModelo = normalizarStrict(l.modelo)
      const lTipo = (l.tipo || '').trim().toLowerCase()
      const lColor = l.color_hex
      const modeloOk = lModelo === modeloNorm || similitudPalabras(l.modelo, editLookBloqueadoModelo1) >= 0.6
      return lMarca === marcaNorm && lTipo === tipoNorm && modeloOk && lColor === colorHex
    })

    if (coincidentes.length > 0) {
      const nombres = coincidentes.map(l => l.nombre_invitada).join(', ')
      setConflictoLookMsg(`⚠️ ${nombres} ya ${coincidentes.length === 1 ? 'lleva' : 'llevan'} este look registrado. Puedes verlo en la pestaña Looks.`)
    } else {
      setConflictoLookMsg('')
    }
  }, [tieneLookBloqueado, editLookBloqueadoMarca1, editLookBloqueadoTipo1, editLookBloqueadoModelo1, editLookBloqueadoColor, looks, evento])

  function copiarLink() {
    navigator.clipboard.writeText(`https://nowear.es/${slug}`)
    setCopiado(true)
    setTimeout(() => setCopiado(false), 2000)
  }

  function diasRestantes(fecha) {
    if (!fecha) return '?'
    const diff = Math.ceil((new Date(fecha) - new Date()) / (1000 * 60 * 60 * 24))
    return diff > 0 ? diff : t('statPasado')
  }

  function exportarLista() {
    if (!puedeExportar(evento) || looks.length === 0) return
    const headers = [t('colNombre'),t('colEmail'),t('colColor'),'Color 2',t('colMarca'),t('colModelo'),t('colTipo'),'Ref',t('colEstado')]
    const rows = looks.map(l => [l.nombre_invitada||'',l.email_invitada||'',l.color_hex||'',l.color_hex_2||'',l.marca||'',l.modelo||'',l.tipo||'',l.referencia||'',l.estado||''])
    const csv = [headers,...rows].map(r=>r.map(c=>`"${c}"`).join(',')).join('\n')
    const blob = new Blob([csv],{type:'text/csv;charset=utf-8;'})
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = `looks-${slug}.csv`; a.click()
    URL.revokeObjectURL(url)
  }

  async function handleGuardarAjustes() {
    setGuardandoAjustes(true); setAjustesMensaje('')
    await supabase.from('eventos').update({
      nombre: editNombre, fecha: editFecha, lugar: editLugar, colores_bloqueados: editColores || null
    }).eq('id', evento.id)
    setEvento(prev => ({...prev, nombre: editNombre, fecha: editFecha, lugar: editLugar, colores_bloqueados: editColores}))
    setGuardandoAjustes(false)
    setAjustesMensaje(t('ajustesGuardado'))
    setTimeout(() => setAjustesMensaje(''), 3000)
  }

  async function handleGuardarBloqueos() {
    setGuardandoBloqueos(true); setBloqueosMensaje('')
    await supabase.from('eventos').update({
      colores_bloqueados: editColores || null,
      look_bloqueado_color: tieneLookBloqueado && editLookBloqueadoColor ? editLookBloqueadoColor : null,
      look_bloqueado_marca1: tieneLookBloqueado && editLookBloqueadoMarca1 ? editLookBloqueadoMarca1 : null,
      look_bloqueado_tipo1: tieneLookBloqueado && editLookBloqueadoTipo1 ? editLookBloqueadoTipo1 : null,
      look_bloqueado_modelo1: tieneLookBloqueado && editLookBloqueadoModelo1 ? editLookBloqueadoModelo1 : null,
      look_bloqueado_referencia1: tieneLookBloqueado && editLookBloqueadoReferencia1 ? editLookBloqueadoReferencia1 : null,
      look_bloqueado_link1: tieneLookBloqueado && editLookBloqueadoLink1 ? editLookBloqueadoLink1 : null,
      look_bloqueado_marca2: tieneLookBloqueado && editLookBloqueadoMarca2 ? editLookBloqueadoMarca2 : null,
      look_bloqueado_tipo2: tieneLookBloqueado && editLookBloqueadoTipo2 ? editLookBloqueadoTipo2 : null,
      look_bloqueado_modelo2: tieneLookBloqueado && editLookBloqueadoModelo2 ? editLookBloqueadoModelo2 : null,
      look_bloqueado_referencia2: tieneLookBloqueado && editLookBloqueadoReferencia2 ? editLookBloqueadoReferencia2 : null,
      look_bloqueado_link2: tieneLookBloqueado && editLookBloqueadoLink2 ? editLookBloqueadoLink2 : null,
    }).eq('id', evento.id)
    setEvento(prev => ({
      ...prev,
      colores_bloqueados: editColores,
      look_bloqueado_color: tieneLookBloqueado ? editLookBloqueadoColor : null,
      look_bloqueado_marca1: tieneLookBloqueado ? editLookBloqueadoMarca1 : null,
      look_bloqueado_tipo1: tieneLookBloqueado ? editLookBloqueadoTipo1 : null,
      look_bloqueado_modelo1: tieneLookBloqueado ? editLookBloqueadoModelo1 : null,
      look_bloqueado_referencia1: tieneLookBloqueado ? editLookBloqueadoReferencia1 : null,
      look_bloqueado_link1: tieneLookBloqueado ? editLookBloqueadoLink1 : null,
      look_bloqueado_marca2: tieneLookBloqueado ? editLookBloqueadoMarca2 : null,
      look_bloqueado_tipo2: tieneLookBloqueado ? editLookBloqueadoTipo2 : null,
      look_bloqueado_modelo2: tieneLookBloqueado ? editLookBloqueadoModelo2 : null,
      look_bloqueado_referencia2: tieneLookBloqueado ? editLookBloqueadoReferencia2 : null,
      look_bloqueado_link2: tieneLookBloqueado ? editLookBloqueadoLink2 : null,
    }))
    setGuardandoBloqueos(false)
    setBloqueosMensaje('Bloqueos guardados correctamente.')
    setTimeout(() => setBloqueosMensaje(''), 3000)
  }

  async function handleGuardarPersonalizacion() {
    setGuardandoPersonalizacion(true); setPersonalizacionMensaje('')
    let foto_url = editFotoEvento
    if (fotoEventoFile) {
      const ext = fotoEventoFile.name.split('.').pop()
      const fileName = `evento-${evento.id}-${Date.now()}.${ext}`
      const { data: uploadData } = await supabase.storage.from('fotos').upload(fileName, fotoEventoFile, { contentType: fotoEventoFile.type })
      if (uploadData) {
        const { data: urlData } = supabase.storage.from('fotos').getPublicUrl(fileName)
        foto_url = urlData.publicUrl
      }
    }
    await supabase.from('eventos').update({ foto_evento_url: foto_url || null, mensaje_invitada: editMensajeInvitada || null }).eq('id', evento.id)
    setEvento(prev => ({...prev, foto_evento_url: foto_url, mensaje_invitada: editMensajeInvitada}))
    setEditFotoEvento(foto_url)
    setGuardandoPersonalizacion(false)
    setPersonalizacionMensaje(t('personGuardado'))
    setTimeout(() => setPersonalizacionMensaje(''), 4000)
  }

  function handleArchivoInvitadas(e) {
    setErrorArchivo('')
    setRecordatorioMensaje('')
    setPendientesConEmail([])
    setPendientesSinEmail([])
    setRecordatorioWhatsapp('')
    const file = e.target.files[0]
    if (!file) return
    setNombreArchivo(file.name)
    const reader = new FileReader()
    reader.onload = async (evt) => {
      try {
        const wb = XLSX.read(evt.target.result, { type: 'binary' })
        const sheet = wb.Sheets[wb.SheetNames[0]]
        const filas = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' })
        if (filas.length < 2) { setErrorArchivo(t('recErrorVacio')); setInvitadasArchivo([]); return }
        const norm = s => (s || '').toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim()
        const cabecera = filas[0].map(norm)
        const idxNombre = cabecera.findIndex(c => c.includes('nombre') || c.includes('name'))
        const idxApellido = cabecera.findIndex(c => c.includes('apellido') || c.includes('surname'))
        const idxEmail = cabecera.findIndex(c => c.includes('email') || c.includes('correo') || c.includes('mail'))
        if (idxNombre === -1) { setErrorArchivo(t('recErrorColumnas')); setInvitadasArchivo([]); return }
        const invitadas = filas.slice(1).map(fila => {
          const nombre = (fila[idxNombre] || '').toString().trim()
          const apellido = idxApellido !== -1 ? (fila[idxApellido] || '').toString().trim() : ''
          const email = idxEmail !== -1 ? (fila[idxEmail] || '').toString().trim().toLowerCase() : ''
          const nombreCompleto = (nombre + ' ' + apellido).trim()
          return { nombreCompleto, email }
        }).filter(i => i.nombreCompleto)
        setInvitadasArchivo(invitadas)
        setRecordatorioMensaje(t('recArchivoCargado').replace('{n}', invitadas.length))
        // Guardar lista en Supabase
        await supabase.from('eventos').update({ lista_invitadas: invitadas }).eq('id', evento.id)
        setNombreArchivo(file.name + ' ✓ guardado')
      } catch (err) {
        setErrorArchivo(t('recErrorLectura'))
        setInvitadasArchivo([])
      }
    }
    reader.readAsBinaryString(file)
  }

  async function handleRecordatorios() {
    if (invitadasArchivo.length === 0) { setErrorArchivo(t('recErrorSinArchivo')); return }
    setEnviandoRecordatorios(true)
    setRecordatorioMensaje('')
    setPendientesConEmail([])
    setPendientesSinEmail([])
    setRecordatorioWhatsapp('')
    const norm = s => (s || '').toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, ' ').trim()
    const emailsRegistrados = looks.map(l => (l.email_invitada || '').toLowerCase().trim()).filter(Boolean)
    const nombresRegistrados = looks.map(l => norm(l.nombre_invitada)).filter(Boolean)
    const pendientes = invitadasArchivo.filter(inv => {
      if (inv.email && emailsRegistrados.includes(inv.email)) return false
      if (norm(inv.nombreCompleto) && nombresRegistrados.includes(norm(inv.nombreCompleto))) return false
      return true
    })
    const conEmail = pendientes.filter(p => p.email)
    const sinEmail = pendientes.filter(p => !p.email)
    setPendientesConEmail(conEmail)
    setPendientesSinEmail(sinEmail)
    const linkEvento = `${process.env.NEXT_PUBLIC_URL || 'https://nowear.es'}/${locale === 'es' ? '' : locale + '/'}${evento.slug}`.replace('nowear.es//', 'nowear.es/')
    if (sinEmail.length > 0) {
      setRecordatorioWhatsapp(`Hola! Te escribo porque aún no has registrado tu look para ${evento.nombre}. Hazlo aquí para asegurarte de que nadie lleve el mismo outfit que tú: ${linkEvento}`)
    }
    for (const inv of conEmail) {
      await fetch('/api/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tipo: 'recordatorio_invitada',
          email: inv.email,
          nombre: inv.nombreCompleto,
          nombreEvento: evento.nombre,
          linkEvento
        })
      })
    }
    setRecordatorioMensaje(t('recResultado').replace('{total}', pendientes.length).replace('{email}', conEmail.length).replace('{wa}', sinEmail.length))
    setEnviandoRecordatorios(false)
  }

  function descargarPlantilla() {
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.aoa_to_sheet([
      ['Nombre', 'Apellido', 'Email'],
      ['Ana', 'García', 'ana@email.com'],
      ['Laura', 'Martínez', ''],
    ])
    XLSX.utils.book_append_sheet(wb, ws, 'Invitadas')
    XLSX.writeFile(wb, 'plantilla-invitadas-nowear.xlsx')
  }

  async function handleAñadirOrganizador() {
    if (!emailNuevoOrg.trim()) return
    setAñadiendoOrg(true); setOrgMensaje('')
    const { data: perfil } = await supabase.from('profiles').select('id, nombre').eq('email', emailNuevoOrg.trim().toLowerCase()).single()
    if (!perfil) { setOrgMensaje(t('orgNoEncontrado')); setAñadiendoOrg(false); return }
    const { data: yaExiste } = await supabase.from('evento_organizadores').select('id').eq('evento_id', evento.id).eq('user_id', perfil.id).single()
    if (yaExiste) { setOrgMensaje(t('orgYaExiste')); setAñadiendoOrg(false); return }
    await supabase.from('evento_organizadores').insert({ evento_id: evento.id, user_id: perfil.id })
    setOrganizadores(prev => [...prev, { user_id: perfil.id, profiles: { nombre: perfil.nombre } }])
    setEmailNuevoOrg('')
    setAñadiendoOrg(false)
    setTimeout(() => setOrgMensaje(''), 3000)
  }

  async function handleEliminarOrganizador(userId) {
    await supabase.from('evento_organizadores').delete().eq('evento_id', evento.id).eq('user_id', userId)
    setOrganizadores(prev => prev.filter(o => o.user_id !== userId))
  }

  if (loading) return <div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'calc(100vh - 68px)',fontSize:'0.75rem',color:'#888884'}}>...</div>

  const planEvento = getPlan(evento)
  const canExport = puedeExportar(evento)
  const isPremium = esPremiumOSuperior(evento)
  const isEnterprise = esEnterprise(evento)
  const prereservados = looks.filter(l => l.estado === 'prereservado').length
  const confirmados = looks.filter(l => l.estado === 'confirmado').length
  const PLAN_LABEL_COLORES = { basico:'#888884', estandar:'#8B9DC3', premium:'#C4917C', enterprise:'#F07987' }

  const inputStyle = {width:'100%',fontFamily:'Poppins,sans-serif',fontSize:'0.82rem',fontWeight:300,padding:'0.9rem 1rem',border:'1px solid #E0E0DC',background:'#FFFFFF',outline:'none',boxSizing:'border-box'}
  const labelStyle = {display:'block',fontSize:'0.6rem',fontWeight:600,letterSpacing:'0.12em',textTransform:'uppercase',color:'#888884',marginBottom:'0.55rem'}
  const textareaStyle = {width:'100%',fontFamily:'Poppins,sans-serif',fontSize:'0.82rem',fontWeight:300,padding:'0.9rem 1rem',border:'1px solid #E0E0DC',background:'#FFFFFF',outline:'none',boxSizing:'border-box',resize:'vertical',minHeight:'100px'}
  const selectStyle = {width:'100%',fontFamily:'Poppins,sans-serif',fontSize:'0.82rem',fontWeight:300,padding:'0.9rem 1rem',border:'1px solid #E0E0DC',background:'#FFFFFF',outline:'none',cursor:'pointer',appearance:'none',backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23888884' stroke-width='1.5' fill='none'/%3E%3C/svg%3E")`,backgroundRepeat:'no-repeat',backgroundPosition:'right 1rem center',boxSizing:'border-box'}
  const notaStyle = {fontSize:'0.65rem',fontWeight:300,color:'#BEBEBA',marginTop:'0.35rem',lineHeight:1.5}

  // Tabs visibles: solo las 4 base + Organizadores Enterprise
  // Personalización y Recordatorios se acceden por los boxes del hero, no por tabs
  const tabs = [t('tabLooks'), t('tabConflictos'), 'Bloqueos', t('tabAjustes')]
  if (isEnterprise) tabs.push(t('tabOrganizadores'))
  // Índices para el contenido (aunque no aparecen en las tabs visibles)
  const tabPersonalizacionIdx = 10
  const tabRecordatoriosIdx = 11
  const tabBloqueosIdx = 2

  const tieneBloqueoLook = !!(evento.look_bloqueado_marca1)

  return (
    <>
      <style>{`
        .bloqueos-prenda-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem; }
        .evento-hero-boxes { flex-direction: row; }
        /* En móvil: boxes premium en columna dentro del box de link, boxes desktop ocultos */
        @media (max-width: 768px) {
          .bloqueos-prenda-grid { grid-template-columns: 1fr; }
          .evento-stats { grid-template-columns: repeat(2,1fr) !important; }
          .evento-contenido { padding: 1.5rem !important; }
          .evento-hero { padding: 1.5rem !important; }
          .evento-tabs { padding: 0 1.5rem !important; }
          .evento-hero-boxes { flex-direction: column !important; }
          .hero-box-desktop-only { display: none !important; }
        }
        @media (min-width: 769px) {
          .hero-box-mobile-btns { display: none !important; }
        }
      `}</style>

      {/* MODAL FOTO */}
      {fotoModal && (
        <div onClick={() => setFotoModal(null)}
          style={{position:'fixed',inset:0,background:'rgba(10,10,10,0.85)',zIndex:3000,display:'flex',alignItems:'center',justifyContent:'center',padding:'2rem',cursor:'pointer'}}>
          <img src={fotoModal} alt="Look" style={{maxWidth:'90vw',maxHeight:'85vh',objectFit:'contain',borderRadius:'4px'}}/>
        </div>
      )}

      <div style={{fontFamily:"'Poppins',sans-serif",paddingBottom:'2rem'}}>

        {/* HERO */}
        <div className="evento-hero" style={{background:'#0A0A0A',padding:'2.5rem 3rem 3rem',position:'relative',overflow:'hidden'}}>
          <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse at top right, rgba(240,121,135,0.07) 0%, transparent 60%)',pointerEvents:'none'}}></div>
          <button onClick={() => router.push(prefijo + '/dashboard')} style={{display:'inline-flex',alignItems:'center',gap:'0.5rem',fontSize:'0.62rem',fontWeight:600,letterSpacing:'0.12em',textTransform:'uppercase',color:'#888884',background:'none',border:'none',cursor:'pointer',fontFamily:'Poppins,sans-serif',marginBottom:'2rem',padding:0}}>
            {t('misEventos')}
          </button>

          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',flexWrap:'wrap',gap:'2rem'}}>
            {/* Info evento */}
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:'0.58rem',fontWeight:600,letterSpacing:'0.18em',textTransform:'uppercase',color:'#888884',marginBottom:'0.5rem'}}>
                {evento.tipo} · <span style={{color: PLAN_LABEL_COLORES[planEvento]}}>{t('planLabel')} {evento.plan}</span>
              </div>
              <h1 style={{fontSize:'clamp(1.8rem,4vw,3.5rem)',fontWeight:700,color:'#FFFFFF',letterSpacing:'-0.025em',lineHeight:1.05,marginBottom:'0.5rem'}}>{evento.nombre}</h1>
              <p style={{fontSize:'0.82rem',fontWeight:300,color:'#888884'}}>
                {evento.fecha ? new Date(evento.fecha).toLocaleDateString('es-ES',{day:'numeric',month:'long',year:'numeric'}) : ''}
                {evento.lugar ? ` · ${evento.lugar}` : ''}
              </p>
              {!isPremium && (
                <button onClick={() => setModalPlanes(true)}
                  style={{marginTop:'1.25rem',display:'inline-flex',alignItems:'center',gap:'0.5rem',fontSize:'0.62rem',fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',padding:'0.55rem 1.25rem',background:'rgba(196,145,124,0.15)',color:'#C4917C',border:'1px solid rgba(196,145,124,0.4)',cursor:'pointer',fontFamily:'Poppins,sans-serif',borderRadius:'4px'}}>
                  {planEvento === 'basico' ? `✨ ${t('mejorarPlan')}` : `🎨 ${t('mejorarPlan')}`}
                </button>
              )}
            </div>

            {/* Boxes derechos */}
            <div className="evento-hero-boxes" style={{display:'flex',flexDirection:'row',gap:'1rem',alignItems:'stretch',flexShrink:0}}>

              {/* Box link - en móvil incluye botones premium dentro */}
              <div style={{background:'#FFFFFF',padding:'1.25rem 1.75rem',minWidth:'220px',borderRadius:'4px',display:'flex',flexDirection:'column',justifyContent:'center'}}>
                <p style={{fontSize:'0.55rem',fontWeight:700,letterSpacing:'0.15em',textTransform:'uppercase',color:'#888884',marginBottom:'0.5rem'}}>{t('linkInvitadas')}</p>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:'1rem'}}>
                  <span style={{fontSize:'0.78rem',fontWeight:500,color:'#0A0A0A',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>nowear.es/{slug}</span>
                  <button onClick={copiarLink} style={{fontSize:'0.65rem',fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',color:copiado?'#4A6B42':'#F07987',background:'none',border:'none',cursor:'pointer',fontFamily:'Poppins,sans-serif',whiteSpace:'nowrap',flexShrink:0}}>
                    {copiado ? t('copiado') : t('copiar')}
                  </button>
                </div>
                <div className="hero-box-mobile-btns" style={{marginTop:'0.75rem',paddingTop:'0.75rem',borderTop:'1px solid #F0F0EE',display:'flex',gap:'0.5rem'}}>
                  <button onClick={() => isPremium ? setTabActiva(tabPersonalizacionIdx) : setModalPlanes(true)}
                    style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',padding:'0.55rem 0.4rem',background:isPremium?'rgba(196,145,124,0.1)':'rgba(0,0,0,0.04)',border:isPremium?'1px solid rgba(196,145,124,0.4)':'1px solid #E0E0DC',borderRadius:'6px',cursor:'pointer',fontFamily:'Poppins,sans-serif'}}>
                    <span style={{fontSize:'0.58rem',fontWeight:700,letterSpacing:'0.06em',textTransform:'uppercase',color:isPremium?'#C4917C':'#BEBEBA'}}>
                      {isPremium ? `✨ ${t('tabPersonalizacion')}` : `🔒 ${t('tabPersonalizacion')}`}
                    </span>
                  </button>
                  <button onClick={() => isPremium ? setTabActiva(tabRecordatoriosIdx) : setModalPlanes(true)}
                    style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',padding:'0.55rem 0.4rem',background:isPremium?'rgba(196,145,124,0.1)':'rgba(0,0,0,0.04)',border:isPremium?'1px solid rgba(196,145,124,0.4)':'1px solid #E0E0DC',borderRadius:'6px',cursor:'pointer',fontFamily:'Poppins,sans-serif'}}>
                    <span style={{fontSize:'0.58rem',fontWeight:700,letterSpacing:'0.06em',textTransform:'uppercase',color:isPremium?'#C4917C':'#BEBEBA'}}>
                      {isPremium ? 'Recordatorios' : '🔒 Recordatorios'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Box recordatorios: desktop, bloqueado si no Premium */}
              <button className="hero-box-desktop-only"
                onClick={() => isPremium ? setTabActiva(tabRecordatoriosIdx) : setModalPlanes(true)}
                style={{background:isPremium?'rgba(196,145,124,0.12)':'rgba(255,255,255,0.04)',border:isPremium?'1px solid rgba(196,145,124,0.35)':'1px solid rgba(255,255,255,0.1)',borderRadius:'4px',padding:'1.25rem 1.5rem',cursor:'pointer',fontFamily:'Poppins,sans-serif',display:'flex',flexDirection:'column',justifyContent:'center',minWidth:'180px',textAlign:'left'}}>
                <p style={{fontSize:'0.55rem',fontWeight:700,letterSpacing:'0.15em',textTransform:'uppercase',color:isPremium?'#C4917C':'#888884',marginBottom:'0.4rem'}}>
                  {!isPremium && '🔒 '}Recordatorios
                </p>
                <p style={{fontSize:'0.78rem',fontWeight:500,color:isPremium?'#FFFFFF':'rgba(255,255,255,0.4)',margin:0}}>
                  {isPremium ? (invitadasArchivo.length > 0 ? `${invitadasArchivo.length} invitadas cargadas` : 'Enviar recordatorio') : 'Enviar recordatorio'}
                </p>
                <p style={{fontSize:'0.62rem',fontWeight:300,color:'rgba(255,255,255,0.35)',margin:'0.2rem 0 0 0'}}>
                  {isPremium ? (invitadasArchivo.length > 0 ? 'Haz clic para cruzar y enviar' : 'Sube tu lista de invitadas') : 'desde Premium'}
                </p>
              </button>

              {/* Box personalización: desktop, bloqueado si no Premium */}
              <button className="hero-box-desktop-only"
                onClick={() => isPremium ? setTabActiva(tabPersonalizacionIdx) : setModalPlanes(true)}
                style={{background:isPremium?'rgba(196,145,124,0.12)':'rgba(255,255,255,0.04)',border:isPremium?'1px solid rgba(196,145,124,0.35)':'1px solid rgba(255,255,255,0.1)',borderRadius:'4px',padding:'1.25rem 1.5rem',cursor:'pointer',fontFamily:'Poppins,sans-serif',display:'flex',flexDirection:'column',justifyContent:'center',minWidth:'180px',textAlign:'left'}}>
                <p style={{fontSize:'0.55rem',fontWeight:700,letterSpacing:'0.15em',textTransform:'uppercase',color:isPremium?'#C4917C':'#888884',marginBottom:'0.4rem'}}>
                  {isPremium ? '✨ ' : '🔒 '}{t('tabPersonalizacion')}
                </p>
                <p style={{fontSize:'0.78rem',fontWeight:500,color:isPremium?'#FFFFFF':'rgba(255,255,255,0.4)',margin:0}}>Foto e imagen</p>
                <p style={{fontSize:'0.62rem',fontWeight:300,color:'rgba(255,255,255,0.35)',margin:'0.2rem 0 0 0'}}>
                  {isPremium ? 'Personaliza el link de tus invitadas' : 'desde Premium'}
                </p>
              </button>
            </div>
          </div>
        </div>

        {/* TABS */}
        <div className="evento-tabs" style={{display:'flex',padding:'0 3rem',borderBottom:'2px solid #E0E0DC',background:'#FFFFFF',position:'sticky',top:'68px',zIndex:100,overflowX:'auto'}}>
          {tabs.map((tab,i) => (
            <button key={i} onClick={() => setTabActiva(i)}
              style={{padding:'1.1rem 0',marginRight:'2.5rem',fontSize:'0.72rem',fontWeight:tabActiva===i?700:400,color:tabActiva===i?'#0A0A0A':'#888884',cursor:'pointer',background:'none',border:'none',borderBottom:tabActiva===i?'2px solid #0A0A0A':'2px solid transparent',fontFamily:'Poppins,sans-serif',whiteSpace:'nowrap',marginBottom:'-2px',flexShrink:0}}>
              {tab}
              {i===1&&conflictos.length>0&&<span style={{marginLeft:'0.4rem',fontSize:'0.55rem',fontWeight:700,background:'#F07987',color:'#FFFFFF',padding:'0.1rem 0.4rem',borderRadius:'10px'}}>{conflictos.length}</span>}
              {tab===t('tabOrganizadores')&&<span style={{marginLeft:'0.4rem',fontSize:'0.5rem',fontWeight:700,background:'#F07987',color:'#FFFFFF',padding:'0.1rem 0.4rem',borderRadius:'10px'}}>{t('badgeEnterprise')}</span>}
            </button>
          ))}
        </div>

        {/* CONTENIDO */}
        <div className="evento-contenido" style={{padding:'2.5rem 3rem'}}>

          {/* STATS */}
          <div className="evento-stats" style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'1.5rem',marginBottom:'2.5rem'}}>
            {[
              {n: looks.length.toString(), l: t('statLooks'), color:'#0A0A0A'},
              {n: confirmados.toString(), l: t('statConfirmados'), color:'#0A0A0A'},
              {n: prereservados.toString(), l: t('statPrereservados'), color:'#C4917C'},
              {n: diasRestantes(evento.fecha).toString(), l: t('statDias'), color:'#0A0A0A'},
            ].map((s,i) => (
              <div key={i} style={{background:'#FFFFFF',borderRadius:'16px',padding:'1.5rem',boxShadow:'0 2px 16px rgba(0,0,0,0.06)',border:'1px solid #F0F0EE'}}>
                <div style={{fontSize:'clamp(1.8rem,4vw,2.5rem)',fontWeight:700,color:s.color,lineHeight:1,letterSpacing:'-0.03em'}}>{s.n}</div>
                <div style={{fontSize:'0.58rem',fontWeight:600,letterSpacing:'0.12em',textTransform:'uppercase',color:'#888884',marginTop:'0.4rem'}}>{s.l}</div>
              </div>
            ))}
          </div>

          {/* TAB LOOKS */}
          {tabActiva === 0 && (
            <>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1.5rem',gap:'1rem',flexWrap:'wrap'}}>
                <span style={{fontSize:'0.82rem',fontWeight:400,color:'#888884'}}>
                  <strong style={{color:'#0A0A0A',fontWeight:700}}>{looks.length}</strong> {t('tabLooks').toLowerCase()}
                </span>
                {canExport ? (
                  <button onClick={exportarLista} style={{fontSize:'0.65rem',fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',padding:'0.65rem 1.5rem',background:'#0A0A0A',color:'#FFFFFF',border:'none',cursor:'pointer',fontFamily:'Poppins,sans-serif',borderRadius:'4px'}}>
                    {t('exportar')}
                  </button>
                ) : (
                  <div style={{display:'inline-flex',alignItems:'center',gap:'0.75rem',flexWrap:'wrap'}}>
                    <button disabled style={{fontSize:'0.65rem',fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',padding:'0.65rem 1.5rem',background:'#E0E0DC',color:'#BEBEBA',border:'none',cursor:'not-allowed',fontFamily:'Poppins,sans-serif',borderRadius:'4px'}}>
                      {t('exportarBloqueado')}
                    </button>
                    <span style={{fontSize:'0.6rem',fontWeight:600,color:'#888884',whiteSpace:'nowrap'}}>{t('exportarDesde')}</span>
                  </div>
                )}
              </div>
              {!canExport && (
                <div style={{marginBottom:'1.5rem',padding:'0.9rem 1.25rem',background:'#F7F7F5',border:'1px solid #E0E0DC',borderRadius:'8px',display:'flex',alignItems:'center',justifyContent:'space-between',gap:'0.75rem',flexWrap:'wrap'}}>
                  <div style={{display:'flex',alignItems:'center',gap:'0.75rem',flex:1}}>
                    <span style={{fontSize:'1rem'}}>📊</span>
                    <span style={{fontSize:'0.78rem',fontWeight:400,color:'#0A0A0A'}}>{t('exportarBanner')}</span>
                  </div>
                  <button onClick={() => setModalPlanes(true)} style={{fontSize:'0.65rem',fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',padding:'0.5rem 1rem',background:'#0A0A0A',color:'#FFFFFF',border:'none',cursor:'pointer',fontFamily:'Poppins,sans-serif',borderRadius:'4px',whiteSpace:'nowrap'}}>
                    {t('exportarLink')}
                  </button>
                </div>
              )}
              {looks.length === 0 ? (
                <div style={{textAlign:'center',padding:'4rem 2rem',color:'#888884',fontSize:'0.78rem',fontWeight:300,border:'1px dashed #E0E0DC',background:'#F7F7F5',lineHeight:2,borderRadius:'8px'}}>
                  {t('sinLooks')}<br/><span style={{fontSize:'0.72rem',color:'#BEBEBA'}}>{t('sinLooksSub')}</span>
                </div>
              ) : (
                <div className="evento-tabla-wrap" style={{border:'1px solid #E0E0DC',overflowX:'auto',borderRadius:'8px'}}>
                  <table style={{width:'100%',borderCollapse:'collapse',minWidth:'600px'}}>
                    <thead>
                      <tr style={{background:'#F7F7F5'}}>
                        {[t('colColor'),t('colNombre'),t('colMarca'),t('colModelo'),t('colTipo'),'Foto',t('colEstado')].map((h,i) => (
                          <th key={i} style={{fontSize:'0.58rem',fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase',color:'#555552',textAlign:'left',padding:'0.9rem 1rem',borderBottom:'1px solid #E0E0DC'}}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {looks.map((row,i) => (
                        <tr key={i} style={{borderBottom:'1px solid #E0E0DC',background:i%2===0?'#FFFFFF':'#FAFAFA'}}>
                          <td style={{padding:'0.9rem 1rem'}}>
                            <div style={{display:'flex',gap:'4px',alignItems:'center'}}>
                              <span style={{width:'20px',height:'20px',borderRadius:'50%',background:row.color_hex||'#E0E0DC',border:'1px solid rgba(0,0,0,0.08)',display:'inline-block'}}></span>
                              {row.color_hex_2&&<span style={{width:'20px',height:'20px',borderRadius:'50%',background:row.color_hex_2,border:'1px solid rgba(0,0,0,0.08)',display:'inline-block'}}></span>}
                            </div>
                          </td>
                          <td style={{padding:'0.9rem 1rem',fontSize:'0.82rem',fontWeight:700,color:'#0A0A0A'}}>{row.nombre_invitada}</td>
                          <td style={{padding:'0.9rem 1rem',fontSize:'0.82rem',fontWeight:400,color:'#0A0A0A'}}>
                            <div>{row.marca||'—'}</div>
                            {row.marca2 && row.marca2 !== row.marca && (
                              <div style={{fontSize:'0.72rem',fontWeight:300,color:'#888884',marginTop:'0.2rem'}}>{row.marca2}</div>
                            )}
                          </td>
                          <td style={{padding:'0.9rem 1rem',fontSize:'0.82rem',fontWeight:400,color:'#0A0A0A'}}>
                            <div>{row.modelo||'—'}</div>
                            {row.modelo2 && (
                              <div style={{fontSize:'0.72rem',fontWeight:300,color:'#888884',marginTop:'0.2rem'}}>{row.modelo2}</div>
                            )}
                            {row.descatalogada && (
                              <div style={{fontSize:'0.6rem',fontWeight:600,color:'#C4917C',marginTop:'0.2rem',letterSpacing:'0.05em'}}>ANTIGUA</div>
                            )}
                          </td>
                          <td style={{padding:'0.9rem 1rem',fontSize:'0.78rem',fontWeight:300,color:'#888884'}}>
                            <div>{row.tipo||'—'}</div>
                            {row.tipo2 && (
                              <div style={{fontSize:'0.72rem',fontWeight:300,color:'#888884',marginTop:'0.2rem'}}>{row.tipo2}</div>
                            )}
                          </td>
                          <td style={{padding:'0.9rem 1rem'}}>
                            {row.foto_url ? (
                              <img src={row.foto_url} alt="Look" onClick={() => setFotoModal(row.foto_url)}
                                style={{width:'36px',height:'36px',objectFit:'cover',borderRadius:'4px',cursor:'pointer',border:'1px solid #E0E0DC'}}/>
                            ) : (
                              <span style={{fontSize:'0.72rem',color:'#BEBEBA'}}>—</span>
                            )}
                          </td>
                          <td style={{padding:'0.9rem 1rem'}}>
                            <span style={{fontSize:'0.58rem',fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',padding:'0.3rem 0.65rem',borderRadius:'20px',background:row.estado==='confirmado'?'#0A0A0A':row.estado==='pendiente'?'#FFF8F0':row.estado==='rechazado'?'#FFF0F1':'#F5EDE8',color:row.estado==='confirmado'?'#FFFFFF':row.estado==='pendiente'?'#C4917C':row.estado==='rechazado'?'#F07987':'#C4917C'}}>
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
              <div style={{textAlign:'center',padding:'4rem 2rem',color:'#888884',fontSize:'0.78rem',fontWeight:300,border:'1px dashed #E0E0DC',background:'#F7F7F5',borderRadius:'8px'}}>
                {t('sinConflictos')}
              </div>
            ) : (
              <div style={{border:'1px solid #E0E0DC',borderRadius:'8px',overflow:'hidden'}}>
                <div style={{background:'#FFF0F1',padding:'1rem 1.5rem',borderBottom:'1px solid #F07987',display:'flex',alignItems:'center',gap:'0.75rem'}}>
                  <span style={{fontSize:'0.75rem',fontWeight:700,color:'#F07987'}}>{conflictos.length} {t('tabConflictos').toLowerCase()}</span>
                </div>
                <div className="evento-tabla-wrap" style={{overflowX:'auto'}}>
                  <table style={{width:'100%',borderCollapse:'collapse',minWidth:'500px'}}>
                    <thead>
                      <tr style={{background:'#F7F7F5'}}>
                        {[t('colInvitada'),t('colEmail'),t('colMarca'),t('colModelo'),t('colColor'),t('colPor'),t('colFecha')].map((h,i) => (
                          <th key={i} style={{fontSize:'0.58rem',fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase',color:'#555552',textAlign:'left',padding:'0.9rem 1rem',borderBottom:'1px solid #E0E0DC'}}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {conflictos.map((c,i) => (
                        <tr key={i} style={{borderBottom:'1px solid #E0E0DC',background:i%2===0?'#FFFFFF':'#FAFAFA'}}>
                          <td style={{padding:'0.9rem 1rem',fontSize:'0.82rem',fontWeight:700,color:'#0A0A0A'}}>{c.nombre_invitada}</td>
                          <td style={{padding:'0.9rem 1rem',fontSize:'0.78rem',fontWeight:300,color:'#888884'}}>{c.email_invitada||'—'}</td>
                          <td style={{padding:'0.9rem 1rem',fontSize:'0.82rem',color:'#0A0A0A'}}>{c.marca||'—'}</td>
                          <td style={{padding:'0.9rem 1rem',fontSize:'0.82rem',color:'#0A0A0A'}}>{c.modelo||'—'}</td>
                          <td style={{padding:'0.9rem 1rem'}}>
                            <span style={{width:'20px',height:'20px',borderRadius:'50%',background:c.color_hex||'#E0E0DC',border:'1px solid rgba(0,0,0,0.08)',display:'inline-block'}}></span>
                          </td>
                          <td style={{padding:'0.9rem 1rem',fontSize:'0.82rem',fontWeight:600,color:'#F07987'}}>{c.nombre_conflicto_con||'—'}</td>
                          <td style={{padding:'0.9rem 1rem',fontSize:'0.75rem',fontWeight:300,color:'#888884'}}>
                            {c.created_at ? new Date(c.created_at).toLocaleDateString('es-ES',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'}) : '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )
          )}

          {/* TAB BLOQUEOS */}
          {tabActiva === tabBloqueosIdx && (
            <div className="evento-ajustes" style={{maxWidth:'560px'}}>
              <h2 style={{fontSize:'1.2rem',fontWeight:600,color:'#0A0A0A',marginBottom:'0.35rem'}}>Bloqueos</h2>
              <p style={{fontSize:'0.75rem',fontWeight:300,color:'#888884',marginBottom:'2rem'}}>Colores y looks que ninguna invitada podrá registrar.</p>

              <div style={{marginBottom:'1.5rem'}}>
                <label style={labelStyle}>{t('ajustesColores') || 'Colores bloqueados'}</label>
                <input type="text" value={editColores} onChange={e => setEditColores(e.target.value)} placeholder={t('ajustesPlaceholder') || 'Ej: blanco, crudo, verde botella...'} style={inputStyle}/>
                <p style={notaStyle}>Ninguna invitada podrá registrar looks con estos colores.</p>
              </div>

              <div style={{padding:'1.25rem',background:'#F7F7F5',border:'1px solid #E0E0DC',borderRadius:'8px',marginBottom:'2rem'}}>
                <button onClick={() => setTieneLookBloqueado(!tieneLookBloqueado)}
                  style={{width:'100%',display:'flex',justifyContent:'space-between',alignItems:'center',background:'none',border:'none',cursor:'pointer',fontFamily:'Poppins,sans-serif',padding:0}}>
                  <div style={{textAlign:'left'}}>
                    <div style={{fontSize:'0.82rem',fontWeight:600,color:'#0A0A0A',marginBottom:'0.2rem'}}>¿Tienes ya tu look escogido?</div>
                    <div style={{fontSize:'0.72rem',fontWeight:300,color:'#888884'}}>Ninguna invitada podrá registrar el mismo look que tú.</div>
                  </div>
                  <div style={{width:'44px',height:'24px',borderRadius:'12px',border:'none',background:tieneLookBloqueado?'#0A0A0A':'#E0E0DC',position:'relative',flexShrink:0,marginLeft:'1rem',transition:'background 0.2s'}}>
                    <span style={{position:'absolute',top:'3px',left:tieneLookBloqueado?'23px':'3px',width:'18px',height:'18px',borderRadius:'50%',background:'#FFFFFF',transition:'left 0.2s',display:'block'}}></span>
                  </div>
                </button>

                {tieneLookBloqueado && (
                  <div style={{marginTop:'1.5rem',borderTop:'1px solid #E0E0DC',paddingTop:'1.5rem'}}>
                    {tieneBloqueoLook && (
                      <div style={{padding:'0.75rem 1rem',background:'#EEF4E8',border:'1px solid #C8DFC0',borderRadius:'4px',marginBottom:'1.25rem',display:'flex',alignItems:'center',gap:'0.75rem'}}>
                        {evento.look_bloqueado_color && <span style={{width:'20px',height:'20px',borderRadius:'50%',background:evento.look_bloqueado_color,border:'1px solid #E0E0DC',flexShrink:0,display:'inline-block'}}></span>}
                        <div>
                          <div style={{fontSize:'0.78rem',fontWeight:600,color:'#0A0A0A'}}>{evento.look_bloqueado_marca1} · {evento.look_bloqueado_modelo1}</div>
                          <div style={{fontSize:'0.72rem',fontWeight:300,color:'#888884'}}>{evento.look_bloqueado_tipo1}{evento.look_bloqueado_marca2 ? ` · 2ª prenda: ${evento.look_bloqueado_marca2}` : ''}</div>
                        </div>
                      </div>
                    )}
                    {conflictoLookMsg && (
                      <div style={{padding:'0.75rem 1rem',background:'#FFF8F0',border:'1px solid #F5D6A0',borderRadius:'4px',marginBottom:'1.25rem'}}>
                        <p style={{fontSize:'0.78rem',fontWeight:400,color:'#C4917C',margin:0,lineHeight:1.6}}>{conflictoLookMsg}</p>
                      </div>
                    )}
                    <div style={{marginBottom:'1.25rem'}}>
                      <label style={labelStyle}>Color del look <span style={{color:'#F07987'}}>*</span></label>
                      <select value={editLookBloqueadoColor} onChange={e => setEditLookBloqueadoColor(e.target.value)} style={selectStyle}>
                        <option value="">Selecciona un color...</option>
                        {COLORES_LISTA.map((c,i) => <option key={i} value={c.hex}>{c.nombre}</option>)}
                      </select>
                      {editLookBloqueadoColor && (
                        <div style={{display:'flex',alignItems:'center',gap:'0.5rem',marginTop:'0.5rem'}}>
                          <span style={{width:'20px',height:'20px',borderRadius:'50%',background:editLookBloqueadoColor,border:'1px solid #E0E0DC',display:'inline-block'}}></span>
                          <span style={{fontSize:'0.75rem',color:'#888884'}}>{COLORES_LISTA.find(c=>c.hex===editLookBloqueadoColor)?.nombre}</span>
                        </div>
                      )}
                    </div>
                    <div style={{padding:'1.25rem',background:'#FFFFFF',border:'1px solid #E0E0DC',borderRadius:'4px',marginBottom:'1rem'}}>
                      <div style={{fontSize:'0.65rem',fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase',color:'#0A0A0A',marginBottom:'1rem'}}>PRENDA 1 <span style={{color:'#F07987'}}>*</span></div>
                      <div className="bloqueos-prenda-grid">
                        <div>
                          <label style={labelStyle}>Marca <span style={{color:'#F07987'}}>*</span></label>
                          <input type="text" placeholder="Ej: Zara" value={editLookBloqueadoMarca1} onChange={e => setEditLookBloqueadoMarca1(e.target.value)} style={inputStyle}/>
                        </div>
                        <div>
                          <label style={labelStyle}>Tipo <span style={{color:'#F07987'}}>*</span></label>
                          <select value={editLookBloqueadoTipo1} onChange={e => setEditLookBloqueadoTipo1(e.target.value)} style={selectStyle}>
                            <option value="">Selecciona...</option>
                            {TIPOS_PRENDA.map((tp,i) => <option key={i}>{tp}</option>)}
                          </select>
                        </div>
                      </div>
                      <div style={{marginBottom:'1rem'}}>
                        <label style={labelStyle}>Modelo <span style={{color:'#F07987'}}>*</span></label>
                        <input type="text" placeholder="Nombre del vestido o modelo" value={editLookBloqueadoModelo1} onChange={e => setEditLookBloqueadoModelo1(e.target.value)} style={inputStyle}/>
                      </div>
                      <div style={{marginBottom:'0.75rem'}}>
                        <label style={labelStyle}>Referencia <span style={{fontSize:'0.6rem',fontWeight:300,color:'#BEBEBA',textTransform:'none',letterSpacing:0}}>opcional</span></label>
                        <input type="text" placeholder="Ej: 123456789" value={editLookBloqueadoReferencia1} onChange={e => setEditLookBloqueadoReferencia1(e.target.value)} style={inputStyle}/>
                      </div>
                      <div>
                        <label style={labelStyle}>Link <span style={{fontSize:'0.6rem',fontWeight:300,color:'#BEBEBA',textTransform:'none',letterSpacing:0}}>opcional</span></label>
                        <input type="url" placeholder="https://www.zara.com/es/..." value={editLookBloqueadoLink1} onChange={e => setEditLookBloqueadoLink1(e.target.value)} style={inputStyle}/>
                      </div>
                    </div>
                    <div style={{padding:'1.25rem',background:'#FFFFFF',border:'1px solid #E0E0DC',borderRadius:'4px'}}>
                      <div style={{fontSize:'0.65rem',fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase',color:'#888884',marginBottom:'1rem'}}>SEGUNDA PRENDA (OPCIONAL)</div>
                      <div className="bloqueos-prenda-grid">
                        <div>
                          <label style={labelStyle}>Marca</label>
                          <input type="text" placeholder="Ej: Mango" value={editLookBloqueadoMarca2} onChange={e => setEditLookBloqueadoMarca2(e.target.value)} style={inputStyle}/>
                        </div>
                        <div>
                          <label style={labelStyle}>Tipo</label>
                          <select value={editLookBloqueadoTipo2} onChange={e => setEditLookBloqueadoTipo2(e.target.value)} style={selectStyle}>
                            <option value="">Selecciona...</option>
                            {TIPOS_PRENDA.map((tp,i) => <option key={i}>{tp}</option>)}
                          </select>
                        </div>
                      </div>
                      <div style={{marginBottom:'1rem'}}>
                        <label style={labelStyle}>Modelo</label>
                        <input type="text" placeholder="Nombre del vestido o modelo" value={editLookBloqueadoModelo2} onChange={e => setEditLookBloqueadoModelo2(e.target.value)} style={inputStyle}/>
                      </div>
                      <div style={{marginBottom:'0.75rem'}}>
                        <label style={labelStyle}>Referencia</label>
                        <input type="text" placeholder="Ej: 123456789" value={editLookBloqueadoReferencia2} onChange={e => setEditLookBloqueadoReferencia2(e.target.value)} style={inputStyle}/>
                      </div>
                      <div>
                        <label style={labelStyle}>Link</label>
                        <input type="url" placeholder="https://www.zara.com/es/..." value={editLookBloqueadoLink2} onChange={e => setEditLookBloqueadoLink2(e.target.value)} style={inputStyle}/>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {bloqueosMensaje && <p style={{fontSize:'0.78rem',fontWeight:400,color:'#4A6B42',marginBottom:'1rem',padding:'0.75rem',background:'#EEF4E8',border:'1px solid #C8DFC0',borderRadius:'4px'}}>{bloqueosMensaje}</p>}
              <button onClick={handleGuardarBloqueos} disabled={guardandoBloqueos} style={{padding:'0.9rem 2.5rem',fontSize:'0.78rem',fontWeight:500,background:'#0A0A0A',color:'#FFFFFF',border:'none',cursor:'pointer',fontFamily:'Poppins,sans-serif',borderRadius:'4px',opacity:guardandoBloqueos?0.6:1}}>
                {guardandoBloqueos ? 'Guardando...' : 'Guardar bloqueos'}
              </button>
            </div>
          )}

          {/* TAB AJUSTES */}
          {tabActiva === 3 && (
            <div className="evento-ajustes" style={{maxWidth:'520px'}}>
              <h2 style={{fontSize:'1.2rem',fontWeight:600,color:'#0A0A0A',marginBottom:'0.35rem'}}>{t('ajustesTitulo')}</h2>
              <p style={{fontSize:'0.75rem',fontWeight:300,color:'#888884',marginBottom:'2rem'}}>{t('ajustesSubtitulo')}</p>
              <div style={{marginBottom:'1.25rem'}}>
                <label style={labelStyle}>{t('ajustesNombre')}</label>
                <input type="text" value={editNombre} onChange={e=>setEditNombre(e.target.value)} style={inputStyle}/>
              </div>
              <div className="evento-ajustes-grid" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem',marginBottom:'1.25rem'}}>
                <div>
                  <label style={labelStyle}>{t('ajustesFecha')}</label>
                  <input type="date" value={editFecha} onChange={e=>setEditFecha(e.target.value)} style={inputStyle}/>
                </div>
                <div>
                  <label style={labelStyle}>{t('ajustesLugar')}</label>
                  <input type="text" value={editLugar} onChange={e=>setEditLugar(e.target.value)} style={inputStyle}/>
                </div>
              </div>
              {ajustesMensaje && <p style={{fontSize:'0.78rem',fontWeight:400,color:'#4A6B42',marginBottom:'1rem',padding:'0.75rem',background:'#EEF4E8',border:'1px solid #C8DFC0',borderRadius:'4px'}}>{ajustesMensaje}</p>}
              <button onClick={handleGuardarAjustes} disabled={guardandoAjustes} style={{padding:'0.9rem 2.5rem',fontSize:'0.78rem',fontWeight:500,background:'#0A0A0A',color:'#FFFFFF',border:'none',cursor:'pointer',fontFamily:'Poppins,sans-serif',borderRadius:'4px',opacity:guardandoAjustes?0.6:1}}>
                {guardandoAjustes ? t('ajustesGuardando') : t('ajustesGuardar')}
              </button>
            </div>
          )}

          {/* TAB PERSONALIZACIÓN */}
          {isPremium && tabActiva === tabPersonalizacionIdx && (
            <div className="evento-person" style={{maxWidth:'600px'}}>
              <h2 style={{fontSize:'1.2rem',fontWeight:600,color:'#0A0A0A',marginBottom:'0.35rem'}}>{t('personTitulo')}</h2>
              <p style={{fontSize:'0.75rem',fontWeight:300,color:'#888884',marginBottom:'2rem'}}>{t('personSubtitulo')}</p>
              <div style={{marginBottom:'1.75rem'}}>
                <label style={labelStyle}>{t('personImagen')} <span style={{fontSize:'0.6rem',fontWeight:300,color:'#BEBEBA',textTransform:'none',letterSpacing:0}}>{t('personImagenOpc')}</span></label>
                <p style={{fontSize:'0.72rem',fontWeight:300,color:'#888884',marginBottom:'0.75rem',lineHeight:1.6}}>{t('personImagenInfo')}</p>
                <div onClick={() => document.getElementById('foto-evento-input').click()}
                  style={{border:'1px dashed #E0E0DC',padding:'1.5rem',textAlign:'center',cursor:'pointer',background:fotoEventoPreview?'transparent':'#F7F7F5',borderRadius:'8px',overflow:'hidden',marginBottom:'0.75rem'}}>
                  {fotoEventoPreview ? (
                    <img src={fotoEventoPreview} alt="Preview" style={{maxHeight:'180px',maxWidth:'100%',objectFit:'cover',borderRadius:'4px'}}/>
                  ) : (
                    <div>
                      <div style={{fontSize:'0.82rem',fontWeight:300,color:'#888884',marginBottom:'0.25rem'}}>{t('personImagenBtn')}</div>
                      <div style={{fontSize:'0.72rem',fontWeight:300,color:'#BEBEBA'}}>JPG, PNG o WEBP</div>
                    </div>
                  )}
                </div>
                <input id="foto-evento-input" type="file" accept="image/*" style={{display:'none'}}
                  onChange={e => { const file=e.target.files[0]; if(file){ setFotoEventoFile(file); setFotoEventoPreview(URL.createObjectURL(file)) } }}/>
                {fotoEventoPreview && (
                  <button onClick={() => { setFotoEventoPreview(null); setFotoEventoFile(null); setEditFotoEvento('') }}
                    style={{fontSize:'0.65rem',fontWeight:600,color:'#F07987',background:'none',border:'none',cursor:'pointer',fontFamily:'Poppins,sans-serif',padding:0}}>
                    {t('personImagenEliminar')}
                  </button>
                )}
              </div>
              <div style={{marginBottom:'2rem'}}>
                <label style={labelStyle}>{t('personMensaje')} <span style={{fontSize:'0.6rem',fontWeight:300,color:'#BEBEBA',textTransform:'none',letterSpacing:0}}>{t('personMensajeOpc')}</span></label>
                <p style={{fontSize:'0.72rem',fontWeight:300,color:'#888884',marginBottom:'0.75rem',lineHeight:1.6}}>{t('personMensajeInfo')}</p>
                <textarea value={editMensajeInvitada} onChange={e => setEditMensajeInvitada(e.target.value)} style={textareaStyle} maxLength={300}/>
                <p style={{fontSize:'0.62rem',fontWeight:300,color:'#BEBEBA',textAlign:'right',marginTop:'0.25rem'}}>{editMensajeInvitada.length}/300</p>
              </div>
              <div style={{marginBottom:'2rem',padding:'1.25rem',background:'#F7F7F5',border:'1px solid #E0E0DC',borderRadius:'8px'}}>
                <p style={{fontSize:'0.6rem',fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase',color:'#888884',marginBottom:'1rem'}}>{t('personPreview')}</p>
                <div style={{background:'#0A0A0A',borderRadius:'4px',padding:'1.5rem',position:'relative',overflow:'hidden'}}>
                  {fotoEventoPreview && <img src={fotoEventoPreview} alt="" style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',opacity:0.4}}/>}
                  <div style={{position:'relative',zIndex:1}}>
                    <div style={{fontSize:'0.55rem',fontWeight:700,letterSpacing:'0.18em',textTransform:'uppercase',color:'rgba(255,255,255,0.5)',marginBottom:'0.5rem'}}>{evento.tipo}</div>
                    <div style={{fontSize:'1.5rem',fontWeight:700,color:'#FFFFFF',letterSpacing:'-0.02em',marginBottom:'0.25rem'}}>{evento.nombre}</div>
                    {editMensajeInvitada && <p style={{fontSize:'0.75rem',fontWeight:400,color:'rgba(255,255,255,0.75)',marginTop:'0.75rem',lineHeight:1.7,fontStyle:'italic'}}>"{editMensajeInvitada}"</p>}
                  </div>
                </div>
              </div>
              {personalizacionMensaje && <p style={{fontSize:'0.78rem',fontWeight:400,color:'#4A6B42',marginBottom:'1rem',padding:'0.75rem',background:'#EEF4E8',border:'1px solid #C8DFC0',borderRadius:'4px'}}>{personalizacionMensaje}</p>}
              <button onClick={handleGuardarPersonalizacion} disabled={guardandoPersonalizacion} style={{padding:'0.9rem 2.5rem',fontSize:'0.78rem',fontWeight:500,background:'#C4917C',color:'#FFFFFF',border:'none',cursor:'pointer',fontFamily:'Poppins,sans-serif',borderRadius:'4px',opacity:guardandoPersonalizacion?0.6:1}}>
                {guardandoPersonalizacion ? t('personGuardando') : t('personGuardar')}
              </button>
            </div>
          )}

          {/* TAB RECORDATORIOS */}
          {isPremium && tabActiva === tabRecordatoriosIdx && (
            <div style={{maxWidth:'600px'}}>
              <h2 style={{fontSize:'1.2rem',fontWeight:600,color:'#0A0A0A',marginBottom:'0.35rem'}}>{t('recTitulo')}</h2>
              <p style={{fontSize:'0.75rem',fontWeight:300,color:'#888884',marginBottom:'2rem'}}>{t('recSubtitulo')}</p>

              <div style={{marginBottom:'1.5rem'}}>
                <label style={labelStyle}>{t('recArchivoLabel')}</label>
                <p style={{fontSize:'0.72rem',fontWeight:300,color:'#888884',marginBottom:'0.75rem',lineHeight:1.6}}>{t('recArchivoInfo')}</p>
                <div onClick={() => document.getElementById('archivo-invitadas-input').click()}
                  style={{border:'1px dashed #E0E0DC',padding:'1.5rem',textAlign:'center',cursor:'pointer',background:'#F7F7F5',borderRadius:'8px',marginBottom:'0.5rem'}}>
                  <div style={{fontSize:'0.82rem',fontWeight:500,color:nombreArchivo?'#0A0A0A':'#888884',marginBottom:'0.25rem'}}>
                    {nombreArchivo || t('recArchivoBtn')}
                  </div>
                  <div style={{fontSize:'0.72rem',fontWeight:300,color:'#BEBEBA'}}>{t('recArchivoFormatos')}</div>
                </div>
                <input id="archivo-invitadas-input" type="file" accept=".xlsx,.xls,.csv" style={{display:'none'}} onChange={handleArchivoInvitadas}/>
                <p style={{fontSize:'0.7rem',fontWeight:300,color:'#888884',marginTop:'0.5rem',lineHeight:1.6}}>
                  {t('recPlantillaInfo')}{' '}
                  <button onClick={descargarPlantilla} style={{fontSize:'0.7rem',fontWeight:600,color:'#C4917C',background:'none',border:'none',cursor:'pointer',fontFamily:'Poppins,sans-serif',padding:0,textDecoration:'underline'}}>
                    {t('recPlantillaLink')}
                  </button>
                </p>
              </div>

              {errorArchivo && (
                <p style={{fontSize:'0.78rem',fontWeight:400,color:'#F07987',marginBottom:'1.5rem',padding:'0.75rem',background:'#FFF0F1',border:'1px solid #F07987',borderRadius:'4px'}}>{errorArchivo}</p>
              )}

              <button onClick={handleRecordatorios} disabled={enviandoRecordatorios || invitadasArchivo.length === 0}
                style={{padding:'0.9rem 2.5rem',fontSize:'0.78rem',fontWeight:500,background:'#0A0A0A',color:'#FFFFFF',border:'none',cursor:invitadasArchivo.length===0?'not-allowed':'pointer',fontFamily:'Poppins,sans-serif',borderRadius:'4px',opacity:(enviandoRecordatorios||invitadasArchivo.length===0)?0.5:1,marginBottom:'1.5rem'}}>
                {enviandoRecordatorios ? t('recEnviando') : t('recEnviar')}
              </button>

              {recordatorioMensaje && (
                <p style={{fontSize:'0.78rem',fontWeight:400,color:'#4A6B42',marginBottom:'1.5rem',padding:'0.75rem',background:'#EEF4E8',border:'1px solid #C8DFC0',borderRadius:'4px'}}>{recordatorioMensaje}</p>
              )}

              {pendientesConEmail.length > 0 && (
                <div style={{marginBottom:'1.5rem'}}>
                  <p style={{fontSize:'0.82rem',fontWeight:600,color:'#0A0A0A',marginBottom:'0.4rem'}}>{t('recConEmail')} ({pendientesConEmail.length})</p>
                  <p style={{fontSize:'0.72rem',fontWeight:300,color:'#888884',marginBottom:'0.75rem'}}>{t('recConEmailInfo')}</p>
                  <div style={{border:'1px solid #E0E0DC',borderRadius:'8px',overflow:'hidden'}}>
                    {pendientesConEmail.map((p, i) => (
                      <div key={i} style={{display:'flex',justifyContent:'space-between',padding:'0.75rem 1rem',fontSize:'0.82rem',fontWeight:300,color:'#0A0A0A',borderBottom: i < pendientesConEmail.length-1 ? '1px solid #E0E0DC' : 'none',background:'#FFFFFF'}}>
                        <span style={{fontWeight:500}}>{p.nombreCompleto}</span>
                        <span style={{color:'#888884'}}>{p.email}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {pendientesSinEmail.length > 0 && (
                <div style={{marginBottom:'1.5rem'}}>
                  <p style={{fontSize:'0.82rem',fontWeight:600,color:'#0A0A0A',marginBottom:'0.4rem'}}>{t('recSinEmail')} ({pendientesSinEmail.length})</p>
                  <p style={{fontSize:'0.72rem',fontWeight:300,color:'#888884',marginBottom:'0.75rem'}}>{t('recSinEmailInfo')}</p>
                  <div style={{border:'1px solid #E0E0DC',borderRadius:'8px',overflow:'hidden',marginBottom:'0.75rem'}}>
                    {pendientesSinEmail.map((p, i) => (
                      <div key={i} style={{padding:'0.75rem 1rem',fontSize:'0.82rem',fontWeight:500,color:'#0A0A0A',borderBottom: i < pendientesSinEmail.length-1 ? '1px solid #E0E0DC' : 'none',background:'#FFFFFF'}}>
                        {p.nombreCompleto}
                      </div>
                    ))}
                  </div>
                  {recordatorioWhatsapp && (
                    <>
                      <div style={{background:'#F7F7F5',border:'1px solid #E0E0DC',borderRadius:'8px',padding:'1rem',fontSize:'0.82rem',fontWeight:300,color:'#0A0A0A',lineHeight:1.6,marginBottom:'0.75rem'}}>
                        {recordatorioWhatsapp}
                      </div>
                      <button onClick={() => navigator.clipboard.writeText(recordatorioWhatsapp)}
                        style={{padding:'0.6rem 1.5rem',fontSize:'0.75rem',fontWeight:500,background:'#25D366',color:'#FFFFFF',border:'none',cursor:'pointer',fontFamily:'Poppins,sans-serif',borderRadius:'4px'}}>
                        {t('recCopiarWhatsapp')}
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB ORGANIZADORES */}
          {isEnterprise && tabs.indexOf(t('tabOrganizadores')) === tabActiva && (
            <div className="evento-org" style={{maxWidth:'560px'}}>
              <h2 style={{fontSize:'1.2rem',fontWeight:600,color:'#0A0A0A',marginBottom:'0.35rem'}}>{t('orgTitulo')}</h2>
              <p style={{fontSize:'0.75rem',fontWeight:300,color:'#888884',marginBottom:'2rem'}}>{t('orgSubtitulo')}</p>
              <div className="evento-org-row" style={{display:'flex',gap:'0.75rem',marginBottom:'1.5rem'}}>
                <input type="email" placeholder={t('orgPlaceholder')} value={emailNuevoOrg} onChange={e => setEmailNuevoOrg(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAñadirOrganizador()} style={{...inputStyle, flex:1}}/>
                <button onClick={handleAñadirOrganizador} disabled={añadiendoOrg}
                  style={{padding:'0.9rem 1.5rem',fontSize:'0.78rem',fontWeight:600,background:'#0A0A0A',color:'#FFFFFF',border:'none',cursor:'pointer',fontFamily:'Poppins,sans-serif',whiteSpace:'nowrap',opacity:añadiendoOrg?0.6:1,borderRadius:'4px'}}>
                  {añadiendoOrg ? t('orgAnandiendo') : t('orgAnadir')}
                </button>
              </div>
              {orgMensaje && <p style={{fontSize:'0.78rem',fontWeight:400,marginBottom:'1rem',padding:'0.75rem',borderRadius:'4px',color:'#4A6B42',background:'#EEF4E8',border:'1px solid #C8DFC0'}}>{orgMensaje}</p>}
              {organizadores.length === 0 ? (
                <div style={{padding:'2rem',background:'#F7F7F5',border:'1px dashed #E0E0DC',borderRadius:'8px',textAlign:'center',fontSize:'0.78rem',fontWeight:300,color:'#888884'}}>
                  {t('orgSinOrgs')}
                </div>
              ) : (
                <div style={{display:'flex',flexDirection:'column',gap:'0.75rem'}}>
                  {organizadores.map((org, i) => (
                    <div key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'1rem 1.25rem',border:'1px solid #E0E0DC',borderRadius:'8px',background:'#FFFFFF'}}>
                      <div style={{fontSize:'0.82rem',fontWeight:600,color:'#0A0A0A'}}>{org.profiles?.nombre || 'Sin nombre'}</div>
                      <button onClick={() => handleEliminarOrganizador(org.user_id)}
                        style={{fontSize:'0.65rem',fontWeight:600,color:'#F07987',background:'none',border:'1px solid #F07987',cursor:'pointer',fontFamily:'Poppins,sans-serif',padding:'0.35rem 0.75rem',borderRadius:'4px'}}>
                        {t('orgEliminar')}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {modalPlanes && (
          <ModalPlanes onClose={() => setModalPlanes(false)} planActual={evento.plan} evento={evento}/>
        )}
      </div>
    </>
  )
}