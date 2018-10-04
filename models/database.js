const { Client } = require("pg");
const connectionString =
  process.env.DATABASE_URL || "postgres://localhost:5432/cl_db";

const client = new Client({
  connectionString: connectionString
});

client.connect();

client.query("DROP TABLE admins", (err, res) => {
  if (err) {
    console.log(err);
  }
});

client.query("DROP TABLE apps", (err, res) => {
  if (err) {
    console.log(err);
  }
});

const createAdminSQLString = `
	CREATE TABLE admins(
    id serial PRIMARY KEY,
    last_name VARCHAR(50),
    first_name VARCHAR(50),
    email VARCHAR(50) UNIQUE,
    password VARCHAR(150),
    username VARCHAR(50) UNIQUE
  )`;

client.query(createAdminSQLString, (err, res) => {
  if (err) {
    console.log(err);
  }
});

const createAppSQLString = `
	CREATE TABLE apps(
		id serial PRIMARY KEY,
		name VARCHAR(50),
		email VARCHAR(50),
		year VARCHAR(5),
		past_project VARCHAR(500),
    first_choice VARCHAR(50),
    second_choice VARCHAR(50),
		third_choice VARCHAR(50),
		why_first_choice VARCHAR(500),
		why_second_choice VARCHAR(500),
		why_third_choice VARCHAR(500),
		see_creative_labs VARCHAR(500),
		links VARCHAR(500),
		creativity VARCHAR(500),
		season VARCHAR(100)
  )`;

client.query(createAppSQLString, (err, res) => {
  if (err) {
    console.log(err);
  }
  client.end();
});
