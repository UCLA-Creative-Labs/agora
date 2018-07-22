const apps = require('./apps');
const admin = require('./admin');
const {login} = require('./login');

module.exports = (app) => {
	app.use('/apps', apps);
	app.use('/admin', admin);
	app.use('/login', login);
};
