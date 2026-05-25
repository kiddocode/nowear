'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Sidebar from '../../../components/Sidebar'

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
      <Sidebar activo="/dashboard/facturacion" />
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
          <div style={{border:'1px solid #E0E0DC',borderRadius:'8px',overflow:'hidden'}}>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr 1fr',padding:'0.75rem 1.5rem',borderBottom:'1px solid #E0E0DC',background:'#F7F7F5'}}>
              {['Evento','Plan','Importe','Fecha'].map((h,i) => (
                <div key={i} style={{fontSize:'0.58rem',fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase',color:'#555552'}}>{h}</div>
              ))}
            </div>
            {eventos.map((ev,i) => (
              <div key={i} style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr 1fr',padding:'1rem 1.5rem',borderBottom:i<eventos.length-1?'1px solid #E0E0DC':'none',alignItems:'center',background:i%2===0?'#FFFFFF':'#FAFAFA'}}>
                <div style={{fontSize:'0.82rem',fontWeight:600,color:'#0A0A0A'}}>{ev.nombre}</div>
                <div style={{fontSize:'0.78rem',fontWeight:300,color:'#888884',textTransform:'capitalize'}}>{ev.plan}</div>
                <div style={{fontSize:'0.82rem',fontWeight:600,color:'#0A0A0A'}}>{PRECIOS[ev.plan] ? `${PRECIOS[ev.plan]}€` : 'N/A'}</div>
                <div style={{fontSize:'0.78rem',fontWeight:300,color:'#888884'}}>
                  {ev.created_at ? new Date(ev.created_at).toLocaleDateString('es-ES',{day:'numeric',month:'short',year:'numeric'}) : 'N/A'}
                </div>
              </div>
            ))}
            <div style={{padding:'1rem 1.5rem',borderTop:'1px solid #E0E0DC',display:'flex',justifyContent:'flex-end',background:'#F7F7F5'}}>
              <div style={{fontSize:'0.82rem',fontWeight:700,color:'#0A0A0A'}}>
                Total: {eventos.reduce((acc,ev) => acc + (PRECIOS[ev.plan] || 0), 0)}€
              </div>
            </div>
          </div>
        )}

        <div style={{marginTop:'2rem',padding:'1.25rem',background:'#F7F7F5',border:'1px solid #E0E0DC',borderRadius:'8px'}}>
          <p style={{fontSize:'0.75rem',fontWeight:300,color:'#888884',lineHeight:1.7}}>
            ¿Necesitas una factura? Escríbenos a <a href="mailto:support@nowear.es" style={{color:'#F07987',textDecoration:'none'}}>support@nowear.es</a> con el nombre de tu evento y te la enviamos en menos de 24 horas.
          </p>
        </div>
      </main>
    </div>
  )
}
