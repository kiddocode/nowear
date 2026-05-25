'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin() {
    setError('')
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) {
      setError('Email o contraseña incorrectos')
    } else {
      router.push('/dashboard')
    }
  }

  async function handleGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/dashboard` }
    })
  }

  return (
    <div className="auth-grid" style={{display:'grid',gridTemplateColumns:'1fr 1fr',minHeight:'calc(100vh - 68px)'}}>
      <div className="auth-visual" style={{background:'#0A0A0A',position:'relative',overflow:'hidden'}}>
        <img
          src="https://qhuatexjyxbunotvghjh.supabase.co/storage/v1/object/public/fotos/pexels-cottonbro-3171765.jpg"
          alt=""
          style={{width:'100%',height:'100%',objectFit:'cover',position:'absolute',inset:0,opacity:0.5}}
        />
        <div style={{position:'absolute',inset:0,background:'linear-gradient(to top, rgba(10,10,10,0.7) 0%, rgba(10,10,10,0.2) 60%)',zIndex:1}}></div>
        <div style={{position:'relative',zIndex:2,padding:'5rem 4rem',height:'100%',display:'flex',flexDirection:'column',justifyContent:'flex-end',boxSizing:'border-box'}}>
          <h2 style={{fontSize:'3rem',fontWeight:700,color:'#FFFFFF',lineHeight:1.05,letterSpacing:'-0.025em',marginBottom:'1rem'}}>
            Bienvenida<br/><em style={{fontStyle:'italic',color:'#F07987'}}>de nuevo.</em>
          </h2>
          <p style={{fontSize:'0.85rem',fontWeight:400,color:'#FFFFFF',lineHeight:1.85,maxWidth:'340px'}}>
            Tu evento te espera. Entra para gestionar los looks y compartir el link con tus invitadas.
          </p>
        </div>
      </div>

      <div style={{display:'flex',flexDirection:'column',justifyContent:'center',padding:'5rem 4rem',background:'#FFFFFF'}}>
        <h2 style={{fontSize:'1.8rem',fontWeight:200,color:'#0A0A0A',letterSpacing:'-0.02em',marginBottom:'0.4rem'}}>Iniciar sesión</h2>
        <p style={{fontSize:'0.75rem',fontWeight:300,color:'#888884',marginBottom:'2.5rem'}}>Accede a tu cuenta de nowear</p>

        <div style={{marginBottom:'1.25rem'}}>
          <label style={{display:'block',fontSize:'0.6rem',fontWeight:600,letterSpacing:'0.12em',textTransform:'uppercase',color:'#888884',marginBottom:'0.55rem'}}>Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{width:'100%',fontFamily:'Poppins,sans-serif',fontSize:'0.82rem',fontWeight:300,padding:'0.9rem 1rem',border:'1px solid #E0E0DC',background:'#FFFFFF',outline:'none',boxSizing:'border-box'}}
          />
        </div>

        <div style={{marginBottom:'1.25rem'}}>
          <label style={{display:'block',fontSize:'0.6rem',fontWeight:600,letterSpacing:'0.12em',textTransform:'uppercase',color:'#888884',marginBottom:'0.55rem'}}>Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            style={{width:'100%',fontFamily:'Poppins,sans-serif',fontSize:'0.82rem',fontWeight:300,padding:'0.9rem 1rem',border:'1px solid #E0E0DC',background:'#FFFFFF',outline:'none',boxSizing:'border-box'}}
          />
        </div>

        {error && (
          <p style={{fontSize:'0.72rem',fontWeight:300,color:'#F07987',marginBottom:'1rem'}}>{error}</p>
        )}

        <button
          onClick={handleLogin}
          disabled={loading}
          style={{width:'100%',padding:'0.9rem',fontSize:'0.78rem',fontWeight:500,background:'#0A0A0A',color:'#FFFFFF',border:'none',cursor:'pointer',fontFamily:'Poppins,sans-serif',marginTop:'0.5rem',opacity:loading?0.6:1,borderRadius:'4px'}}
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>

        <div style={{display:'flex',alignItems:'center',gap:'1rem',margin:'1.5rem 0',fontSize:'0.62rem',fontWeight:300,color:'#BEBEBA'}}>
          <span style={{flex:1,height:'1px',background:'#E0E0DC'}}></span>
          o
          <span style={{flex:1,height:'1px',background:'#E0E0DC'}}></span>
        </div>

        <button
          onClick={handleGoogle}
          style={{width:'100%',padding:'0.9rem',fontSize:'0.78rem',fontWeight:500,background:'transparent',color:'#0A0A0A',border:'1px solid #0A0A0A',cursor:'pointer',fontFamily:'Poppins,sans-serif',borderRadius:'4px'}}
        >
          Continuar con Google
        </button>

        <p style={{marginTop:'1.5rem',fontSize:'0.75rem',fontWeight:300,color:'#888884'}}>
          ¿No tienes cuenta? <a href="/register" style={{color:'#0A0A0A',fontWeight:500,textDecoration:'underline',textUnderlineOffset:'3px'}}>Crear cuenta gratis</a>
        </p>
      </div>
    </div>
  )
}
