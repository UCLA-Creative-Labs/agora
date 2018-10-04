const { google } = require("googleapis");
const sheets = google.sheets("v4");

const Season = require("./utils/season");
const credentials = require("../config/credentials.json");

/**
 * Google Sheets interface
 */

const defaultSpreadsheetId = "1R8cU5fpEiWA2WpzjHagtcosG0MUUaqvslOyTkpyBRHc";

class Sheets {
  constructor(spreadsheetId = defaultSpreadsheetId) {
    this.spreadsheetId = spreadsheetId;
  }

  createApplication({
    name,
    email,
    year,
    pastProject,
    firstChoiceProject,
    secondChoiceProject,
    thirdChoiceProject,
    whyFirstChoice,
    whySecondChoice,
    whyThirdChoice,
    seeCreativeLabs,
    links,
    creativity
  }) {
    const season = Season.getCurrentSeason();

    const params = [
      name,
      email,
      year,
      pastProject,
      firstChoiceProject,
      secondChoiceProject,
      thirdChoiceProject,
      whyFirstChoice,
      whySecondChoice,
      whyThirdChoice,
      seeCreativeLabs,
      links,
      creativity,
      season
    ];

    function appendWrapper(jwtClient) {
      sheets.spreadsheets.values.append(
        {
          auth: jwtClient,
          spreadsheetId: this.spreadsheetId,
          range: "A1",
          valueInputOption: "RAW",
          insertDataOption: "INSERT_ROWS",

          resource: {
            values: [params]
          }
        },
        function(err, response) {
          if (err) {
            console.log("The API returned an error: " + err);
            return;
          }
        }
      );
    }

    const append = appendWrapper.bind(this);
    function getJWT() {
      // configure a JWT auth client
      const jwtClient = new google.auth.JWT(
        credentials.client_email,
        null,
        credentials.private_key,
        ["https://www.googleapis.com/auth/spreadsheets"]
      );
      //authenticate request
      jwtClient.authorize(function(err, tokens) {
        if (err) {
          console.log(err);
          return;
        } else {
          console.log("Successfully connected!");
        }
      });

      append(jwtClient);
    }

    getJWT();
  }
}

const SheetsInstance = new Sheets();

module.exports = SheetsInstance;
