const MONDAY_API_URL = 'https://api.monday.com/v2'

function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
    body: JSON.stringify(body),
  }
}

function authorized(event) {
  const token = process.env.MONDAY_MONITOR_TOKEN
  if (!token) return false
  const header = event.headers?.authorization || ''
  const query = event.queryStringParameters?.token || ''
  return header === `Bearer ${token}` || query === token
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

function simplifyItem(item) {
  return {
    id: item.id,
    name: item.name,
    created_at: item.created_at,
    updated_at: item.updated_at,
    columns: (item.column_values || [])
      .filter((c) => c.text)
      .slice(0, 20)
      .map((c) => ({ id: c.id, text: String(c.text).slice(0, 500) })),
  }
}

export async function handler(event) {
  if (event.httpMethod !== 'GET') return json(405, { error: 'Method not allowed' })
  if (!authorized(event)) return json(401, { error: 'Unauthorized' })

  const env = process.env
  if (!env.MONDAY_API_TOKEN || !env.MONDAY_BOARD_ID) {
    return json(500, { error: 'Monday environment is not configured' })
  }

  const limit = Math.min(Number(event.queryStringParameters?.limit || 25), 100)
  const query = `
    query OrynvalLeadMonitor($boardId: [ID!], $limit: Int!) {
      boards(ids: $boardId) {
        id
        name
        items_page(limit: $limit) {
          items {
            id
            name
            created_at
            updated_at
            column_values { id text value }
          }
        }
      }
    }
  `

  try {
    const data = await mondayRequest(env.MONDAY_API_TOKEN, query, {
      boardId: [String(env.MONDAY_BOARD_ID)],
      limit,
    })
    const board = data.boards?.[0]
    const items = (board?.items_page?.items || [])
      .map(simplifyItem)
      .sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)))

    return json(200, {
      ok: true,
      board: board ? { id: board.id, name: board.name } : null,
      checkedAt: new Date().toISOString(),
      items,
    })
  } catch (err) {
    console.error('[monday-recent]', err.message)
    return json(500, { error: 'Failed to read Monday leads' })
  }
}
