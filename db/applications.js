const db = require('./index');

/**
 * Applications ORM essentially
 */

class Applications {

  createApplication({firstName, lastName, email, response, year, firstChoice}) {
    if (!firstName | !lastName | !email | !response | !year | !firstChoice) {
      return new Error('Missing Field.');
    }

    const params = [lastName, firstName, email, 
                    response, year, firstChoice ];

    return db.query('INSERT INTO apps (last_name, first_name, email, response, year, first_choice) VALUES ($1, $2, $3, $4, $5, $6)', params)
      .then(response => {return response;})
      .catch(err => {return err.message});
  }
}

const ApplicationsInstance = new Applications();

module.exports = ApplicationsInstance;