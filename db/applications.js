const db = require("./index");
const Season = require("./utils/season");
const { strings } = require("../utils/index");

/**
 * Applications ORM essentially
 */

class Applications {
  fetchApplications({
    years,
    firstChoice,
    secondChoice,
    thirdChoice,
    season,
    limit = 400,
    offset = 0
  }) {
    const params = [];
    const SQLStrings = [];
    let SQLString = "SELECT * FROM apps";
    let filterCount = 0;

    if (years) {
      params.push(years);
      SQLStrings.push(`year=ANY($${++filterCount}::int[])`);
    }

    if (season) {
      params.push(season);
      SQLStrings.push(`season=$${++filterCount}`);
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
      SQLString += " WHERE ";
      SQLString += SQLStrings.join(" AND ");
    }

    params.push(limit);
    params.push(offset);

    SQLString += ` ORDER BY id`;
    SQLString += ` LIMIT $${++filterCount}`;
    SQLString += ` OFFSET $${++filterCount}`;

    return db.query(SQLString, params);
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

    return db.query(
      "INSERT INTO apps (\
        name, \
        email, \
        year, \
        past_project, \
        first_choice, \
        second_choice, \
        third_choice, \
        why_first_choice, \
        why_second_choice, \
        why_third_choice, \
        see_creative_labs, \
        links, \
        creativity, \
        season \
       ) \
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)",
      params
    );
  }
}

const ApplicationsInstance = new Applications();

module.exports = ApplicationsInstance;
