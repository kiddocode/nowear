export default function privacidad() {
  return (
    <div style={{maxWidth:'760px',margin:'0 auto',padding:'6rem 2rem'}}>
      <span style={{display:'inline-flex',alignItems:'center',gap:'0.6rem',fontSize:'0.6rem',fontWeight:600,letterSpacing:'0.18em',textTransform:'uppercase',color:'#F07987',marginBottom:'2rem'}}>
        <span style={{width:'24px',height:'1px',background:'#F07987',display:'inline-block'}}></span>Legal
      </span>
      <h1 style={{fontSize:'2.5rem',fontWeight:100,letterSpacing:'-0.025em',marginBottom:'0.5rem'}}>Política de <strong style={{fontWeight:700}}>Privacidad</strong></h1>
      <p style={{fontSize:'0.78rem',color:'#888884',marginBottom:'3rem'}}>Última actualización: mayo 2026</p>

      {[
        {
          title:'1. Responsable del tratamiento',
          body:`El responsable del tratamiento de los datos personales recogidos a través de nowear.es es Nowear (en adelante, "Nowear"), con email de contacto support@nowear.es.\n\nNowear se compromete a tratar los datos personales de sus usuarios con pleno respeto a la normativa vigente en materia de protección de datos, en particular el Reglamento (UE) 2016/679 (RGPD) y la Ley Orgánica 3/2018 de Protección de Datos Personales y garantía de los derechos digitales (LOPDGDD).`
        },
        {
          title:'2. Datos que recopilamos',
          body:`Recopilamos los siguientes tipos de datos:\n\n• Datos de registro: nombre, dirección de correo electrónico y contraseña cuando creas una cuenta.\n• Datos del evento: nombre del evento, fecha, lista de invitadas y looks registrados.\n• Datos de pago: gestionados íntegramente por Stripe. Nowear no almacena datos de tarjetas de crédito.\n• Datos de uso: información técnica sobre cómo interactúas con la plataforma (navegador, dispositivo, páginas visitadas).\n• Datos de contacto: nombre y email cuando nos escribes a través del formulario de contacto.`
        },
        {
          title:'3. Finalidad del tratamiento',
          body:`Tratamos tus datos para:\n\n• Prestarte el servicio de coordinación de looks para eventos.\n• Gestionar tu cuenta y los eventos que crees.\n• Procesar los pagos asociados a los planes contratados.\n• Enviarte comunicaciones relacionadas con el servicio (confirmaciones, alertas de coincidencia).\n• Atender tus solicitudes de soporte.\n• Cumplir con obligaciones legales.`
        },
        {
          title:'4. Base legal',
          body:`El tratamiento de tus datos se basa en:\n\n• La ejecución del contrato de servicio que aceptas al registrarte.\n• Tu consentimiento, cuando sea requerido.\n• El cumplimiento de obligaciones legales aplicables.\n• El interés legítimo de Nowear para mejorar el servicio.`
        },
        {
          title:'5. Conservación de datos',
          body:`Conservaremos tus datos mientras mantengas tu cuenta activa o sea necesario para prestarte el servicio. Una vez eliminada tu cuenta, los datos se suprimirán en un plazo máximo de 30 días, salvo que la ley exija su conservación por un período mayor.`
        },
        {
          title:'6. Compartición de datos',
          body:`Nowear no vende ni cede tus datos a terceros. Podemos compartir datos con proveedores de servicios que actúan como encargados del tratamiento bajo nuestras instrucciones:\n\n• Supabase: almacenamiento de datos y autenticación.\n• Stripe: procesamiento de pagos.\n• Vercel: infraestructura de hosting.\n\nTodos ellos ofrecen garantías adecuadas conforme al RGPD.`
        },
        {
          title:'7. Tus derechos',
          body:`Puedes ejercer en cualquier momento los siguientes derechos:\n\n• Acceso: conocer qué datos tenemos sobre ti.\n• Rectificación: corregir datos inexactos.\n• Supresión: solicitar la eliminación de tus datos.\n• Oposición: oponerte a determinados tratamientos.\n• Portabilidad: recibir tus datos en formato estructurado.\n• Limitación: solicitar que restrinjamos el tratamiento.\n\nPara ejercer estos derechos, escríbenos a support@nowear.es. También puedes presentar una reclamación ante la Agencia Española de Protección de Datos (aepd.es).`
        },
        {
          title:'8. Cookies',
          body:`Nowear utiliza cookies técnicas estrictamente necesarias para el funcionamiento del servicio (sesión, autenticación). No utilizamos cookies de publicidad ni de seguimiento de terceros.`
        },
        {
          title:'9. Cambios en esta política',
          body:`Podemos actualizar esta política ocasionalmente. Te notificaremos cualquier cambio relevante por email o mediante un aviso en la plataforma. La fecha de última actualización figura siempre al inicio de este documento.`
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
