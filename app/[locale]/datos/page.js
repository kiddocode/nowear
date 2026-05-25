'use client'
import { useTranslations } from 'next-intl'

export default function Datos() {
  const t = useTranslations('legal')

  const secciones = {
    es: [
      { title: '1. Marco normativo', body: `El tratamiento de datos personales en NOWEAR® se realiza conforme al Reglamento General de Protección de Datos (RGPD, Reglamento UE 2016/679) y a la Ley Orgánica 3/2018 (LOPDGDD).` },
      { title: '2. Responsable del tratamiento', body: `Responsable: María Teresa Navarrete González\nTitular de la marca: NOWEAR®\nDomicilio: Madrid, España\nEmail de contacto: support@nowear.es` },
      { title: '3. Categorías de datos tratados', body: `• Datos identificativos: nombre y email de organizadoras e invitadas.\n• Datos de acceso: credenciales cifradas mediante Supabase Auth.\n• Datos del evento: looks registrados, coincidencias detectadas. Visibles únicamente para la organizadora y el equipo NOWEAR® en casos de soporte técnico. Las invitadas no acceden a los looks de otras participantes.\n• Datos de navegación: IP, navegador, páginas visitadas.\n\nNo se tratan categorías especiales de datos (art. 9 RGPD).` },
      { title: '4. Finalidades y bases jurídicas', body: `• Prestación del servicio: ejecución del contrato (art. 6.1.b RGPD).\n• Gestión de pagos: ejecución del contrato (art. 6.1.b RGPD).\n• Emails transaccionales: ejecución del contrato (art. 6.1.b RGPD).\n• Mejora del servicio: interés legítimo (art. 6.1.f RGPD).\n• Obligaciones legales: art. 6.1.c RGPD.\n\nNOWEAR® no enviará comunicaciones comerciales sin consentimiento previo.` },
      { title: '5. Plazo de conservación', body: `• Datos de cuenta: hasta 30 días tras eliminación voluntaria.\n• Datos de invitadas: hasta 30 días después del evento.\n• Datos de facturación: 5 años (legislación fiscal española).\n• Datos de contacto: hasta resolver la consulta.` },
      { title: '6. Encargados del tratamiento', body: `• Supabase: base de datos y autenticación.\n• Stripe: procesamiento de pagos (PCI DSS nivel 1).\n• Vercel: hosting y CDN.\n• Resend: emails transaccionales.\n\nTodos con garantías adecuadas conforme al RGPD.` },
      { title: '7. Transferencias internacionales', body: `Algunos proveedores pueden tratar datos fuera del EEE. NOWEAR® adopta las garantías exigidas por el RGPD, incluyendo cláusulas contractuales tipo aprobadas por la Comisión Europea.` },
      { title: '8. Menores de edad', body: `El servicio no está dirigido a menores de 14 años. Si detectamos datos de menores sin autorización, los eliminaremos inmediatamente.` },
      { title: '9. Derechos de los interesados', body: `Puedes ejercer los siguientes derechos enviando un email a support@nowear.es:\n\n• Acceso (art. 15 RGPD)\n• Rectificación (art. 16 RGPD)\n• Supresión (art. 17 RGPD)\n• Limitación (art. 18 RGPD)\n• Portabilidad (art. 20 RGPD)\n• Oposición (art. 21 RGPD)\n\nRespondemos en un plazo máximo de 30 días. Puedes reclamar ante la AEPD (www.aepd.es).` },
      { title: '10. Medidas de seguridad', body: `• Cifrado de contraseñas mediante bcrypt.\n• Conexiones TLS 1.2/1.3 (HTTPS).\n• Row Level Security (RLS) en base de datos.\n• Acceso restringido a la titular del servicio.\n• Copias de seguridad periódicas.` },
      { title: '11. Delegado de Protección de Datos', body: `NOWEAR® no está obligada a designar un DPO (art. 37 RGPD). Para consultas sobre protección de datos: support@nowear.es.` },
    ],
    en: [
      { title: '1. Legal framework', body: `Personal data processing at NOWEAR® is carried out in accordance with the General Data Protection Regulation (GDPR, EU Regulation 2016/679).` },
      { title: '2. Data Controller', body: `Controller: María Teresa Navarrete González\nBrand owner: NOWEAR®\nDomicile: Madrid, Spain\nContact email: support@nowear.es` },
      { title: '3. Categories of data processed', body: `• Identification data: name and email of organizers and guests.\n• Access data: credentials encrypted via Supabase Auth.\n• Event data: registered looks and detected conflicts. Only visible to the event organizer and NOWEAR® team for technical support. Guests cannot see other participants' looks.\n• Navigation data: IP, browser, pages visited.\n\nNo special categories of data are processed (Art. 9 GDPR).` },
      { title: '4. Purposes and legal bases', body: `• Service provision: contract performance (Art. 6.1.b GDPR).\n• Payment processing: contract performance (Art. 6.1.b GDPR).\n• Transactional emails: contract performance (Art. 6.1.b GDPR).\n• Service improvement: legitimate interest (Art. 6.1.f GDPR).\n• Legal obligations: Art. 6.1.c GDPR.\n\nNOWEAR® will not send commercial communications without prior consent.` },
      { title: '5. Retention period', body: `• Account data: up to 30 days after voluntary deletion.\n• Guest data: up to 30 days after the event.\n• Billing data: 5 years (Spanish tax law).\n• Contact data: until the query is resolved.` },
      { title: '6. Data processors', body: `• Supabase: database and authentication.\n• Stripe: payment processing (PCI DSS Level 1).\n• Vercel: hosting and CDN.\n• Resend: transactional emails.\n\nAll with appropriate GDPR safeguards.` },
      { title: '7. International transfers', body: `Some providers may process data outside the EEA. NOWEAR® applies the safeguards required by the GDPR, including standard contractual clauses approved by the European Commission.` },
      { title: '8. Minors', body: `The service is not directed at persons under 14 years of age. If we detect data from minors without authorization, we will delete it immediately.` },
      { title: "9. Data subjects' rights", body: `You may exercise the following rights by emailing support@nowear.es:\n\n• Access (Art. 15 GDPR)\n• Rectification (Art. 16 GDPR)\n• Erasure (Art. 17 GDPR)\n• Restriction (Art. 18 GDPR)\n• Portability (Art. 20 GDPR)\n• Objection (Art. 21 GDPR)\n\nWe respond within 30 days. You may also complain to the AEPD (www.aepd.es).` },
      { title: '10. Security measures', body: `• bcrypt password encryption.\n• TLS 1.2/1.3 (HTTPS) connections.\n• Row Level Security (RLS) in database.\n• Access restricted to the service owner.\n• Regular backups.` },
      { title: '11. Data Protection Officer', body: `NOWEAR® is not required to appoint a DPO (Art. 37 GDPR). For data protection queries: support@nowear.es.` },
    ],
    fr: [
      { title: '1. Cadre réglementaire', body: `Le traitement des données personnelles chez NOWEAR® est effectué conformément au Règlement Général sur la Protection des Données (RGPD, Règlement UE 2016/679).` },
      { title: '2. Responsable du traitement', body: `Responsable : María Teresa Navarrete González\nTitulaire de la marque : NOWEAR®\nDomicile : Madrid, Espagne\nEmail de contact : support@nowear.es` },
      { title: '3. Catégories de données traitées', body: `• Données d'identification : nom et email des organisatrices et invitées.\n• Données d'accès : identifiants chiffrés via Supabase Auth.\n• Données de l'événement : looks enregistrés et conflits détectés. Visibles uniquement par l'organisatrice et l'équipe NOWEAR® pour le support. Les invitées ne voient pas les looks des autres.\n• Données de navigation : IP, navigateur, pages visitées.` },
      { title: '4. Finalités et bases légales', body: `• Prestation du service : exécution du contrat (art. 6.1.b RGPD).\n• Traitement des paiements : exécution du contrat (art. 6.1.b RGPD).\n• Emails transactionnels : exécution du contrat (art. 6.1.b RGPD).\n• Amélioration du service : intérêt légitime (art. 6.1.f RGPD).\n\nNOWEAR® n'enverra pas de communications commerciales sans consentement préalable.` },
      { title: '5. Durée de conservation', body: `• Données de compte : jusqu'à 30 jours après suppression.\n• Données des invitées : jusqu'à 30 jours après l'événement.\n• Données de facturation : 5 ans.\n• Données de contact : jusqu'à résolution de la demande.` },
      { title: '6. Sous-traitants', body: `• Supabase, Stripe (PCI DSS niveau 1), Vercel et Resend.\n\nTous avec les garanties adéquates du RGPD.` },
      { title: '7. Transferts internationaux', body: `Certains prestataires peuvent traiter des données hors de l'EEE avec les garanties RGPD appropriées, notamment les clauses contractuelles types.` },
      { title: '8. Mineurs', body: `Le service n'est pas destiné aux personnes de moins de 14 ans. Les données de mineurs seront supprimées immédiatement si détectées.` },
      { title: '9. Droits des personnes concernées', body: `Vous pouvez exercer vos droits d'accès, rectification, effacement, limitation, portabilité et opposition en écrivant à support@nowear.es.\n\nVous pouvez également déposer une plainte auprès de la CNIL ou de l'AEPD (www.aepd.es).` },
      { title: '10. Mesures de sécurité', body: `• Chiffrement des mots de passe (bcrypt).\n• Connexions TLS/HTTPS.\n• Row Level Security dans la base de données.\n• Sauvegardes régulières.` },
      { title: '11. Délégué à la Protection des Données', body: `NOWEAR® n'est pas tenu de désigner un DPD (art. 37 RGPD). Pour toute question : support@nowear.es.` },
    ],
    pt: [
      { title: '1. Enquadramento legal', body: `O tratamento de dados pessoais na NOWEAR® é realizado em conformidade com o Regulamento Geral sobre a Proteção de Dados (RGPD, Regulamento UE 2016/679).` },
      { title: '2. Responsável pelo tratamento', body: `Responsável: María Teresa Navarrete González\nTitular da marca: NOWEAR®\nDomicílio: Madrid, Espanha\nEmail de contacto: support@nowear.es` },
      { title: '3. Categorias de dados tratados', body: `• Dados identificativos: nome e email de organizadoras e convidadas.\n• Dados de acesso: credenciais cifradas via Supabase Auth.\n• Dados do evento: looks registados e conflitos detetados. Visíveis apenas para a organizadora e equipa NOWEAR® para suporte técnico.\n• Dados de navegação: IP, navegador, páginas visitadas.` },
      { title: '4. Finalidades e bases jurídicas', body: `• Prestação do serviço: execução do contrato (art. 6.1.b RGPD).\n• Processamento de pagamentos: execução do contrato (art. 6.1.b RGPD).\n• Emails transacionais: execução do contrato (art. 6.1.b RGPD).\n• Melhoria do serviço: interesse legítimo (art. 6.1.f RGPD).` },
      { title: '5. Prazo de conservação', body: `• Dados de conta: até 30 dias após eliminação.\n• Dados de convidadas: até 30 dias após o evento.\n• Dados de faturação: 5 anos.\n• Dados de contacto: até resolução da consulta.` },
      { title: '6. Subcontratantes', body: `• Supabase, Stripe (PCI DSS nível 1), Vercel e Resend, todos com garantias adequadas ao RGPD.` },
      { title: '7. Transferências internacionais', body: `Alguns fornecedores podem tratar dados fora do EEE com as garantias exigidas pelo RGPD.` },
      { title: '8. Menores', body: `O serviço não se destina a menores de 14 anos. Dados de menores serão eliminados imediatamente se detetados.` },
      { title: '9. Direitos dos titulares', body: `Podes exercer os direitos de acesso, retificação, eliminação, limitação, portabilidade e oposição enviando email para support@nowear.es.\n\nPodes também apresentar reclamação à AEPD (www.aepd.es).` },
      { title: '10. Medidas de segurança', body: `• Cifração de palavras-passe (bcrypt).\n• Ligações TLS/HTTPS.\n• Row Level Security na base de dados.\n• Cópias de segurança regulares.` },
      { title: '11. Encarregado de Proteção de Dados', body: `A NOWEAR® não é obrigada a designar um EPD (art. 37 RGPD). Para consultas: support@nowear.es.` },
    ],
    de: [
      { title: '1. Rechtsrahmen', body: `Die Verarbeitung personenbezogener Daten bei NOWEAR® erfolgt gemäß der Datenschutz-Grundverordnung (DSGVO, EU-Verordnung 2016/679).` },
      { title: '2. Verantwortlicher', body: `Verantwortlicher: María Teresa Navarrete González\nMarkeninhaber: NOWEAR®\nSitz: Madrid, Spanien\nKontakt-E-Mail: support@nowear.es` },
      { title: '3. Kategorien verarbeiteter Daten', body: `• Identifikationsdaten: Name und E-Mail von Organisatorinnen und Gästen.\n• Zugangsdaten: verschlüsselte Zugangsdaten über Supabase Auth.\n• Event-Daten: registrierte Looks und erkannte Konflikte. Nur für die Organisatorin und das NOWEAR®-Team sichtbar.\n• Navigationsdaten: IP, Browser, besuchte Seiten.` },
      { title: '4. Zwecke und Rechtsgrundlagen', body: `• Dienstleistungserbringung: Vertragserfüllung (Art. 6.1.b DSGVO).\n• Zahlungsabwicklung: Vertragserfüllung (Art. 6.1.b DSGVO).\n• Transaktions-E-Mails: Vertragserfüllung (Art. 6.1.b DSGVO).\n• Serviceverbesserung: berechtigte Interessen (Art. 6.1.f DSGVO).` },
      { title: '5. Speicherdauer', body: `• Kontodaten: bis zu 30 Tage nach Löschung.\n• Gästedaten: bis zu 30 Tage nach dem Event.\n• Rechnungsdaten: 5 Jahre.\n• Kontaktdaten: bis zur Lösung der Anfrage.` },
      { title: '6. Auftragsverarbeiter', body: `• Supabase, Stripe (PCI DSS Level 1), Vercel und Resend, alle mit angemessenen DSGVO-Garantien.` },
      { title: '7. Internationale Übermittlungen', body: `Einige Anbieter können Daten außerhalb des EWR verarbeiten, mit den von der DSGVO geforderten Garantien.` },
      { title: '8. Minderjährige', body: `Der Dienst richtet sich nicht an Personen unter 14 Jahren. Daten Minderjähriger werden sofort gelöscht.` },
      { title: '9. Rechte der betroffenen Personen', body: `Sie können folgende Rechte per E-Mail an support@nowear.es ausüben:\n\n• Auskunft (Art. 15 DSGVO)\n• Berichtigung (Art. 16 DSGVO)\n• Löschung (Art. 17 DSGVO)\n• Einschränkung (Art. 18 DSGVO)\n• Datenübertragbarkeit (Art. 20 DSGVO)\n• Widerspruch (Art. 21 DSGVO)` },
      { title: '10. Sicherheitsmaßnahmen', body: `• bcrypt-Passwortverschlüsselung.\n• TLS/HTTPS-Verbindungen.\n• Row Level Security in der Datenbank.\n• Regelmäßige Backups.` },
      { title: '11. Datenschutzbeauftragter', body: `NOWEAR® ist nicht verpflichtet, einen DSB zu benennen (Art. 37 DSGVO). Für Fragen: support@nowear.es.` },
    ],
    nl: [
      { title: '1. Wettelijk kader', body: `De verwerking van persoonsgegevens bij NOWEAR® vindt plaats in overeenstemming met de Algemene Verordening Gegevensbescherming (AVG, EU-Verordening 2016/679).` },
      { title: '2. Verwerkingsverantwoordelijke', body: `Verantwoordelijke: María Teresa Navarrete González\nMerkeigenaar: NOWEAR®\nVestplaats: Madrid, Spanje\nContact-e-mail: support@nowear.es` },
      { title: '3. Categorieën verwerkte gegevens', body: `• Identificatiegegevens: naam en e-mail van organisatoren en gasten.\n• Toegangsgegevens: versleutelde inloggegevens via Supabase Auth.\n• Eventgegevens: geregistreerde looks en gedetecteerde conflicten. Alleen zichtbaar voor de organisator en het NOWEAR®-team.\n• Navigatiegegevens: IP, browser, bezochte pagina's.` },
      { title: '4. Doeleinden en rechtsgrondslagen', body: `• Dienstverlening: uitvoering van overeenkomst (art. 6.1.b AVG).\n• Betalingsverwerking: uitvoering van overeenkomst (art. 6.1.b AVG).\n• Transactionele e-mails: uitvoering van overeenkomst (art. 6.1.b AVG).\n• Serviceverbetering: gerechtvaardigd belang (art. 6.1.f AVG).` },
      { title: '5. Bewaartermijn', body: `• Accountgegevens: tot 30 dagen na verwijdering.\n• Gastgegevens: tot 30 dagen na het evenement.\n• Factureringsgegevens: 5 jaar.\n• Contactgegevens: tot oplossing van het verzoek.` },
      { title: '6. Verwerkers', body: `• Supabase, Stripe (PCI DSS Level 1), Vercel en Resend, allemaal met passende AVG-garanties.` },
      { title: '7. Internationale overdrachten', body: `Sommige providers kunnen gegevens buiten de EER verwerken met de door de AVG vereiste garanties.` },
      { title: '8. Minderjarigen', body: `De dienst is niet gericht op personen onder de 14 jaar. Gegevens van minderjarigen worden onmiddellijk verwijderd.` },
      { title: '9. Rechten van betrokkenen', body: `U kunt de volgende rechten uitoefenen door te e-mailen naar support@nowear.es:\n\n• Toegang (art. 15 AVG)\n• Rectificatie (art. 16 AVG)\n• Verwijdering (art. 17 AVG)\n• Beperking (art. 18 AVG)\n• Overdraagbaarheid (art. 20 AVG)\n• Bezwaar (art. 21 AVG)` },
      { title: '10. Beveiligingsmaatregelen', body: `• bcrypt wachtwoordversleuteling.\n• TLS/HTTPS-verbindingen.\n• Row Level Security in database.\n• Regelmatige back-ups.` },
      { title: '11. Functionaris voor Gegevensbescherming', body: `NOWEAR® is niet verplicht een FG aan te stellen (art. 37 AVG). Voor vragen: support@nowear.es.` },
    ]
  }

  return (
    <div style={{maxWidth:'760px',margin:'0 auto',padding:'6rem 2rem'}}>
      <span style={{display:'inline-flex',alignItems:'center',gap:'0.6rem',fontSize:'0.6rem',fontWeight:600,letterSpacing:'0.18em',textTransform:'uppercase',color:'#F07987',marginBottom:'2rem'}}>
        <span style={{width:'24px',height:'1px',background:'#F07987',display:'inline-block'}}></span>{t('badge')}
      </span>
      <h1 style={{fontSize:'2.5rem',fontWeight:100,letterSpacing:'-0.025em',marginBottom:'0.5rem'}}>
        {t('datosTitulo')} <strong style={{fontWeight:700}}>{t('datosEmphasis')}</strong>
      </h1>
      <p style={{fontSize:'0.78rem',color:'#888884',marginBottom:'3rem'}}>{t('ultimaActualizacion')}</p>
      <DatosContent secciones={secciones} t={t} />
    </div>
  )
}

function DatosContent({ secciones, t }) {
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
          {t('contactoInfoDatos')} <a href="mailto:support@nowear.es" style={{color:'#F07987',textDecoration:'none'}}>support@nowear.es</a>
        </p>
      </div>
      <p style={{fontSize:'0.65rem',fontWeight:300,color:'#BEBEBA',marginTop:'3rem',textAlign:'center'}}>{t('copyright')}</p>
    </>
  )
}