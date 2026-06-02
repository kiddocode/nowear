'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { supabase } from '@/lib/supabase'

export default function Register() {
  const router = useRouter()
  const t = useTranslations('register')
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleRegister() {
    setError('')
    if (password.length < 8) { setError(t('errorPassword')); return }
    setLoading(true)
    const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { nombre } } })
    if (error) { setLoading(false); setError(error.message); return }
    if (data.user) { await supabase.from('profiles').update({ nombre }).eq('id', data.user.id); fetch('/api/admin/nuevousuario', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, nombre, proveedor: 'email', created_at: new Date().toISOString() }) }) }
    setLoading(false)
    router.push('/dashboard')
  }

  async function handleGoogle() {
    await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: `${window.location.origin}/dashboard` } })
  }

  return (
    <>
      <style>{`
        .auth-grid { display: grid; grid-template-columns: 1fr 1fr; min-height: calc(100vh - 68px); }
        .auth-visual { background: #0A0A0A; position: relative; overflow: hidden; }
        .auth-visual-mobile { display: none; width: 100%; height: 200px; overflow: hidden; position: relative; }
        .auth-form { display: flex; flex-direction: column; justify-content: center; padding: 5rem 4rem; background: #FFFFFF; }

        @media (max-width: 1024px) {
          .auth-grid { grid-template-columns: 1fr; }
          .auth-visual { display: none; }
          .auth-visual-mobile { display: block; }
          .auth-form { padding: 2rem; justify-content: flex-start; }
        }

        @media (max-width: 768px) {
          .auth-form { padding: 1.5rem; }
          .auth-visual-mobile { height: 180px; }
        }
      `}</style>

      <div className="auth-grid">

        {/* IMAGEN LATERAL DESKTOP */}
        <div className="auth-visual">
          <img src="https://qhuatexjyxbunotvghjh.supabase.co/storage/v1/object/public/fotos/pexels-cottonbro-3171765.jpg" alt="" style={{width:'100%',height:'100%',objectFit:'cover',position:'absolute',inset:0,opacity:0.5}}/>
          <div style={{position:'absolute',inset:0,background:'linear-gradient(to top, rgba(10,10,10,0.7) 0%, rgba(10,10,10,0.2) 60%)',zIndex:1}}></div>
          <div style={{position:'relative',zIndex:2,padding:'5rem 4rem',height:'100%',display:'flex',flexDirection:'column',justifyContent:'flex-end',boxSizing:'border-box'}}>
            <h2 style={{fontSize:'3rem',fontWeight:700,color:'#FFFFFF',lineHeight:1.05,letterSpacing:'-0.025em',marginBottom:'1rem'}}>
              {t('tituloVisual')}<br/><em style={{fontStyle:'italic',color:'#F07987'}}>{t('tituloVisualEmphasis')}</em>
            </h2>
            <p style={{fontSize:'0.85rem',fontWeight:400,color:'#FFFFFF',lineHeight:1.85,maxWidth:'340px'}}>{t('visual')}</p>
          </div>
        </div>

        {/* IMAGEN CABECERA MÓVIL */}
        <div className="auth-visual-mobile">
          <img src="https://qhuatexjyxbunotvghjh.supabase.co/storage/v1/object/public/fotos/pexels-cottonbro-3171765.jpg" alt="" style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:'center 30%'}}/>
          <div style={{position:'absolute',inset:0,background:'linear-gradient(to top, rgba(10,10,10,0.6) 0%, rgba(10,10,10,0.1) 60%)'}}></div>
          <div style={{position:'absolute',bottom:'1rem',left:'1.5rem',right:'1.5rem'}}>
            <h2 style={{fontSize:'1.4rem',fontWeight:700,color:'#FFFFFF',lineHeight:1.1,letterSpacing:'-0.02em'}}>
              {t('tituloVisual')}<br/><em style={{fontStyle:'italic',color:'#F07987'}}>{t('tituloVisualEmphasis')}</em>
            </h2>
          </div>
        </div>

        {/* FORMULARIO */}
        <div className="auth-form">
          <h2 style={{fontSize:'1.8rem',fontWeight:200,color:'#0A0A0A',letterSpacing:'-0.02em',marginBottom:'0.4rem'}}>{t('titulo')}</h2>
          <p style={{fontSize:'0.75rem',fontWeight:300,color:'#888884',marginBottom:'2.5rem'}}>{t('subtitulo')}</p>
          <div style={{marginBottom:'1.25rem'}}>
            <label style={{display:'block',fontSize:'0.6rem',fontWeight:600,letterSpacing:'0.12em',textTransform:'uppercase',color:'#888884',marginBottom:'0.55rem'}}>{t('nombre')}</label>
            <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} style={{width:'100%',fontFamily:'Poppins,sans-serif',fontSize:'0.82rem',fontWeight:300,padding:'0.9rem 1rem',border:'1px solid #E0E0DC',background:'#FFFFFF',outline:'none',boxSizing:'border-box'}}/>
          </div>
          <div style={{marginBottom:'1.25rem'}}>
            <label style={{display:'block',fontSize:'0.6rem',fontWeight:600,letterSpacing:'0.12em',textTransform:'uppercase',color:'#888884',marginBottom:'0.55rem'}}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={{width:'100%',fontFamily:'Poppins,sans-serif',fontSize:'0.82rem',fontWeight:300,padding:'0.9rem 1rem',border:'1px solid #E0E0DC',background:'#FFFFFF',outline:'none',boxSizing:'border-box'}}/>
          </div>
          <div style={{marginBottom:'1.25rem'}}>
            <label style={{display:'block',fontSize:'0.6rem',fontWeight:600,letterSpacing:'0.12em',textTransform:'uppercase',color:'#888884',marginBottom:'0.55rem'}}>{t('password')}</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder={t('passwordPlaceholder')} onKeyDown={e => e.key === 'Enter' && handleRegister()} style={{width:'100%',fontFamily:'Poppins,sans-serif',fontSize:'0.82rem',fontWeight:300,padding:'0.9rem 1rem',border:'1px solid #E0E0DC',background:'#FFFFFF',outline:'none',boxSizing:'border-box'}}/>
          </div>
          {error && <p style={{fontSize:'0.72rem',fontWeight:300,color:'#F07987',marginBottom:'1rem'}}>{error}</p>}
          <button onClick={handleRegister} disabled={loading} style={{width:'100%',padding:'0.9rem',fontSize:'0.78rem',fontWeight:500,background:'#0A0A0A',color:'#FFFFFF',border:'none',cursor:'pointer',fontFamily:'Poppins,sans-serif',marginTop:'0.5rem',opacity:loading?0.6:1,borderRadius:'4px'}}>
            {loading ? t('creando') : t('crear')}
          </button>
          <div style={{display:'flex',alignItems:'center',gap:'1rem',margin:'1.5rem 0',fontSize:'0.62rem',fontWeight:300,color:'#BEBEBA'}}>
            <span style={{flex:1,height:'1px',background:'#E0E0DC'}}></span>o<span style={{flex:1,height:'1px',background:'#E0E0DC'}}></span>
          </div>
          <button onClick={handleGoogle} style={{width:'100%',padding:'0.9rem',fontSize:'0.78rem',fontWeight:500,background:'transparent',color:'#0A0A0A',border:'1px solid #0A0A0A',cursor:'pointer',fontFamily:'Poppins,sans-serif',borderRadius:'4px'}}>
            {t('google')}
          </button>
          <p style={{marginTop:'1.5rem',fontSize:'0.75rem',fontWeight:300,color:'#888884'}}>
            {t('yaTieneCuenta')} <a href="/login" style={{color:'#0A0A0A',fontWeight:500,textDecoration:'underline',textUnderlineOffset:'3px'}}>{t('iniciarSesion')}</a>
          </p>
        </div>
      </div>
    </>
  )
}