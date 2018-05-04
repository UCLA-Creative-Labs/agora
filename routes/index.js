const apps = require('./apps');
const admin = require('./admin');

module.exports = (app) => {
	// app.use('/', (req, res) => res.render('index', {} ))
	app.use('/apps', apps);
	app.use('/admin', admin);
};
