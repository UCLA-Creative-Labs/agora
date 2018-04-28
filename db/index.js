const pg = require('pg');
const pool = new pg.Pool({
user: 'bryanwong',
host: '127.0.0.1',
database: 'cl_db',
password: '123',
port: '5432'});

const query = async (text, params) => {
	try {
		await pool.connect()
		const res = await pool.query(text, params)
		return res
	} catch(err) {
		throw err
	}
}

module.exports = {
	query: query,
}