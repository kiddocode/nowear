'use client'
import { useState } from 'react'

const PLANES = [
  {
    key: 'basico',
    nombre: 'Básico',
    precio: '9€',
    descripcion: '1 mes antes',
    desc: 'El registro abre 1 mes antes del evento. Ideal para planificación corta.',
    features: ['Link único para invitadas', 'Detección de coincidencias', 'Prerreserva de looks', 'Colores bloqueados'],
    color: '#888884',
    bg: '#FFFFFF',
  },
  {
    key: 'estandar',
    nombre: 'Estándar',
    precio: '19€',
    descripcion: '3 meses antes',
    desc: 'El registro abre 3 meses antes del evento. Tiempo suficiente para todas.',
    features: ['Todo lo del plan Básico', 'Exportar lista de looks', 'Soporte prioritario por email'],
    color: '#8B9DC3',
    bg: '#EEF2F8',
    destacado: true,
  },
  {
    key: 'premium',
    nombre: 'Premium',
    precio: '29€',
    descripcion: 'Sin límite de tiempo',
    desc: 'El registro abre cuando quieras, sin límite de tiempo. Para las más organizadas.',
    features: ['Todo lo anterior', 'Acceso anticipado a nuevas funciones', 'Link de invitada personalizado'],
    color: '#C4917C',
    bg: '#F5EDE8',
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
          eventoData: evento ? { id: evento.id, nombre: evento.nombre, slug: evento.slug } : null,
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
              <div key={plan.key} style={{border: plan.destacado ? '2px solid #F07987' : '1px solid #E0E0DC',borderRadius:'12px',padding:'1.75rem',position:'relative',background: plan.destacado ? '#0A0A0A' : '#FFFFFF'}}>
                {plan.destacado && (
                  <div style={{position:'absolute',top:'-12px',left:'50%',transform:'translateX(-50%)',background:'#F07987',color:'#FFFFFF',fontSize:'0.55rem',fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase',padding:'0.25rem 0.75rem',borderRadius:'20px',whiteSpace:'nowrap'}}>
                    Más popular
                  </div>
                )}

                <div style={{fontSize:'0.6rem',fontWeight:700,letterSpacing:'0.15em',textTransform:'uppercase',color: plan.destacado ? 'rgba(255,255,255,0.5)' : plan.color,marginBottom:'0.25rem'}}>{plan.nombre}</div>
                <div style={{fontSize:'0.62rem',fontWeight:300,color: plan.destacado ? 'rgba(255,255,255,0.4)' : '#888884',marginBottom:'0.75rem',textTransform:'uppercase',letterSpacing:'0.08em'}}>{plan.descripcion}</div>
                <div style={{fontSize:'2.2rem',fontWeight:700,color: plan.destacado ? '#FFFFFF' : '#0A0A0A',letterSpacing:'-0.03em',lineHeight:1,marginBottom:'0.75rem'}}>{plan.precio}</div>
                <div style={{fontSize:'0.72rem',fontWeight:300,color: plan.destacado ? 'rgba(255,255,255,0.65)' : '#888884',marginBottom:'1.25rem',lineHeight:1.6}}>{plan.desc}</div>

                <div style={{width:'100%',height:'1px',background: plan.destacado ? 'rgba(255,255,255,0.1)' : '#E0E0DC',marginBottom:'1.25rem'}}></div>

                <div style={{display:'flex',flexDirection:'column',gap:'0.5rem',marginBottom:'1.75rem'}}>
                  {plan.features.map((f,i) => (
                    <div key={i} style={{display:'flex',alignItems:'flex-start',gap:'0.5rem',fontSize:'0.75rem',fontWeight:300,color: plan.destacado ? 'rgba(255,255,255,0.8)' : '#0A0A0A'}}>
                      <span style={{color: plan.destacado ? '#F07987' : plan.color,fontWeight:700,flexShrink:0,marginTop:'1px'}}>✓</span>
                      <span>{f}</span>
                    </div>
                  ))}
                </div>

                {esActual ? (
                  <div style={{width:'100%',padding:'0.8rem',fontSize:'0.72rem',fontWeight:600,textAlign:'center',background:'rgba(255,255,255,0.1)',color: plan.destacado ? 'rgba(255,255,255,0.5)' : '#888884',borderRadius:'6px',boxSizing:'border-box',border:'1px solid #E0E0DC'}}>
                    Plan actual
                  </div>
                ) : (
                  <button
                    onClick={() => handlePago(plan.key)}
                    disabled={!!cargando}
                    style={{width:'100%',padding:'0.8rem',fontSize:'0.72rem',fontWeight:700,letterSpacing:'0.08em',textTransform:'uppercase',background: plan.destacado ? '#F07987' : '#0A0A0A',color:'#FFFFFF',border:'none',cursor:cargando?'not-allowed':'pointer',fontFamily:'Poppins,sans-serif',borderRadius:'6px',opacity:cargando?0.7:1,boxSizing:'border-box',transition:'opacity 0.15s'}}>
                    {esCargando ? 'Redirigiendo...' : `Elegir ${plan.nombre}`}
                  </button>
                )}
              </div>
            )
          })}
        </div>

        {/* Enterprise */}
        <div style={{padding:'1.25rem 1.5rem',border:'2px dashed #C4C4C0',borderRadius:'12px',display:'flex',justifyContent:'space-between',alignItems:'center',gap:'1rem',flexWrap:'wrap',background:'#F7F7F5'}}>
          <div>
            <div style={{fontSize:'0.55rem',fontWeight:600,letterSpacing:'0.15em',textTransform:'uppercase',background:'#0A0A0A',color:'#FFFFFF',padding:'0.22rem 0.65rem',display:'inline-block',marginBottom:'0.5rem'}}>Enterprise</div>
            <div style={{fontSize:'0.82rem',fontWeight:400,color:'#0A0A0A',marginBottom:'0.25rem'}}>Solución personalizada para empresas y eventos recurrentes.</div>
            <div style={{display:'flex',flexDirection:'column',gap:'0.2rem',marginTop:'0.5rem'}}>
              {['Múltiples eventos','Cuenta de empresa','Tarifa anual','Desarrollo ad-hoc','Soporte dedicado'].map((f,i) => (
                <div key={i} style={{fontSize:'0.72rem',fontWeight:300,color:'#555552',display:'flex',alignItems:'center',gap:'0.4rem'}}>
                  <span style={{color:'#C4917C',fontWeight:700}}>✓</span> {f}
                </div>
              ))}
            </div>
          </div>
          <a href="mailto:support@nowear.es?subject=Plan Enterprise NOWEAR"
            style={{fontSize:'0.65rem',fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',padding:'0.7rem 1.5rem',background:'#0A0A0A',color:'#FFFFFF',textDecoration:'none',borderRadius:'6px',whiteSpace:'nowrap'}}>
            Contactar →
          </a>
        </div>

        <p style={{fontSize:'0.65rem',fontWeight:300,color:'#BEBEBA',textAlign:'center',marginTop:'1.5rem'}}>
          Pago seguro con Stripe. El plan se activa en cuanto se confirma el pago.
        </p>
      </div>
    </div>
  )
}