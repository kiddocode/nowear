export default function Datos() {
  return (
    <div style={{maxWidth:'760px',margin:'0 auto',padding:'6rem 2rem'}}>
      <span style={{display:'inline-flex',alignItems:'center',gap:'0.6rem',fontSize:'0.6rem',fontWeight:600,letterSpacing:'0.18em',textTransform:'uppercase',color:'#F07987',marginBottom:'2rem'}}>
        <span style={{width:'24px',height:'1px',background:'#F07987',display:'inline-block'}}></span>Legal
      </span>
      <h1 style={{fontSize:'2.5rem',fontWeight:100,letterSpacing:'-0.025em',marginBottom:'0.5rem'}}>Protección <strong style={{fontWeight:700}}>de Datos</strong></h1>
      <p style={{fontSize:'0.78rem',color:'#888884',marginBottom:'3rem'}}>Última actualización: mayo de 2026</p>

      {[
        {
          title: '1. Marco normativo',
          body: `El tratamiento de datos personales en NOWEAR® se realiza conforme al Reglamento General de Protección de Datos (RGPD, Reglamento UE 2016/679) y a la Ley Orgánica 3/2018, de 5 de diciembre, de Protección de Datos Personales y garantía de los derechos digitales (LOPDGDD).`
        },
        {
          title: '2. Responsable del tratamiento',
          body: `Responsable: María Teresa Navarrete González\nTitular de la marca: NOWEAR®\nDomicilio: Madrid, España\nEmail de contacto: support@nowear.es`
        },
        {
          title: '3. Categorías de datos tratados',
          body: `NOWEAR® trata las siguientes categorías de datos personales:\n\n• Datos identificativos: nombre y dirección de correo electrónico de organizadoras e invitadas.\n• Datos de acceso: credenciales de autenticación almacenadas de forma cifrada a través de Supabase Auth.\n• Datos del evento: información sobre los eventos creados, looks registrados (marca, modelo, color, foto opcional) y posibles coincidencias detectadas. Estos datos son visibles únicamente para la organizadora del evento y, cuando sea necesario por razones técnicas o de soporte, para el equipo de NOWEAR®. Las invitadas no tienen acceso a los looks de otras participantes.\n• Datos de navegación: dirección IP, tipo de navegador, páginas visitadas y duración de la sesión.\n\nNOWEAR® no trata categorías especiales de datos en el sentido del artículo 9 del RGPD.`
        },
        {
          title: '4. Finalidades y bases jurídicas',
          body: `• Prestación del servicio de coordinación de looks: ejecución del contrato (art. 6.1.b RGPD).\n• Gestión de pagos a través de Stripe: ejecución del contrato (art. 6.1.b RGPD).\n• Envío de emails transaccionales (confirmaciones, alertas): ejecución del contrato (art. 6.1.b RGPD).\n• Mejora y análisis del servicio: interés legítimo (art. 6.1.f RGPD).\n• Cumplimiento de obligaciones fiscales y legales: obligación legal (art. 6.1.c RGPD).\n\nNOWEAR® no enviará comunicaciones comerciales o promocionales sin el consentimiento previo del usuario, salvo en los casos permitidos por la normativa aplicable.`
        },
        {
          title: '5. Plazo de conservación',
          body: `• Datos de cuenta de organizadora: mientras la cuenta permanezca activa y hasta 30 días tras su eliminación voluntaria.\n• Datos de invitadas (looks registrados): hasta 30 días después de la fecha del evento, salvo que la organizadora los elimine antes.\n• Datos de facturación: 5 años conforme a la legislación fiscal española.\n• Datos de contacto (formulario): hasta que se resuelva la consulta planteada.`
        },
        {
          title: '6. Encargados del tratamiento',
          body: `NOWEAR® utiliza los siguientes proveedores que actúan como encargados del tratamiento bajo sus instrucciones y con las garantías exigidas por el RGPD:\n\n• Supabase (Supabase Inc., EE.UU.): base de datos, autenticación y almacenamiento de archivos.\n• Stripe (Stripe, Inc., EE.UU.): procesamiento de pagos. Certificado PCI DSS nivel 1.\n• Vercel (Vercel Inc., EE.UU.): infraestructura de hosting y CDN.\n• Resend (Resend Inc.): envío de emails transaccionales.`
        },
        {
          title: '7. Transferencias internacionales',
          body: `Algunos de los proveedores utilizados por NOWEAR® pueden tratar datos fuera del Espacio Económico Europeo, especialmente en Estados Unidos. En dichos casos, NOWEAR® adopta las garantías adecuadas exigidas por el RGPD para proteger los datos personales, incluyendo la firma de cláusulas contractuales tipo aprobadas por la Comisión Europea cuando resulte necesario.`
        },
        {
          title: '8. Menores de edad',
          body: `El servicio de NOWEAR® no está dirigido a menores de 14 años. NOWEAR® no recopila conscientemente datos personales de menores. Si detectamos que se han proporcionado datos personales de un menor sin autorización válida, procederemos a su eliminación lo antes posible. Si tienes conocimiento de que un menor ha facilitado datos personales, te rogamos que nos lo comuniques a support@nowear.es.`
        },
        {
          title: '9. Derechos de los interesados',
          body: `Conforme al RGPD, puedes ejercer los siguientes derechos enviando un email a support@nowear.es con el asunto "Ejercicio de derechos RGPD":\n\n• Derecho de acceso (art. 15 RGPD): obtener confirmación de si tratamos tus datos y acceder a ellos.\n• Derecho de rectificación (art. 16 RGPD): corregir datos inexactos o incompletos.\n• Derecho de supresión (art. 17 RGPD): solicitar la eliminación de tus datos cuando ya no sean necesarios.\n• Derecho a la limitación del tratamiento (art. 18 RGPD): solicitar que restrinjamos el tratamiento en determinadas circunstancias.\n• Derecho a la portabilidad (art. 20 RGPD): recibir tus datos en formato estructurado, de uso común y lectura mecánica.\n• Derecho de oposición (art. 21 RGPD): oponerte al tratamiento basado en interés legítimo.\n\nRespondemos a todas las solicitudes en un plazo máximo de 30 días. También tienes derecho a presentar una reclamación ante la Agencia Española de Protección de Datos (www.aepd.es).`
        },
        {
          title: '10. Medidas de seguridad',
          body: `NOWEAR® aplica las siguientes medidas técnicas y organizativas para proteger los datos personales:\n\n• Cifrado de contraseñas mediante bcrypt a través de Supabase Auth.\n• Conexiones cifradas con TLS 1.2/1.3 (HTTPS) en todas las comunicaciones.\n• Control de acceso basado en roles (RLS — Row Level Security) en la base de datos.\n• Acceso a datos de producción restringido a la titular del servicio.\n• Copias de seguridad periódicas gestionadas por Supabase.`
        },
        {
          title: '11. Delegado de Protección de Datos',
          body: `NOWEAR® no está obligada a designar un Delegado de Protección de Datos conforme al artículo 37 del RGPD. Para cualquier consulta relacionada con la protección de datos, puedes contactar directamente en support@nowear.es.`
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
          Para ejercer tus derechos o cualquier consulta sobre protección de datos, escríbenos a{' '}
          <a href="mailto:support@nowear.es" style={{color:'#F07987',textDecoration:'none'}}>support@nowear.es</a>
        </p>
      </div>

      <p style={{fontSize:'0.65rem',fontWeight:300,color:'#BEBEBA',marginTop:'3rem',textAlign:'center'}}>
        © 2026 NOWEAR®. Todos los derechos reservados.
      </p>
    </div>
  )
}