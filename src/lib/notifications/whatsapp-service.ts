interface WhatsAppOptions {
  to: string
  message: string
}

export async function sendWhatsApp(options: WhatsAppOptions): Promise<void> {
  const apiUrl = process.env.WHATSAPP_API_URL
  const apiKey = process.env.WHATSAPP_API_KEY
  const from = process.env.WHATSAPP_FROM

  if (!apiUrl || !apiKey) {
    console.warn('WhatsApp API not configured')
    return
  }

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from,
      to: options.to,
      body: options.message,
    }),
  })

  if (!response.ok) {
    throw new Error(`WhatsApp API error: ${response.statusText}`)
  }
}
