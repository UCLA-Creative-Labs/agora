const db = require("./index");

class Applications {
  fetchApplications({
    years,
    firstChoice,
    secondChoice,
    thirdChoice,
    limit = 400,
    offset = 0
  }) {
    const params = [];
    const SQLStrings = [];
    let SQLString = "SELECT * FROM apps";
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

  createApplications({
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
      creativity
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
        creativity \
       ) \
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)",
      params
    );
  }
}

const ApplicationsInstance = new Applications();

module.exports = ApplicationsInstance;
