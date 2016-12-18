const express		= require('express');

const Controller	= require('../lighting/controller');
const config		= require('../config');
const api			= require('./api');

const router		= express.Router();
const controller	= Controller.getInstance();

// login
router.get('/login', (req, res) => {
	if (req.session.authentificated) {
		res.redirect('/');
		return;
	}
	res.render('login', {
		title: 'lightnode | login',
		loginFailed: req.session.loginFailed || false,
	});
});

router.post('/login', (req, res) => {
	if (['admin', 'p5'].includes(req.body.username)) {
		req.session.user_name       = req.body.username;
		req.session.user_id         = '0';
		req.session.authentificated = true;
		req.session.loginFailed     = false;

		res.redirect('/controller');
	} else {
		req.session.authentificated = false;
		req.session.loginFailed     = true;

		res.redirect('/login');
	}
});

// api stuff
router.use('/api', api);

// protect all following routes
router.use((req, res, next) => {
	if (req.session.authentificated) {
		next();
	} else {
		req.session.reqPreAuth = req.url; // store requested URL not allowed
		res.redirect('/login');
	}
});

router.get('/contoller', (req, res) => {
	// res.render('controller');
	res.json({ asdf: 'asdf' });
});

module.exports = {
	getRouter: router,
	socketHandler: require('./sockets.js'),
};
