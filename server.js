import express from 'express';
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const {
    MONDAY_API_TOKEN,
    MONDAY_BOARD_ID,
    MONDAY_GROUP_ID,
    MONDAY_COL_EMAIL,
    MONDAY_COL_PHONE,
    MONDAY_COL_MESSAGE,
    MONDAY_COL_SOURCE,
    MONDAY_COL_STATUS,
    MONDAY_COL_CREATED_AT,
    MONDAY_STATUS_LABEL = 'New Lead',
    PORT = 3000,
    DEBUG_KEY,
} = process.env;

const MONDAY_API_URL = 'https://api.monday.com/v2';
const PLACEHOLDER_BOARD_ID = 'your_board_id_here';

const app = express();
app.use(express.json({ limit: '32kb' }));
app.use(express.static(__dirname, { extensions: ['html'] }));

function assertEnv() {
    if (!MONDAY_API_TOKEN) throw new Error('MONDAY_API_TOKEN is not set in .env');
    if (!MONDAY_BOARD_ID) throw new Error('MONDAY_BOARD_ID is not set in .env');
    if (MONDAY_BOARD_ID === PLACEHOLDER_BOARD_ID) {
        throw new Error(`MONDAY_BOARD_ID is still the placeholder "${PLACEHOLDER_BOARD_ID}" — set your real board ID in .env`);
    }
}

async function mondayRequest(query, variables) {
    const res = await fetch(MONDAY_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: MONDAY_API_TOKEN,
            'API-Version': '2024-01',
        },
        body: JSON.stringify({ query, variables }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok || data.errors) {
        const detail = data.errors ? JSON.stringify(data.errors) : `HTTP ${res.status}`;
        const err = new Error(`monday API error: ${detail}`);
        err.mondayResponse = data;
        err.status = res.status;
        throw err;
    }
    return data.data;
}

function buildColumnValues({ email, phone, message, source }) {
    const values = {};
    const now = new Date();
    const isoDate = now.toISOString().slice(0, 10);
    const isoTime = now.toISOString().slice(11, 19);

    if (MONDAY_COL_EMAIL && email) {
        values[MONDAY_COL_EMAIL] = { email, text: email };
    }
    if (MONDAY_COL_PHONE && phone) {
        values[MONDAY_COL_PHONE] = phone;
    }
    if (MONDAY_COL_MESSAGE && message) {
        values[MONDAY_COL_MESSAGE] = { text: message };
    }
    if (MONDAY_COL_SOURCE && source) {
        values[MONDAY_COL_SOURCE] = source;
    }
    if (MONDAY_COL_STATUS) {
        values[MONDAY_COL_STATUS] = { label: MONDAY_STATUS_LABEL };
    }
    if (MONDAY_COL_CREATED_AT) {
        values[MONDAY_COL_CREATED_AT] = { date: isoDate, time: isoTime };
    }
    return values;
}

// Health check
app.get('/api/health', (_req, res) => {
    res.json({ ok: true, message: 'Server is running' });
});

// Discover board structure — columns + groups
app.get('/api/board-debug', async (req, res) => {
    try {
        if (DEBUG_KEY && req.query.key !== DEBUG_KEY) {
            return res.status(401).json({ error: 'Unauthorized — missing or wrong ?key=' });
        }
        assertEnv();

        const query = `
            query GetBoard($boardId: [ID!]) {
                boards(ids: $boardId) {
                    id
                    name
                    columns { id title type }
                    groups { id title }
                }
            }
        `;
        const data = await mondayRequest(query, { boardId: [String(MONDAY_BOARD_ID)] });
        res.json(data);
    } catch (err) {
        console.error('[board-debug] error:', err.message);
        res.status(500).json({ error: err.message });
    }
});

// Create a new lead
app.post('/api/leads', async (req, res) => {
    console.log('\n[/api/leads] called');
    console.log('  env  | hasToken:', !!MONDAY_API_TOKEN, ' hasBoardId:', !!MONDAY_BOARD_ID && MONDAY_BOARD_ID !== PLACEHOLDER_BOARD_ID);

    try {
        assertEnv();

        const body = req.body || {};
        const email = String(body.email || '').trim();
        const fullName = String(body.fullName || '').trim();
        const phone = String(body.phone || '').trim();
        const message = String(body.message || '').trim();
        const source = String(body.source || 'landing-page').trim();
        const honeypot = String(body.company_website || '').trim();

        // Honeypot — bots fill hidden fields. Silently accept and drop.
        if (honeypot) {
            console.log('  drop | honeypot triggered');
            return res.json({ ok: true });
        }

        // email is required; everything else optional
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            console.log('  fail | invalid email');
            return res.status(400).json({ error: 'A valid email is required' });
        }
        if (email.length > 200 || fullName.length > 200 || phone.length > 50 || message.length > 4000) {
            return res.status(400).json({ error: 'Input too long' });
        }

        const itemName = fullName || email;
        const columnValues = buildColumnValues({ email, phone, message, source });

        console.log('  body | email:', email, ' fullName:', fullName || '(none)', ' phone:', phone || '(none)', ' message.len:', message.length);
        console.log('  cols | columnValues =', JSON.stringify(columnValues));
        console.log('  send | board_id:', MONDAY_BOARD_ID, ' item_name:', itemName);

        const mutation = `
            mutation CreateLead($boardId: ID!, $itemName: String!, $columnValues: JSON!${MONDAY_GROUP_ID ? ', $groupId: String' : ''}) {
                create_item(
                    board_id: $boardId,
                    item_name: $itemName,
                    column_values: $columnValues
                    ${MONDAY_GROUP_ID ? ', group_id: $groupId' : ''}
                ) {
                    id
                    name
                }
            }
        `;

        const variables = {
            boardId: String(MONDAY_BOARD_ID),
            itemName,
            columnValues: JSON.stringify(columnValues),
        };
        if (MONDAY_GROUP_ID) variables.groupId = MONDAY_GROUP_ID;

        const data = await mondayRequest(mutation, variables);
        console.log('  ok   | monday item created:', data.create_item);
        res.json({ ok: true, item: data.create_item });
    } catch (err) {
        console.error('  ERR  |', err.message);
        if (err.mondayResponse) {
            console.error('  monday response:', JSON.stringify(err.mondayResponse, null, 2));
        }
        res.status(500).json({ error: err.message || 'Failed to save lead' });
    }
});

app.listen(PORT, () => {
    console.log('');
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`Health check available at http://localhost:${PORT}/api/health`);
    console.log(`Leads endpoint available at http://localhost:${PORT}/api/leads`);
    console.log('');
    console.log(`MONDAY_API_TOKEN exists: ${!!MONDAY_API_TOKEN}`);
    console.log(`MONDAY_BOARD_ID: ${MONDAY_BOARD_ID || '(not set)'}${MONDAY_BOARD_ID === PLACEHOLDER_BOARD_ID ? ' ⚠ placeholder — set real ID in .env' : ''}`);
    const mapped = ['EMAIL', 'PHONE', 'MESSAGE', 'SOURCE', 'STATUS', 'CREATED_AT']
        .filter(k => process.env[`MONDAY_COL_${k}`])
        .join(', ') || '(none — item will be created with item_name only)';
    console.log(`Mapped columns: ${mapped}`);
    console.log('');
});
