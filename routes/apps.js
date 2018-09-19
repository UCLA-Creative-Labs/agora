const Router = require('express-promise-router');
const router = new Router();

const db = require('../db');
const {passport} = require('./login');
const {strings} = require('../utils/index');
const ApplicationInstance = require('../db/applications');

/* generic application fetching */
router.post('/fetch', async (req, res) => {
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

router.post('/create', async (req, res) => {
  const newApp = req.body

  const response = ApplicationInstance.createApplication(newApp)
    .then(response => {
      return response;
    }).catch(err => {
      return {err};
    });

  if (response.err) {
	  res.status(500).send(response.err);
  }

  res.status(201).send("Application created.");
})

module.exports = router;
