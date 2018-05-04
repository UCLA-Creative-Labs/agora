const Router = require('express-promise-router');
const router = new Router();

const db = require('../db');

router.get('/:username', async (req, res) => {
	const { username } = req.params
	const { rows } = await db.query('SELECT * FROM apps WHERE username=$1', [username])
	let payload = {}

	if(rows === undefined || !rows.length){
		payload.err = "User not found."
		res.status(404).send(payload)
	}

	payload.user = rows[0]

	res.status(200).send(payload)
})

router.get('/unreviewed', async (req, res) => {
	const { amount, offset } = req.query
	if (!amount) {
		amount = 64
	}
	if (!offset) {
		offset = 0
	}
	const { rows } = await db.query('SELECT TOP $1 FROM apps WHERE submitted=$2 AND reviewed=$3 AND ROWNUM > $4', amount, true, false, offset)
	let payload = {}

	if (rows === undefined || !rows.length) {
		payload.err = "No unreviewed applications"
		res.status(404).send(payload)
	}

	payload.apps = rows

	res.status(200).send(payload)
})

router.post('/new', async (req, res) => {
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

module.exports = router;
