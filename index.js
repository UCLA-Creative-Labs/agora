const express = require('express')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
const db = require('./db')
const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

/* cross origin */
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    next();
});

app.get('/apps/:username', async (req, res) => {
	const { username } = req.params
	const { rows } = await db.query('SELECT * FROM apps WHERE username=$1', [username])
	let payload = {};

	if(rows === undefined || !rows.length){
		payload.err = "User not found."
		res.status(404).send(payload)
	}

	payload.user = rows[0]

	res.status(200).send(payload)
})

app.post('/apps/new', async (req, res) => {
	const newApp = req.body
	let payload = {}

	const user = await db.query('SELECT * FROM apps WHERE username=$1', [newApp.username])

	if(user.rowCount){
		payload.err = 'User already exists.'
		res.status(404).send(payload)
	}

	const params = [ newApp.last_name, newApp.first_name, newApp.email, newApp.response, newApp.username ]
	const { rows } = await db.query('INSERT INTO apps VALUES ($1, $2, $3, $4, $5)', params)
	res.send(rows)

})

app.post('/admins/new', async (req, res) => {
	const newAdmin = req.body
	let payload = {}

	const admin = await db.query('SELECT * FROM admins WHERE username=$1', [newAdmin.username])

	if(admin.rowCount){
		payload.err = "Admin with that username already exists."
		res.status(404).send(payload)
	}

	const hash = await bcrypt.hash(newAdmin.password, 10)
	const params = [ newAdmin.last_name, newAdmin.first_name, newAdmin.email, hash, newAdmin.username ]
	const { rows } = await db.query('INSERT INTO admins VALUES ($1, $2, $3, $4, $5)', params)
	res.send(rows)
})

app.put('/admins/login', async (req, res) => {
	const login = req.body
	const params = [ login.username ]
	const admin = await db.query('SElECT * FROM admins WHERE username=$1', params)
	let payload = {}

	if(!admin.rowCount){
		payload.err = 'Admin not found.'
		res.status(404).send(payload)
	}

	const rows = admin.rows
	const hash = rows[0].password
	await bcrypt.compare(login.password, hash, function(err, resp) {
	  if(resp) {	
	  	payload.admin = rows[0]
	  	res.status(200).send(payload)
	  } else {
	   	payload.err = 'Password doesn\'t match.'
	   	res.status(404).send(payload)
	  } 
	});
})

app.listen(3000)