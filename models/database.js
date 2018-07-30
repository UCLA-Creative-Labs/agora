const { Client } = require('pg');
const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/cl_db';

const client = new Client({
  connectionString: connectionString,
});

client.connect();

client.query(
	'DROP TABLE admins',
	(err, res) => {
		if(err) {
			console.log(err)
		}
});

client.query(
	'DROP TABLE apps',
	(err, res) => {
		if(err) {
			console.log(err)
		}
});

client.query(
	'CREATE TABLE admins(id serial PRIMARY KEY, last_name VARCHAR(50), first_name VARCHAR(50), email VARCHAR(50) UNIQUE, password VARCHAR(150), username VARCHAR(50) UNIQUE)', 
	(err, res) => {
		if (err) {
			console.log(err)
		}
});

client.query(
	'CREATE TABLE apps(id serial PRIMARY KEY, last_name VARCHAR(50), first_name VARCHAR(50), email VARCHAR(50), response TEXT, year INTEGER, first_choice VARCHAR(50))', 
	(err, res) => {
		if (err) {
			console.log(err)
		}
	client.end()
});
