export default function Terminos() {
  return (
    <div style={{maxWidth:'760px',margin:'0 auto',padding:'6rem 2rem'}}>
      <span style={{display:'inline-flex',alignItems:'center',gap:'0.6rem',fontSize:'0.6rem',fontWeight:600,letterSpacing:'0.18em',textTransform:'uppercase',color:'#F07987',marginBottom:'2rem'}}>
        <span style={{width:'24px',height:'1px',background:'#F07987',display:'inline-block'}}></span>Legal
      </span>
      <h1 style={{fontSize:'2.5rem',fontWeight:100,letterSpacing:'-0.025em',marginBottom:'0.5rem'}}>Términos <strong style={{fontWeight:700}}>de Uso</strong></h1>
      <p style={{fontSize:'0.78rem',color:'#888884',marginBottom:'3rem'}}>Última actualización: mayo 2026</p>

      {[
        {
          title:'1. Objeto',
          body:`Estos Términos de Uso regulan el acceso y uso de la plataforma Nowear (nowear.es), un servicio de coordinación de looks para eventos sociales que permite a las organizadoras evitar que las invitadas coincidan en su vestimenta.`
        },
        {
          title:'2. Aceptación',
          body:`El uso de Nowear implica la aceptación plena de estos términos. Si no estás de acuerdo con alguno de ellos, debes abstenerte de usar el servicio.`
        },
        {
          title:'3. Alta y cuenta',
          body:`Para usar Nowear como organizadora es necesario crear una cuenta con un email válido y una contraseña segura. Eres responsable de mantener la confidencialidad de tus credenciales y de toda la actividad que se realice desde tu cuenta.\n\nLas invitadas no necesitan crear cuenta para registrar su look a través del link del evento.`
        },
        {
          title:'4. Planes y pagos',
          body:`Nowear ofrece tres planes de pago único por evento (Básico 9€, Estándar 19€, Premium 29€) y un plan Enterprise bajo presupuesto personalizado. Los precios incluyen IVA cuando aplique.\n\nEl pago se realiza a través de Stripe. Una vez completado el pago, el acceso al evento queda activado de forma inmediata. No se realizan devoluciones una vez creado el evento, salvo error técnico imputable a Nowear.`
        },
        {
          title:'5. Uso permitido',
          body:`Te comprometes a usar Nowear exclusivamente para coordinar looks en eventos reales. Queda prohibido:\n\n• Usar el servicio para fines fraudulentos o ilegales.\n• Registrar looks de otras personas sin su consentimiento.\n• Intentar acceder a datos de otros eventos sin autorización.\n• Realizar ingeniería inversa o intentar vulnerar la seguridad de la plataforma.`
        },
        {
          title:'6. Propiedad intelectual',
          body:`El nombre, logotipo, diseño y código de Nowear son propiedad de Nowear y están protegidos por la normativa de propiedad intelectual. No se permite su reproducción, distribución o uso sin autorización expresa.`
        },
        {
          title:'7. Limitación de responsabilidad',
          body:`Nowear no se hace responsable de:\n\n• Coincidencias de looks que ocurran fuera de la plataforma.\n• Pérdida de datos por causas ajenas a Nowear (fuerza mayor, fallos de terceros).\n• Daños indirectos derivados del uso o imposibilidad de uso del servicio.\n\nEl servicio se presta "tal cual" y Nowear no garantiza disponibilidad ininterrumpida, aunque se esfuerza por mantener un uptime del 99,9%.`
        },
        {
          title:'8. Cancelación',
          body:`Puedes cancelar tu cuenta en cualquier momento desde el panel de configuración. Los eventos ya creados permanecerán activos hasta su fecha de celebración. Nowear se reserva el derecho de suspender cuentas que incumplan estos términos.`
        },
        {
          title:'9. Legislación aplicable',
          body:`Estos términos se rigen por la legislación española. Para cualquier controversia, las partes se someten a los juzgados y tribunales del domicilio del usuario, salvo que la normativa aplicable establezca otro fuero.`
        },
        {
          title:'10. Contacto',
          body:`Para cualquier consulta sobre estos términos, escríbenos a support@nowear.es.`
        },
      ].map((s,i)=>(
        <div key={i} style={{marginBottom:'2.5rem'}}>
          <h2 style={{fontSize:'1rem',fontWeight:600,marginBottom:'0.75rem',letterSpacing:'-0.01em'}}>{s.title}</h2>
          {s.body.split('\n').map((line,j)=>(
            <p key={j} style={{fontSize:'0.875rem',fontWeight:300,color:'#444442',lineHeight:1.9,marginBottom:'0.25rem'}}>{line}</p>
          ))}
        </div>
      ))}
    </div>
  )
}