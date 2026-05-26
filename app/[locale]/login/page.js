'use client'
import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { supabase } from '@/lib/supabase'

export default function Login() {
  const router = useRouter()
  const pathname = usePathname()
  const t = useTranslations('login')

  const localesPrefix = ['fr','en','pt','de','nl']
  const locale = localesPrefix.find(loc => pathname.startsWith(`/${loc}/`) || pathname === `/${loc}`) || 'es'
  const prefijo = locale !== 'es' ? `/${locale}` : ''

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [modoReset, setModoReset] = useState(false)
  const [resetEnviado, setResetEnviado] = useState(false)
  const [loadingReset, setLoadingReset] = useState(false)

  async function handleLogin() {
    setError(''); setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) { setError(t('errorCredenciales')) } else { router.push(prefijo + '/dashboard') }
  }

  async function handleGoogle() {
    await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: `${window.location.origin}${prefijo}/dashboard` } })
  }

  async function handleReset() {
    if (!email) { setError('Introduce tu email primero.'); return }
    setLoadingReset(true); setError('')
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}${prefijo}/auth/callback`,
    })
    setLoadingReset(false)
    if (error) { setError(error.message) } else { setResetEnviado(true) }
  }

  const inputStyle = {width:'100%',fontFamily:'Poppins,sans-serif',fontSize:'0.82rem',fontWeight:300,padding:'0.9rem 1rem',border:'1px solid #E0E0DC',background:'#FFFFFF',outline:'none',boxSizing:'border-box'}
  const labelStyle = {display:'block',fontSize:'0.6rem',fontWeight:600,letterSpacing:'0.12em',textTransform:'uppercase',color:'#888884',marginBottom:'0.55rem'}

  return (
    <div className="auth-grid" style={{display:'grid',gridTemplateColumns:'1fr 1fr',minHeight:'calc(100vh - 68px)'}}>
      <div className="auth-visual" style={{background:'#0A0A0A',position:'relative',overflow:'hidden'}}>
        <img src="https://qhuatexjyxbunotvghjh.supabase.co/storage/v1/object/public/fotos/pexels-cottonbro-3171765.jpg" alt="" style={{width:'100%',height:'100%',objectFit:'cover',position:'absolute',inset:0,opacity:0.5}}/>
        <div style={{position:'absolute',inset:0,background:'linear-gradient(to top, rgba(10,10,10,0.7) 0%, rgba(10,10,10,0.2) 60%)',zIndex:1}}></div>
        <div style={{position:'relative',zIndex:2,padding:'5rem 4rem',height:'100%',display:'flex',flexDirection:'column',justifyContent:'flex-end',boxSizing:'border-box'}}>
          <h2 style={{fontSize:'3rem',fontWeight:700,color:'#FFFFFF',lineHeight:1.05,letterSpacing:'-0.025em',marginBottom:'1rem'}}>
            {t('bienvenida')}<br/><em style={{fontStyle:'italic',color:'#F07987'}}>{t('bienvenidaEmphasis')}</em>
          </h2>
          <p style={{fontSize:'0.85rem',fontWeight:400,color:'#FFFFFF',lineHeight:1.85,maxWidth:'340px'}}>{t('visual')}</p>
        </div>
      </div>

      <div style={{display:'flex',flexDirection:'column',justifyContent:'center',padding:'5rem 4rem',background:'#FFFFFF'}}>

        {modoReset ? (
          <>
            <h2 style={{fontSize:'1.8rem',fontWeight:200,color:'#0A0A0A',letterSpacing:'-0.02em',marginBottom:'0.4rem'}}>{t('resetTitulo')}</h2>
            <p style={{fontSize:'0.75rem',fontWeight:300,color:'#888884',marginBottom:'2.5rem'}}>{t('resetSub')}</p>

            {resetEnviado ? (
              <div style={{padding:'1.25rem',background:'#EEF4E8',border:'1px solid #C8DFC0',borderRadius:'4px',marginBottom:'1.5rem'}}>
                <p style={{fontSize:'0.82rem',fontWeight:400,color:'#4A6B42',lineHeight:1.6}}>{t('resetEnviado')}</p>
              </div>
            ) : (
              <>
                <div style={{marginBottom:'1.25rem'}}>
                  <label style={labelStyle}>Email</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleReset()} style={inputStyle}/>
                </div>
                {error && <p style={{fontSize:'0.72rem',fontWeight:300,color:'#F07987',marginBottom:'1rem'}}>{error}</p>}
                <button onClick={handleReset} disabled={loadingReset} style={{width:'100%',padding:'0.9rem',fontSize:'0.78rem',fontWeight:500,background:'#0A0A0A',color:'#FFFFFF',border:'none',cursor:'pointer',fontFamily:'Poppins,sans-serif',opacity:loadingReset?0.6:1,borderRadius:'4px',marginBottom:'1.25rem'}}>
                  {loadingReset ? t('enviandoReset') : t('enviarReset')}
                </button>
              </>
            )}

            <button onClick={() => { setModoReset(false); setResetEnviado(false); setError('') }}
              style={{fontSize:'0.75rem',fontWeight:400,color:'#888884',background:'none',border:'none',cursor:'pointer',fontFamily:'Poppins,sans-serif',padding:0,textAlign:'left'}}>
              {t('volver')}
            </button>
          </>
        ) : (
          <>
            <h2 style={{fontSize:'1.8rem',fontWeight:200,color:'#0A0A0A',letterSpacing:'-0.02em',marginBottom:'0.4rem'}}>{t('titulo')}</h2>
            <p style={{fontSize:'0.75rem',fontWeight:300,color:'#888884',marginBottom:'2.5rem'}}>{t('subtitulo')}</p>

            <div style={{marginBottom:'1.25rem'}}>
              <label style={labelStyle}>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle}/>
            </div>

            <div style={{marginBottom:'0.5rem'}}>
              <label style={labelStyle}>{t('password')}</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleLogin()} style={inputStyle}/>
            </div>

            <button onClick={() => { setModoReset(true); setError('') }}
              style={{fontSize:'0.72rem',fontWeight:400,color:'#888884',background:'none',border:'none',cursor:'pointer',fontFamily:'Poppins,sans-serif',padding:0,textAlign:'right',marginBottom:'1.25rem',textDecoration:'underline',textUnderlineOffset:'3px'}}>
              {t('olvidaste')}
            </button>

            {error && <p style={{fontSize:'0.72rem',fontWeight:300,color:'#F07987',marginBottom:'1rem'}}>{error}</p>}

            <button onClick={handleLogin} disabled={loading} style={{width:'100%',padding:'0.9rem',fontSize:'0.78rem',fontWeight:500,background:'#0A0A0A',color:'#FFFFFF',border:'none',cursor:'pointer',fontFamily:'Poppins,sans-serif',marginTop:'0.5rem',opacity:loading?0.6:1,borderRadius:'4px'}}>
              {loading ? t('entrando') : t('entrar')}
            </button>

            <div style={{display:'flex',alignItems:'center',gap:'1rem',margin:'1.5rem 0',fontSize:'0.62rem',fontWeight:300,color:'#BEBEBA'}}>
              <span style={{flex:1,height:'1px',background:'#E0E0DC'}}></span>{t('o')}<span style={{flex:1,height:'1px',background:'#E0E0DC'}}></span>
            </div>

            <button onClick={handleGoogle} style={{width:'100%',padding:'0.9rem',fontSize:'0.78rem',fontWeight:500,background:'transparent',color:'#0A0A0A',border:'1px solid #0A0A0A',cursor:'pointer',fontFamily:'Poppins,sans-serif',borderRadius:'4px'}}>
              {t('google')}
            </button>

            <p style={{marginTop:'1.5rem',fontSize:'0.75rem',fontWeight:300,color:'#888884'}}>
              {t('sinCuenta')} <a href={prefijo + '/register'} style={{color:'#0A0A0A',fontWeight:500,textDecoration:'underline',textUnderlineOffset:'3px'}}>{t('crearCuenta')}</a>
            </p>
          </>
        )}
      </div>
    </div>
  )
}