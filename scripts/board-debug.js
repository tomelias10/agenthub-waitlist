import dotenv from 'dotenv';
dotenv.config();

const { MONDAY_API_TOKEN, MONDAY_BOARD_ID } = process.env;

if (!MONDAY_API_TOKEN || !MONDAY_BOARD_ID) {
    console.error('MONDAY_API_TOKEN and MONDAY_BOARD_ID must be set in .env');
    process.exit(1);
}

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

const res = await fetch('https://api.monday.com/v2', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        Authorization: MONDAY_API_TOKEN,
        'API-Version': '2024-01',
    },
    body: JSON.stringify({ query, variables: { boardId: [String(MONDAY_BOARD_ID)] } }),
});

const data = await res.json();
if (data.errors) {
    console.error(JSON.stringify(data.errors, null, 2));
    process.exit(1);
}

const board = data.data?.boards?.[0];
if (!board) {
    console.error('Board not found. Check MONDAY_BOARD_ID.');
    process.exit(1);
}

console.log(`\nBoard: ${board.name} (id: ${board.id})\n`);
console.log('Columns:');
console.table(board.columns.map(c => ({ id: c.id, title: c.title, type: c.type })));
console.log('\nGroups:');
console.table(board.groups.map(g => ({ id: g.id, title: g.title })));

console.log('\nPaste the matching column IDs into .env:');
console.log('  MONDAY_COL_EMAIL=<email column id>');
console.log('  MONDAY_COL_PHONE=<phone/text column id>');
console.log('  MONDAY_COL_MESSAGE=<long_text column id>');
console.log('  MONDAY_COL_SOURCE=<text column id>');
console.log('  MONDAY_COL_STATUS=<status column id>');
console.log('  MONDAY_COL_CREATED_AT=<date column id>   # optional');
