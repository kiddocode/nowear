export async function GET() {
  const urls = [
    'https://nowear.es',
    'https://nowear.es/blog/como-coordinar-looks-invitadas-boda',
    'https://nowear.es/blog/dos-invitadas-mismo-vestido-boda-como-evitarlo',
    'https://nowear.es/blog/dress-code-boda-guia-completa',
    'https://nowear.es/blog/invitada-perfecta-boda-checklist',
    'https://nowear.es/blog/organizar-dress-code-boda-sin-dramas',
    'https://nowear.es/blog/que-llevar-a-una-boda-de-invitada-2026',
    'https://nowear.es/blog/colores-prohibidos-boda-mas-alla-del-blanco',
    'https://nowear.es/blog/looks-invitada-boda-otono-invierno',
    'https://nowear.es/blog/coordinacion-looks-alfombra-roja-festivales-cine',
    'https://nowear.es/blog/gestion-vestuario-galas-premios-goya-feroz',
    'https://nowear.es/blog/protocolo-institucional-coordinacion-indumentaria',
    'https://nowear.es/blog/protocolo-vestuario-recepciones-oficiales-casas-reales',
    'https://nowear.es/blog/coordinacion-vestuario-agencias-eventos',
    'https://nowear.es/blog/herramienta-estilistas-agencias-moda-eventos',
  ]

  const body = {
    host: 'nowear.es',
    key: '149b1ae7cec39d9a7604d746938d5aba',
    keyLocation: 'https://nowear.es/149b1ae7cec39d9a7604d746938d5aba.txt',
    urlList: urls
  }

  const res = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(body)
  })

  return new Response(JSON.stringify({ status: res.status, ok: res.ok }), {
    headers: { 'Content-Type': 'application/json' }
  })
}
