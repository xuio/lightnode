#!/usr/bin/env node
'use strict';

const http          = require('http');
const crypto        = require('crypto');
const path          = require('path');

const express       = require('express');
const exphbs        = require('express-handlebars');
const socketio      = require('socket.io');
const cookieParser  = require('cookie-parser');
const bodyParser    = require('body-parser');
const session       = require('express-session');
const morgan        = require('morgan');
const argv          = require('optimist').argv;

// session store
const NedbStore     = require('express-nedb-session')(session);

// load config file
const config        = require(`./config/${argv.config || 'default'}`);
const Controller    = require('./lighting/controller');
const router        = require('./routes/router');

const app           = express();
const server        = http.createServer(app);
const io            = socketio.listen(server);

// instantiate controller singleton
const controller = Controller.getInstance();

// deploy universes from config file
for (const universe in config.universes) {
	controller.addUniverse(
		universe,
		config.universes[universe].output.driver,
		config.universes[universe].output.device
	);
}

// configure BodyParser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(morgan('dev'));

// serve static stuff
app.use('/', express.static(path.join(__dirname, './frontend/dist')));

// serve fonts
app.use('/fonts', express.static(path.join(__dirname, './node_modules/font-awesome/fonts')));

// configure session
app.use(
	session({
		secret: '687r6tzfhuoi878t6zfgtzdgse56utzgui', // true randomness
		resave: false,
		saveUninitialized: false,
		cookie: {
			path: '/',
			httpOnly: true,
			maxAge: (60 * 60 * 365),
		},
		store: new NedbStore({ filename: path.join(__dirname, 'sessions') })
	})
);

// configure handlebars
app.engine('.hbs', exphbs({
	defaultLayout: 'main',
	extname: '.hbs',
}));
app.set('view engine', '.hbs');

// deploy router
app.use('/', router.Router);

const listen_port = config.server.listen_port || 3000;
const listen_host = config.server.listen_host || '::';

server.listen(listen_port, listen_host, null, () => {
	if (config.server.uid && config.server.gid) {
		try {
			process.setuid(config.server.uid);
			process.setgid(config.server.gid);
		} catch (err) {
			console.log(err);
			process.exit(1);
		}
	}
	console.log(`LightNode listening on [${listen_host}]:${listen_port}`);
});

io.set('log level', 1);

io.sockets.on('connection', router.socketHandler);
