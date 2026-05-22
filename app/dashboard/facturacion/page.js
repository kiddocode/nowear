'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function Facturacion() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [eventos, setEventos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function cargar() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setUser(user)
      const { data: evs } = await supabase.from('eventos').select('*').eq('organizadora_id', user.id).order('created_at', { ascending: false })
      setEventos(evs || [])
      setLoading(false)
    }
    cargar()
  }, [])

  const PRECIOS = { basico: 9, estandar: 19, premium: 29 }

  if (loading) return <div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'calc(100vh - 68px)',fontSize:'0.75rem',color:'#888884'}}>Cargando...</div>

  return (
    <div style={{display:'grid',gridTemplateColumns:'220px 1fr',minHeight:'calc(100vh - 68px)'}}>
      <aside style={{borderRight:'1px solid #E0E0DC',padding:'2rem 0',display:'flex',flexDirection:'column',background:'#FFFFFF',position:'sticky',top:'68px',height:'calc(100vh - 68px)'}}>
        <div style={{marginBottom:'1.5rem'}}>
          <div style={{fontSize:'0.55rem',fontWeight:600,letterSpacing:'0.2em',textTransform:'uppercase',color:'#BEBEBA',padding:'0 1.5rem',marginBottom:'0.5rem'}}>Principal</div>
          <a href="/dashboard" style={{display:'flex',alignItems:'center',gap:'0.65rem',padding:'0.7rem 1.5rem',fontSize:'0.75rem',fontWeight:300,color:'#888884',textDecoration:'none'}}>
            <span style={{width:'5px',height:'5px',borderRadius:'50%',background:'currentColor',flexShrink:0,opacity:0.4}}></span>Mis eventos
          </a>
          <a href="/dashboard/nuevo" style={{display:'flex',alignItems:'center',gap:'0.65rem',padding:'0.7rem 1.5rem',fontSize:'0.75rem',fontWeight:300,color:'#888884',textDecoration:'none'}}>
            <span style={{width:'5px',height:'5px',borderRadius:'50%',background:'currentColor',flexShrink:0,opacity:0.4}}></span>Nuevo evento
          </a>
        </div>
        <div style={{marginBottom:'1.5rem'}}>
          <div style={{fontSize:'0.55rem',fontWeight:600,letterSpacing:'0.2em',textTransform:'uppercase',color:'#BEBEBA',padding:'0 1.5rem',marginBottom:'0.5rem'}}>Cuenta</div>
          <a href="/dashboard/perfil" style={{display:'flex',alignItems:'center',gap:'0.65rem',padding:'0.7rem 1.5rem',fontSize:'0.75rem',fontWeight:300,color:'#888884',textDecoration:'none'}}>
            <span style={{width:'5px',height:'5px',borderRadius:'50%',background:'currentColor',flexShrink:0,opacity:0.4}}></span>Perfil
          </a>
          <a href="/dashboard/facturacion" style={{display:'flex',alignItems:'center',gap:'0.65rem',padding:'0.7rem 1.5rem',fontSize:'0.75rem',fontWeight:500,color:'#0A0A0A',background:'#F0F0EE',borderLeft:'2px solid #0A0A0A',textDecoration:'none'}}>
            <span style={{width:'5px',height:'5px',borderRadius:'50%',background:'#0A0A0A',flexShrink:0}}></span>Facturación
          </a>
          <a href="/dashboard/ayuda" style={{display:'flex',alignItems:'center',gap:'0.65rem',padding:'0.7rem 1.5rem',fontSize:'0.75rem',fontWeight:300,color:'#888884',textDecoration:'none'}}>
            <span style={{width:'5px',height:'5px',borderRadius:'50%',background:'currentColor',flexShrink:0,opacity:0.4}}></span>Ayuda
          </a>
          <button onClick={async () => { await supabase.auth.signOut(); router.push('/') }} style={{display:'flex',alignItems:'center',gap:'0.65rem',padding:'0.7rem 1.5rem',fontSize:'0.75rem',fontWeight:300,color:'#888884',background:'none',border:'none',cursor:'pointer',fontFamily:'Poppins,sans-serif',width:'100%',textAlign:'left'}}>
            <span style={{width:'5px',height:'5px',borderRadius:'50%',background:'currentColor',flexShrink:0,opacity:0.4}}></span>Cerrar sesión
          </button>
        </div>
      </aside>

      <main style={{padding:'3rem',maxWidth:'760px'}}>
        <div style={{marginBottom:'2.5rem',paddingBottom:'2rem',borderBottom:'1px solid #E0E0DC'}}>
          <h1 style={{fontSize:'2.2rem',fontWeight:200,color:'#0A0A0A',letterSpacing:'-0.025em',lineHeight:1,marginBottom:'0.35rem'}}>Facturación</h1>
          <p style={{fontSize:'0.75rem',fontWeight:300,color:'#888884'}}>Historial de pagos de tus eventos</p>
        </div>

        {eventos.length === 0 ? (
          <div style={{textAlign:'center',padding:'4rem',border:'1px dashed #E0E0DC',color:'#888884',fontSize:'0.75rem'}}>
            Todavía no has creado ningún evento.
          </div>
        ) : (
          <div style={{border:'1px solid #E0E0DC'}}>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr 1fr',padding:'0.75rem 1.5rem',borderBottom:'1px solid #E0E0DC',background:'#F7F7F5'}}>
              {['Evento','Plan','Importe','Fecha'].map((h,i) => (
                <div key={i} style={{fontSize:'0.58rem',fontWeight:600,letterSpacing:'0.12em',textTransform:'uppercase',color:'#888884'}}>{h}</div>
              ))}
            </div>
            {eventos.map((ev,i) => (
              <div key={i} style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr 1fr',padding:'1rem 1.5rem',borderBottom:i<eventos.length-1?'1px solid #E0E0DC':'none',alignItems:'center'}}>
                <div style={{fontSize:'0.82rem',fontWeight:500,color:'#0A0A0A'}}>{ev.nombre}</div>
                <div style={{fontSize:'0.78rem',fontWeight:300,color:'#888884',textTransform:'capitalize'}}>{ev.plan}</div>
                <div style={{fontSize:'0.82rem',fontWeight:500,color:'#0A0A0A'}}>{PRECIOS[ev.plan] ? `${PRECIOS[ev.plan]}€` : 'N/A'}</div>
                <div style={{fontSize:'0.78rem',fontWeight:300,color:'#888884'}}>
                  {ev.created_at ? new Date(ev.created_at).toLocaleDateString('es-ES',{day:'numeric',month:'short',year:'numeric'}) : 'N/A'}
                </div>
              </div>
            ))}
            <div style={{padding:'1rem 1.5rem',borderTop:'1px solid #E0E0DC',display:'flex',justifyContent:'flex-end',background:'#F7F7F5'}}>
              <div style={{fontSize:'0.82rem',fontWeight:600,color:'#0A0A0A'}}>
                Total: {eventos.reduce((acc,ev) => acc + (PRECIOS[ev.plan] || 0), 0)}€
              </div>
            </div>
          </div>
        )}

        <div style={{marginTop:'2rem',padding:'1.25rem',background:'#F7F7F5',border:'1px solid #E0E0DC'}}>
          <p style={{fontSize:'0.75rem',fontWeight:300,color:'#888884',lineHeight:1.7}}>
            ¿Necesitas una factura? Escríbenos a <a href="mailto:support@nowear.es" style={{color:'#F07987',textDecoration:'none'}}>support@nowear.es</a> con el nombre de tu evento y te la enviamos en menos de 24 horas.
          </p>
        </div>
      </main>
    </div>
  )
}
