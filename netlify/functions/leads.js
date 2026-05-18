const MONDAY_API_URL = 'https://api.monday.com/v2';

function json(statusCode, body) {
    return {
        statusCode,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    };
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
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok || data.errors) {
        const detail = data.errors ? JSON.stringify(data.errors) : `HTTP ${res.status}`;
        const err = new Error(`monday API error: ${detail}`);
        err.mondayResponse = data;
        throw err;
    }
    return data.data;
}

function buildColumnValues(env, { email, phone, message, source }) {
    const values = {};
    const now = new Date();
    const isoDate = now.toISOString().slice(0, 10);
    const isoTime = now.toISOString().slice(11, 19);

    if (env.MONDAY_COL_EMAIL && email) values[env.MONDAY_COL_EMAIL] = { email, text: email };
    if (env.MONDAY_COL_PHONE && phone) values[env.MONDAY_COL_PHONE] = phone;
    if (env.MONDAY_COL_MESSAGE && message) values[env.MONDAY_COL_MESSAGE] = { text: message };
    if (env.MONDAY_COL_SOURCE && source) values[env.MONDAY_COL_SOURCE] = source;
    if (env.MONDAY_COL_STATUS) values[env.MONDAY_COL_STATUS] = { label: env.MONDAY_STATUS_LABEL || 'New Lead' };
    if (env.MONDAY_COL_CREATED_AT) values[env.MONDAY_COL_CREATED_AT] = { date: isoDate, time: isoTime };
    return values;
}

export async function handler(event) {
    if (event.httpMethod !== 'POST') {
        return json(405, { error: 'Method not allowed' });
    }

    const env = process.env;
    console.log('\n[leads] called');
    console.log('  env  | hasToken:', !!env.MONDAY_API_TOKEN, ' hasBoardId:', !!env.MONDAY_BOARD_ID);

    try {
        if (!env.MONDAY_API_TOKEN) throw new Error('MONDAY_API_TOKEN is not set');
        if (!env.MONDAY_BOARD_ID) throw new Error('MONDAY_BOARD_ID is not set');

        let body;
        try {
            body = JSON.parse(event.body || '{}');
        } catch {
            return json(400, { error: 'Invalid JSON body' });
        }

        const email = String(body.email || '').trim();
        const fullName = String(body.fullName || '').trim();
        const phone = String(body.phone || '').trim();
        const message = String(body.message || '').trim();
        const source = String(body.source || 'landing-page').trim();
        const honeypot = String(body.company_website || '').trim();

        if (honeypot) {
            console.log('  drop | honeypot triggered');
            return json(200, { ok: true });
        }

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            console.log('  fail | invalid email');
            return json(400, { error: 'A valid email is required' });
        }
        if (email.length > 200 || fullName.length > 200 || phone.length > 50 || message.length > 4000) {
            return json(400, { error: 'Input too long' });
        }

        const itemName = fullName || email;
        const columnValues = buildColumnValues(env, { email, phone, message, source });

        console.log('  body | email:', email, ' fullName:', fullName || '(none)', ' phone:', phone || '(none)', ' message.len:', message.length);
        console.log('  cols | columnValues =', JSON.stringify(columnValues));
        console.log('  send | board_id:', env.MONDAY_BOARD_ID, ' item_name:', itemName);

        const hasGroup = !!env.MONDAY_GROUP_ID;
        const mutation = `
            mutation CreateLead($boardId: ID!, $itemName: String!, $columnValues: JSON!${hasGroup ? ', $groupId: String' : ''}) {
                create_item(
                    board_id: $boardId,
                    item_name: $itemName,
                    column_values: $columnValues
                    ${hasGroup ? ', group_id: $groupId' : ''}
                ) { id name }
            }
        `;

        const variables = {
            boardId: String(env.MONDAY_BOARD_ID),
            itemName,
            columnValues: JSON.stringify(columnValues),
        };
        if (hasGroup) variables.groupId = env.MONDAY_GROUP_ID;

        const data = await mondayRequest(env.MONDAY_API_TOKEN, mutation, variables);
        console.log('  ok   | monday item created:', data.create_item);
        return json(200, { ok: true, item: data.create_item });
    } catch (err) {
        console.error('  ERR  |', err.message);
        if (err.mondayResponse) {
            console.error('  monday response:', JSON.stringify(err.mondayResponse, null, 2));
        }
        return json(500, { error: err.message || 'Failed to save lead' });
    }
}
