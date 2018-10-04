const Router = require("express-promise-router");
const router = new Router();

const { StatusCodes } = require("./constants.js");
const SheetsInstance = require("../db/sheets");

/* create application for sheets */
router.post("/create", async (req, res) => {
  try {
    const createQuery = await SheetsInstance.createApplication();

    if (createQuery.err) {
      res.status(StatusCodes.INTERNAL_SERVICE_ERROR).send(createQuery.err);
    }

    res.status(StatusCodes.SUCCESS).send({ apps: createQuery.rows });
  } catch (err) {
    res.status(StatusCodes.BAD_REQUEST).send(err.message);
  }
});

module.exports = router;
