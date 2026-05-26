import {NextIntlClientProvider} from 'next-intl'
import {getMessages} from 'next-intl/server'
import NavbarWrapper from '../components/NavbarWrapper'
import '../globals.css'

const SUPABASE = 'https://qhuatexjyxbunotvghjh.supabase.co/storage/v1/object/public/fotos/'

const META = {
  es: {
    title: 'NOWEAR — Que ninguna invitada llegue vestida igual',
    description: 'La plataforma para coordinar looks en bodas, comuniones y bautizos. Registra tu outfit, detecta coincidencias y disfruta tranquila. Desde 9€ por evento.',
    keywords: 'nowear, coordinación looks boda, invitadas boda vestido igual, outfits boda coordinados, registro looks evento, boda comunión bautizo moda',
  },
  fr: {
    title: 'NOWEAR — Pour que personne ne porte la même tenue',
    description: 'La plateforme pour coordonner les tenues lors de mariages, communions et baptêmes. Enregistrez votre look, détectez les doublons. À partir de 9€ par événement.',
    keywords: 'nowear, coordination tenues mariage, invitées mariage même robe, looks mariage coordonnés',
  },
  en: {
    title: 'NOWEAR — No Two Looks Alike',
    description: 'The platform to coordinate outfits at weddings, communions and christenings. Register your look, detect conflicts and enjoy your day. From €9 per event.',
    keywords: 'nowear, wedding outfit coordination, guests same dress wedding, coordinated looks event',
  },
  pt: {
    title: 'NOWEAR — Para que ninguém apareça vestida igual',
    description: 'A plataforma para coordenar looks em casamentos, comunhões e batizados. Regista o teu outfit, deteta coincidências. A partir de 9€ por evento.',
    keywords: 'nowear, coordenação looks casamento, convidadas casamento mesmo vestido',
  },
  de: {
    title: 'NOWEAR — Damit niemand gleich gekleidet erscheint',
    description: 'Die Plattform zur Look-Koordinierung bei Hochzeiten, Kommunionen und Taufen. Registrieren Sie Ihr Outfit, erkennen Sie Überschneidungen. Ab 9€ pro Event.',
    keywords: 'nowear, Hochzeit Outfit Koordinierung, Gäste gleiche Kleidung Hochzeit',
  },
  nl: {
    title: 'NOWEAR — Zodat niemand hetzelfde draagt',
    description: 'Het platform voor het coördineren van outfits bij bruiloften, communies en doopfeesten. Registreer je look, detecteer conflicten. Vanaf €9 per evenement.',
    keywords: 'nowear, outfit coördinatie bruiloft, gasten zelfde jurk bruiloft',
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
          "inLanguage": ["es","fr","en","pt","de","nl"],
          "sameAs": ["https://www.instagram.com/nowearapp"],
        })}}/>

        {/* FUENTES */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,200;1,300;1,400&display=swap" rel="stylesheet" />
      </head>
      <body style={{fontFamily:"'Poppins', sans-serif"}}>
        <NextIntlClientProvider messages={messages}>
          <NavbarWrapper locale={locale}/>
          <div style={{paddingTop:'68px'}}>
            {children}
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}