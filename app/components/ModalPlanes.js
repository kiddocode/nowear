'use client'
import { useState } from 'react'
import { useTranslations } from 'next-intl'

const PLANES_BASE = [
  { key: 'basico', precio: 9, color: '#888884' },
  { key: 'estandar', precio: 19, color: '#8B9DC3', destacado: true },
  { key: 'premium', precio: 29, color: '#C4917C' },
]

function getPlanNivel(planKey) {
  if (!planKey) return 0
  const p = planKey.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  if (p.includes('premium')) return 3
  if (p.includes('estandar') || p.includes('standard')) return 2
  if (p.includes('basico')) return 1
  return 0
}

function getPlanPrecio(planKey) {
  if (!planKey) return 0
  const p = planKey.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  if (p.includes('premium')) return 29
  if (p.includes('estandar') || p.includes('standard')) return 19
  if (p.includes('basico')) return 9
  return 0
}

export default function ModalPlanes({ onClose, planActual, evento }) {
  const t = useTranslations('modal')
  const tp = useTranslations('precios')
  const [cargando, setCargando] = useState(null)

  const nivelActual = getPlanNivel(planActual)
  const precioActual = getPlanPrecio(planActual)
  const planesData = tp.raw('planes')

  async function handlePago(planKey, precioDiferencia) {
    setCargando(planKey)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: planKey,
          planActual: planActual || null,
          eventoData: evento ? { id: evento.id, nombre: evento.nombre, slug: evento.slug } : null,
        })
      })
      const data = await res.json()
      if (data.url) { window.location.href = data.url }
      else { setCargando(null); alert(data.error || t('errorPago')) }
    } catch (e) { setCargando(null); alert(t('errorConexion')) }
  }

  return (
    <div style={{position:'fixed',inset:0,background:'rgba(10,10,10,0.7)',zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center',padding:'1rem'}}
      onClick={e => e.target === e.currentTarget && onClose()}>

      <div className="planes-modal-inner" style={{background:'#FFFFFF',borderRadius:'16px',width:'100%',maxWidth:'820px',maxHeight:'90vh',overflowY:'auto',padding:'2.5rem',position:'relative',boxSizing:'border-box'}}>
        <button onClick={onClose} style={{position:'absolute',top:'1.25rem',right:'1.25rem',background:'none',border:'none',cursor:'pointer',fontSize:'1.4rem',color:'#888884',fontFamily:'Poppins,sans-serif',lineHeight:1,padding:'0.25rem'}}>×</button>

        <h2 style={{fontSize:'clamp(1.2rem,4vw,1.6rem)',fontWeight:700,color:'#0A0A0A',letterSpacing:'-0.025em',marginBottom:'0.35rem'}}>{t('titulo')}</h2>
        <p style={{fontSize:'0.78rem',fontWeight:300,color:'#888884',marginBottom:'1.5rem'}}>{t('subtitulo')}</p>

        <div className="planes-grid-inner" style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'1.25rem',marginBottom:'1.5rem'}}>
          {PLANES_BASE.map((planBase, idx) => {
            const plan = { ...planBase, ...planesData[idx] }
            const nivelPlan = getPlanNivel(plan.key)
            const esActual = nivelPlan === nivelActual && !!planActual
            const esInferior = nivelPlan < nivelActual
            const esCargando = cargando === plan.key
            const diferencia = Math.max(plan.precio - precioActual, 0)
            const esMejora = precioActual > 0 && nivelPlan > nivelActual

            return (
              <div key={plan.key} style={{border: plan.destacado ? '2px solid #F07987' : '1px solid #E0E0DC',borderRadius:'12px',padding:'1.5rem',position:'relative',background: plan.destacado ? '#0A0A0A' : '#FFFFFF',opacity: esInferior ? 0.5 : 1,boxSizing:'border-box'}}>
                {plan.destacado && (
                  <div style={{position:'absolute',top:'-12px',left:'50%',transform:'translateX(-50%)',background:'#F07987',color:'#FFFFFF',fontSize:'0.55rem',fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase',padding:'0.25rem 0.75rem',borderRadius:'20px',whiteSpace:'nowrap'}}>
                    {t('masPopular')}
                  </div>
                )}
                <div style={{fontSize:'0.6rem',fontWeight:700,letterSpacing:'0.15em',textTransform:'uppercase',color: plan.destacado ? 'rgba(255,255,255,0.5)' : plan.color,marginBottom:'0.25rem'}}>{plan.plan}</div>
                <div style={{fontSize:'0.62rem',fontWeight:300,color: plan.destacado ? 'rgba(255,255,255,0.4)' : '#888884',marginBottom:'0.75rem',textTransform:'uppercase',letterSpacing:'0.08em'}}>{plan.sub}</div>
                <div style={{marginBottom:'0.25rem'}}>
                  <span style={{fontSize:'clamp(1.6rem,3vw,2.2rem)',fontWeight:700,color: plan.destacado ? '#FFFFFF' : '#0A0A0A',letterSpacing:'-0.03em',lineHeight:1}}>
                    {esMejora ? `${diferencia}€` : `${plan.precio}€`}
                  </span>
                  {esMejora && <span style={{fontSize:'0.72rem',fontWeight:300,color: plan.destacado ? 'rgba(255,255,255,0.5)' : '#888884',marginLeft:'0.5rem'}}>({t('diferencia')})</span>}
                </div>
                {esMejora && <div style={{fontSize:'0.65rem',fontWeight:300,color: plan.destacado ? 'rgba(255,255,255,0.4)' : '#BEBEBA',marginBottom:'0.5rem',textDecoration:'line-through'}}>{t('precioCompleto')}: {plan.precio}€</div>}
                <div style={{fontSize:'0.72rem',fontWeight:300,color: plan.destacado ? 'rgba(255,255,255,0.65)' : '#888884',marginBottom:'1rem',lineHeight:1.6}}>{plan.desc}</div>
                <div style={{width:'100%',height:'1px',background: plan.destacado ? 'rgba(255,255,255,0.1)' : '#E0E0DC',marginBottom:'1rem'}}></div>
                <div style={{display:'flex',flexDirection:'column',gap:'0.4rem',marginBottom:'1.5rem'}}>
                  {plan.feats.map((f,i) => (
                    <div key={i} style={{display:'flex',alignItems:'flex-start',gap:'0.5rem',fontSize:'0.72rem',fontWeight:i===0&&plan.key==='premium'?600:300,color: plan.destacado ? 'rgba(255,255,255,0.8)' : '#0A0A0A',background:i===0&&plan.key==='premium'?'rgba(196,145,124,0.12)':'transparent',padding:i===0&&plan.key==='premium'?'0.35rem 0.5rem':'0',borderRadius:i===0&&plan.key==='premium'?'4px':'0',border:i===0&&plan.key==='premium'?'1px solid rgba(196,145,124,0.3)':'none'}}>
                      <span style={{color:i===0&&plan.key==='premium'?'#C4917C': plan.destacado ? '#F07987' : plan.color,fontWeight:700,flexShrink:0,marginTop:'1px'}}>✓</span>
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
                {esActual ? (
                  <div style={{width:'100%',padding:'0.75rem',fontSize:'0.72rem',fontWeight:600,textAlign:'center',background: plan.destacado ? 'rgba(255,255,255,0.1)' : '#F0F0EE',color: plan.destacado ? 'rgba(255,255,255,0.5)' : '#888884',borderRadius:'6px',boxSizing:'border-box',border:'1px solid #E0E0DC'}}>
                    {t('planActual')}
                  </div>
                ) : esInferior ? (
                  <div style={{width:'100%',padding:'0.75rem',fontSize:'0.72rem',fontWeight:500,textAlign:'center',background:'#F0F0EE',color:'#BEBEBA',borderRadius:'6px',boxSizing:'border-box'}}>
                    {t('noDisponible')}
                  </div>
                ) : !evento ? (
                  <div style={{width:'100%',padding:'0.75rem',fontSize:'0.72rem',fontWeight:500,textAlign:'center',background:'#F5EDE8',color:'#C4917C',borderRadius:'6px',boxSizing:'border-box',lineHeight:1.5}}>
                    {t('entraAlEvento')}
                  </div>
                ) : (
                  <button onClick={() => handlePago(plan.key, diferencia)} disabled={!!cargando}
                    style={{width:'100%',padding:'0.75rem',fontSize:'0.72rem',fontWeight:700,letterSpacing:'0.08em',textTransform:'uppercase',background: plan.destacado ? '#F07987' : '#0A0A0A',color:'#FFFFFF',border:'none',cursor:cargando?'not-allowed':'pointer',fontFamily:'Poppins,sans-serif',borderRadius:'6px',opacity:cargando?0.7:1,boxSizing:'border-box',transition:'opacity 0.15s'}}>
                    {esCargando ? t('redirigiendo') : esMejora ? `${t('mejorarPor')} ${diferencia}€` : `${t('elegir')} ${plan.plan}`}
                  </button>
                )}
              </div>
            )
          })}
        </div>

        <div className="planes-enterprise-row" style={{padding:'1.25rem',border:'2px dashed #C4C4C0',borderRadius:'12px',display:'flex',justifyContent:'space-between',alignItems:'center',gap:'1rem',flexWrap:'wrap',background:'#F7F7F5',marginBottom:'1.5rem'}}>
          <div>
            <div style={{fontSize:'0.55rem',fontWeight:600,letterSpacing:'0.15em',textTransform:'uppercase',background:'#0A0A0A',color:'#FFFFFF',padding:'0.22rem 0.65rem',display:'inline-block',marginBottom:'0.5rem'}}>{t('enterprise')}</div>
            <div style={{fontSize:'0.82rem',fontWeight:400,color:'#0A0A0A',marginBottom:'0.25rem'}}>{t('enterpriseDesc')}</div>
            <div style={{display:'flex',flexWrap:'wrap',gap:'0.75rem',marginTop:'0.5rem'}}>
              {['Formulario a medida','Paquetes recurrentes','Multi-organizador','Soporte dedicado'].map((f,i) => (
                <div key={i} style={{fontSize:'0.72rem',fontWeight:300,color:'#555552',display:'flex',alignItems:'center',gap:'0.4rem'}}>
                  <span style={{color:'#C4917C',fontWeight:700}}>✓</span> {f}
                </div>
              ))}
            </div>
          </div>
          <a href="mailto:support@nowear.es?subject=Plan Enterprise NOWEAR"
            style={{fontSize:'0.65rem',fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',padding:'0.7rem 1.5rem',background:'#0A0A0A',color:'#FFFFFF',textDecoration:'none',borderRadius:'6px',whiteSpace:'nowrap',flexShrink:0}}>
            {t('contactar')}
          </a>
        </div>

        <div style={{padding:'1rem 1.25rem',background:'#F7F7F5',border:'1px solid #E0E0DC',borderRadius:'8px'}}>
          <p style={{fontSize:'0.65rem',fontWeight:300,color:'#888884',lineHeight:1.7,margin:0}}>
            {t('avisoLegal')} <a href="/terminos" style={{color:'#C4917C',textDecoration:'underline'}}>{t('terminosLink')}</a>.
          </p>
        </div>
      </div>
    </div>
  )
}