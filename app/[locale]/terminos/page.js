export default function Terminos() {
  return (
    <div style={{maxWidth:'760px',margin:'0 auto',padding:'6rem 2rem'}}>
      <span style={{display:'inline-flex',alignItems:'center',gap:'0.6rem',fontSize:'0.6rem',fontWeight:600,letterSpacing:'0.18em',textTransform:'uppercase',color:'#F07987',marginBottom:'2rem'}}>
        <span style={{width:'24px',height:'1px',background:'#F07987',display:'inline-block'}}></span>Legal
      </span>
      <h1 style={{fontSize:'2.5rem',fontWeight:100,letterSpacing:'-0.025em',marginBottom:'0.5rem'}}>Términos <strong style={{fontWeight:700}}>de Uso</strong></h1>
      <p style={{fontSize:'0.78rem',color:'#888884',marginBottom:'3rem'}}>Última actualización: mayo de 2026</p>

      {[
        {
          title: '1. Objeto y titular del servicio',
          body: `Estos Términos de Uso regulan el acceso y uso de la plataforma NOWEAR® (nowear.es), un servicio de coordinación de looks para eventos sociales que permite a las organizadoras evitar que las invitadas coincidan en su vestimenta.\n\nEl servicio es titularidad de María Teresa Navarrete González, con NIF 26748920N, titular de la marca registrada NOWEAR® (expediente OEPM, clases 35 y 42). Contacto: support@nowear.es.`
        },
        {
          title: '2. Aceptación de los términos',
          body: `El acceso y uso de NOWEAR® implica la aceptación plena y sin reservas de estos Términos de Uso, así como de la Política de Privacidad y la Política de Protección de Datos. Si no estás de acuerdo con alguno de ellos, debes abstenerte de usar el servicio.`
        },
        {
          title: '3. Alta y cuenta de usuario',
          body: `Para usar NOWEAR® como organizadora es necesario crear una cuenta con un email válido. Eres responsable de mantener la confidencialidad de tus credenciales y de toda la actividad que se realice desde tu cuenta.\n\nLas invitadas no necesitan crear cuenta para registrar su look a través del link del evento. Al introducir su email, aceptan que sus datos sean tratados conforme a la Política de Privacidad de NOWEAR®.`
        },
        {
          title: '4. Planes y pagos',
          body: `NOWEAR® ofrece los siguientes planes de pago único por evento:\n\n• Plan Básico: 9 € — el registro de looks abre 1 mes antes del evento, hasta 50 invitadas.\n• Plan Estándar: 19 € — el registro abre 3 meses antes, hasta 150 invitadas, incluye exportación de lista.\n• Plan Premium: 29 € — sin límite de tiempo, invitadas ilimitadas, personalización del link de invitada.\n• Plan Enterprise: precio a medida según necesidades.\n\nLos precios indicados son finales. El pago se realiza a través de Stripe de forma segura. Una vez completado el pago, el plan queda activado de forma inmediata.\n\nNo se realizan devoluciones una vez activado el plan, salvo error técnico imputable a NOWEAR®. No es posible hacer downgrade a un plan inferior. Puedes mejorar a un plan superior en cualquier momento pagando únicamente la diferencia entre planes.`
        },
        {
          title: '5. Uso permitido del servicio',
          body: `Te comprometes a usar NOWEAR® exclusivamente para coordinar looks en eventos reales. Queda expresamente prohibido:\n\n• Usar el servicio para fines fraudulentos, ilegales o contrarios a la buena fe.\n• Registrar looks de otras personas sin su consentimiento.\n• Intentar acceder a datos de otros eventos sin autorización.\n• Realizar ingeniería inversa, descompilar o intentar vulnerar la seguridad de la plataforma.\n• Usar el servicio de forma que pueda dañar, sobrecargar o deteriorar los sistemas de NOWEAR®.`
        },
        {
          title: '6. Propiedad intelectual',
          body: `El nombre NOWEAR®, su logotipo, diseño, código fuente, contenidos y arquitectura del servicio son propiedad exclusiva de María Teresa Navarrete González y están protegidos por la normativa de propiedad intelectual e industrial española y europea.\n\nQueda prohibida su reproducción, distribución, transformación o comunicación pública total o parcial sin autorización expresa y escrita de la titular.`
        },
        {
          title: '7. Marcas de terceros — aviso informativo',
          body: `Las marcas comerciales de moda y otras empresas que aparecen mencionadas o referenciadas en NOWEAR® (como Zara, Mango, Massimo Dutti u otras) se incluyen exclusivamente con carácter informativo y de referencia para facilitar a las usuarias el registro de sus looks.\n\nNOWEAR® no mantiene ninguna relación comercial, acuerdo de colaboración, patrocinio ni afiliación con dichas marcas. Su mención no implica respaldo, recomendación ni vinculación de ningún tipo entre NOWEAR® y las marcas referenciadas. Todas las marcas mencionadas son propiedad de sus respectivos titulares.`
        },
        {
          title: '8. Limitación de responsabilidad',
          body: `NOWEAR® no se hace responsable de:\n\n• Coincidencias de looks que ocurran por causas ajenas al uso correcto de la plataforma.\n• Pérdida de datos por causas de fuerza mayor o fallos de proveedores terceros.\n• Daños indirectos o lucro cesante derivados del uso o imposibilidad de uso del servicio.\n\nEl servicio se presta en el estado en que se encuentra. NOWEAR® no garantiza disponibilidad ininterrumpida, aunque se esfuerza por mantener la máxima disponibilidad posible.`
        },
        {
          title: '9. Cancelación de cuenta',
          body: `Puedes cancelar tu cuenta en cualquier momento desde el panel de configuración. Los eventos ya creados permanecerán accesibles hasta su fecha de celebración. NOWEAR® se reserva el derecho de suspender o cancelar cuentas que incumplan estos Términos de Uso, sin derecho a reembolso.`
        },
        {
          title: '10. Modificación de los términos',
          body: `NOWEAR® se reserva el derecho de modificar estos Términos de Uso en cualquier momento. Los cambios relevantes se comunicarán por email o mediante aviso en la plataforma con al menos 15 días de antelación. El uso continuado del servicio tras la entrada en vigor de los nuevos términos implica su aceptación.`
        },
        {
          title: '11. Legislación aplicable y jurisdicción',
          body: `Estos Términos de Uso se rigen por la legislación española. Para cualquier controversia derivada del uso de NOWEAR®, las partes se someten a los juzgados y tribunales del domicilio del usuario, sin perjuicio de lo dispuesto en la normativa de protección de consumidores y usuarios.`
        },
        {
          title: '12. Contacto',
          body: `Para cualquier consulta sobre estos términos, escríbenos a support@nowear.es.`
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
          ¿Tienes alguna pregunta sobre estos términos? Escríbenos a{' '}
          <a href="mailto:support@nowear.es" style={{color:'#F07987',textDecoration:'none'}}>support@nowear.es</a>
        </p>
      </div>

      <p style={{fontSize:'0.65rem',fontWeight:300,color:'#BEBEBA',marginTop:'3rem',textAlign:'center'}}>
        © 2026 NOWEAR®. Todos los derechos reservados.
      </p>
    </div>
  )
}