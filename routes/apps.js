const Router = require('express-promise-router');
const router = new Router();

const db = require('../db');

router.get('/:username', async (req, res) => {
	const { username } = req.params;
	const { rows } = await db.query('SELECT * FROM apps WHERE username=$1', [username]);
	let payload = {};

	if(rows === undefined || !rows.length){
		payload.err = "User not found.";
		res.status(404).send(payload);
	}

	payload.user = rows[0];

	res.status(200).send(payload);
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
