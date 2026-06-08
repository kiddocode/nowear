'use client'

import { useState, useEffect } from 'react'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('nw_cookie_consent')
    if (!consent) setVisible(true)
  }, [])

  function aceptar() {
    localStorage.setItem('nw_cookie_consent', 'accepted')
    setVisible(false)
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', { analytics_storage: 'granted' })
    }
  }

  function rechazar() {
    localStorage.setItem('nw_cookie_consent', 'rejected')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 9999,
      background: '#0A0A0A',
      border: '1px solid rgba(255,255,255,0.12)',
      borderRadius: '16px',
      padding: '20px 24px',
      display: 'flex',
      alignItems: 'center',
      gap: '20px',
      maxWidth: '640px',
      width: 'calc(100% - 32px)',
      boxShadow: '0 8px 40px rgba(0,0,0,0.4)',
      flexWrap: 'wrap'
    }}>
      <p style={{
        color: '#FFFFFF',
        fontSize: '0.82rem',
        fontFamily: 'Poppins, sans-serif',
        fontWeight: 300,
        lineHeight: 1.5,
        margin: 0,
        flex: 1,
        minWidth: '200px'
      }}>
        Usamos cookies analíticas para mejorar la experiencia.{' '}
        <a href="/es/privacidad" style={{ color: '#C4917C', textDecoration: 'underline' }}>
          Más información
        </a>
      </p>
      <div style={{ display: 'flex', gap: '10px', flexShrink: 0 }}>
        <button
          onClick={rechazar}
          style={{
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.25)',
            color: '#FFFFFF',
            borderRadius: '8px',
            padding: '8px 18px',
            fontSize: '0.78rem',
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 400,
            cursor: 'pointer',
            whiteSpace: 'nowrap'
          }}
        >
          Rechazar
        </button>
        <button
          onClick={aceptar}
          style={{
            background: '#C4917C',
            border: 'none',
            color: '#FFFFFF',
            borderRadius: '8px',
            padding: '8px 18px',
            fontSize: '0.78rem',
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 500,
            cursor: 'pointer',
            whiteSpace: 'nowrap'
          }}
        >
          Aceptar
        </button>
      </div>
    </div>
  )
}
