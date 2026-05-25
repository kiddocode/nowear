import {NextIntlClientProvider} from 'next-intl'
import {getMessages} from 'next-intl/server'
import NavbarWrapper from '../components/NavbarWrapper'
import '../globals.css'

export default async function LocaleLayout({children, params}) {
  const {locale} = await params
  const messages = await getMessages()

  return (
    <html lang={locale}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>NOWEAR — No two looks alike</title>
        <meta name="description" content="La plataforma para que ninguna invitada llegue vestida igual." />
        <meta property="og:title" content="NOWEAR — No two looks alike"/>
        <meta property="og:description" content="Registra looks, detecta coincidencias, disfruta tranquila."/>
        <meta property="og:image" content="https://qhuatexjyxbunotvghjh.supabase.co/storage/v1/object/public/fotos/nowear_logo_white.png"/>
        <meta property="og:image:width" content="1200"/>
        <meta property="og:image:height" content="630"/>
        <meta property="og:url" content="https://nowear.es"/>
        <meta property="og:type" content="website"/>
        <meta property="og:site_name" content="NOWEAR"/>
        <meta name="twitter:card" content="summary_large_image"/>
        <meta name="twitter:title" content="NOWEAR — No two looks alike"/>
        <meta name="twitter:description" content="Registra looks, detecta coincidencias, disfruta tranquila."/>
        <meta name="twitter:image" content="https://qhuatexjyxbunotvghjh.supabase.co/storage/v1/object/public/fotos/nowear_logo_white.png"/>
        <link rel="icon" href="https://qhuatexjyxbunotvghjh.supabase.co/storage/v1/object/public/fotos/favicon.png" type="image/png"/>
        <link rel="apple-touch-icon" href="https://qhuatexjyxbunotvghjh.supabase.co/storage/v1/object/public/fotos/favicon.png"/>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
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
