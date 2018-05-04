const Router = require('express-promise-router');
const router = new Router();

const db = require('../db');

router.post('/new', async (req, res) => {
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

router.put('/login', async (req, res) => {
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

module.exports = router;
