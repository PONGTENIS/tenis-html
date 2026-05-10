export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const { nombre, email, fecha, turno } = req.body
  const RESEND_KEY = process.env.RESEND_API_KEY
  const FROM = process.env.FROM_EMAIL || 'onboarding@resend.dev'
  const FROM_NAME = process.env.FROM_NAME || 'Club Tenis de Mesa'
  const body = `Hola ${nombre},\n\nTu turno de tenis de mesa quedó confirmado.\n\nFecha: ${fecha}\nHorario: ${turno} hs\n\nTe pedimos que llegues 5 minutos antes. ¡Te esperamos en la cancha!\n\nSaludos,\n${FROM_NAME}`
  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + RESEND_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: FROM_NAME + ' <' + FROM + '>', to: email, subject: 'Turno confirmado - ' + fecha + ' ' + turno + ' hs', text: body })
    })
    return res.status(200).json({ ok: true })
  } catch(e) {
    return res.status(500).json({ error: e.message })
  }
}
