#!/usr/bin/env node
'use strict';

const http			= require('http');
const crypto		= require('crypto');
const path			= require('path');

// register babel
require('babel-register')({
	presets: ['react', 'es2015'],
	extensions: ['.jsx']
});

const express		= require('express');
const ReactEngine	= require('react-engine');
const socketio		= require('socket.io');
const cookieParser	= require('cookie-parser');
const bodyParser	= require('body-parser');
const session		= require('express-session');
const morgan		= require('morgan');

const config		= require('./config');
const Controller	= require('./lighting/controller');
const router		= require('./routes/router');

const app			= express();
const server		= http.createServer(app);
const io			= socketio.listen(server);

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

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(morgan('dev'));

// deploy bootstrap
app.use('/css', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/css')));

// deploy static stuff
app.use('/js', express.static(path.join(__dirname, './static/js')));
app.use('/css', express.static(path.join(__dirname, './static/css')));

// configure react server renderer
const engine = ReactEngine.server.create();
app.set('view engine', 'jsx');
app.engine('.jsx', engine);
app.set('views', path.join(__dirname, '/views'));
app.set('view', require('react-engine/lib/expressView'));

// configure session
app.use(
	session({
		secret: crypto.randomBytes(64).toString('hex'),
		resave: false,
		saveUninitialized: false,
		cookie: {
			path: '/',
			httpOnly: true,
			maxAge: (60 * 60 * 365)
		},
	})
);

// deploy router
app.use('/', router.getRouter);

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
});

io.set('log level', 1);

io.sockets.on('connection', router.socketHandler);
