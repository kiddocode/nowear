import './globals.css'

export const metadata = {
  title: 'NOWEAR — No two looks alike',
  description: 'La plataforma para que ninguna invitada llegue vestida igual.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;1,200;1,300;1,400&display=swap" rel="stylesheet" />
      </head>
      <body style={{ fontFamily: "'Poppins', sans-serif" }}>
        <nav style={{
          position: 'fixed', top: 0, left: 0, right: 0, height: '68px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 3rem',
          background: 'rgba(255,255,255,0.96)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid #E0E0DC',
          zIndex: 1000,
        }}>
          <a href="/" style={{
            fontSize: '0.95rem', fontWeight: 600,
            letterSpacing: '0.18em', textTransform: 'uppercase',
            color: '#0A0A0A', textDecoration: 'none',
          }}>NOWEAR</a>
          <div style={{ display: 'flex', gap: '2.5rem' }}>
            {['Cómo funciona', 'Marcas', 'FAQ', 'Contacto'].map((item, i) => (
              <a key={i} href={`/#${['como','marcas','faq','contacto'][i]}`} style={{
                fontSize: '0.72rem', fontWeight: 300, color: '#3A3A38', textDecoration: 'none',
              }}>{item}</a>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <a href="/login" style={{ fontSize: '0.72rem', fontWeight: 300, color: '#3A3A38', padding: '0.65rem 1rem', textDecoration: 'none' }}>Entrar</a>
            <a href="/register" style={{
              fontSize: '0.72rem', fontWeight: 500, padding: '0.65rem 1.5rem',
              background: '#0A0A0A', color: '#FFFFFF', textDecoration: 'none',
            }}>Empezar</a>
          </div>
        </nav>
        <div style={{ paddingTop: '68px' }}>
          {children}
        </div>
      </body>
    </html>
  )
}