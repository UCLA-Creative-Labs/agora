const Router = require('express-promise-router');
const router = new Router();

const db = require('../db');
const {passport} = require('./login');
const {strings} = require('../utils/index');

/* fetches all applications */
router.put('/', async (req, res) => {
  const { years } = req.body;

  // TO DO dont do this;
  let yearsArray = [1,2,3,4];
  if (years) {
    yearsArray = strings().toArray(years, Number);
  }

  const appQuery = await db.query('SELECT * FROM apps WHERE year=ANY($1::int[])', [yearsArray]);

  if (appQuery.err) {
    console.log(appQuery.err);
		res.status(500).send(appQuery.err);
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

  const params = [ newApp.last_name, newApp.first_name, newApp.email, 
                   newApp.response, newApp.year, newApp.first_choice ];
  const createAppQuery = await db.query('INSERT INTO apps (last_name, first_name, email, response, year, first_choice) VALUES ($1, $2, $3, $4, $5, $6)', params);
  

  if (createAppQuery.err) {
	  res.status(500).send(createAppQuery.err);
  }
  
  res.status(201).send();
})

module.exports = router;
