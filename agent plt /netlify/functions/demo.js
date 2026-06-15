// Orynval — demo request handler → creates an item on a monday.com board.
// The monday API token lives ONLY in server-side env vars, never in the client.
//
// Required env vars (set in Netlify → Site settings → Environment variables):
//   MONDAY_API_TOKEN   monday personal API token (Admin → API)
//   MONDAY_BOARD_ID    numeric board id (from the board URL)
// Optional env vars (column ids — found via the board's column menu → "Customize"):
//   MONDAY_GROUP_ID        group to drop items into (e.g. "topics")
//   MONDAY_COL_EMAIL       an Email column id
//   MONDAY_COL_DETAILS     a Long Text column id (company, industry, notes land here)
//   MONDAY_COL_STATUS      a Status column id   (set to MONDAY_STATUS_LABEL)
//   MONDAY_STATUS_LABEL    status label, default "New demo request"
//   MONDAY_COL_SOURCE      a Text column id
//   MONDAY_COL_CREATED_AT  a Date column id

const MONDAY_API_URL = 'https://api.monday.com/v2'
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function json(statusCode, body) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }
}

async function mondayRequest(token, query, variables) {
  const res = await fetch(MONDAY_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
      'API-Version': '2024-01',
    },
    body: JSON.stringify({ query, variables }),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok || data.errors) {
    const detail = data.errors ? JSON.stringify(data.errors) : `HTTP ${res.status}`
    throw new Error(`monday API error: ${detail}`)
  }
  return data.data
}

function buildColumnValues(env, { email, details, source }) {
  const values = {}
  const now = new Date()
  if (env.MONDAY_COL_EMAIL && email) values[env.MONDAY_COL_EMAIL] = { email, text: email }
  if (env.MONDAY_COL_DETAILS && details) values[env.MONDAY_COL_DETAILS] = { text: details }
  if (env.MONDAY_COL_SOURCE && source) values[env.MONDAY_COL_SOURCE] = source
  if (env.MONDAY_COL_STATUS)
    values[env.MONDAY_COL_STATUS] = { label: env.MONDAY_STATUS_LABEL || 'New demo request' }
  if (env.MONDAY_COL_CREATED_AT)
    values[env.MONDAY_COL_CREATED_AT] = {
      date: now.toISOString().slice(0, 10),
      time: now.toISOString().slice(11, 19),
    }
  return values
}

export async function handler(event) {
  if (event.httpMethod !== 'POST') return json(405, { error: 'Method not allowed' })

  const env = process.env
  try {
    if (!env.MONDAY_API_TOKEN) throw new Error('MONDAY_API_TOKEN is not set')
    if (!env.MONDAY_BOARD_ID) throw new Error('MONDAY_BOARD_ID is not set')

    let body
    try {
      body = JSON.parse(event.body || '{}')
    } catch {
      return json(400, { error: 'Invalid JSON body' })
    }

    const name = String(body.name || '').trim()
    const email = String(body.email || '').trim()
    const company = String(body.company || '').trim()
    const industry = String(body.industry || '').trim()
    const notes = String(body.notes || '').trim()
    const source = String(body.source || 'orynval-landing').trim()
    const honeypot = String(body.company_website || '').trim()

    // Silently accept bot submissions (honeypot) without writing to monday.
    if (honeypot) return json(200, { ok: true })

    if (!name) return json(400, { error: 'Name is required' })
    if (!EMAIL_RE.test(email)) return json(400, { error: 'A valid email is required' })
    if (!company) return json(400, { error: 'Company is required' })
    if (name.length > 200 || email.length > 200 || company.length > 200 || notes.length > 4000)
      return json(400, { error: 'Input too long' })

    // Everything lands in one long-text column, so a board only needs token + id to work.
    const details = [
      `Email: ${email}`,
      `Company: ${company}`,
      industry && `Industry: ${industry}`,
      notes && `Wants handled: ${notes}`,
    ]
      .filter(Boolean)
      .join('\n')

    const itemName = `${name}${company ? ` — ${company}` : ''}`
    const columnValues = buildColumnValues(env, { email, details, source })

    const hasGroup = !!env.MONDAY_GROUP_ID
    const mutation = `
      mutation CreateDemo($boardId: ID!, $itemName: String!, $columnValues: JSON!${hasGroup ? ', $groupId: String' : ''}) {
        create_item(
          board_id: $boardId,
          item_name: $itemName,
          column_values: $columnValues
          ${hasGroup ? ', group_id: $groupId' : ''}
        ) { id name }
      }
    `
    const variables = {
      boardId: String(env.MONDAY_BOARD_ID),
      itemName,
      columnValues: JSON.stringify(columnValues),
    }
    if (hasGroup) variables.groupId = env.MONDAY_GROUP_ID

    const data = await mondayRequest(env.MONDAY_API_TOKEN, mutation, variables)
    const itemId = data.create_item && data.create_item.id

    // Attach all details as a note, so the full lead is captured even when no
    // board columns are mapped.
    if (itemId && details) {
      const updateMutation = `
        mutation AddNote($itemId: ID!, $body: String!) {
          create_update(item_id: $itemId, body: $body) { id }
        }
      `
      await mondayRequest(env.MONDAY_API_TOKEN, updateMutation, {
        itemId: String(itemId),
        body: details,
      }).catch((e) => console.error('[demo] note failed:', e.message))
    }

    return json(200, { ok: true, item: data.create_item })
  } catch (err) {
    console.error('[demo]', err.message)
    return json(500, { error: 'Failed to submit. Please try again.' })
  }
}
