'use client'

export default function BlogGrid({ posts, locale }) {
  return (
    <>
      <style>{`
        .blog-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; }
        @media (max-width: 1024px) { .blog-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 640px) { .blog-grid { grid-template-columns: 1fr; } }
      `}</style>
      <div style={{maxWidth:'1200px',margin:'0 auto',padding:'4rem 2rem'}}>
        <div style={{marginBottom:'3rem'}}>
          <span style={{fontSize:'0.6rem',fontWeight:600,letterSpacing:'0.18em',textTransform:'uppercase',color:'#F07987'}}>Blog</span>
          <h1 style={{fontSize:'clamp(2rem,4vw,3.5rem)',fontWeight:100,letterSpacing:'-0.025em',lineHeight:1.1,marginTop:'0.5rem',marginBottom:'1rem'}}>
            Inspiración y consejos<br/><strong style={{fontWeight:700}}>para invitadas.</strong>
          </h1>
          <p style={{fontSize:'0.95rem',fontWeight:300,color:'#888884',maxWidth:'520px',lineHeight:1.9}}>
            Guías de looks, tendencias, dress codes y todo lo que necesitas saber para llegar perfecta a cualquier evento.
          </p>
        </div>
        <div className="blog-grid">
          {posts.map((post) => (
            <a key={post.slug} href={`${locale === 'es' ? '' : '/' + locale}/blog/${post.slug}`}
              style={{textDecoration:'none',display:'block',border:'1px solid #E0E0DC',borderRadius:'12px',overflow:'hidden',background:'#FFFFFF',transition:'transform 0.15s,box-shadow 0.15s'}}
              onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-4px)';e.currentTarget.style.boxShadow='0 8px 32px rgba(0,0,0,0.1)'}}
              onMouseLeave={e=>{e.currentTarget.style.transform='none';e.currentTarget.style.boxShadow='none'}}>
              <div style={{height:'200px',background:'linear-gradient(135deg,#0A0A0A 0%,#2C2C2C 100%)',display:'flex',alignItems:'center',justifyContent:'center'}}>
                <span style={{fontSize:'0.6rem',fontWeight:700,letterSpacing:'0.18em',textTransform:'uppercase',color:'rgba(255,255,255,0.4)'}}>NOWEAR</span>
              </div>
              <div style={{padding:'1.5rem'}}>
                {post.categoria && (
                  <span style={{fontSize:'0.55rem',fontWeight:700,letterSpacing:'0.15em',textTransform:'uppercase',color:'#F07987',marginBottom:'0.5rem',display:'block'}}>{post.categoria}</span>
                )}
                <h2 style={{fontSize:'1rem',fontWeight:600,color:'#0A0A0A',lineHeight:1.4,marginBottom:'0.75rem',letterSpacing:'-0.01em'}}>{post.titulo}</h2>
                <p style={{fontSize:'0.78rem',fontWeight:300,color:'#888884',lineHeight:1.7,marginBottom:'1rem'}}>{post.descripcion}</p>
                <span style={{fontSize:'0.65rem',fontWeight:300,color:'#BEBEBA'}}>{post.fecha ? new Date(post.fecha).toLocaleDateString('es-ES',{day:'numeric',month:'long',year:'numeric'}) : ''}</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </>
  )
}
