import {NextIntlClientProvider} from 'next-intl'
import {getMessages} from 'next-intl/server'
import NavbarWrapper from '../components/NavbarWrapper'
import '../globals.css'
import CookieBanner from '../components/CookieBanner'

const SUPABASE = 'https://qhuatexjyxbunotvghjh.supabase.co/storage/v1/object/public/fotos/'

const META = {
  es: {
    title: 'NOWEAR — Que ninguna invitada llegue vestida igual',
    description: 'La plataforma para que las invitadas de una boda, comunión o bautizo no coincidan con el mismo vestido. Registra tu look, detecta coincidencias y disfruta tranquila. Desde 9€.',
    keywords: 'nowear, no wear, nowear app, nowear es, no wear app, web para invitadas boda, web invitadas vestidos, web invitadas outfits, web vestidos invitadas, web looks invitadas, app invitadas boda, app para invitadas boda, app eventos vestidos, app coordinación looks, app vestidos boda, aplicación invitadas boda, aplicación para no coincidir boda, aplicación coordinación outfits boda, plataforma invitadas boda, plataforma looks boda, plataforma vestidos evento, que no coincidan los vestidos en una boda, dos invitadas mismo vestido boda, evitar ir igual que otra invitada, cómo coordinar looks invitadas boda, como no coincidir con nadie en una boda, evitar coincidir vestido boda, no llegar igual a una boda, que nadie lleve el mismo vestido, invitadas boda mismo vestido, registro looks boda, registrar outfit boda, registrar vestido boda, reservar look boda, coordinación outfits boda, coordinación looks invitadas, coordinar vestidos invitadas boda, look invitada boda, looks invitadas boda, outfit invitada boda, outfits invitadas boda, vestido invitada boda, vestidos invitadas boda, vestido para boda invitada, vestidos para boda, look invitada comunión, looks invitadas comunión, outfit comunión invitada, vestido comunión invitada, look invitada bautizo, outfit bautizo invitada, vestido bautizo invitada, look invitada graduación, outfit graduación invitada, vestido graduación, look invitada gala, outfit gala invitada, vestido gala invitada, dress code boda, dress code evento, dress code invitadas, moda invitadas boda, moda invitadas evento, moda boda invitada, estilo invitada boda, estilo invitadas evento, tendencias invitadas boda, tendencias looks boda 2025, tendencias looks boda 2026, marcas vestidos invitadas, tiendas vestidos invitadas boda, organizar boda looks, organizar vestidos invitadas, gestionar looks boda, herramienta boda invitadas, herramienta coordinación looks, herramienta vestidos evento, sin coincidir boda, sin repetir look boda, look único boda invitada, prerreserva look boda, reservar vestido boda, bloquear look boda, conflicto looks boda, dos vestidos iguales boda, misma ropa boda invitadas, link invitadas boda, enlace invitadas boda, formulario invitadas boda, boda sin repeticiones outfits, comunión sin repetir looks, bautizo coordinación vestidos, evento con dress code, evento coordinado looks, evento sin coincidir vestidos',
  },
  en: {
    title: 'NOWEAR — No Two Looks Alike at Your Event',
    description: 'The platform so no wedding guest shows up wearing the same outfit. Register your look, detect conflicts and enjoy the day. From €9 per event.',
    keywords: 'nowear, no wear, nowear app, wedding guests same dress, avoid same outfit wedding, two guests same dress wedding, coordinate looks wedding, wedding outfit tracker, no two looks alike, guest outfit coordination, wedding app guests, wedding outfit app, app for wedding guests, platform wedding outfits, register look wedding, wedding dress conflict, same outfit wedding guests, bridesmaid look coordination, wedding guest dress code, event outfit coordination, gala outfit coordination, communion guest outfit, christening guest outfit, graduation outfit coordination, dress code event app, outfit registration event, wedding look reservation, block outfit wedding, wedding outfit platform, event look management',
  },
  fr: {
    title: 'NOWEAR — Pour que personne ne porte la même tenue',
    description: 'La plateforme pour éviter que les invitées d\'un mariage, communion ou baptême portent la même robe. Enregistrez votre look, détectez les doublons. À partir de 9€.',
    keywords: 'nowear, no wear, nowear app, invitées mariage même robe, éviter même tenue mariage, deux invitées même robe mariage, coordonner looks mariage, application mariage invitées, tenue mariage coordination, app invitées mariage, plateforme looks mariage, enregistrer tenue mariage, conflit tenues mariage, robe mariage invitée, looks invitées mariage, coordination tenues événement, dress code mariage app, réservation look mariage, même tenue communion invitées, coordination looks baptême, gala tenue coordination',
  },
  pt: {
    title: 'NOWEAR — Para que ninguém apareça vestida igual',
    description: 'A plataforma para que as convidadas de um casamento, comunhão ou batizado não coincidam com o mesmo vestido. Regista o teu look, deteta coincidências. A partir de 9€.',
    keywords: 'nowear, no wear, nowear app, convidadas casamento mesmo vestido, evitar coincidir vestido casamento, duas convidadas mesmo vestido, coordenar looks casamento, app casamento convidadas, plataforma looks casamento, registar look casamento, conflito trajes casamento, vestido convidada casamento, looks convidadas casamento, coordenação looks evento, dress code casamento app, reserva look casamento, comunhão coordenação looks, batizado coordenação vestidos',
  },
  de: {
    title: 'NOWEAR — Damit keine Gästin gleich gekleidet erscheint',
    description: 'Die Plattform damit Hochzeitsgäste nicht dasselbe Kleid tragen. Registrieren Sie Ihr Outfit, erkennen Sie Überschneidungen und genießen Sie entspannt. Ab 9€.',
    keywords: 'nowear, no wear, nowear app, Hochzeitsgäste gleiches Kleid, gleiches Outfit Hochzeit vermeiden, zwei Gäste gleiches Kleid Hochzeit, Looks koordinieren Hochzeit, Hochzeit App Gäste, Plattform Hochzeit Outfits, Look registrieren Hochzeit, Hochzeit Outfit Konflikt, Kleid Hochzeitsgast, Hochzeit Look Koordinierung, Event Outfit Koordinierung, Dresscode Hochzeit App, Look Reservierung Hochzeit, Kommunion Outfit Koordinierung, Taufe Outfit Koordinierung',
  },
  it: {
    title: 'NOWEAR — Nessuna ospite arriva vestita uguale',
    description: 'La piattaforma perché nessuna ospite di un matrimonio, comunione o battesimo indossi lo stesso vestito. Registra il tuo look, rileva i conflitti. Da 9€.',
    keywords: 'nowear, ospiti matrimonio stesso vestito, evitare stesso outfit matrimonio, coordinare look matrimonio, app ospiti matrimonio, look sposa ospite, vestito ospite matrimonio italia',
  },
  nl: {
    title: 'NOWEAR — Zodat niemand hetzelfde draagt op jouw event',
    description: 'Het platform zodat bruiloftsgasten niet dezelfde jurk dragen. Registreer je look, detecteer conflicten en geniet zorgeloos. Vanaf €9 per evenement.',
    keywords: 'nowear, no wear, nowear app, bruiloftsgasten zelfde jurk, zelfde outfit bruiloft vermijden, twee gasten zelfde jurk bruiloft, looks coördineren bruiloft, bruiloft app gasten, platform bruiloft outfits, look registreren bruiloft, bruiloft outfit conflict, jurk bruiloftsgast, bruiloft look coördinatie, evenement outfit coördinatie, dresscode bruiloft app, look reservering bruiloft, communie outfit coördinatie, doop outfit coördinatie',
  },
}

export default async function LocaleLayout({children, params}) {
  const {locale} = await params
  const messages = await getMessages()
  const meta = META[locale] || META.es
  const canonical = locale === 'es' ? 'https://nowear.es' : `https://nowear.es/${locale}`

  return (
    <html lang={locale}>
      <head>
        <meta charSet="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* TÍTULO Y DESCRIPCIÓN */}
        <title>{meta.title}</title>
        <meta name="description" content={meta.description}/>
        <meta name="keywords" content={meta.keywords}/>
        <meta name="author" content="NOWEAR"/>
        <meta name="robots" content="index, follow"/>
        <link rel="canonical" href={canonical}/>

        {/* HREFLANG - indica a Google las versiones por idioma */}
        <link rel="alternate" hrefLang="es" href="https://nowear.es"/>
        <link rel="alternate" hrefLang="fr" href="https://nowear.es/fr"/>
        <link rel="alternate" hrefLang="en" href="https://nowear.es/en"/>
        <link rel="alternate" hrefLang="pt" href="https://nowear.es/pt"/>
        <link rel="alternate" hrefLang="de" href="https://nowear.es/de"/>
        <link rel="alternate" hrefLang="nl" href="https://nowear.es/nl"/>
        <link rel="alternate" hrefLang="it" href="https://nowear.es/it"/>
        <link rel="alternate" hrefLang="x-default" href="https://nowear.es"/>

        {/* OPEN GRAPH */}
        <meta property="og:title" content={meta.title}/>
        <meta property="og:description" content={meta.description}/>
        <meta property="og:image" content={`${SUPABASE}nowear-og.jpg`}/>
        <meta property="og:image:width" content="1200"/>
        <meta property="og:image:height" content="630"/>
        <meta property="og:image:alt" content="NOWEAR — No two looks alike"/>
        <meta property="og:url" content={canonical}/>
        <meta property="og:type" content="website"/>
        <meta property="og:site_name" content="NOWEAR"/>
        <meta property="og:locale" content={locale === 'es' ? 'es_ES' : locale === 'fr' ? 'fr_FR' : locale === 'en' ? 'en_GB' : locale === 'pt' ? 'pt_PT' : locale === 'de' ? 'de_DE' : 'nl_NL'}/>

        {/* TWITTER */}
        <meta name="twitter:card" content="summary_large_image"/>
        <meta name="twitter:site" content="@nowearapp"/>
        <meta name="twitter:title" content={meta.title}/>
        <meta name="twitter:description" content={meta.description}/>
        <meta name="twitter:image" content={`${SUPABASE}nowear-og.jpg`}/>

        {/* FAVICON */}
        <link rel="icon" href={`${SUPABASE}favicon.png`} type="image/png"/>
        <link rel="apple-touch-icon" href={`${SUPABASE}favicon.png`}/>
        <meta name="theme-color" content="#0A0A0A"/>

        {/* STRUCTURED DATA - Schema.org */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "NOWEAR",
          "alternateName": "No two looks alike",
          "description": META.es.description,
          "url": "https://nowear.es",
          "applicationCategory": "LifestyleApplication",
          "operatingSystem": "Web",
          "offers": [
            { "@type": "Offer", "price": "9", "priceCurrency": "EUR", "name": "Plan Básico" },
            { "@type": "Offer", "price": "19", "priceCurrency": "EUR", "name": "Plan Estándar" },
            { "@type": "Offer", "price": "29", "priceCurrency": "EUR", "name": "Plan Premium" },
          ],
          "featureList": [
            "Detección automática de looks coincidentes",
            "Registro de outfits por invitadas",
            "Notificaciones por email",
            "Panel de organizadora",
            "Exportar lista de looks",
            "Personalización de enlace de invitada",
            "Compatible con bodas, comuniones, bautizos y galas"
          ],
          "audience": {
            "@type": "Audience",
            "audienceType": "Novias, organizadoras de eventos, invitadas a bodas"
          },
          "inLanguage": ["es","fr","en","pt","de","nl","it"],
          "sameAs": ["https://www.instagram.com/nowearapp"],
        })}}/>

        {/* FUENTES */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,200;1,300;1,400&display=swap" rel="stylesheet" />

        {/* GA4 - carga con consentimiento por defecto denegado */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-WNMFPXECYM"></script>
        <script dangerouslySetInnerHTML={{ __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('consent', 'default', { analytics_storage: 'denied' });
          gtag('js', new Date());
          gtag('config', 'G-WNMFPXECYM', { send_page_view: false });
          var consent = localStorage.getItem('nw_cookie_consent');
          if (consent === 'accepted') {
            gtag('consent', 'update', { analytics_storage: 'granted' });
            gtag('event', 'page_view');
          }
        `}} />
      </head>
      <body style={{fontFamily:"'Poppins', sans-serif"}}>
        <NextIntlClientProvider messages={messages}>
          <NavbarWrapper locale={locale}/>
          <div style={{paddingTop:'68px'}}>
            {children}
        <CookieBanner />
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}