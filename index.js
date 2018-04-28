const express = require('express')
const bodyParser = require('body-parser')
const db = require('./db')
const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/apps/:username', async (req, res) => {
	try {
		const { username } = req.params
		const { rows } = await db.query('SELECT * FROM apps WHERE username=$1', [username])
		const payload = {
			users: rows,
		}
		res.send(payload)
	} catch(e) {
		throw e
	}
})

app.post('/apps/new', async (req, res) => {
	try {
		const newUser = req.body
		const params = [ newUser.lastName, newUser.firstName, newUser.email, newUser.response, newUser.username ]
		const { rows } = await db.query('INSERT INTO apps VALUES ($1, $2, $3, $4, $5)', params)
		res.send(rows)
	} catch(e) {
		throw e
	}
})

app.listen(3000)