const Router = require('express-promise-router');
const router = new Router();

const db = require('../db');
const {passport} = require('./login');
const {strings} = require('../utils/index');

/* generic application fetching */
router.get('/', async (req, res) => {
  const { years, firstChoice, secondChoice, thirdChoice, limit = 400, offset = 0 } = req.query;
  const params = [];

  const SQLStrings = [];
  let SQLString = 'SELECT * FROM apps';
  let filterCount = 0;

  if (years) {
    params.push(strings().toArray(years, Number));
    SQLStrings.push(`year=ANY($${++filterCount}::int[])`);
  }

  if (firstChoice) {
    params.push(firstChoice);
    SQLStrings.push(`first_choice=$${++filterCount}`);
  }

  if (secondChoice) {
    params.push(secondChoice);
    SQLStrings.push(`second_choice=$${++filterCount}`);
  }

  if (thirdChoice) {
    params.push(thirdChoice);
    SQLStrings.push(`third_choice=$${++filterCount}`);
  }

  if (SQLStrings.length) {
    SQLString += ' WHERE ';
    SQLString += SQLStrings.join(' AND ');
  }

  params.push(limit);
  params.push(offset);

  SQLString += ` ORDER BY id`;
  SQLString += ` LIMIT $${++filterCount}`;
  SQLString += ` OFFSET $${++filterCount}`;

  const appQuery = await db.query(SQLString, params);
  let payload = {};

  if (appQuery.err) {
    console.log(appQuery.err);
		res.status(500).send(appQuery.err);
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
