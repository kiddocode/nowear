'use client'
import { useState } from 'react'

const PLANES = [
  {
    key: 'basico',
    nombre: 'Básico',
    precio: '9€',
    descripcion: '1 mes antes del evento',
    features: [
      'Hasta 50 invitadas',
      'Link único del evento',
      'Detección de conflictos',
      'Emails automáticos',
    ],
    color: '#888884',
    bg: '#F0F0EE',
  },
  {
    key: 'estandar',
    nombre: 'Estándar',
    precio: '19€',
    descripcion: '3 meses antes del evento',
    features: [
      'Hasta 150 invitadas',
      'Link único del evento',
      'Detección de conflictos',
      'Emails automáticos',
      'Exportar lista CSV',
    ],
    color: '#8B9DC3',
    bg: '#EEF2F8',
  },
  {
    key: 'premium',
    nombre: 'Premium',
    precio: '29€',
    descripcion: 'Sin límite de tiempo',
    features: [
      'Invitadas ilimitadas',
      'Link único del evento',
      'Detección de conflictos',
      'Emails automáticos',
      'Exportar lista CSV',
      'Foto personalizada del evento',
      'Mensaje para invitadas',
    ],
    color: '#C4917C',
    bg: '#F5EDE8',
    destacado: true,
  },
]

export default function ModalPlanes({ onClose, planActual, evento }) {
  const [cargando, setCargando] = useState(null)

  async function handlePago(planKey) {
    setCargando(planKey)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: planKey,
          eventoData: evento ? {
            id: evento.id,
            nombre: evento.nombre,
            slug: evento.slug,
          } : null,
        })
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setCargando(null)
        alert('Error al iniciar el pago. Inténtalo de nuevo.')
      }
    } catch (e) {
      setCargando(null)
      alert('Error al conectar con el servidor de pagos.')
    }
  }

  return (
    <div
      style={{position:'fixed',inset:0,background:'rgba(10,10,10,0.7)',zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center',padding:'1rem'}}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div style={{background:'#FFFFFF',borderRadius:'16px',width:'100%',maxWidth:'800px',maxHeight:'90vh',overflowY:'auto',padding:'2.5rem',position:'relative'}}>

        <button onClick={onClose}
          style={{position:'absolute',top:'1.25rem',right:'1.25rem',background:'none',border:'none',cursor:'pointer',fontSize:'1.4rem',color:'#888884',fontFamily:'Poppins,sans-serif',lineHeight:1,padding:'0.25rem'}}>
          ×
        </button>

        <h2 style={{fontSize:'1.6rem',fontWeight:700,color:'#0A0A0A',letterSpacing:'-0.025em',marginBottom:'0.35rem'}}>Elige tu plan</h2>
        <p style={{fontSize:'0.78rem',fontWeight:300,color:'#888884',marginBottom:'2rem'}}>Pago único por evento, sin suscripciones.</p>

        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'1.25rem',marginBottom:'1.5rem'}}>
          {PLANES.map(plan => {
            const esActual = planActual && planActual.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').includes(plan.key)
            const esCargando = cargando === plan.key

            return (
              <div key={plan.key} style={{border: plan.destacado ? `2px solid ${plan.color}` : '1px solid #E0E0DC',borderRadius:'12px',padding:'1.75rem',position:'relative',background: plan.destacado ? plan.bg : '#FFFFFF'}}>
                {plan.destacado && (
                  <div style={{position:'absolute',top:'-12px',left:'50%',transform:'translateX(-50%)',background:plan.color,color:'#FFFFFF',fontSize:'0.55rem',fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase',padding:'0.25rem 0.75rem',borderRadius:'20px',whiteSpace:'nowrap'}}>
                    Más popular
                  </div>
                )}

                <div style={{fontSize:'0.6rem',fontWeight:700,letterSpacing:'0.15em',textTransform:'uppercase',color:plan.color,marginBottom:'0.5rem'}}>{plan.nombre}</div>
                <div style={{fontSize:'2.2rem',fontWeight:700,color:'#0A0A0A',letterSpacing:'-0.03em',lineHeight:1,marginBottom:'0.25rem'}}>{plan.precio}</div>
                <div style={{fontSize:'0.72rem',fontWeight:300,color:'#888884',marginBottom:'1.5rem'}}>{plan.descripcion}</div>

                <div style={{display:'flex',flexDirection:'column',gap:'0.5rem',marginBottom:'1.75rem'}}>
                  {plan.features.map((f,i) => (
                    <div key={i} style={{display:'flex',alignItems:'flex-start',gap:'0.5rem',fontSize:'0.75rem',fontWeight:300,color:'#0A0A0A'}}>
                      <span style={{color:plan.color,fontWeight:700,flexShrink:0,marginTop:'1px'}}>✓</span>
                      <span>{f}</span>
                    </div>
                  ))}
                </div>

                {esActual ? (
                  <div style={{width:'100%',padding:'0.8rem',fontSize:'0.72rem',fontWeight:600,textAlign:'center',background:'#F0F0EE',color:'#888884',borderRadius:'6px',boxSizing:'border-box'}}>
                    Plan actual
                  </div>
                ) : (
                  <button
                    onClick={() => handlePago(plan.key)}
                    disabled={!!cargando}
                    style={{width:'100%',padding:'0.8rem',fontSize:'0.72rem',fontWeight:700,letterSpacing:'0.08em',textTransform:'uppercase',background: plan.destacado ? plan.color : '#0A0A0A',color:'#FFFFFF',border:'none',cursor:cargando?'not-allowed':'pointer',fontFamily:'Poppins,sans-serif',borderRadius:'6px',opacity:cargando?0.7:1,boxSizing:'border-box',transition:'opacity 0.15s'}}>
                    {esCargando ? 'Redirigiendo...' : `Elegir ${plan.nombre}`}
                  </button>
                )}
              </div>
            )
          })}
        </div>

        {/* Enterprise */}
        <div style={{padding:'1.25rem 1.5rem',border:'1px solid #E0E0DC',borderRadius:'12px',display:'flex',justifyContent:'space-between',alignItems:'center',gap:'1rem',flexWrap:'wrap',background:'#FAFAFA'}}>
          <div>
            <div style={{fontSize:'0.6rem',fontWeight:700,letterSpacing:'0.15em',textTransform:'uppercase',color:'#F07987',marginBottom:'0.25rem'}}>Enterprise</div>
            <div style={{fontSize:'0.82rem',fontWeight:400,color:'#0A0A0A'}}>Múltiples eventos, varios organizadores, soporte dedicado.</div>
            <div style={{fontSize:'0.72rem',fontWeight:300,color:'#888884'}}>Precio a medida según necesidades.</div>
          </div>
          <a href="mailto:support@nowear.es?subject=Plan Enterprise NOWEAR"
            style={{fontSize:'0.65rem',fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',padding:'0.7rem 1.5rem',background:'#F07987',color:'#FFFFFF',textDecoration:'none',borderRadius:'6px',whiteSpace:'nowrap'}}>
            Contactar
          </a>
        </div>

        <p style={{fontSize:'0.65rem',fontWeight:300,color:'#BEBEBA',textAlign:'center',marginTop:'1.5rem'}}>
          Pago seguro con Stripe. El plan se activa en cuanto se confirma el pago.
        </p>
      </div>
    </div>
  )
}