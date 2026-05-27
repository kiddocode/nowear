'use client'
import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { supabase } from '@/lib/supabase'
import Sidebar from '../../../components/Sidebar'

function slugify(text) {
  return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9\s-]/g,'').trim().replace(/\s+/g,'-')
}

const PLANES_BASE = [
  {id:'basico',precio:'9€',meses:1},
  {id:'estandar',precio:'19€',meses:3,popular:true},
  {id:'premium',precio:'29€',meses:null},
]

const COLORES_BLOQUEO = [
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

export default function NuevoEvento() {
  const router = useRouter()
  const pathname = usePathname()
  const t = useTranslations('nuevo')
  const tp = useTranslations('precios')

  const localesPrefix = ['fr','en','pt','de','nl']
  const locale = localesPrefix.find(loc => pathname.startsWith(`/${loc}/`) || pathname === `/${loc}`) || 'es'
  const prefijo = locale !== 'es' ? `/${locale}` : ''

  const [tipo, setTipo] = useState('')
  const [nombre, setNombre] = useState('')
  const [fecha, setFecha] = useState('')
  const [lugar, setLugar] = useState('')
  const [numInvitadas, setNumInvitadas] = useState('')
  const [coloresBloqueados, setColoresBloqueados] = useState('')
  const [damasHonor, setDamasHonor] = useState('')
  const [error, setError] = useState('')
  const [showPlanes, setShowPlanes] = useState(false)
  const [planSeleccionado, setPlanSeleccionado] = useState(null)
  const [planError, setPlanError] = useState('')
  const [loading, setLoading] = useState(false)

  // Look bloqueado
  const [tieneLookBloqueado, setTieneLookBloqueado] = useState(false)
  const [lookBloqueadoColor, setLookBloqueadoColor] = useState('')
  const [lookBloqueadoMarca1, setLookBloqueadoMarca1] = useState('')
  const [lookBloqueadoTipo1, setLookBloqueadoTipo1] = useState('')
  const [lookBloqueadoModelo1, setLookBloqueadoModelo1] = useState('')
  const [lookBloqueadoReferencia1, setLookBloqueadoReferencia1] = useState('')
  const [lookBloqueadoMarca2, setLookBloqueadoMarca2] = useState('')
  const [lookBloqueadoTipo2, setLookBloqueadoTipo2] = useState('')
  const [lookBloqueadoModelo2, setLookBloqueadoModelo2] = useState('')
  const [lookBloqueadoReferencia2, setLookBloqueadoReferencia2] = useState('')

  const planesData = tp.raw('planes')

  const inputStyle = {width:'100%',fontFamily:'Poppins,sans-serif',fontSize:'0.82rem',fontWeight:300,padding:'0.9rem 1rem',border:'1px solid #E0E0DC',background:'#FFFFFF',outline:'none',boxSizing:'border-box'}
  const labelStyle = {display:'block',fontSize:'0.6rem',fontWeight:600,letterSpacing:'0.12em',textTransform:'uppercase',color:'#888884',marginBottom:'0.55rem'}
  const selectStyle = {width:'100%',fontFamily:'Poppins,sans-serif',fontSize:'0.82rem',fontWeight:300,padding:'0.9rem 1rem',border:'1px solid #E0E0DC',background:'#FFFFFF',outline:'none',cursor:'pointer',appearance:'none',backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23888884' stroke-width='1.5' fill='none'/%3E%3C/svg%3E")`,backgroundRepeat:'no-repeat',backgroundPosition:'right 1rem center',boxSizing:'border-box'}

  const tiposData = t.raw ? (typeof t.raw === 'function' ? [] : []) : []

  function validarFechaPlan(fecha, planId) {
    if (!fecha || planId === 'premium') return { ok: true }
    const hoy = new Date()
    const fechaEvento = new Date(fecha)
    const dias = Math.ceil((fechaEvento - hoy) / (1000*60*60*24))
    if (planId === 'basico' && dias > 31) return { ok: false, msg: `Tu evento es dentro de ${dias} días. El plan Básico solo abre el registro 1 mes antes.` }
    if (planId === 'estandar' && dias > 92) return { ok: false, msg: `Tu evento es dentro de ${dias} días. El plan Estándar abre el registro 3 meses antes.` }
    if (dias < 0) return { ok: false, msg: t('errorFechaPasada') }
    return { ok: true }
  }

  function handleContinuar() {
    setError('')
    if (!tipo || !nombre || !fecha || !lugar) { setError(t('errorCampos')); return }
    if (new Date(fecha) < new Date()) { setError(t('errorFechaPasada')); return }
    setShowPlanes(true)
  }

  function handleSeleccionarPlan(planId) {
    setPlanSeleccionado(planId)
    const v = validarFechaPlan(fecha, planId)
    setPlanError(!v.ok ? v.msg : '')
  }

  async function handlePagar() {
    if (!planSeleccionado) return
    const v = validarFechaPlan(fecha, planSeleccionado)
    if (!v.ok) { setPlanError(v.msg); return }
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push(prefijo + '/login'); return }
    const slug = slugify(nombre) + '-' + Date.now().toString().slice(-4)
    const { error: eventoError } = await supabase.from('eventos').insert({
      organizadora_id: user.id, slug, nombre, tipo, fecha, lugar,
      num_invitadas: numInvitadas ? parseInt(numInvitadas) : null,
      colores_bloqueados: coloresBloqueados || null,
      damas_honor: damasHonor || null,
      plan: planSeleccionado,
      look_bloqueado_color: tieneLookBloqueado && lookBloqueadoColor ? lookBloqueadoColor : null,
      look_bloqueado_marca1: tieneLookBloqueado && lookBloqueadoMarca1 ? lookBloqueadoMarca1 : null,
      look_bloqueado_tipo1: tieneLookBloqueado && lookBloqueadoTipo1 ? lookBloqueadoTipo1 : null,
      look_bloqueado_modelo1: tieneLookBloqueado && lookBloqueadoModelo1 ? lookBloqueadoModelo1 : null,
      look_bloqueado_referencia1: tieneLookBloqueado && lookBloqueadoReferencia1 ? lookBloqueadoReferencia1 : null,
      look_bloqueado_marca2: tieneLookBloqueado && lookBloqueadoMarca2 ? lookBloqueadoMarca2 : null,
      look_bloqueado_tipo2: tieneLookBloqueado && lookBloqueadoTipo2 ? lookBloqueadoTipo2 : null,
      look_bloqueado_modelo2: tieneLookBloqueado && lookBloqueadoModelo2 ? lookBloqueadoModelo2 : null,
      look_bloqueado_referencia2: tieneLookBloqueado && lookBloqueadoReferencia2 ? lookBloqueadoReferencia2 : null,
    })
    if (eventoError) { setLoading(false); setError(t('errorEvento')); setShowPlanes(false); return }
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan: planSeleccionado, eventoData: { nombre, slug } })
    })
    const data = await res.json()
    setLoading(false)
    if (data.url) { window.location.href = data.url } else { setError(t('errorPago')); setShowPlanes(false) }
  }

  const TIPOS_PRENDA = ['Vestido corto','Vestido midi','Vestido largo','Traje','Conjunto','Falda','Pantalón','Top','Blusa','Mono','Otra']

  return (
    <>
      <style>{`
        .nuevo-outer { display: grid; grid-template-columns: 220px 1fr; min-height: calc(100vh - 68px); }
        .nuevo-sidebar-wrap { display: block; }
        .nuevo-main { display: grid; grid-template-columns: 1fr 1fr; min-height: calc(100vh - 68px); }
        .nuevo-img { position: relative; overflow: hidden; }
        .nuevo-img-mobile { display: none; width: 100%; height: 180px; overflow: hidden; position: relative; flex-shrink: 0; }
        .nuevo-form { padding: 3rem; border-right: 1px solid #E0E0DC; overflow-y: auto; }
        .nuevo-fecha-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.25rem; }
        .nuevo-prenda-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem; }
        .nuevo-planes-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 1px; background: #E0E0DC; margin: 2rem 3rem; }
        .nuevo-planes-modal { background: #FFFFFF; max-width: 1060px; width: 100%; max-height: 90vh; overflow-y: auto; }
        .nuevo-planes-header { padding: 2.5rem 3rem 2rem; border-bottom: 1px solid #E0E0DC; display: flex; justify-content: space-between; align-items: flex-start; }
        .nuevo-planes-footer { padding: 1.5rem 3rem 2.5rem; display: flex; justify-content: space-between; align-items: center; gap: 1rem; }

        @media (max-width: 1024px) {
          .nuevo-outer { grid-template-columns: 1fr; }
          .nuevo-sidebar-wrap { display: none; }
          .nuevo-main { grid-template-columns: 1fr; min-height: unset; }
          .nuevo-img { display: none; }
          .nuevo-img-mobile { display: block; }
          .nuevo-form { padding: 2rem; border-right: none; padding-bottom: 5rem; }
          .nuevo-planes-grid { grid-template-columns: repeat(2,1fr); margin: 1.5rem; }
          .nuevo-planes-header { padding: 1.5rem; }
          .nuevo-planes-footer { padding: 1rem 1.5rem 1.5rem; flex-direction: column; align-items: stretch; }
          .nuevo-planes-modal { border-radius: 12px; max-height: 95vh; }
        }
        @media (max-width: 768px) {
          .nuevo-form { padding: 1.5rem; padding-bottom: 5rem; }
          .nuevo-fecha-grid { grid-template-columns: 1fr; }
          .nuevo-prenda-grid { grid-template-columns: 1fr; }
          .nuevo-planes-grid { grid-template-columns: 1fr; margin: 1rem; }
          .nuevo-planes-footer { padding: 1rem; }
          .nuevo-img-mobile { height: 160px; }
        }
      `}</style>

      <div className="nuevo-outer">
        <div className="nuevo-sidebar-wrap"><Sidebar activo="/dashboard/nuevo" /></div>
        <main className="nuevo-main">

          <div className="nuevo-img-mobile">
            <img src="https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=900&q=80" alt="Evento" style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:'center 40%',display:'block'}}/>
            <div style={{position:'absolute',inset:0,background:'linear-gradient(to top,rgba(10,10,10,0.65) 0%,rgba(10,10,10,0.1) 60%)'}}></div>
            <div style={{position:'absolute',bottom:'1rem',left:'1.5rem',right:'1.5rem'}}>
              <p style={{fontSize:'1.2rem',fontWeight:700,color:'#FFFFFF',lineHeight:1.2,letterSpacing:'-0.01em'}}>
                {t('tagline')}<br/><em style={{fontStyle:'italic',color:'#F07987'}}>{t('taglineEmphasis')}</em>
              </p>
            </div>
          </div>

          <div className="nuevo-form">
            <div style={{marginBottom:'2.5rem',paddingBottom:'2rem',borderBottom:'1px solid #E0E0DC'}}>
              <h1 style={{fontSize:'clamp(1.6rem,4vw,2.2rem)',fontWeight:200,color:'#0A0A0A',letterSpacing:'-0.025em',lineHeight:1,marginBottom:'0.35rem'}}>{t('titulo')}</h1>
              <p style={{fontSize:'0.75rem',fontWeight:300,color:'#888884'}}>{t('subtitulo')}</p>
            </div>

            <div style={{marginBottom:'1.25rem'}}>
              <label style={labelStyle}>{t('tipoEvento')} <span style={{color:'#F07987'}}>*</span></label>
              <select value={tipo} onChange={e => setTipo(e.target.value)} style={selectStyle}>
                <option value="">{t('seleccionaTipo')}</option>
                <option>{t('boda')}</option><option>{t('bautizo')}</option><option>{t('comunion')}</option>
                <option>{t('pedida')}</option><option>{t('cumpleanos')}</option>
                <option>{t('cenaEmpresa')}</option><option>{t('otro')}</option>
              </select>
            </div>

            <div style={{marginBottom:'1.25rem'}}>
              <label style={labelStyle}>{t('nombreEvento')} <span style={{color:'#F07987'}}>*</span></label>
              <input type="text" placeholder={t('nombrePlaceholder')} value={nombre} onChange={e => setNombre(e.target.value)} style={inputStyle}/>
            </div>

            <div className="nuevo-fecha-grid">
              <div>
                <label style={labelStyle}>{t('fecha')} <span style={{color:'#F07987'}}>*</span></label>
                <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} style={inputStyle}/>
              </div>
              <div>
                <label style={labelStyle}>{t('lugar')} <span style={{color:'#F07987'}}>*</span></label>
                <input type="text" placeholder={t('lugarPlaceholder')} value={lugar} onChange={e => setLugar(e.target.value)} style={inputStyle}/>
              </div>
            </div>

            <div style={{marginBottom:'1.25rem'}}>
              <label style={labelStyle}>{t('numInvitadas')}</label>
              <input type="number" placeholder={t('numPlaceholder')} value={numInvitadas} onChange={e => setNumInvitadas(e.target.value)} style={inputStyle}/>
            </div>

            <div style={{marginBottom:'1.25rem'}}>
              <label style={labelStyle}>{t('coloresBloqueados')} <span style={{fontSize:'0.58rem',fontWeight:300,color:'#BEBEBA',textTransform:'none',letterSpacing:0}}>opcional</span></label>
              <p style={{fontSize:'0.72rem',fontWeight:300,color:'#BEBEBA',marginBottom:'0.75rem',lineHeight:1.6}}>{t('coloresInfo')}</p>
              <input type="text" placeholder={t('coloresPlaceholder')} value={coloresBloqueados} onChange={e => setColoresBloqueados(e.target.value)} style={inputStyle}/>
            </div>

            <div style={{marginBottom:'1.25rem'}}>
              <label style={labelStyle}>{t('damasHonor')} <span style={{fontSize:'0.58rem',fontWeight:300,color:'#BEBEBA',textTransform:'none',letterSpacing:0}}>opcional</span></label>
              <p style={{fontSize:'0.72rem',fontWeight:300,color:'#BEBEBA',marginBottom:'0.75rem',lineHeight:1.6}}>{t('damasInfo')}</p>
              <select value={damasHonor} onChange={e => setDamasHonor(e.target.value)} style={selectStyle}>
                <option value="">{t('seleccionaOpcion')}</option>
                <option value="si">{t('damasSi')}</option>
                <option value="no">{t('damasNo')}</option>
                <option value="color">{t('damasColor')}</option>
              </select>
            </div>

            {/* LOOK BLOQUEADO */}
            <div style={{marginBottom:'2.5rem'}}>
              <div style={{padding:'1.25rem',background:'#F7F7F5',border:'1px solid #E0E0DC',borderRadius:'8px'}}>
                <button
                  onClick={() => setTieneLookBloqueado(!tieneLookBloqueado)}
                  style={{width:'100%',display:'flex',justifyContent:'space-between',alignItems:'center',background:'none',border:'none',cursor:'pointer',fontFamily:'Poppins,sans-serif',padding:0}}>
                  <div style={{textAlign:'left'}}>
                    <div style={{fontSize:'0.82rem',fontWeight:600,color:'#0A0A0A',marginBottom:'0.2rem'}}>
                      {t('lookBloqueadoPregunta') || '¿Tienes ya tu look escogido?'}
                    </div>
                    <div style={{fontSize:'0.72rem',fontWeight:300,color:'#888884'}}>
                      {t('lookBloqueadoInfo') || 'Ninguna invitada podrá registrar el mismo look que tú.'}
                    </div>
                  </div>
                  <div style={{width:'44px',height:'24px',borderRadius:'12px',border:'none',background:tieneLookBloqueado?'#0A0A0A':'#E0E0DC',position:'relative',flexShrink:0,marginLeft:'1rem',transition:'background 0.2s'}}>
                    <span style={{position:'absolute',top:'3px',left:tieneLookBloqueado?'23px':'3px',width:'18px',height:'18px',borderRadius:'50%',background:'#FFFFFF',transition:'left 0.2s',display:'block'}}></span>
                  </div>
                </button>

                {tieneLookBloqueado && (
                  <div style={{marginTop:'1.5rem',borderTop:'1px solid #E0E0DC',paddingTop:'1.5rem'}}>

                    {/* COLOR */}
                    <div style={{marginBottom:'1.25rem'}}>
                      <label style={labelStyle}>{t('colorLook') || 'Color del look'} <span style={{color:'#F07987'}}>*</span></label>
                      <select value={lookBloqueadoColor} onChange={e => setLookBloqueadoColor(e.target.value)} style={selectStyle}>
                        <option value="">{t('seleccionaColor') || 'Selecciona un color...'}</option>
                        {COLORES_BLOQUEO.map((c,i) => (
                          <option key={i} value={c.hex}>{c.nombre}</option>
                        ))}
                      </select>
                      {lookBloqueadoColor && (
                        <div style={{display:'flex',alignItems:'center',gap:'0.5rem',marginTop:'0.5rem'}}>
                          <span style={{width:'20px',height:'20px',borderRadius:'50%',background:lookBloqueadoColor,border:'1px solid #E0E0DC',display:'inline-block'}}></span>
                          <span style={{fontSize:'0.75rem',color:'#888884'}}>{COLORES_BLOQUEO.find(c=>c.hex===lookBloqueadoColor)?.nombre}</span>
                        </div>
                      )}
                    </div>

                    {/* PRENDA 1 */}
                    <div style={{padding:'1.25rem',background:'#FFFFFF',border:'1px solid #E0E0DC',borderRadius:'4px',marginBottom:'1rem'}}>
                      <div style={{fontSize:'0.65rem',fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase',color:'#0A0A0A',marginBottom:'1rem'}}>
                        {t('prenda1') || 'PRENDA 1'} <span style={{color:'#F07987'}}>*</span>
                      </div>
                      <div className="nuevo-prenda-grid">
                        <div>
                          <label style={labelStyle}>{t('marca') || 'Marca'} <span style={{color:'#F07987'}}>*</span></label>
                          <input type="text" placeholder="Ej: Zara" value={lookBloqueadoMarca1} onChange={e => setLookBloqueadoMarca1(e.target.value)} style={inputStyle}/>
                        </div>
                        <div>
                          <label style={labelStyle}>{t('tipo') || 'Tipo'} <span style={{color:'#F07987'}}>*</span></label>
                          <select value={lookBloqueadoTipo1} onChange={e => setLookBloqueadoTipo1(e.target.value)} style={selectStyle}>
                            <option value="">{t('selecciona') || 'Selecciona...'}</option>
                            {TIPOS_PRENDA.map((tp,i) => <option key={i}>{tp}</option>)}
                          </select>
                        </div>
                      </div>
                      <div style={{marginBottom:'1rem'}}>
                        <label style={labelStyle}>{t('modelo') || 'Modelo'} <span style={{color:'#F07987'}}>*</span></label>
                        <input type="text" placeholder={t('modeloPlaceholder') || 'Nombre del vestido o modelo'} value={lookBloqueadoModelo1} onChange={e => setLookBloqueadoModelo1(e.target.value)} style={inputStyle}/>
                      </div>
                      <div>
                        <label style={labelStyle}>{t('referencia') || 'Referencia o link'} <span style={{fontSize:'0.6rem',fontWeight:300,color:'#BEBEBA',textTransform:'none',letterSpacing:0}}>opcional</span></label>
                        <input type="text" placeholder={t('referenciaPlaceholder') || 'URL o referencia del producto'} value={lookBloqueadoReferencia1} onChange={e => setLookBloqueadoReferencia1(e.target.value)} style={inputStyle}/>
                      </div>
                    </div>

                    {/* PRENDA 2 */}
                    <div style={{padding:'1.25rem',background:'#FFFFFF',border:'1px solid #E0E0DC',borderRadius:'4px'}}>
                      <div style={{fontSize:'0.65rem',fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase',color:'#888884',marginBottom:'1rem'}}>
                        {t('prenda2') || 'SEGUNDA PRENDA (OPCIONAL)'}
                      </div>
                      <div className="nuevo-prenda-grid">
                        <div>
                          <label style={labelStyle}>{t('marca') || 'Marca'}</label>
                          <input type="text" placeholder="Ej: Mango" value={lookBloqueadoMarca2} onChange={e => setLookBloqueadoMarca2(e.target.value)} style={inputStyle}/>
                        </div>
                        <div>
                          <label style={labelStyle}>{t('tipo') || 'Tipo'}</label>
                          <select value={lookBloqueadoTipo2} onChange={e => setLookBloqueadoTipo2(e.target.value)} style={selectStyle}>
                            <option value="">{t('selecciona') || 'Selecciona...'}</option>
                            {TIPOS_PRENDA.map((tp,i) => <option key={i}>{tp}</option>)}
                          </select>
                        </div>
                      </div>
                      <div style={{marginBottom:'1rem'}}>
                        <label style={labelStyle}>{t('modelo') || 'Modelo'}</label>
                        <input type="text" placeholder={t('modeloPlaceholder') || 'Nombre del vestido o modelo'} value={lookBloqueadoModelo2} onChange={e => setLookBloqueadoModelo2(e.target.value)} style={inputStyle}/>
                      </div>
                      <div>
                        <label style={labelStyle}>{t('referencia') || 'Referencia o link'}</label>
                        <input type="text" placeholder={t('referenciaPlaceholder') || 'URL o referencia del producto'} value={lookBloqueadoReferencia2} onChange={e => setLookBloqueadoReferencia2(e.target.value)} style={inputStyle}/>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {error && <p style={{fontSize:'0.78rem',fontWeight:600,color:'#F07987',marginBottom:'1rem',padding:'0.75rem',background:'#FFF0F1',border:'1px solid #F07987',borderRadius:'4px'}}>{error}</p>}

            <button onClick={handleContinuar} style={{padding:'0.9rem 2.5rem',fontSize:'0.78rem',fontWeight:500,background:'#0A0A0A',color:'#FFFFFF',border:'none',cursor:'pointer',fontFamily:'Poppins,sans-serif',letterSpacing:'0.03em',borderRadius:'4px',width:'100%'}}>
              {t('continuar')}
            </button>
          </div>

          <div className="nuevo-img">
            <img src="https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=900&q=80" alt="Evento" style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}}/>
            <div style={{position:'absolute',inset:0,background:'linear-gradient(to top,rgba(10,10,10,0.75) 0%,rgba(10,10,10,0.1) 60%)',display:'flex',flexDirection:'column',justifyContent:'flex-end',padding:'3rem'}}>
              <p style={{fontSize:'1.3rem',fontWeight:700,color:'#FFFFFF',lineHeight:1.5,letterSpacing:'-0.01em',marginBottom:'1.5rem'}}>
                {t('tagline')}<br/><em style={{fontStyle:'italic',color:'#F07987'}}>{t('taglineEmphasis')}</em>
              </p>
              <div style={{display:'flex',flexDirection:'column',gap:'0.75rem'}}>
                {[t('feat1'),t('feat2'),t('feat3')].map((item,i) => (
                  <div key={i} style={{display:'flex',alignItems:'center',gap:'0.75rem',fontSize:'0.82rem',fontWeight:400,color:'rgba(255,255,255,0.85)'}}>
                    <span style={{width:'4px',height:'4px',borderRadius:'50%',background:'#F07987',flexShrink:0}}></span>{item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>

      {showPlanes && (
        <div style={{position:'fixed',inset:0,background:'rgba(10,10,10,0.7)',zIndex:2000,display:'flex',alignItems:'center',justifyContent:'center',padding:'1rem'}}>
          <div className="nuevo-planes-modal">
            <div className="nuevo-planes-header">
              <div>
                <h2 style={{fontSize:'clamp(1.3rem,3vw,1.8rem)',fontWeight:200,color:'#0A0A0A',letterSpacing:'-0.02em',marginBottom:'0.3rem'}}>{t('elegirPlan')}</h2>
                <p style={{fontSize:'0.75rem',fontWeight:300,color:'#888884'}}>{t('pagoUnico')}</p>
              </div>
              <button onClick={() => { setShowPlanes(false); setPlanSeleccionado(null); setPlanError('') }} style={{background:'none',border:'none',fontSize:'1.2rem',cursor:'pointer',color:'#888884',padding:'0.25rem',lineHeight:1,flexShrink:0}}>✕</button>
            </div>
            <div className="nuevo-planes-grid">
              {PLANES_BASE.map((planBase, idx) => {
                const planData = planesData[idx]
                const plan = { ...planBase, ...planData }
                const validacion = validarFechaPlan(fecha, plan.id)
                const seleccionado = planSeleccionado === plan.id
                return (
                  <div key={plan.id} onClick={() => handleSeleccionarPlan(plan.id)}
                    style={{background:seleccionado?'#0A0A0A':'#FFFFFF',padding:'1.5rem',cursor:'pointer',position:'relative',transition:'background 0.15s',opacity:!validacion.ok&&!seleccionado?0.5:1}}>
                    {plan.popular && <div style={{position:'absolute',top:'0.75rem',right:'0.75rem',fontSize:'0.52rem',fontWeight:600,letterSpacing:'0.1em',textTransform:'uppercase',background:'#F07987',color:'#FFFFFF',padding:'0.2rem 0.5rem'}}>{t('popular')}</div>}
                    {!validacion.ok && <div style={{position:'absolute',top:'0.75rem',left:'0.75rem',fontSize:'0.52rem',fontWeight:600,letterSpacing:'0.1em',textTransform:'uppercase',background:'#F5EDE8',color:'#C4917C',padding:'0.2rem 0.5rem'}}>{t('verAviso')}</div>}
                    <div style={{fontSize:'clamp(1.5rem,3vw,2rem)',fontWeight:100,color:seleccionado?'#FFFFFF':'#0A0A0A',letterSpacing:'-0.03em',lineHeight:1,marginBottom:'0.25rem'}}>{plan.precio}</div>
                    <div style={{fontSize:'0.62rem',fontWeight:600,letterSpacing:'0.12em',textTransform:'uppercase',color:seleccionado?'#F07987':'#888884',marginBottom:'0.25rem'}}>{plan.sub}</div>
                    <div style={{fontSize:'0.82rem',fontWeight:300,color:seleccionado?'#FFFFFF':'#0A0A0A',marginBottom:'1.25rem'}}>{plan.plan}</div>
                    <div style={{display:'flex',flexDirection:'column',gap:'0.4rem'}}>
                      {plan.feats.map((f,i) => (
                        <div key={i} style={{display:'flex',alignItems:'center',gap:'0.6rem',fontSize:'0.72rem',fontWeight:300,color:seleccionado?'rgba(255,255,255,0.75)':'#888884'}}>
                          <span style={{width:'4px',height:'4px',borderRadius:'50%',background:seleccionado?'#F07987':'#BEBEBA',flexShrink:0}}></span>{f}
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
              <div style={{background:'#F7F7F5',padding:'1.5rem',position:'relative',border:'1px dashed #E0E0DC'}}>
                <div style={{position:'absolute',top:'0.75rem',right:'0.75rem',fontSize:'0.52rem',fontWeight:600,letterSpacing:'0.1em',textTransform:'uppercase',background:'#0A0A0A',color:'#FFFFFF',padding:'0.2rem 0.5rem'}}>{t('enterprise')}</div>
                <div style={{fontSize:'1.3rem',fontWeight:200,color:'#0A0A0A',letterSpacing:'-0.02em',lineHeight:1.2,marginBottom:'0.25rem',marginTop:'0.5rem'}}>{t('aMedida')}</div>
                <div style={{fontSize:'0.62rem',fontWeight:600,letterSpacing:'0.12em',textTransform:'uppercase',color:'#888884',marginBottom:'0.25rem'}}>{t('solucionPersonalizada')}</div>
                <div style={{fontSize:'0.82rem',fontWeight:300,color:'#0A0A0A',marginBottom:'1.25rem'}}>{t('paraEmpresas')}</div>
                <div style={{display:'flex',flexDirection:'column',gap:'0.4rem',marginBottom:'1.25rem'}}>
                  {[t('efMultiples'),t('efCuenta'),t('efTarifa'),t('efDesarrollo'),t('efSoporte')].map((f,i) => (
                    <div key={i} style={{display:'flex',alignItems:'center',gap:'0.6rem',fontSize:'0.72rem',fontWeight:300,color:'#888884'}}>
                      <span style={{width:'4px',height:'4px',borderRadius:'50%',background:'#BEBEBA',flexShrink:0}}></span>{f}
                    </div>
                  ))}
                </div>
                <a href="/#contacto" onClick={() => setShowPlanes(false)} style={{display:'block',textAlign:'center',padding:'0.65rem',fontSize:'0.72rem',fontWeight:500,background:'#0A0A0A',color:'#FFFFFF',textDecoration:'none',fontFamily:'Poppins,sans-serif',borderRadius:'4px'}}>
                  {t('contactar')}
                </a>
              </div>
            </div>
            {planError && (
              <div style={{margin:'0 1rem 1rem',padding:'1rem 1.25rem',background:'#FFF8F0',border:'1px solid #F5D6A0',borderRadius:'4px'}}>
                <p style={{fontSize:'0.78rem',fontWeight:600,color:'#C4917C',marginBottom:'0.25rem'}}>{t('aviso')}</p>
                <p style={{fontSize:'0.75rem',fontWeight:300,color:'#888884',lineHeight:1.6}}>{planError}</p>
                <p style={{fontSize:'0.72rem',fontWeight:500,color:'#C4917C',marginTop:'0.5rem'}}>{t('avisoPremium')}</p>
              </div>
            )}
            <div className="nuevo-planes-footer">
              <p style={{fontSize:'0.72rem',fontWeight:300,color:'#888884'}}>
                {planSeleccionado ? t('planSeleccionado').replace('{plan}', planesData[PLANES_BASE.findIndex(p=>p.id===planSeleccionado)]?.plan || planSeleccionado) : t('seleccionaPlan')}
              </p>
              <button onClick={handlePagar} disabled={!planSeleccionado||loading||!!planError}
                style={{padding:'0.9rem 2rem',fontSize:'0.78rem',fontWeight:500,background:planSeleccionado&&!planError?'#0A0A0A':'#E0E0DC',color:planSeleccionado&&!planError?'#FFFFFF':'#888884',border:'none',cursor:planSeleccionado&&!planError?'pointer':'not-allowed',fontFamily:'Poppins,sans-serif',letterSpacing:'0.03em',opacity:loading?0.6:1,borderRadius:'4px',whiteSpace:'nowrap'}}>
                {loading ? t('procesando') : t('procederPago')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}