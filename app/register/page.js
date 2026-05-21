'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function Register() {
  const router = useRouter()
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleRegister() {
    setError('')
    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres')
      return
    }
    setLoading(true)
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { nombre } }
    })
    if (error) {
      setLoading(false)
      setError(error.message)
      return
    }
    // Actualizar nombre en profiles
    if (data.user) {
      await supabase.from('profiles').update({ nombre }).eq('id', data.user.id)
    }
    setLoading(false)
    router.push('/dashboard')
  }

  async function handleGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/dashboard` }
    })
  }

  return (
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',minHeight:'calc(100vh - 68px)'}}>
      <div style={{background:'#0A0A0A',position:'relative',overflow:'hidden'}}>
        <img
          src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=900&q=80"
          alt=""
          style={{width:'100%',height:'100%',objectFit:'cover',position:'absolute',inset:0,opacity:0.4}}
        />
        <div style={{position:'relative',zIndex:2,padding:'5rem 4rem',height:'100%',display:'flex',flexDirection:'column',justifyContent:'flex-end'}}>
          <h2 style={{fontSize:'3rem',fontWeight:100,color:'#FFFFFF',lineHeight:1.05,letterSpacing:'-0.025em',marginBottom:'1rem'}}>
            Tu evento,<br/><em style={{fontStyle:'italic',color:'#C4917C'}}>sin repeticiones.</em>
          </h2>
          <p style={{fontSize:'0.8rem',fontWeight:300,color:'#888884',lineHeight:1.85,maxWidth:'340px'}}>
            Crea tu cuenta, registra tu evento y comparte el link con tus invitadas en menos de 2 minutos.
          </p>
        </div>
      </div>

      <div style={{display:'flex',flexDirection:'column',justifyContent:'center',padding:'5rem 4rem',background:'#FFFFFF'}}>
        <h2 style={{fontSize:'1.8rem',fontWeight:200,color:'#0A0A0A',letterSpacing:'-0.02em',marginBottom:'0.4rem'}}>Crear cuenta</h2>
        <p style={{fontSize:'0.75rem',fontWeight:300,color:'#888884',marginBottom:'2.5rem'}}>Es gratis y sin compromiso</p>

        <div style={{marginBottom:'1.25rem'}}>
          <label style={{display:'block',fontSize:'0.6rem',fontWeight:600,letterSpacing:'0.12em',textTransform:'uppercase',color:'#888884',marginBottom:'0.55rem'}}>Nombre</label>
          <input
            type="text"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            style={{width:'100%',fontFamily:'Poppins,sans-serif',fontSize:'0.82rem',fontWeight:300,padding:'0.9rem 1rem',border:'1px solid #E0E0DC',background:'#FFFFFF',outline:'none',boxSizing:'border-box'}}
          />
        </div>

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
            placeholder="Mínimo 8 caracteres"
            onKeyDown={e => e.key === 'Enter' && handleRegister()}
            style={{width:'100%',fontFamily:'Poppins,sans-serif',fontSize:'0.82rem',fontWeight:300,padding:'0.9rem 1rem',border:'1px solid #E0E0DC',background:'#FFFFFF',outline:'none',boxSizing:'border-box'}}
          />
        </div>

        {error && (
          <p style={{fontSize:'0.72rem',fontWeight:300,color:'#C4917C',marginBottom:'1rem'}}>{error}</p>
        )}

        <button
          onClick={handleRegister}
          disabled={loading}
          style={{width:'100%',padding:'0.9rem',fontSize:'0.78rem',fontWeight:500,background:'#0A0A0A',color:'#FFFFFF',border:'none',cursor:'pointer',fontFamily:'Poppins,sans-serif',marginTop:'0.5rem',opacity:loading?0.6:1}}
        >
          {loading ? 'Creando cuenta...' : 'Crear cuenta'}
        </button>

        <div style={{display:'flex',alignItems:'center',gap:'1rem',margin:'1.5rem 0',fontSize:'0.62rem',fontWeight:300,color:'#BEBEBA'}}>
          <span style={{flex:1,height:'1px',background:'#E0E0DC'}}></span>
          o
          <span style={{flex:1,height:'1px',background:'#E0E0DC'}}></span>
        </div>

        <button
          onClick={handleGoogle}
          style={{width:'100%',padding:'0.9rem',fontSize:'0.78rem',fontWeight:500,background:'transparent',color:'#0A0A0A',border:'1px solid #0A0A0A',cursor:'pointer',fontFamily:'Poppins,sans-serif'}}
        >
          Continuar con Google
        </button>

        <p style={{marginTop:'1.5rem',fontSize:'0.75rem',fontWeight:300,color:'#888884'}}>
          ¿Ya tienes cuenta? <a href="/login" style={{color:'#0A0A0A',fontWeight:500,textDecoration:'underline',textUnderlineOffset:'3px'}}>Iniciar sesión</a>
        </p>
      </div>
    </div>
  )
}