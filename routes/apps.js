const Router = require("express-promise-router");
const router = new Router();

const db = require("../db");
const { passport } = require("./login");
const ApplicationsInstance = require("../db/applications");
const SheetsInstance = require("../db/sheets");
const { StatusCodes } = require("./constants.js");

/* generic application fetching */
router.post("/fetch", async (req, res) => {
  try {
    const fetchQuery = await ApplicationsInstance.fetchApplications(req.body);

    if (fetchQuery.err) {
      res.status(StatusCodes.INTERNAL_SERVICE_ERROR).send(fetchQuery.err);
    }

    res.status(StatusCodes.SUCCESS).send({ apps: fetchQuery.rows });
  } catch (err) {
    res.status(StatusCodes.BAD_REQUEST).send(err.message);
  }
});

/* fetches a single application */
router.get(
  "/:username",
  passport.authenticate("jwt-1", { session: false }),
  async (req, res) => {
    const { username } = req.params;
    const appQuery = await db.query("SELECT * FROM apps WHERE username=$1", [
      username
    ]);

    if (appQuery.err) {
      res.status(500).send(appQuery.err.detail);
    }

    let payload = {};

    if (rows === undefined || !rows.length) {
      payload.err = "App not found.";
      res.status(404).send(payload);
    }

    payload.user = rows[0];

    res.status(200).send(payload);
  }
);

router.post("/create", async (req, res) => {
  const newApp = req.body;

  try {
    const createAppSheetQuery = await SheetsInstance.createApplication(newApp);
    const createAppQuery = await ApplicationsInstance.createApplication(newApp);

    if (createAppQuery.err) {
      res.status(StatusCodes.INTERNAL_SERVICE_ERROR).send(createAppQuery.err);
    }

    res.status(StatusCodes.CREATE_SUCCESS).send();
  } catch (err) {
    res.status(StatusCodes.BAD_REQUEST).send(err.message);
  }
});

module.exports = router;
