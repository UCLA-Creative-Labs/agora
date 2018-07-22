const Router = require('express-promise-router');
const router = new Router();
const bcrypt = require('bcrypt');

const db = require('../db');
const {passport} = require('./login');

/* create admin route
 * req.body: {
 *   last_name: string,
 *   first_name: string,
 *   email: string,
 *   username: string,
 *   password: string
 * }
 * requires JWT
*/
router.post('/', passport.authenticate('jwt-1', { session: false }), async (req, res) => {
	const admin = req.body;
	let payload = {};

	const query = await db.query('SELECT * FROM admins WHERE username=$1', [admin.username]);

  if ( query.rowCount ) {
		payload.err = "Admin with that username already exists.";
		res.status(404).send(payload);
	}

	const hash = await bcrypt.hash(admin.password, 10);
	const params = [ admin.last_name, admin.first_name, admin.email, hash, admin.username ];

	const insertQuery = await db.query('INSERT INTO admins (last_name, first_name, email, password, username) VALUES ($1, $2, $3, $4, $5)', params);

	if (insertQuery.err) {
		res.status(500).send(insertQuery.err.detail);
	}

  if ( !insertQuery.rowCount ) {
		payload.err = "Admin not created.";
		res.status(500).send(payload);
	}

  res.status(201).send("Admin created");
});

module.exports = router;
