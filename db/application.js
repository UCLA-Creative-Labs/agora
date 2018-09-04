const db = require('./index');

class Applications {

    fetchApplications({years, firstChoice, secondChoice, thirdChoice, limit = 400, offset = 0}) {
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

        return db.query(SQLString, params);
    }

    createApplications({firstName, lastName, year, email, response, firstChoice}) {
        if (!firstName | !lastName | !year | !email | !response | !firstChoice) {
            throw new Error("Missing Field.");
        }

        const params = [lastName, firstName, email, 
                        response, year, firstChoice];

        return db.query('INSERT INTO apps (last_name, first_name, email, response, year, first_choice) VALUES ($1, $2, $3, $4, $5, $6)', params);
    }
}

const ApplicationsInstance = new Applications();

module.exports = ApplicationsInstance;