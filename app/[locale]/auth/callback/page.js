'use client'
import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AuthCallback() {
  const router = useRouter()
  const pathname = usePathname()
  const [password, setPassword] = useState('')
  const [password2, setPassword2] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [listo, setListo] = useState(false)
  const [tipo, setTipo] = useState(null) // 'recovery' | 'other' | null

  const localesPrefix = ['fr','en','pt','de','nl']
  const locale = localesPrefix.find(loc => pathname.startsWith(`/${loc}/`) || pathname === `/${loc}`) || 'es'
  const prefijo = locale !== 'es' ? `/${locale}` : ''

  useEffect(() => {
    // Leer el hash de la URL manualmente
    const hash = window.location.hash
    const params = new URLSearchParams(hash.replace('#', ''))
    const type = params.get('type')
    const accessToken = params.get('access_token')
    const refreshToken = params.get('refresh_token')

    if (type === 'recovery' && accessToken) {
      // Establecer la sesión con el token del hash
      supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken || '',
      }).then(({ error }) => {
        if (error) {
          setError('El enlace ha expirado. Solicita uno nuevo.')
          setTipo('error')
        } else {
          setTipo('recovery')
        }
      })
    } else if (accessToken) {
      // Otro tipo de callback (login con Google etc), redirigir al dashboard
      supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken || '',
      }).then(() => {
        router.push(prefijo + '/dashboard')
      })
    } else {
      // Sin token, redirigir al login
      router.push(prefijo + '/login')
    }
  }, [])

  async function handleCambiar() {
    if (password.length < 8) { setError('La contraseña debe tener al menos 8 caracteres.'); return }
    if (password !== password2) { setError('Las contraseñas no coinciden.'); return }
    setLoading(true); setError('')
    const { error } = await supabase.auth.updateUser({ password })
    setLoading(false)
    if (error) { setError(error.message) }
    else { setListo(true); setTimeout(() => router.push(prefijo + '/dashboard'), 2000) }
  }

  const inputStyle = {width:'100%',fontFamily:'Poppins,sans-serif',fontSize:'0.82rem',fontWeight:300,padding:'0.9rem 1rem',border:'1px solid #E0E0DC',background:'#FFFFFF',outline:'none',boxSizing:'border-box'}
  const labelStyle = {display:'block',fontSize:'0.6rem',fontWeight:600,letterSpacing:'0.12em',textTransform:'uppercase',color:'#888884',marginBottom:'0.55rem'}

  if (listo) return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'calc(100vh - 68px)',padding:'2rem',textAlign:'center'}}>
      <div>
        <div style={{fontSize:'1.8rem',fontWeight:200,color:'#0A0A0A',marginBottom:'0.5rem'}}>Contraseña actualizada</div>
        <p style={{fontSize:'0.82rem',fontWeight:300,color:'#888884'}}>Redirigiendo al dashboard...</p>
      </div>
    </div>
  )

  if (!tipo) return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'calc(100vh - 68px)',fontSize:'0.75rem',color:'#888884'}}>
      Verificando enlace...
    </div>
  )

  if (tipo === 'error') return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'calc(100vh - 68px)',padding:'2rem',textAlign:'center'}}>
      <div>
        <div style={{fontSize:'1.4rem',fontWeight:300,color:'#0A0A0A',marginBottom:'0.5rem'}}>Enlace expirado</div>
        <p style={{fontSize:'0.82rem',fontWeight:300,color:'#888884',marginBottom:'1.5rem'}}>Solicita un nuevo enlace de recuperación.</p>
        <a href={prefijo + '/login'} style={{fontSize:'0.78rem',fontWeight:500,color:'#F07987',textDecoration:'underline'}}>Volver al login</a>
      </div>
    </div>
  )

  return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'calc(100vh - 68px)',padding:'2rem'}}>
      <div style={{width:'100%',maxWidth:'400px'}}>
        <h1 style={{fontSize:'1.8rem',fontWeight:200,color:'#0A0A0A',letterSpacing:'-0.02em',marginBottom:'0.4rem'}}>Nueva contraseña</h1>
        <p style={{fontSize:'0.75rem',fontWeight:300,color:'#888884',marginBottom:'2.5rem'}}>Introduce tu nueva contraseña.</p>
        <div style={{marginBottom:'1.25rem'}}>
          <label style={labelStyle}>Nueva contraseña</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} style={inputStyle} placeholder="Mínimo 8 caracteres"/>
        </div>
        <div style={{marginBottom:'1.5rem'}}>
          <label style={labelStyle}>Confirmar contraseña</label>
          <input type="password" value={password2} onChange={e => setPassword2(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleCambiar()} style={inputStyle}/>
        </div>
        {error && <p style={{fontSize:'0.72rem',fontWeight:300,color:'#F07987',marginBottom:'1rem'}}>{error}</p>}
        <button onClick={handleCambiar} disabled={loading} style={{width:'100%',padding:'0.9rem',fontSize:'0.78rem',fontWeight:500,background:'#0A0A0A',color:'#FFFFFF',border:'none',cursor:'pointer',fontFamily:'Poppins,sans-serif',opacity:loading?0.6:1,borderRadius:'4px'}}>
          {loading ? 'Guardando...' : 'Cambiar contraseña'}
        </button>
      </div>
    </div>
  )
}