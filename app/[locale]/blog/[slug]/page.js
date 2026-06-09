import { getPostHtml, getPostSlugs } from '@/lib/blog'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
  const locales = ['es','en','fr','de','pt','nl','it']
  const params = []
  for (const locale of locales) {
    const slugs = getPostSlugs('es')
    slugs.forEach(slug => params.push({ locale, slug }))
  }
  return params
}

export default async function BlogPost({ params }) {
  const { locale, slug } = await params
  const post = await getPostHtml(slug, locale)
  if (!post) notFound()

  return (
    <>
      <style>{`
        .blog-content h2 { font-size:1.4rem;font-weight:700;color:#0A0A0A;margin:2rem 0 1rem;letter-spacing:-0.02em; }
        .blog-content h3 { font-size:1.1rem;font-weight:600;color:#0A0A0A;margin:1.5rem 0 0.75rem; }
        .blog-content p { font-size:0.95rem;font-weight:300;color:#3A3A38;line-height:1.95;margin-bottom:1.25rem; }
        .blog-content ul { margin:0 0 1.25rem 1.5rem; }
        .blog-content li { font-size:0.95rem;font-weight:300;color:#3A3A38;line-height:1.9;margin-bottom:0.4rem; }
        .blog-content strong { font-weight:600;color:#0A0A0A; }
        .blog-content a { color:#F07987;text-decoration:underline; }
        .blog-content hr { border:none;border-top:1px solid #E0E0DC;margin:2rem 0; }
      `}</style>
      <div style={{maxWidth:'760px',margin:'0 auto',padding:'4rem 2rem 6rem'}}>
        <a href={`/${locale === 'es' ? '' : locale + '/'}blog`}
          style={{fontSize:'0.62rem',fontWeight:600,letterSpacing:'0.12em',textTransform:'uppercase',color:'#888884',textDecoration:'none',display:'inline-flex',alignItems:'center',gap:'0.4rem',marginBottom:'2.5rem'}}>
          ← Blog
        </a>
        {post.categoria && (
          <span style={{fontSize:'0.55rem',fontWeight:700,letterSpacing:'0.15em',textTransform:'uppercase',color:'#F07987',display:'block',marginBottom:'0.75rem'}}>{post.categoria}</span>
        )}
        <h1 style={{fontSize:'clamp(1.8rem,4vw,3rem)',fontWeight:100,letterSpacing:'-0.025em',lineHeight:1.1,marginBottom:'1rem'}}>
          {post.titulo.split(':').map((part, i) => i === 0 ? <span key={i}>{part}{post.titulo.includes(':') ? ':' : ''}<br/></span> : <strong key={i} style={{fontWeight:700}}>{part}</strong>)}
        </h1>
        <p style={{fontSize:'0.95rem',fontWeight:300,color:'#888884',lineHeight:1.8,marginBottom:'1.5rem'}}>{post.descripcion}</p>
        <div style={{display:'flex',alignItems:'center',gap:'1rem',marginBottom:'3rem',paddingBottom:'2rem',borderBottom:'1px solid #E0E0DC'}}>
          <span style={{fontSize:'0.72rem',fontWeight:300,color:'#BEBEBA'}}>{post.fecha ? new Date(post.fecha).toLocaleDateString('es-ES',{day:'numeric',month:'long',year:'numeric'}) : ''}</span>
          {post.categoria && <span style={{fontSize:'0.72rem',fontWeight:300,color:'#BEBEBA'}}>·</span>}
          {post.categoria && <span style={{fontSize:'0.72rem',fontWeight:300,color:'#BEBEBA'}}>{post.categoria}</span>}
        </div>
        <div className="blog-content" dangerouslySetInnerHTML={{__html: post.contentHtml}}/>
        <div style={{marginTop:'4rem',padding:'2rem',background:'#0A0A0A',borderRadius:'12px',textAlign:'center'}}>
          <p style={{fontSize:'0.6rem',fontWeight:700,letterSpacing:'0.18em',textTransform:'uppercase',color:'rgba(255,255,255,0.4)',marginBottom:'0.75rem'}}>NOWEAR</p>
          <p style={{fontSize:'1.1rem',fontWeight:300,color:'#FFFFFF',lineHeight:1.6,marginBottom:'1.5rem'}}>Que ninguna invitada llegue<br/><strong style={{fontWeight:700}}>vestida igual.</strong></p>
          <a href={`/${locale === 'es' ? '' : locale + '/'}register`}
            style={{display:'inline-block',padding:'0.85rem 2rem',background:'#F07987',color:'#FFFFFF',textDecoration:'none',fontSize:'0.78rem',fontWeight:500,borderRadius:'4px'}}>
            Crear mi evento gratis
          </a>
        </div>
      </div>
    </>
  )
}
