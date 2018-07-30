const pg = require('pg');
const pool = new pg.Pool({
host: '127.0.0.1',
database: 'cl_db',
});

const query = async (text, params) => {
	try {
		const client = await pool.connect();
		const res = await client.query(text, params);

		return res;
	} catch(err) {
		return {err: err};
	}
}

module.exports = {
	query: query,
}
