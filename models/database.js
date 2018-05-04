const { Client } = require('pg');
const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/cl_db';

const client = new Client({
  connectionString: connectionString,
});

client.connect();

client.query(
	'CREATE TABLE admins(last_name VARCHAR(50), first_name VARCHAR(50), email VARCHAR(50) UNIQUE, password VARCHAR(150), username VARCHAR(50) UNIQUE)', 
	(err, res) => {
		if (err) {
			console.log(err)
		}
});

client.query(
	'CREATE TABLE apps(last_name VARCHAR(50), first_name VARCHAR(50), email VARCHAR(50) UNIQUE, password VARCHAR(150), username VARCHAR(50) UNIQUE, response TEXT)', 
	(err, res) => {
		if (err) {
			console.log(err)
		}
	client.end()
});
