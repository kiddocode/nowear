export default function Privacidad() {
  return (
    <div style={{maxWidth:'760px',margin:'0 auto',padding:'6rem 2rem'}}>
      <span style={{display:'inline-flex',alignItems:'center',gap:'0.6rem',fontSize:'0.6rem',fontWeight:600,letterSpacing:'0.18em',textTransform:'uppercase',color:'#F07987',marginBottom:'2rem'}}>
        <span style={{width:'24px',height:'1px',background:'#F07987',display:'inline-block'}}></span>Legal
      </span>
      <h1 style={{fontSize:'2.5rem',fontWeight:100,letterSpacing:'-0.025em',marginBottom:'0.5rem'}}>Política de <strong style={{fontWeight:700}}>Privacidad</strong></h1>
      <p style={{fontSize:'0.78rem',color:'#888884',marginBottom:'3rem'}}>Última actualización: mayo de 2026</p>

      {[
        {
          title: '1. Responsable del tratamiento',
          body: `El responsable del tratamiento de los datos personales recogidos a través de nowear.es es María Teresa Navarrete González, titular de la marca NOWEAR®, con domicilio en Madrid, España, y correo electrónico de contacto support@nowear.es.\n\nNOWEAR® se compromete a tratar los datos personales de sus usuarios con pleno respeto a la normativa vigente en materia de protección de datos, en particular el Reglamento (UE) 2016/679 (RGPD) y la Ley Orgánica 3/2018 de Protección de Datos Personales y garantía de los derechos digitales (LOPDGDD).`
        },
        {
          title: '2. Datos que recopilamos',
          body: `Recopilamos los siguientes tipos de datos:\n\n• Datos de registro: nombre y dirección de correo electrónico cuando creas una cuenta como organizadora.\n• Datos del evento: nombre del evento, fecha, lugar, lista de looks registrados por las invitadas y posibles conflictos detectados. Los looks registrados por las invitadas serán visibles únicamente para la organizadora del evento y para el equipo de NOWEAR® cuando resulte necesario para tareas de soporte, moderación o mantenimiento técnico. Las invitadas no tienen acceso a los looks de otras participantes.\n• Datos de pago: gestionados íntegramente por Stripe. NOWEAR® no almacena datos de tarjetas de crédito ni información bancaria.\n• Datos de uso: información técnica sobre cómo interactúas con la plataforma (navegador, dispositivo, páginas visitadas).\n• Datos de contacto: nombre y email cuando nos escribes a través del formulario de contacto.`
        },
        {
          title: '3. Finalidad del tratamiento',
          body: `Tratamos tus datos para:\n\n• Prestarte el servicio de coordinación de looks para eventos.\n• Gestionar tu cuenta y los eventos que crees como organizadora.\n• Procesar los pagos asociados a los planes contratados a través de Stripe.\n• Enviarte comunicaciones relacionadas con el servicio: confirmaciones de look, alertas de coincidencia y notificaciones del evento.\n• Atender tus solicitudes de soporte.\n• Cumplir con las obligaciones legales que resulten de aplicación.\n\nNOWEAR® no enviará comunicaciones comerciales o promocionales sin el consentimiento previo del usuario, salvo en los casos permitidos por la normativa aplicable.`
        },
        {
          title: '4. Base legal del tratamiento',
          body: `El tratamiento de tus datos se basa en:\n\n• La ejecución del contrato de servicio que aceptas al registrarte o al usar el servicio como invitada (art. 6.1.b RGPD).\n• Tu consentimiento, cuando sea requerido (art. 6.1.a RGPD).\n• El cumplimiento de obligaciones legales aplicables (art. 6.1.c RGPD).\n• El interés legítimo de NOWEAR® para mejorar la plataforma y garantizar su seguridad (art. 6.1.f RGPD).`
        },
        {
          title: '5. Conservación de datos',
          body: `Conservaremos tus datos mientras mantengas tu cuenta activa o sea necesario para prestarte el servicio. Una vez eliminada tu cuenta, los datos se suprimirán en un plazo máximo de 30 días, salvo que la ley exija su conservación por un período mayor (por ejemplo, datos de facturación durante 5 años conforme a la legislación fiscal española).`
        },
        {
          title: '6. Compartición de datos con terceros',
          body: `NOWEAR® no vende ni cede tus datos personales a terceros con fines comerciales. Podemos compartir datos con los siguientes proveedores de servicios que actúan como encargados del tratamiento bajo nuestras instrucciones:\n\n• Supabase (Supabase Inc.): almacenamiento de base de datos y autenticación.\n• Stripe (Stripe, Inc.): procesamiento seguro de pagos.\n• Vercel (Vercel Inc.): infraestructura de alojamiento web.\n• Resend: envío de emails transaccionales.\n\nTodos ellos ofrecen garantías adecuadas de protección de datos conforme al RGPD. Algunos de estos proveedores pueden tratar datos fuera del Espacio Económico Europeo, especialmente en Estados Unidos. En dichos casos, NOWEAR® adopta las garantías adecuadas exigidas por el RGPD, incluyendo la firma de cláusulas contractuales tipo aprobadas por la Comisión Europea cuando resulte necesario.`
        },
        {
          title: '7. Tus derechos',
          body: `Puedes ejercer en cualquier momento los siguientes derechos enviando un email a support@nowear.es:\n\n• Acceso: conocer qué datos personales tenemos sobre ti.\n• Rectificación: corregir datos inexactos o incompletos.\n• Supresión: solicitar la eliminación de tus datos cuando ya no sean necesarios.\n• Oposición: oponerte a determinados tratamientos.\n• Portabilidad: recibir tus datos en formato estructurado y de uso común.\n• Limitación: solicitar que restrinjamos el tratamiento en determinadas circunstancias.\n\nTambién tienes derecho a presentar una reclamación ante la Agencia Española de Protección de Datos (www.aepd.es) si consideras que el tratamiento de tus datos no es conforme a la normativa.`
        },
        {
          title: '8. Menores de edad',
          body: `El servicio de NOWEAR® no está dirigido a menores de 14 años. NOWEAR® no recopila conscientemente datos personales de menores. Si detectamos que se han proporcionado datos personales de un menor sin autorización válida, procederemos a su eliminación lo antes posible. Si tienes conocimiento de que un menor ha facilitado datos personales, te rogamos que nos lo comuniques a support@nowear.es.`
        },
        {
          title: '9. Cookies',
          body: `NOWEAR® utiliza únicamente cookies técnicas estrictamente necesarias para el funcionamiento del servicio (gestión de sesión y autenticación). No utilizamos cookies de publicidad, seguimiento de terceros ni perfilado comercial.`
        },
        {
          title: '10. Seguridad',
          body: `Aplicamos medidas técnicas y organizativas adecuadas para proteger tus datos frente a accesos no autorizados, pérdida o alteración, incluyendo conexiones cifradas mediante TLS/HTTPS, control de acceso por roles y copias de seguridad periódicas.`
        },
        {
          title: '11. Cambios en esta política',
          body: `Podemos actualizar esta política ocasionalmente. Te notificaremos cualquier cambio relevante por email o mediante un aviso en la plataforma. La fecha de última actualización figura siempre al inicio de este documento.`
        },
      ].map((s, i) => (
        <div key={i} style={{marginBottom:'2.5rem'}}>
          <h2 style={{fontSize:'1rem',fontWeight:600,marginBottom:'0.75rem',letterSpacing:'-0.01em'}}>{s.title}</h2>
          {s.body.split('\n').map((line, j) => (
            <p key={j} style={{fontSize:'0.875rem',fontWeight:300,color:'#444442',lineHeight:1.9,marginBottom:'0.25rem'}}>{line}</p>
          ))}
        </div>
      ))}

      <div style={{marginTop:'3rem',padding:'1.5rem',background:'#F7F7F5',border:'1px solid #E0E0DC',borderRadius:'8px'}}>
        <p style={{fontSize:'0.78rem',fontWeight:300,color:'#888884',lineHeight:1.8}}>
          ¿Tienes alguna pregunta sobre esta política? Escríbenos a{' '}
          <a href="mailto:support@nowear.es" style={{color:'#F07987',textDecoration:'none'}}>support@nowear.es</a>
        </p>
      </div>

      <p style={{fontSize:'0.65rem',fontWeight:300,color:'#BEBEBA',marginTop:'3rem',textAlign:'center'}}>
        © 2026 NOWEAR®. Todos los derechos reservados.
      </p>
    </div>
  )
}