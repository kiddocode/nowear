'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter, usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { supabase } from '@/lib/supabase'
import ModalPlanes from '@/app/components/ModalPlanes'

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
    await supabase.from('eventos').update({ nombre: editNombre, fecha: editFecha, lugar: editLugar, colores_bloqueados: editColores || null }).eq('id', evento.id)
    setEvento(prev => ({...prev, nombre: editNombre, fecha: editFecha, lugar: editLugar, colores_bloqueados: editColores}))
    setGuardandoAjustes(false)
    setAjustesMensaje(t('ajustesGuardado'))
    setTimeout(() => setAjustesMensaje(''), 3000)
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
    setOrgMensaje(`${perfil.nombre} ${t('orgAnadir')}.`)
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

  // Tabs: Personalización solo en desktop (en móvil se accede desde el hero)
  const tabs = [t('tabLooks'), t('tabConflictos'), t('tabColores'), t('tabAjustes')]
  if (isPremium) tabs.push(t('tabPersonalizacion'))
  if (isEnterprise) tabs.push(t('tabOrganizadores'))

  // Índice de la tab de personalización
  const tabPersonalizacionIdx = isPremium ? tabs.indexOf(t('tabPersonalizacion')) : -1

  return (
    <>
      <style>{`
        .evento-premium-link-mobile { display: none; }
        @media (max-width: 1024px) {
          .evento-premium-link-mobile { display: block !important; }
          .evento-tab-personalizacion { display: none !important; }
        }
      `}</style>

      <div style={{fontFamily:"'Poppins',sans-serif",paddingBottom:'2rem'}}>

        {/* HERO */}
        <div className="evento-hero" style={{background:'#0A0A0A',padding:'2.5rem 3rem 3rem',position:'relative',overflow:'hidden'}}>
          <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse at top right, rgba(240,121,135,0.07) 0%, transparent 60%)',pointerEvents:'none'}}></div>
          <button onClick={() => router.push(prefijo + '/dashboard')} style={{display:'inline-flex',alignItems:'center',gap:'0.5rem',fontSize:'0.62rem',fontWeight:600,letterSpacing:'0.12em',textTransform:'uppercase',color:'#888884',background:'none',border:'none',cursor:'pointer',fontFamily:'Poppins,sans-serif',marginBottom:'2rem',padding:0}}>
            {t('misEventos')}
          </button>
          <div className="evento-hero-inner" style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',flexWrap:'wrap',gap:'2rem'}}>
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

            {/* LINK INVITADAS - fondo blanco */}
            <div className="evento-hero-link" style={{background:'#FFFFFF',padding:'1.25rem 1.75rem',minWidth:'260px',borderRadius:'4px',flexShrink:0}}>
              <p style={{fontSize:'0.55rem',fontWeight:700,letterSpacing:'0.15em',textTransform:'uppercase',color:'#888884',marginBottom:'0.5rem'}}>{t('linkInvitadas')}</p>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:'1rem'}}>
                <span style={{fontSize:'0.78rem',fontWeight:500,color:'#0A0A0A',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>nowear.es/{slug}</span>
                <button onClick={copiarLink} style={{fontSize:'0.65rem',fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',color:copiado?'#4A6B42':'#F07987',background:'none',border:'none',cursor:'pointer',fontFamily:'Poppins,sans-serif',whiteSpace:'nowrap',flexShrink:0}}>
                  {copiado ? t('copiado') : t('copiar')}
                </button>
              </div>

              {/* PERSONALIZAR LINK - solo premium, solo móvil, pegado bajo el link */}
              {isPremium && (
                <div className="evento-premium-link-mobile" style={{marginTop:'0.75rem',paddingTop:'0.75rem',borderTop:'1px solid #F0D8CC'}}>
                  <button
                    onClick={() => setTabActiva(tabPersonalizacionIdx)}
                    style={{width:'100%',display:'flex',justifyContent:'space-between',alignItems:'center',background:'none',border:'none',cursor:'pointer',fontFamily:'Poppins,sans-serif',padding:0}}>
                    <span style={{fontSize:'0.6rem',fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase',color:'#C4917C'}}>✨ {t('tabPersonalizacion')}</span>
                    <span style={{fontSize:'0.75rem',color:'#C4917C'}}>›</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* TABS */}
        <div className="evento-tabs" style={{display:'flex',padding:'0 3rem',borderBottom:'2px solid #E0E0DC',background:'#FFFFFF',position:'sticky',top:'68px',zIndex:100,overflowX:'auto'}}>
          {tabs.map((tab,i) => {
            const esPersonalizacion = tab === t('tabPersonalizacion')
            return (
              <button key={i} onClick={() => setTabActiva(i)}
                className={esPersonalizacion ? 'evento-tab-personalizacion' : ''}
                style={{padding:'1.1rem 0',marginRight:'2.5rem',fontSize:'0.72rem',fontWeight:tabActiva===i?700:400,color:tabActiva===i?'#0A0A0A':'#888884',cursor:'pointer',background:'none',border:'none',borderBottom:tabActiva===i?'2px solid #0A0A0A':'2px solid transparent',fontFamily:'Poppins,sans-serif',whiteSpace:'nowrap',marginBottom:'-2px',flexShrink:0}}>
                {tab}
                {i===1&&conflictos.length>0&&<span style={{marginLeft:'0.4rem',fontSize:'0.55rem',fontWeight:700,background:'#F07987',color:'#FFFFFF',padding:'0.1rem 0.4rem',borderRadius:'10px'}}>{conflictos.length}</span>}
                {tab===t('tabOrganizadores')&&<span style={{marginLeft:'0.4rem',fontSize:'0.5rem',fontWeight:700,background:'#F07987',color:'#FFFFFF',padding:'0.1rem 0.4rem',borderRadius:'10px'}}>{t('badgeEnterprise')}</span>}
              </button>
            )
          })}
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
                  {t('sinLooks')}<br/>
                  <span style={{fontSize:'0.72rem',color:'#BEBEBA'}}>{t('sinLooksSub')}</span>
                </div>
              ) : (
                <div className="evento-tabla-wrap" style={{border:'1px solid #E0E0DC',overflowX:'auto',borderRadius:'8px'}}>
                  <table style={{width:'100%',borderCollapse:'collapse',minWidth:'500px'}}>
                    <thead>
                      <tr style={{background:'#F7F7F5'}}>
                        {[t('colColor'),t('colNombre'),t('colMarca'),t('colModelo'),t('colTipo'),t('colEstado')].map((h,i) => (
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
                          <td style={{padding:'0.9rem 1rem',fontSize:'0.82rem',fontWeight:400,color:'#0A0A0A'}}>{row.marca||'—'}</td>
                          <td style={{padding:'0.9rem 1rem',fontSize:'0.82rem',fontWeight:400,color:'#0A0A0A'}}>{row.modelo||'—'}</td>
                          <td style={{padding:'0.9rem 1rem',fontSize:'0.78rem',fontWeight:300,color:'#888884'}}>{row.tipo||'—'}</td>
                          <td style={{padding:'0.9rem 1rem'}}>
                            <span style={{fontSize:'0.58rem',fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',padding:'0.3rem 0.65rem',borderRadius:'20px',background:row.estado==='confirmado'?'#0A0A0A':'#F5EDE8',color:row.estado==='confirmado'?'#FFFFFF':'#C4917C'}}>
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
                <div className="evento-conflictos-header" style={{background:'#FFF0F1',padding:'1rem 1.5rem',borderBottom:'1px solid #F07987',display:'flex',alignItems:'center',gap:'0.75rem'}}>
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

          {/* TAB COLORES */}
          {tabActiva === 2 && (
            <div style={{padding:'2rem',border:'1px solid #E0E0DC',background:'#F7F7F5',borderRadius:'8px'}}>
              <p style={{fontSize:'0.82rem',fontWeight:300,color:'#888884',lineHeight:1.8}}>
                {evento.colores_bloqueados || t('coloresNinguno')}
              </p>
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
              <div style={{marginBottom:'2rem'}}>
                <label style={labelStyle}>{t('ajustesColores')}</label>
                <input type="text" value={editColores} onChange={e=>setEditColores(e.target.value)} placeholder={t('ajustesPlaceholder')} style={inputStyle}/>
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

          {/* TAB ORGANIZADORES */}
          {isEnterprise && tabs.indexOf(t('tabOrganizadores')) === tabActiva && (
            <div className="evento-org" style={{maxWidth:'560px'}}>
              <h2 style={{fontSize:'1.2rem',fontWeight:600,color:'#0A0A0A',marginBottom:'0.35rem'}}>{t('orgTitulo')}</h2>
              <p style={{fontSize:'0.75rem',fontWeight:300,color:'#888884',marginBottom:'2rem'}}>{t('orgSubtitulo')}</p>
              <div className="evento-org-row" style={{display:'flex',gap:'0.75rem',marginBottom:'1.5rem'}}>
                <input type="email" placeholder={t('orgPlaceholder')} value={emailNuevoOrg} onChange={e => setEmailNuevoOrg(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAñadirOrganizador()} style={{...inputStyle, flex:1}}/>
                <button onClick={handleAñadirOrganizador} disabled={añadiendoOrg} style={{padding:'0.9rem 1.5rem',fontSize:'0.78rem',fontWeight:600,background:'#0A0A0A',color:'#FFFFFF',border:'none',cursor:'pointer',fontFamily:'Poppins,sans-serif',whiteSpace:'nowrap',opacity:añadiendoOrg?0.6:1,borderRadius:'4px'}}>
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
                      <button onClick={() => handleEliminarOrganizador(org.user_id)} style={{fontSize:'0.65rem',fontWeight:600,color:'#F07987',background:'none',border:'1px solid #F07987',cursor:'pointer',fontFamily:'Poppins,sans-serif',padding:'0.35rem 0.75rem',borderRadius:'4px'}}>
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