const apps = require('./apps');
const admin = require('./admin');
const login = require('./login');

module.exports = (app) => {
	// app.use('/', (req, res) => res.render('index', {} ))
	app.use('/apps', apps);
	app.use('/admin', admin);
	app.use('/login', login);
};
