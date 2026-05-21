'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

const PLANES = [
  {
    id: 'basico',
    precio: '9€',
    nombre: 'Básico',
    duracion: '1 mes',
    descripcion: 'Perfecto para eventos próximos',
    features: ['1 evento activo', 'Hasta 50 invitadas', 'Link único', 'Detección de conflictos']
  },
  {
    id: 'estandar',
    precio: '19€',
    nombre: 'Estándar',
    duracion: '3 meses',
    descripcion: 'El más popular',
    popular: true,
    features: ['1 evento activo', 'Hasta 150 invitadas', 'Link único', 'Detección de conflictos', 'Exportar lista']
  },
  {
    id: 'premium',
    precio: '29€',
    nombre: 'Premium',
    duracion: 'Sin límite de tiempo',
    descripcion: 'Para eventos con mucha antelación',
    features: ['1 evento activo', 'Invitadas ilimitadas', 'Link único', 'Detección de conflictos', 'Exportar lista', 'Soporte prioritario']
  }
]

export default function NuevoEvento() {
  const router = useRouter()
  const [tipo, setTipo] = useState('')
  const [nombre, setNombre] = useState('')
  const [fecha, setFecha] = useState('')
  const [lugar, setLugar] = useState('')
  const [numInvitadas, setNumInvitadas] = useState('')
  const [coloresBloqueados, setColoresBloqueados] = useState('')
  const [error, setError] = useState('')
  const [showPlanes, setShowPlanes] = useState(false)
  const [planSeleccionado, setPlanSeleccionado] = useState(null)
  const [loading, setLoading] = useState(false)

  function handleContinuar() {
    setError('')
    if (!tipo || !nombre || !fecha || !lugar) {
      setError('Rellena todos los campos obligatorios')
      return
    }
    setShowPlanes(true)
  }

  async function handlePagar() {
    if (!planSeleccionado) return
    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    const slug = slugify(nombre) + '-' + Date.now().toString().slice(-4)

    const { error } = await supabase.from('eventos').insert({
      organizadora_id: user.id,
      slug,
      nombre,
      tipo,
      fecha,
      lugar,
      num_invitadas: numInvitadas ? parseInt(numInvitadas) : null,
      colores_bloqueados: coloresBloqueados || null,
      plan: planSeleccionado
    })

    setLoading(false)
    if (error) {
      setError('Error al crear el evento. Inténtalo de nuevo.')
      setShowPlanes(false)
      return
    }
    router.push('/dashboard')
  }

  return (
    <div style={{display:'grid',gridTemplateColumns:'220px 1fr',minHeight:'calc(100vh - 68px)'}}>

      {/* SIDEBAR */}
      <aside style={{borderRight:'1px solid #E0E0DC',padding:'2rem 0',display:'flex',flexDirection:'column',background:'#FFFFFF',position:'sticky',top:'68px',height:'calc(100vh - 68px)'}}>
        <div style={{marginBottom:'1.5rem'}}>
          <div style={{fontSize:'0.55rem',fontWeight:600,letterSpacing:'0.2em',textTransform:'uppercase',color:'#BEBEBA',padding:'0 1.5rem',marginBottom:'0.5rem'}}>Principal</div>
          <a href="/dashboard" style={{display:'flex',alignItems:'center',gap:'0.65rem',padding:'0.7rem 1.5rem',fontSize:'0.75rem',fontWeight:300,color:'#888884',textDecoration:'none'}}>
            <span style={{width:'5px',height:'5px',borderRadius:'50%',background:'currentColor',flexShrink:0,opacity:0.4}}></span>Mis eventos
          </a>
          <a href="/dashboard/nuevo" style={{display:'flex',alignItems:'center',gap:'0.65rem',padding:'0.7rem 1.5rem',fontSize:'0.75rem',fontWeight:500,color:'#0A0A0A',background:'#F0F0EE',borderLeft:'2px solid #0A0A0A',textDecoration:'none'}}>
            <span style={{width:'5px',height:'5px',borderRadius:'50%',background:'#0A0A0A',flexShrink:0}}></span>Nuevo evento
          </a>
        </div>
        <div style={{marginBottom:'1.5rem'}}>
          <div style={{fontSize:'0.55rem',fontWeight:600,letterSpacing:'0.2em',textTransform:'uppercase',color:'#BEBEBA',padding:'0 1.5rem',marginBottom:'0.5rem'}}>Cuenta</div>
          {['Perfil','Facturación','Ayuda'].map((item,i) => (
            <a key={i} href="#" style={{display:'flex',alignItems:'center',gap:'0.65rem',padding:'0.7rem 1.5rem',fontSize:'0.75rem',fontWeight:300,color:'#888884',textDecoration:'none'}}>
              <span style={{width:'5px',height:'5px',borderRadius:'50%',background:'currentColor',flexShrink:0,opacity:0.4}}></span>{item}
            </a>
          ))}
        </div>
      </aside>

      {/* MAIN */}
      <main className="nuevo-grid" style={{display:'grid',gridTemplateColumns:'1fr 1fr',minHeight:'calc(100vh - 68px)'}}>

        {/* FORMULARIO */}
        <div className="nuevo-form" style={{padding:'3rem',borderRight:'1px solid #E0E0DC'}}>
          <div style={{marginBottom:'2.5rem',paddingBottom:'2rem',borderBottom:'1px solid #E0E0DC'}}>
            <h1 style={{fontSize:'2.2rem',fontWeight:200,color:'#0A0A0A',letterSpacing:'-0.025em',lineHeight:1,marginBottom:'0.35rem'}}>Nuevo evento</h1>
            <p style={{fontSize:'0.75rem',fontWeight:300,color:'#888884'}}>Configura tu evento y elige tu plan</p>
          </div>

          <div style={{marginBottom:'1.25rem'}}>
            <label style={{display:'block',fontSize:'0.6rem',fontWeight:600,letterSpacing:'0.12em',textTransform:'uppercase',color:'#888884',marginBottom:'0.55rem'}}>
              Tipo de evento <span style={{color:'#C4917C'}}>*</span>
            </label>
            <select
              value={tipo}
              onChange={e => setTipo(e.target.value)}
              style={{width:'100%',fontFamily:'Poppins,sans-serif',fontSize:'0.82rem',fontWeight:300,padding:'0.9rem 1rem',border:'1px solid #E0E0DC',background:'#FFFFFF',outline:'none',cursor:'pointer',appearance:'none',backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23888884' stroke-width='1.5' fill='none'/%3E%3C/svg%3E")`,backgroundRepeat:'no-repeat',backgroundPosition:'right 1rem center',boxSizing:'border-box'}}
            >
              <option value="">Selecciona el tipo...</option>
              <option>Boda</option>
              <option>Bautizo</option>
              <option>Comunión</option>
              <option>Pedida de mano</option>
              <option>Cumpleaños</option>
              <option>Cena de empresa</option>
              <option>Otro</option>
            </select>
          </div>

          <div style={{marginBottom:'1.25rem'}}>
            <label style={{display:'block',fontSize:'0.6rem',fontWeight:600,letterSpacing:'0.12em',textTransform:'uppercase',color:'#888884',marginBottom:'0.55rem'}}>
              Nombre del evento <span style={{color:'#C4917C'}}>*</span>
            </label>
            <input
              type="text"
              placeholder="Ej: Boda de Ana & Carlos"
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              style={{width:'100%',fontFamily:'Poppins,sans-serif',fontSize:'0.82rem',fontWeight:300,padding:'0.9rem 1rem',border:'1px solid #E0E0DC',background:'#FFFFFF',outline:'none',boxSizing:'border-box'}}
            />
          </div>

          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem',marginBottom:'1.25rem'}}>
            <div>
              <label style={{display:'block',fontSize:'0.6rem',fontWeight:600,letterSpacing:'0.12em',textTransform:'uppercase',color:'#888884',marginBottom:'0.55rem'}}>
                Fecha <span style={{color:'#C4917C'}}>*</span>
              </label>
              <input
                type="date"
                value={fecha}
                onChange={e => setFecha(e.target.value)}
                style={{width:'100%',fontFamily:'Poppins,sans-serif',fontSize:'0.82rem',fontWeight:300,padding:'0.9rem 1rem',border:'1px solid #E0E0DC',background:'#FFFFFF',outline:'none',boxSizing:'border-box'}}
              />
            </div>
            <div>
              <label style={{display:'block',fontSize:'0.6rem',fontWeight:600,letterSpacing:'0.12em',textTransform:'uppercase',color:'#888884',marginBottom:'0.55rem'}}>
                Lugar <span style={{color:'#C4917C'}}>*</span>
              </label>
              <input
                type="text"
                placeholder="Ciudad o venue"
                value={lugar}
                onChange={e => setLugar(e.target.value)}
                style={{width:'100%',fontFamily:'Poppins,sans-serif',fontSize:'0.82rem',fontWeight:300,padding:'0.9rem 1rem',border:'1px solid #E0E0DC',background:'#FFFFFF',outline:'none',boxSizing:'border-box'}}
              />
            </div>
          </div>

          <div style={{marginBottom:'1.25rem'}}>
            <label style={{display:'block',fontSize:'0.6rem',fontWeight:600,letterSpacing:'0.12em',textTransform:'uppercase',color:'#888884',marginBottom:'0.55rem'}}>
              Número de invitadas
            </label>
            <input
              type="number"
              placeholder="Aproximado"
              value={numInvitadas}
              onChange={e => setNumInvitadas(e.target.value)}
              style={{width:'100%',fontFamily:'Poppins,sans-serif',fontSize:'0.82rem',fontWeight:300,padding:'0.9rem 1rem',border:'1px solid #E0E0DC',background:'#FFFFFF',outline:'none',boxSizing:'border-box'}}
            />
          </div>

          <div style={{marginBottom:'2.5rem'}}>
            <label style={{display:'block',fontSize:'0.6rem',fontWeight:600,letterSpacing:'0.12em',textTransform:'uppercase',color:'#888884',marginBottom:'0.25rem'}}>
              Colores bloqueados <span style={{fontSize:'0.58rem',fontWeight:300,color:'#BEBEBA',textTransform:'none',letterSpacing:0}}>opcional</span>
            </label>
            <p style={{fontSize:'0.72rem',fontWeight:300,color:'#BEBEBA',marginBottom:'0.75rem',lineHeight:1.6}}>
              Colores que ninguna invitada podrá registrar.
            </p>
            <input
              type="text"
              placeholder="Ej: blanco, crudo, verde botella..."
              value={coloresBloqueados}
              onChange={e => setColoresBloqueados(e.target.value)}
              style={{width:'100%',fontFamily:'Poppins,sans-serif',fontSize:'0.82rem',fontWeight:300,padding:'0.9rem 1rem',border:'1px solid #E0E0DC',background:'#FFFFFF',outline:'none',boxSizing:'border-box'}}
            />
          </div>

          {error && (
            <p style={{fontSize:'0.72rem',fontWeight:300,color:'#C4917C',marginBottom:'1rem'}}>{error}</p>
          )}

          <button
            onClick={handleContinuar}
            style={{padding:'0.9rem 2.5rem',fontSize:'0.78rem',fontWeight:500,background:'#0A0A0A',color:'#FFFFFF',border:'none',cursor:'pointer',fontFamily:'Poppins,sans-serif',letterSpacing:'0.03em'}}
          >
            Continuar y elegir plan →
          </button>
        </div>

        {/* IMAGEN LATERAL */}
        <div className="nuevo-img" style={{position:'relative',overflow:'hidden'}}>
          <img
            src="https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=900&q=80"
            alt="Evento"
            style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}}
          />
          <div style={{position:'absolute',inset:0,background:'linear-gradient(to top,rgba(10,10,10,0.75) 0%,rgba(10,10,10,0.1) 60%)',display:'flex',flexDirection:'column',justifyContent:'flex-end',padding:'3rem'}}>
            <p style={{fontSize:'1.3rem',fontWeight:200,color:'#FFFFFF',lineHeight:1.5,letterSpacing:'-0.01em',marginBottom:'1.5rem'}}>
              Cada evento merece<br/>
              <em style={{fontStyle:'italic',color:'#C4917C'}}>su propio vestidor.</em>
            </p>
            <div style={{display:'flex',flexDirection:'column',gap:'0.75rem'}}>
              {['Un link único para tus invitadas','Detección de coincidencias automática','Prerreserva de looks antes de comprar'].map((item,i) => (
                <div key={i} style={{display:'flex',alignItems:'center',gap:'0.75rem',fontSize:'0.75rem',fontWeight:300,color:'rgba(255,255,255,0.7)'}}>
                  <span style={{width:'4px',height:'4px',borderRadius:'50%',background:'#C4917C',flexShrink:0}}></span>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* POP-UP PLANES */}
      {showPlanes && (
        <div style={{position:'fixed',inset:0,background:'rgba(10,10,10,0.7)',zIndex:2000,display:'flex',alignItems:'center',justifyContent:'center',padding:'1.5rem'}}>
          <div style={{background:'#FFFFFF',maxWidth:'860px',width:'100%',maxHeight:'90vh',overflowY:'auto'}}>

            {/* HEADER */}
            <div style={{padding:'2.5rem 3rem 2rem',borderBottom:'1px solid #E0E0DC',display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
              <div>
                <h2 style={{fontSize:'1.8rem',fontWeight:200,color:'#0A0A0A',letterSpacing:'-0.02em',marginBottom:'0.3rem'}}>Elige tu plan</h2>
                <p style={{fontSize:'0.75rem',fontWeight:300,color:'#888884'}}>Pago único por evento. Sin suscripciones.</p>
              </div>
              <button
                onClick={() => setShowPlanes(false)}
                style={{background:'none',border:'none',fontSize:'1.2rem',cursor:'pointer',color:'#888884',padding:'0.25rem',lineHeight:1}}
              >✕</button>
            </div>

            {/* PLANES */}
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'1px',background:'#E0E0DC',margin:'2rem 3rem'}}>
              {PLANES.map(plan => (
                <div
                  key={plan.id}
                  onClick={() => setPlanSeleccionado(plan.id)}
                  style={{background: planSeleccionado === plan.id ? '#0A0A0A' : '#FFFFFF',padding:'2rem',cursor:'pointer',position:'relative',transition:'background 0.15s'}}
                >
                  {plan.popular && (
                    <div style={{position:'absolute',top:'1rem',right:'1rem',fontSize:'0.52rem',fontWeight:600,letterSpacing:'0.1em',textTransform:'uppercase',background:'#C4917C',color:'#FFFFFF',padding:'0.2rem 0.5rem'}}>
                      Popular
                    </div>
                  )}
                  <div style={{fontSize:'2rem',fontWeight:100,color: planSeleccionado === plan.id ? '#FFFFFF' : '#0A0A0A',letterSpacing:'-0.03em',lineHeight:1,marginBottom:'0.25rem'}}>
                    {plan.precio}
                  </div>
                  <div style={{fontSize:'0.62rem',fontWeight:600,letterSpacing:'0.12em',textTransform:'uppercase',color: planSeleccionado === plan.id ? '#C4917C' : '#888884',marginBottom:'0.25rem'}}>
                    {plan.duracion}
                  </div>
                  <div style={{fontSize:'0.85rem',fontWeight:300,color: planSeleccionado === plan.id ? '#FFFFFF' : '#0A0A0A',marginBottom:'1.5rem'}}>
                    {plan.nombre}
                  </div>
                  <div style={{display:'flex',flexDirection:'column',gap:'0.5rem'}}>
                    {plan.features.map((f,i) => (
                      <div key={i} style={{display:'flex',alignItems:'center',gap:'0.6rem',fontSize:'0.72rem',fontWeight:300,color: planSeleccionado === plan.id ? 'rgba(255,255,255,0.75)' : '#888884'}}>
                        <span style={{width:'4px',height:'4px',borderRadius:'50%',background: planSeleccionado === plan.id ? '#C4917C' : '#BEBEBA',flexShrink:0}}></span>
                        {f}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* FOOTER */}
            <div style={{padding:'1.5rem 3rem 2.5rem',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <p style={{fontSize:'0.72rem',fontWeight:300,color:'#888884'}}>
                {planSeleccionado ? `Plan ${PLANES.find(p=>p.id===planSeleccionado)?.nombre} seleccionado` : 'Selecciona un plan para continuar'}
              </p>
              <button
                onClick={handlePagar}
                disabled={!planSeleccionado || loading}
                style={{padding:'0.9rem 2.5rem',fontSize:'0.78rem',fontWeight:500,background: planSeleccionado ? '#0A0A0A' : '#E0E0DC',color: planSeleccionado ? '#FFFFFF' : '#888884',border:'none',cursor: planSeleccionado ? 'pointer' : 'not-allowed',fontFamily:'Poppins,sans-serif',letterSpacing:'0.03em',opacity: loading ? 0.6 : 1}}
              >
                {loading ? 'Creando evento...' : 'Proceder al pago →'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}