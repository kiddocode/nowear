export default function datos() {
  return (
    <div style={{maxWidth:'760px',margin:'0 auto',padding:'6rem 2rem'}}>
      <span style={{display:'inline-flex',alignItems:'center',gap:'0.6rem',fontSize:'0.6rem',fontWeight:600,letterSpacing:'0.18em',textTransform:'uppercase',color:'#F07987',marginBottom:'2rem'}}>
        <span style={{width:'24px',height:'1px',background:'#F07987',display:'inline-block'}}></span>Legal
      </span>
      <h1 style={{fontSize:'2.5rem',fontWeight:100,letterSpacing:'-0.025em',marginBottom:'0.5rem'}}>Protección <strong style={{fontWeight:700}}>de Datos</strong></h1>
      <p style={{fontSize:'0.78rem',color:'#888884',marginBottom:'3rem'}}>Última actualización: mayo 2026</p>

      {[
        {
          title:'1. Marco normativo',
          body:`El tratamiento de datos personales en Nowear se realiza conforme al Reglamento General de Protección de Datos (RGPD, Reglamento UE 2016/679) y a la Ley Orgánica 3/2018, de 5 de diciembre, de Protección de Datos Personales y garantía de los derechos digitales (LOPDGDD).`
        },
        {
          title:'2. Responsable del tratamiento',
          body:`Nowear, con email de contacto support@nowear.es, es el responsable del tratamiento de los datos personales recabados a través de la plataforma nowear.es.`
        },
        {
          title:'3. Categorías de datos tratados',
          body:`Nowear trata las siguientes categorías de datos personales:\n\n• Datos identificativos: nombre y apellidos, dirección de correo electrónico.\n• Datos de acceso: credenciales de autenticación (almacenadas de forma cifrada).\n• Datos del evento: información sobre el evento creado y los looks registrados por las invitadas.\n• Datos de navegación: dirección IP, tipo de navegador, páginas visitadas y duración de la sesión.\n\nNowear no trata categorías especiales de datos (datos de salud, origen racial, creencias religiosas, etc.).`
        },
        {
          title:'4. Finalidades y bases jurídicas',
          body:`Finalidad / Base jurídica:\n\n• Prestación del servicio: ejecución del contrato (art. 6.1.b RGPD).\n• Gestión de pagos: ejecución del contrato (art. 6.1.b RGPD).\n• Comunicaciones del servicio: ejecución del contrato (art. 6.1.b RGPD).\n• Mejora del servicio: interés legítimo (art. 6.1.f RGPD).\n• Cumplimiento de obligaciones legales: obligación legal (art. 6.1.c RGPD).`
        },
        {
          title:'5. Plazo de conservación',
          body:`Los datos se conservarán durante el tiempo necesario para cumplir con la finalidad para la que fueron recabados:\n\n• Datos de cuenta: mientras la cuenta permanezca activa y hasta 30 días tras su eliminación.\n• Datos de facturación: 5 años conforme a la legislación fiscal española.\n• Datos de contacto: hasta que se resuelva la consulta planteada.`
        },
        {
          title:'6. Transferencias internacionales',
          body:`Algunos de nuestros proveedores de servicios (Supabase, Stripe, Vercel) pueden procesar datos fuera del Espacio Económico Europeo. En todos los casos, estas transferencias se realizan con las garantías adecuadas exigidas por el RGPD (cláusulas contractuales tipo, decisiones de adecuación de la Comisión Europea).`
        },
        {
          title:'7. Derechos de los interesados',
          body:`Conforme al RGPD, puedes ejercer los siguientes derechos sobre tus datos personales:\n\n• Derecho de acceso (art. 15 RGPD): obtener confirmación de si tratamos tus datos y acceder a ellos.\n• Derecho de rectificación (art. 16 RGPD): corregir datos inexactos o incompletos.\n• Derecho de supresión (art. 17 RGPD): solicitar la eliminación de tus datos cuando ya no sean necesarios.\n• Derecho a la limitación del tratamiento (art. 18 RGPD): solicitar que restrinjamos el tratamiento en determinadas circunstancias.\n• Derecho a la portabilidad (art. 20 RGPD): recibir tus datos en formato estructurado y de uso común.\n• Derecho de oposición (art. 21 RGPD): oponerte al tratamiento basado en interés legítimo.\n\nPara ejercer cualquiera de estos derechos, envía un email a support@nowear.es indicando el derecho que deseas ejercer y adjuntando una copia de tu documento de identidad.\n\nTienes derecho a presentar una reclamación ante la Agencia Española de Protección de Datos (www.aepd.es) si consideras que el tratamiento de tus datos no es conforme a la normativa.`
        },
        {
          title:'8. Medidas de seguridad',
          body:`Nowear aplica medidas técnicas y organizativas adecuadas para proteger tus datos personales frente a accesos no autorizados, pérdida, destrucción o alteración, entre ellas:\n\n• Cifrado de contraseñas mediante bcrypt.\n• Conexiones cifradas con TLS/HTTPS.\n• Acceso restringido a datos según el principio de mínimo privilegio.\n• Copias de seguridad periódicas.`
        },
        {
          title:'9. Contacto DPO',
          body:`Nowear no está obligada a designar un Delegado de Protección de Datos conforme al art. 37 RGPD. Para cualquier consulta relacionada con la protección de datos, puedes contactarnos en support@nowear.es.`
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
