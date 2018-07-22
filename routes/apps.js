const Router = require('express-promise-router');
const router = new Router();

const db = require('../db');
const {passport} = require('./login');

/* fetches all applications */
router.get('/', passport.authenticate('jwt-1', { session: false }), async (req, res) => {
  const appQuery = await db.query('SELECT * FROM apps');

  if (appQuery.err) {
		res.status(500).send(appQuery.err.detail);
  }

	let payload = {};

	if(appQuery.rows === undefined || !appQuery.rows.length){
		payload.err = "No apps found.";
		res.status(404).send(payload);
	}

	payload.apps = appQuery.rows;

  res.status(200).send(payload);
})

/* fetches a single application */
router.get('/:username', passport.authenticate('jwt-1', { session: false }), async (req, res) => {
  const { username } = req.params;
  const appQuery = await db.query('SELECT * FROM apps WHERE username=$1', [username]);

  if (appQuery.err) {
	  res.status(500).send(appQuery.err.detail);
  }
  
  let payload = {};

  if(rows === undefined || !rows.length){
    payload.err = "App not found.";
    res.status(404).send(payload);
  }

  payload.user = rows[0];

  res.status(200).send(payload);
})

router.post('/', async (req, res) => {
	const newApp = req.body
	let payload = {}

	const user = await db.query('SELECT * FROM apps WHERE username=$1', [newApp.username])

  if (user.err) {
	  res.status(500).send(user.err.detail);
  }

	if(user.rowCount){
		payload.err = 'User already exists.'
		res.status(404).send(payload)
	}

	const params = [ newApp.last_name, newApp.first_name, newApp.email, newApp.username, newApp.response ]
  const appQuery = await db.query('INSERT INTO apps (last_name, first_name, email, username, response) VALUES ($1, $2, $3, $4, $5)', params)
  
  if (appQuery.err) {
	  res.status(500).send(appQuery.err.detail);
  }

  res.send(appQuery.rows[0])
})

module.exports = router;
