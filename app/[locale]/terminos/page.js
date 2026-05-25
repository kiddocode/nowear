'use client'
import { useTranslations } from 'next-intl'

export default function Terminos() {
  const t = useTranslations('legal')

  const secciones = {
    es: [
      { title: '1. Objeto y titular del servicio', body: `Estos Términos de Uso regulan el acceso y uso de la plataforma NOWEAR® (nowear.es), un servicio de coordinación de looks para eventos sociales que permite a las organizadoras evitar que las invitadas coincidan en su vestimenta.\n\nEl servicio es titularidad de María Teresa Navarrete González, titular de la marca registrada NOWEAR®, con domicilio en Madrid, España. Contacto: support@nowear.es.` },
      { title: '2. Aceptación de los términos', body: `El acceso y uso de NOWEAR® implica la aceptación plena y sin reservas de estos Términos de Uso, así como de la Política de Privacidad y la Política de Protección de Datos.` },
      { title: '3. Alta y cuenta de usuario', body: `Para usar NOWEAR® como organizadora es necesario crear una cuenta con un email válido. Eres responsable de mantener la confidencialidad de tus credenciales.\n\nLas invitadas no necesitan crear cuenta para registrar su look a través del link del evento.` },
      { title: '4. Planes y pagos', body: `NOWEAR® ofrece los siguientes planes de pago único por evento:\n\n• Plan Básico: 9 € — 1 mes antes, hasta 50 invitadas.\n• Plan Estándar: 19 € — 3 meses antes, hasta 150 invitadas, exportación de lista.\n• Plan Premium: 29 € — sin límite de tiempo, invitadas ilimitadas, personalización del link.\n• Plan Enterprise: precio a medida.\n\nEl pago se realiza a través de Stripe. No se realizan devoluciones una vez activado el plan. No es posible hacer downgrade. Puedes mejorar a un plan superior pagando únicamente la diferencia.` },
      { title: '5. Uso permitido del servicio', body: `Te comprometes a usar NOWEAR® exclusivamente para coordinar looks en eventos reales. Queda prohibido:\n\n• Usar el servicio para fines fraudulentos o ilegales.\n• Registrar looks de otras personas sin su consentimiento.\n• Intentar acceder a datos de otros eventos sin autorización.\n• Realizar ingeniería inversa o intentar vulnerar la seguridad de la plataforma.` },
      { title: '6. Propiedad intelectual', body: `El nombre NOWEAR®, su logotipo, diseño, código fuente y contenidos son propiedad exclusiva de María Teresa Navarrete González, protegidos por la normativa de propiedad intelectual e industrial española y europea.\n\nQueda prohibida su reproducción, distribución o comunicación pública sin autorización expresa.` },
      { title: '7. Marcas de terceros — aviso informativo', body: `Las marcas comerciales de moda mencionadas en NOWEAR® (Zara, Mango, Massimo Dutti u otras) se incluyen exclusivamente con carácter informativo para facilitar el registro de looks.\n\nNOWEAR® no mantiene ninguna relación comercial, patrocinio ni afiliación con dichas marcas. Todas son propiedad de sus respectivos titulares.` },
      { title: '8. Menores de edad', body: `El servicio no está dirigido a menores de 14 años. Si tienes conocimiento de que un menor ha facilitado datos, comunícalo a support@nowear.es.` },
      { title: '9. Limitación de responsabilidad', body: `NOWEAR® no se hace responsable de coincidencias de looks por causas ajenas al uso correcto de la plataforma, ni de pérdida de datos por causas de fuerza mayor.` },
      { title: '10. Cancelación de cuenta', body: `Puedes cancelar tu cuenta en cualquier momento desde el panel de configuración. NOWEAR® se reserva el derecho de suspender cuentas que incumplan estos términos.` },
      { title: '11. Modificación de los términos', body: `NOWEAR® puede modificar estos términos en cualquier momento. Los cambios relevantes se comunicarán con al menos 15 días de antelación.` },
      { title: '12. Legislación aplicable y jurisdicción', body: `Estos términos se rigen por la legislación española. Para cualquier controversia, las partes se someten a los juzgados del domicilio del usuario.` },
      { title: '13. Contacto', body: `Para cualquier consulta: support@nowear.es` },
    ],
    en: [
      { title: '1. Subject and service owner', body: `These Terms of Use govern access and use of the NOWEAR® platform (nowear.es), a look coordination service for social events.\n\nThe service is owned by María Teresa Navarrete González, owner of the registered trademark NOWEAR®, based in Madrid, Spain. Contact: support@nowear.es.` },
      { title: '2. Acceptance', body: `Access to and use of NOWEAR® implies full acceptance of these Terms, the Privacy Policy and the Data Protection Policy.` },
      { title: '3. Account registration', body: `To use NOWEAR® as an organizer you must create an account with a valid email. You are responsible for maintaining the confidentiality of your credentials.\n\nGuests do not need to create an account to register their look via the event link.` },
      { title: '4. Plans and payments', body: `NOWEAR® offers the following one-time payment plans per event:\n\n• Basic Plan: €9 — 1 month before, up to 50 guests.\n• Standard Plan: €19 — 3 months before, up to 150 guests, list export.\n• Premium Plan: €29 — no time limit, unlimited guests, guest link customization.\n• Enterprise Plan: custom pricing.\n\nPayment is processed through Stripe. No refunds once the plan is activated. No downgrade possible. You can upgrade to a higher plan paying only the difference.` },
      { title: '5. Permitted use', body: `You agree to use NOWEAR® exclusively to coordinate looks for real events. The following is prohibited:\n\n• Using the service for fraudulent or illegal purposes.\n• Registering other people's looks without their consent.\n• Attempting to access other events' data without authorization.\n• Reverse engineering or attempting to breach the platform's security.` },
      { title: '6. Intellectual property', body: `The name NOWEAR®, its logo, design, source code and content are the exclusive property of María Teresa Navarrete González, protected by Spanish and European intellectual property law.\n\nReproduction, distribution or public communication without express authorization is prohibited.` },
      { title: '7. Third-party trademarks — informational notice', body: `Fashion brand trademarks mentioned in NOWEAR® (Zara, Mango, Massimo Dutti and others) are included exclusively for informational purposes to facilitate look registration.\n\nNOWEAR® has no commercial relationship, sponsorship or affiliation with these brands. All are the property of their respective owners.` },
      { title: '8. Minors', body: `The service is not directed at persons under 14 years of age. If you know a minor has provided data, please notify us at support@nowear.es.` },
      { title: '9. Limitation of liability', body: `NOWEAR® is not liable for look conflicts caused by improper use of the platform, or for data loss due to force majeure.` },
      { title: '10. Account cancellation', body: `You may cancel your account at any time from the settings panel. NOWEAR® reserves the right to suspend accounts that violate these terms.` },
      { title: '11. Modification of terms', body: `NOWEAR® may modify these terms at any time. Relevant changes will be communicated with at least 15 days notice.` },
      { title: '12. Applicable law and jurisdiction', body: `These terms are governed by Spanish law. Any disputes shall be subject to the courts of the user's domicile.` },
      { title: '13. Contact', body: `For any queries: support@nowear.es` },
    ],
    fr: [
      { title: '1. Objet et titulaire du service', body: `Les présentes Conditions d'Utilisation régissent l'accès et l'utilisation de la plateforme NOWEAR® (nowear.es).\n\nLe service appartient à María Teresa Navarrete González, titulaire de la marque NOWEAR®, domiciliée à Madrid, Espagne. Contact : support@nowear.es.` },
      { title: '2. Acceptation', body: `L'accès et l'utilisation de NOWEAR® impliquent l'acceptation pleine et entière des présentes Conditions, de la Politique de Confidentialité et de la Politique de Protection des Données.` },
      { title: '3. Création de compte', body: `Pour utiliser NOWEAR® en tant qu'organisatrice, vous devez créer un compte avec un email valide.\n\nLes invitées n'ont pas besoin de créer un compte pour enregistrer leur look.` },
      { title: '4. Forfaits et paiements', body: `NOWEAR® propose les forfaits suivants à paiement unique par événement :\n\n• Forfait Basique : 9 € — 1 mois avant, jusqu'à 50 invitées.\n• Forfait Standard : 19 € — 3 mois avant, jusqu'à 150 invitées, export de liste.\n• Forfait Premium : 29 € — sans limite de temps, invitées illimitées, personnalisation du lien.\n• Forfait Enterprise : tarif sur mesure.\n\nAucun remboursement après activation. Pas de downgrade possible.` },
      { title: '5. Utilisation autorisée', body: `Vous vous engagez à utiliser NOWEAR® exclusivement pour coordonner des tenues pour de vrais événements. Il est interdit d'utiliser le service à des fins frauduleuses ou d'enregistrer les looks d'autres personnes sans leur consentement.` },
      { title: '6. Propriété intellectuelle', body: `Le nom NOWEAR®, son logo, design et code source sont la propriété exclusive de María Teresa Navarrete González, protégée par le droit de la propriété intellectuelle espagnol et européen.` },
      { title: '7. Marques tierces — mention informative', body: `Les marques de mode mentionnées dans NOWEAR® (Zara, Mango, etc.) sont incluses uniquement à titre informatif pour faciliter l'enregistrement des looks. NOWEAR® n'a aucune relation commerciale avec ces marques.` },
      { title: '8. Mineurs', body: `Le service n'est pas destiné aux personnes de moins de 14 ans.` },
      { title: '9. Limitation de responsabilité', body: `NOWEAR® n'est pas responsable des conflits de looks causés par une mauvaise utilisation de la plateforme.` },
      { title: '10. Résiliation du compte', body: `Vous pouvez résilier votre compte à tout moment depuis le panneau de configuration.` },
      { title: '11. Modification des conditions', body: `NOWEAR® peut modifier ces conditions à tout moment avec un préavis d'au moins 15 jours.` },
      { title: '12. Droit applicable et juridiction', body: `Les présentes conditions sont régies par le droit espagnol.` },
      { title: '13. Contact', body: `Pour toute question : support@nowear.es` },
    ],
    pt: [
      { title: '1. Objeto e titular do serviço', body: `Estes Termos de Uso regulam o acesso e uso da plataforma NOWEAR® (nowear.es).\n\nO serviço é titularidade de María Teresa Navarrete González, titular da marca registada NOWEAR®, com domicílio em Madrid, Espanha. Contacto: support@nowear.es.` },
      { title: '2. Aceitação', body: `O acesso e uso da NOWEAR® implica a aceitação plena destes Termos, da Política de Privacidade e da Política de Proteção de Dados.` },
      { title: '3. Criação de conta', body: `Para usar a NOWEAR® como organizadora é necessário criar uma conta com um email válido.\n\nAs convidadas não precisam criar conta para registar o seu look.` },
      { title: '4. Planos e pagamentos', body: `NOWEAR® oferece os seguintes planos de pagamento único por evento:\n\n• Plano Básico: 9 € — 1 mês antes, até 50 convidadas.\n• Plano Standard: 19 € — 3 meses antes, até 150 convidadas, exportação de lista.\n• Plano Premium: 29 € — sem limite de tempo, convidadas ilimitadas, personalização do link.\n• Plano Enterprise: preço personalizado.\n\nSem reembolsos após ativação. Sem downgrade possível.` },
      { title: '5. Uso permitido', body: `Comprometes-te a usar a NOWEAR® exclusivamente para coordenar looks em eventos reais. É proibido usar o serviço para fins fraudulentos ou registar looks de outras pessoas sem o seu consentimento.` },
      { title: '6. Propriedade intelectual', body: `O nome NOWEAR®, o seu logótipo, design e código-fonte são propriedade exclusiva de María Teresa Navarrete González, protegida pelo direito de propriedade intelectual espanhol e europeu.` },
      { title: '7. Marcas de terceiros — aviso informativo', body: `As marcas de moda mencionadas na NOWEAR® (Zara, Mango, etc.) incluem-se exclusivamente com carácter informativo. A NOWEAR® não tem qualquer relação comercial com essas marcas.` },
      { title: '8. Menores', body: `O serviço não se destina a menores de 14 anos.` },
      { title: '9. Limitação de responsabilidade', body: `A NOWEAR® não é responsável por conflitos de looks causados por uso incorrecto da plataforma.` },
      { title: '10. Cancelamento de conta', body: `Podes cancelar a tua conta em qualquer momento a partir do painel de configuração.` },
      { title: '11. Modificação dos termos', body: `A NOWEAR® pode modificar estes termos a qualquer momento com um pré-aviso de pelo menos 15 dias.` },
      { title: '12. Lei aplicável e jurisdição', body: `Estes termos regem-se pela legislação espanhola.` },
      { title: '13. Contacto', body: `Para qualquer consulta: support@nowear.es` },
    ],
    de: [
      { title: '1. Gegenstand und Dienstleister', body: `Diese Nutzungsbedingungen regeln den Zugang und die Nutzung der NOWEAR®-Plattform (nowear.es).\n\nDer Dienst gehört María Teresa Navarrete González, Inhaberin der eingetragenen Marke NOWEAR®, mit Sitz in Madrid, Spanien. Kontakt: support@nowear.es.` },
      { title: '2. Annahme', body: `Der Zugang zu und die Nutzung von NOWEAR® impliziert die vollständige Annahme dieser Bedingungen, der Datenschutzrichtlinie und der Datenschutzpolitik.` },
      { title: '3. Kontoregistrierung', body: `Um NOWEAR® als Organisatorin zu nutzen, müssen Sie ein Konto mit einer gültigen E-Mail-Adresse erstellen.\n\nGäste benötigen kein Konto, um ihren Look zu registrieren.` },
      { title: '4. Pakete und Zahlungen', body: `NOWEAR® bietet folgende Einmalzahlungspakete pro Event:\n\n• Basic-Paket: 9 € — 1 Monat vorher, bis zu 50 Gäste.\n• Standard-Paket: 19 € — 3 Monate vorher, bis zu 150 Gäste, Listenexport.\n• Premium-Paket: 29 € — ohne Zeitlimit, unbegrenzte Gäste, Link-Personalisierung.\n• Enterprise-Paket: individueller Preis.\n\nKeine Rückerstattungen nach Aktivierung. Kein Downgrade möglich.` },
      { title: '5. Zulässige Nutzung', body: `Sie verpflichten sich, NOWEAR® ausschließlich zur Koordinierung von Looks für echte Events zu nutzen. Es ist verboten, den Dienst für betrügerische Zwecke zu nutzen oder Looks anderer Personen ohne deren Zustimmung zu registrieren.` },
      { title: '6. Geistiges Eigentum', body: `Der Name NOWEAR®, sein Logo, Design und Quellcode sind das ausschließliche Eigentum von María Teresa Navarrete González, geschützt durch spanisches und europäisches Recht.` },
      { title: '7. Marken Dritter — informativer Hinweis', body: `In NOWEAR® erwähnte Modemarken (Zara, Mango usw.) werden ausschließlich zu Informationszwecken aufgeführt. NOWEAR® unterhält keine Geschäftsbeziehung mit diesen Marken.` },
      { title: '8. Minderjährige', body: `Der Dienst richtet sich nicht an Personen unter 14 Jahren.` },
      { title: '9. Haftungsbeschränkung', body: `NOWEAR® haftet nicht für Look-Konflikte, die durch unsachgemäße Nutzung der Plattform verursacht werden.` },
      { title: '10. Kontokündigung', body: `Sie können Ihr Konto jederzeit über das Einstellungsmenü kündigen.` },
      { title: '11. Änderung der Bedingungen', body: `NOWEAR® kann diese Bedingungen jederzeit mit mindestens 15 Tagen Vorankündigung ändern.` },
      { title: '12. Anwendbares Recht und Gerichtsstand', body: `Diese Bedingungen unterliegen spanischem Recht.` },
      { title: '13. Kontakt', body: `Für Anfragen: support@nowear.es` },
    ],
    nl: [
      { title: '1. Onderwerp en dienstverlener', body: `Deze Gebruiksvoorwaarden regelen de toegang tot en het gebruik van het NOWEAR®-platform (nowear.es).\n\nDe dienst is eigendom van María Teresa Navarrete González, eigenaar van het geregistreerde merk NOWEAR®, gevestigd in Madrid, Spanje. Contact: support@nowear.es.` },
      { title: '2. Aanvaarding', body: `Toegang tot en gebruik van NOWEAR® impliceert volledige aanvaarding van deze Voorwaarden, het Privacybeleid en het Gegevensbeschermingsbeleid.` },
      { title: '3. Accountregistratie', body: `Om NOWEAR® als organisator te gebruiken, moet u een account aanmaken met een geldig e-mailadres.\n\nGasten hoeven geen account aan te maken om hun look te registreren.` },
      { title: '4. Pakketten en betalingen', body: `NOWEAR® biedt de volgende eenmalige betalingspakketten per evenement:\n\n• Basis-pakket: €9 — 1 maand van tevoren, tot 50 gasten.\n• Standaard-pakket: €19 — 3 maanden van tevoren, tot 150 gasten, lijstexport.\n• Premium-pakket: €29 — geen tijdslimiet, onbeperkte gasten, link-aanpassing.\n• Enterprise-pakket: aangepaste prijs.\n\nGeen terugbetalingen na activering. Geen downgrade mogelijk.` },
      { title: '5. Toegestaan gebruik', body: `U verbindt zich ertoe NOWEAR® uitsluitend te gebruiken voor het coördineren van looks voor echte evenementen. Het is verboden de dienst voor frauduleuze doeleinden te gebruiken.` },
      { title: '6. Intellectueel eigendom', body: `De naam NOWEAR®, het logo, ontwerp en broncode zijn het exclusieve eigendom van María Teresa Navarrete González, beschermd door Spaans en Europees recht.` },
      { title: '7. Merken van derden — informatieve mededeling', body: `Modebrandmerken vermeld in NOWEAR® (Zara, Mango enz.) zijn uitsluitend opgenomen voor informatieve doeleinden. NOWEAR® heeft geen commerciële relatie met deze merken.` },
      { title: '8. Minderjarigen', body: `De dienst is niet gericht op personen onder de 14 jaar.` },
      { title: '9. Beperking van aansprakelijkheid', body: `NOWEAR® is niet aansprakelijk voor look-conflicten veroorzaakt door onjuist gebruik van het platform.` },
      { title: '10. Accountopzegging', body: `U kunt uw account op elk moment opzeggen via het instellingenpaneel.` },
      { title: '11. Wijziging van voorwaarden', body: `NOWEAR® kan deze voorwaarden op elk moment wijzigen met een vooraankondiging van minimaal 15 dagen.` },
      { title: '12. Toepasselijk recht en jurisdictie', body: `Deze voorwaarden worden beheerst door Spaans recht.` },
      { title: '13. Contact', body: `Voor vragen: support@nowear.es` },
    ]
  }

  return (
    <div style={{maxWidth:'760px',margin:'0 auto',padding:'6rem 2rem'}}>
      <span style={{display:'inline-flex',alignItems:'center',gap:'0.6rem',fontSize:'0.6rem',fontWeight:600,letterSpacing:'0.18em',textTransform:'uppercase',color:'#F07987',marginBottom:'2rem'}}>
        <span style={{width:'24px',height:'1px',background:'#F07987',display:'inline-block'}}></span>{t('badge')}
      </span>
      <h1 style={{fontSize:'2.5rem',fontWeight:100,letterSpacing:'-0.025em',marginBottom:'0.5rem'}}>
        {t('terminosTitulo')} <strong style={{fontWeight:700}}>{t('terminosEmphasis')}</strong>
      </h1>
      <p style={{fontSize:'0.78rem',color:'#888884',marginBottom:'3rem'}}>{t('ultimaActualizacion')}</p>
      <TerminosContent secciones={secciones} t={t} />
    </div>
  )
}

function TerminosContent({ secciones, t }) {
  if (typeof window === 'undefined') return null
  const lang = document.documentElement.lang || 'es'
  const locale = ['es','fr','en','pt','de','nl'].includes(lang) ? lang : 'es'
  const content = secciones[locale] || secciones['es']
  return (
    <>
      {content.map((s, i) => (
        <div key={i} style={{marginBottom:'2.5rem'}}>
          <h2 style={{fontSize:'1rem',fontWeight:600,marginBottom:'0.75rem',letterSpacing:'-0.01em'}}>{s.title}</h2>
          {s.body.split('\n').map((line, j) => (
            <p key={j} style={{fontSize:'0.875rem',fontWeight:300,color:'#444442',lineHeight:1.9,marginBottom:'0.25rem'}}>{line}</p>
          ))}
        </div>
      ))}
      <div style={{marginTop:'3rem',padding:'1.5rem',background:'#F7F7F5',border:'1px solid #E0E0DC',borderRadius:'8px'}}>
        <p style={{fontSize:'0.78rem',fontWeight:300,color:'#888884',lineHeight:1.8}}>
          {t('contactoInfo')} <a href="mailto:support@nowear.es" style={{color:'#F07987',textDecoration:'none'}}>support@nowear.es</a>
        </p>
      </div>
      <p style={{fontSize:'0.65rem',fontWeight:300,color:'#BEBEBA',marginTop:'3rem',textAlign:'center'}}>{t('copyright')}</p>
    </>
  )
}