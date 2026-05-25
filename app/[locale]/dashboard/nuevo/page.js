'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
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

export default function NuevoEvento() {
  const router = useRouter()
  const t = useTranslations('nuevo')
  const tp = useTranslations('precios')
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

  const planesData = tp.raw('planes')

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
    if (!user) { router.push('/login'); return }
    const slug = slugify(nombre) + '-' + Date.now().toString().slice(-4)
    const { error: eventoError } = await supabase.from('eventos').insert({
      organizadora_id: user.id, slug, nombre, tipo, fecha, lugar,
      num_invitadas: numInvitadas ? parseInt(numInvitadas) : null,
      colores_bloqueados: coloresBloqueados || null,
      damas_honor: damasHonor || null,
      plan: planSeleccionado
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

  const inputStyle = {width:'100%',fontFamily:'Poppins,sans-serif',fontSize:'0.82rem',fontWeight:300,padding:'0.9rem 1rem',border:'1px solid #E0E0DC',background:'#FFFFFF',outline:'none',boxSizing:'border-box'}
  const labelStyle = {display:'block',fontSize:'0.6rem',fontWeight:600,letterSpacing:'0.12em',textTransform:'uppercase',color:'#888884',marginBottom:'0.55rem'}
  const selectStyle = {width:'100%',fontFamily:'Poppins,sans-serif',fontSize:'0.82rem',fontWeight:300,padding:'0.9rem 1rem',border:'1px solid #E0E0DC',background:'#FFFFFF',outline:'none',cursor:'pointer',appearance:'none',backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23888884' stroke-width='1.5' fill='none'/%3E%3C/svg%3E")`,backgroundRepeat:'no-repeat',backgroundPosition:'right 1rem center',boxSizing:'border-box'}

  return (
    <div style={{display:'grid',gridTemplateColumns:'220px 1fr',minHeight:'calc(100vh - 68px)'}}>
      <Sidebar activo="/dashboard/nuevo" />
      <main style={{display:'grid',gridTemplateColumns:'1fr 1fr',minHeight:'calc(100vh - 68px)'}}>
        <div style={{padding:'3rem',borderRight:'1px solid #E0E0DC'}}>
          <div style={{marginBottom:'2.5rem',paddingBottom:'2rem',borderBottom:'1px solid #E0E0DC'}}>
            <h1 style={{fontSize:'2.2rem',fontWeight:200,color:'#0A0A0A',letterSpacing:'-0.025em',lineHeight:1,marginBottom:'0.35rem'}}>{t('titulo')}</h1>
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

          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem',marginBottom:'1.25rem'}}>
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

          <div style={{marginBottom:'2.5rem'}}>
            <label style={labelStyle}>{t('damasHonor')} <span style={{fontSize:'0.58rem',fontWeight:300,color:'#BEBEBA',textTransform:'none',letterSpacing:0}}>opcional</span></label>
            <p style={{fontSize:'0.72rem',fontWeight:300,color:'#BEBEBA',marginBottom:'0.75rem',lineHeight:1.6}}>{t('damasInfo')}</p>
            <select value={damasHonor} onChange={e => setDamasHonor(e.target.value)} style={selectStyle}>
              <option value="">{t('seleccionaOpcion')}</option>
              <option value="si">{t('damasSi')}</option>
              <option value="no">{t('damasNo')}</option>
              <option value="color">{t('damasColor')}</option>
            </select>
          </div>

          {error && <p style={{fontSize:'0.78rem',fontWeight:600,color:'#F07987',marginBottom:'1rem',padding:'0.75rem',background:'#FFF0F1',border:'1px solid #F07987'}}>{error}</p>}

          <button onClick={handleContinuar} style={{padding:'0.9rem 2.5rem',fontSize:'0.78rem',fontWeight:500,background:'#0A0A0A',color:'#FFFFFF',border:'none',cursor:'pointer',fontFamily:'Poppins,sans-serif',letterSpacing:'0.03em',borderRadius:'4px'}}>
            {t('continuar')}
          </button>
        </div>

        <div style={{position:'relative',overflow:'hidden'}}>
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

      {showPlanes && (
        <div style={{position:'fixed',inset:0,background:'rgba(10,10,10,0.7)',zIndex:2000,display:'flex',alignItems:'center',justifyContent:'center',padding:'1.5rem'}}>
          <div style={{background:'#FFFFFF',maxWidth:'1060px',width:'100%',maxHeight:'90vh',overflowY:'auto'}}>
            <div style={{padding:'2.5rem 3rem 2rem',borderBottom:'1px solid #E0E0DC',display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
              <div>
                <h2 style={{fontSize:'1.8rem',fontWeight:200,color:'#0A0A0A',letterSpacing:'-0.02em',marginBottom:'0.3rem'}}>{t('elegirPlan')}</h2>
                <p style={{fontSize:'0.75rem',fontWeight:300,color:'#888884'}}>{t('pagoUnico')}</p>
              </div>
              <button onClick={() => { setShowPlanes(false); setPlanSeleccionado(null); setPlanError('') }} style={{background:'none',border:'none',fontSize:'1.2rem',cursor:'pointer',color:'#888884',padding:'0.25rem',lineHeight:1}}>✕</button>
            </div>

            <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'1px',background:'#E0E0DC',margin:'2rem 3rem'}}>
              {PLANES_BASE.map((planBase, idx) => {
                const planData = planesData[idx]
                const plan = { ...planBase, ...planData }
                const validacion = validarFechaPlan(fecha, plan.id)
                const seleccionado = planSeleccionado === plan.id
                return (
                  <div key={plan.id} onClick={() => handleSeleccionarPlan(plan.id)}
                    style={{background:seleccionado?'#0A0A0A':'#FFFFFF',padding:'2rem',cursor:'pointer',position:'relative',transition:'background 0.15s',opacity:!validacion.ok&&!seleccionado?0.5:1}}>
                    {plan.popular && <div style={{position:'absolute',top:'1rem',right:'1rem',fontSize:'0.52rem',fontWeight:600,letterSpacing:'0.1em',textTransform:'uppercase',background:'#F07987',color:'#FFFFFF',padding:'0.2rem 0.5rem'}}>{t('popular')}</div>}
                    {!validacion.ok && <div style={{position:'absolute',top:'1rem',left:'1rem',fontSize:'0.52rem',fontWeight:600,letterSpacing:'0.1em',textTransform:'uppercase',background:'#F5EDE8',color:'#C4917C',padding:'0.2rem 0.5rem'}}>{t('verAviso')}</div>}
                    <div style={{fontSize:'2rem',fontWeight:100,color:seleccionado?'#FFFFFF':'#0A0A0A',letterSpacing:'-0.03em',lineHeight:1,marginBottom:'0.25rem'}}>{plan.precio}</div>
                    <div style={{fontSize:'0.62rem',fontWeight:600,letterSpacing:'0.12em',textTransform:'uppercase',color:seleccionado?'#F07987':'#888884',marginBottom:'0.25rem'}}>{plan.sub}</div>
                    <div style={{fontSize:'0.85rem',fontWeight:300,color:seleccionado?'#FFFFFF':'#0A0A0A',marginBottom:'1.5rem'}}>{plan.plan}</div>
                    <div style={{display:'flex',flexDirection:'column',gap:'0.5rem'}}>
                      {plan.feats.map((f,i) => (
                        <div key={i} style={{display:'flex',alignItems:'center',gap:'0.6rem',fontSize:'0.72rem',fontWeight:300,color:seleccionado?'rgba(255,255,255,0.75)':'#888884'}}>
                          <span style={{width:'4px',height:'4px',borderRadius:'50%',background:seleccionado?'#F07987':'#BEBEBA',flexShrink:0}}></span>{f}
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}

              <div style={{background:'#F7F7F5',padding:'2rem',position:'relative',border:'1px dashed #E0E0DC'}}>
                <div style={{position:'absolute',top:'1rem',right:'1rem',fontSize:'0.52rem',fontWeight:600,letterSpacing:'0.1em',textTransform:'uppercase',background:'#0A0A0A',color:'#FFFFFF',padding:'0.2rem 0.5rem'}}>{t('enterprise')}</div>
                <div style={{fontSize:'1.4rem',fontWeight:200,color:'#0A0A0A',letterSpacing:'-0.02em',lineHeight:1.2,marginBottom:'0.25rem',marginTop:'0.5rem'}}>{t('aMedida')}</div>
                <div style={{fontSize:'0.62rem',fontWeight:600,letterSpacing:'0.12em',textTransform:'uppercase',color:'#888884',marginBottom:'0.25rem'}}>{t('solucionPersonalizada')}</div>
                <div style={{fontSize:'0.85rem',fontWeight:300,color:'#0A0A0A',marginBottom:'1.5rem'}}>{t('paraEmpresas')}</div>
                <div style={{display:'flex',flexDirection:'column',gap:'0.5rem',marginBottom:'1.5rem'}}>
                  {[t('efMultiples'),t('efCuenta'),t('efTarifa'),t('efDesarrollo'),t('efSoporte')].map((f,i) => (
                    <div key={i} style={{display:'flex',alignItems:'center',gap:'0.6rem',fontSize:'0.72rem',fontWeight:300,color:'#888884'}}>
                      <span style={{width:'4px',height:'4px',borderRadius:'50%',background:'#BEBEBA',flexShrink:0}}></span>{f}
                    </div>
                  ))}
                </div>
                <a href="/#contacto" onClick={() => setShowPlanes(false)} style={{display:'block',textAlign:'center',padding:'0.75rem',fontSize:'0.72rem',fontWeight:500,background:'#0A0A0A',color:'#FFFFFF',textDecoration:'none',fontFamily:'Poppins,sans-serif',borderRadius:'4px'}}>
                  {t('contactar')}
                </a>
              </div>
            </div>

            {planError && (
              <div style={{margin:'0 3rem',padding:'1rem 1.25rem',background:'#FFF8F0',border:'1px solid #F5D6A0',marginBottom:'1rem'}}>
                <p style={{fontSize:'0.78rem',fontWeight:600,color:'#C4917C',marginBottom:'0.25rem'}}>{t('aviso')}</p>
                <p style={{fontSize:'0.75rem',fontWeight:300,color:'#888884',lineHeight:1.6}}>{planError}</p>
                <p style={{fontSize:'0.72rem',fontWeight:500,color:'#C4917C',marginTop:'0.5rem'}}>{t('avisoPremium')}</p>
              </div>
            )}

            <div style={{padding:'1.5rem 3rem 2.5rem',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <p style={{fontSize:'0.72rem',fontWeight:300,color:'#888884'}}>
                {planSeleccionado ? t('planSeleccionado').replace('{plan}', planesData[PLANES_BASE.findIndex(p=>p.id===planSeleccionado)]?.plan || planSeleccionado) : t('seleccionaPlan')}
              </p>
              <button onClick={handlePagar} disabled={!planSeleccionado||loading||!!planError}
                style={{padding:'0.9rem 2.5rem',fontSize:'0.78rem',fontWeight:500,background:planSeleccionado&&!planError?'#0A0A0A':'#E0E0DC',color:planSeleccionado&&!planError?'#FFFFFF':'#888884',border:'none',cursor:planSeleccionado&&!planError?'pointer':'not-allowed',fontFamily:'Poppins,sans-serif',letterSpacing:'0.03em',opacity:loading?0.6:1,borderRadius:'4px'}}>
                {loading ? t('procesando') : t('procederPago')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}