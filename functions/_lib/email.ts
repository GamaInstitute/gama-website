// Shared helpers for the submission endpoints (research-summary, weekpaper-submission):
// HTML escaping, JSON responses, multipart file access and the team-notification email layout.

export function esc(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

// No Buffer in the Workers runtime without nodejs_compat. Encoding chunk by chunk
// (a multiple of 3 bytes, so no padding mid-stream) avoids building a full binary
// string copy of the file, which matters for multi-MB attachments in 128MB of memory.
export function toBase64(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf)
  const CHUNK = 0x8000 * 3
  const parts: string[] = []
  for (let i = 0; i < bytes.length; i += CHUNK) {
    parts.push(btoa(String.fromCharCode(...bytes.subarray(i, i + CHUNK))))
  }
  return parts.join('')
}

export function textField(form: FormData, key: string): string | undefined {
  const v = form.get(key)
  return typeof v === 'string' ? v : undefined
}

// workers-types narrows get() to string for typed overloads; widen before the check
export function filePart(form: FormData, key: string): File | null {
  const v = form.get(key) as unknown
  return v instanceof File && v.size > 0 ? v : null
}

export async function toAttachment(file: File) {
  return { filename: file.name, content: toBase64(await file.arrayBuffer()) }
}

export function row(label: string, valueHtml: string): string {
  return `<tr>
    <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;font-size:14px;width:170px;vertical-align:top"><strong style="color:#1e293b">${label}</strong></td>
    <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;font-size:14px;color:#1e293b;white-space:pre-wrap">${valueHtml || '<span style="color:#94a3b8">-</span>'}</td>
  </tr>`
}

export function link(url: string): string {
  return url ? `<a href="${esc(url)}" style="color:#165C71;text-decoration:none">${esc(url)}</a>` : ''
}

export function mailto(email: string): string {
  return `<a href="mailto:${esc(email)}" style="color:#165C71;text-decoration:none">${esc(email)}</a>`
}

export function emailLayout(title: string, rowsHtml: string, replyName: string): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f7fa;font-family:system-ui,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f7fa;padding:32px 16px">
    <tr><td>
      <table width="600" cellpadding="0" cellspacing="0" align="center"
             style="background:#ffffff;border-radius:10px;overflow:hidden;border:1px solid #e2e8f0;max-width:600px;margin:0 auto">
        <tr>
          <td style="background:linear-gradient(135deg,#B56418,#165C71);padding:28px 32px">
            <p style="margin:0;font-size:13px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:#fff;opacity:.8">Gama Institute</p>
            <h1 style="margin:6px 0 0;font-size:22px;font-weight:700;color:#fff">${esc(title)}</h1>
          </td>
        </tr>
        <tr>
          <td style="padding:28px 32px">
            <table cellpadding="0" cellspacing="0" width="100%">
              ${rowsHtml}
            </table>
          </td>
        </tr>
        <tr>
          <td style="background:#f8fafc;padding:16px 32px;border-top:1px solid #e2e8f0">
            <p style="margin:0;font-size:12px;color:#94a3b8">Répondez directement à ce courriel pour contacter ${esc(replyName)}.</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}
