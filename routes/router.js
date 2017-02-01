const express		= require('express');
const requireFrom	= require('requirefrom');

const api			= requireFrom('routes/api');

const router		= express.Router();

// login
router.get('/login', (req, res) => {
	if (req.session.authentificated) {
		res.redirect('/');
		return;
	}
	res.render('login', {
		title: 'lightnode',
		loginFailed: req.session.loginFailed || false,
	});
});

router.post('/login', (req, res) => {
	if (['admin', 'p5'].includes(req.body.username)) {
		req.session.user_name       = req.body.username;
		req.session.user_id         = '0';
		req.session.authentificated = true;
		req.session.loginFailed     = false;

		res.redirect('/');
	} else {
		req.session.authentificated = false;
		req.session.loginFailed     = true;

		res.redirect('/login');
	}
});

// logout
router.get('/logout', (req, res) => {
	req.session.destroy();
	res.redirect('/login');
});

// protect all following routes
router.use((req, res, next) => {
	if (req.session.authentificated) {
		next();
	} else {
		req.session.reqPreAuth = req.url; // store requested URL not allowed
		res.redirect('/login');
	}
});

// api stuff
router.use('/api', api);

router.get('/', (req, res) => {
	res.render('app');
});

module.exports = {
	Router: router,
	socketHandler: requireFrom('routes/sockets.js'),
};
