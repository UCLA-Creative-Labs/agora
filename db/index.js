const pg = require('pg');
const pool = new pg.Pool({
host: '127.0.0.1',
database: 'cl_db',
});

const query = async (text, params) => {
	try {
		const client = await pool.connect();
		const res = await client.query(text, params)
		return res
	} catch(err) {
		throw err
	}
}
// pool.connect().then(client => {
// 	return client.query()
// 			.then((result) => {
// 					client.release();
// 					console.log(result.rows)
// 					callback(null, result.rows[0]);
// 			})
// 			.catch(err => {
// 					client.release();
// 					callback(err, null);
// 			});
// }).catch(err=>{
// 	console.log("Issue",err)
// })
module.exports = {
	query: query,
}