'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Sidebar from '../../../components/Sidebar'

export default function Ayuda() {
  const router = useRouter()
  const [user, setUser] = useState(null)

  useEffect(() => {
    async function cargar() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setUser(user)
    }
    cargar()
  }, [])

  return (
    <div style={{display:'grid',gridTemplateColumns:'220px 1fr',minHeight:'calc(100vh - 68px)'}}>
      <Sidebar activo="/dashboard/ayuda" />
      <main style={{padding:'3rem',maxWidth:'680px'}}>
        <div style={{marginBottom:'2.5rem',paddingBottom:'2rem',borderBottom:'1px solid #E0E0DC'}}>
          <h1 style={{fontSize:'2.2rem',fontWeight:200,color:'#0A0A0A',letterSpacing:'-0.025em',lineHeight:1,marginBottom:'0.35rem'}}>Ayuda</h1>
          <p style={{fontSize:'0.75rem',fontWeight:300,color:'#888884'}}>Resolvemos todas tus dudas</p>
        </div>

        {[
          {q:'¿Cómo comparto el link con mis invitadas?',a:'Desde tu dashboard, entra en el evento y copia el link que aparece en la parte superior. Puedes mandarlo por WhatsApp, email o incluirlo en tu web de boda.'},
          {q:'¿Puedo cambiar la fecha de mi evento?',a:'Sí. Entra en tu evento, ve a la pestaña Ajustes y podrás modificar la fecha, nombre y lugar.'},
          {q:'¿Qué pasa si una invitada registra el look equivocado?',a:'La invitada puede volver al link y registrar un nuevo look. El anterior queda como prerreserva hasta que lo confirme.'},
          {q:'¿Cómo exporto la lista de looks?',a:'Desde la pestaña Looks registrados de tu evento, haz clic en Exportar lista. Recibirás un archivo CSV con todos los looks.'},
          {q:'¿Puedo tener más de un evento activo?',a:'Con los planes actuales cada pago activa un evento. Si necesitas gestionar múltiples eventos simultáneamente, contacta con nosotros para el plan Enterprise.'},
          {q:'¿Cómo funciona la prerreserva?',a:'Una invitada puede marcar un look como prerreservado cuando lo ha visto pero aún no lo ha comprado. Nadie más puede registrar ese mismo look mientras la prerreserva esté activa.'},
          {q:'¿Necesito ayuda con algo más?',a:'Escríbenos a support@nowear.es y te respondemos en menos de 24 horas.'},
        ].map((item,i) => (
          <details key={i} style={{borderBottom:'1px solid #E0E0DC'}}>
            <summary style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'1.25rem 0',fontSize:'0.88rem',fontWeight:500,color:'#0A0A0A',cursor:'pointer',listStyle:'none',lineHeight:1.4}}>
              {item.q}
              <span style={{fontSize:'1.2rem',fontWeight:100,color:'#BEBEBA',flexShrink:0,marginLeft:'1rem'}}>+</span>
            </summary>
            <p style={{fontSize:'0.82rem',fontWeight:300,color:'#555552',lineHeight:2,paddingBottom:'1.25rem'}}>{item.a}</p>
          </details>
        ))}

        <div style={{marginTop:'3rem',padding:'2rem',background:'#0A0A0A'}}>
          <h2 style={{fontSize:'1.1rem',fontWeight:300,color:'#FFFFFF',marginBottom:'0.5rem'}}>¿Necesitas más ayuda?</h2>
          <p style={{fontSize:'0.78rem',fontWeight:300,color:'#888884',marginBottom:'1.25rem',lineHeight:1.7}}>Nuestro equipo está disponible de lunes a viernes. Te respondemos en menos de 24 horas.</p>
          <a href="mailto:support@nowear.es" style={{fontSize:'0.78rem',fontWeight:500,color:'#F07987',textDecoration:'none'}}>support@nowear.es</a>
        </div>
      </main>
    </div>
  )
}