#!/usr/bin/env node
'use strict';

const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const Controller = require('./controller');
const A = Controller.Animation;

const	config = require('./config');

function controllerWeb() {
	const app    = express();
	const server = http.createServer(app);
	const io     = socketio.listen(server);

	const controller = new Controller();

	for (const universe in config.universes) {
		controller.addUniverse(
			universe,
			config.universes[universe].output.driver,
			config.universes[universe].output.device
		);
	}

	const listen_port = config.server.listen_port || 8080;
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

	app.get('/', (req, res) => {
		res.json('test');
	});

	app.get('/state/:universe', (req, res) => {
		if (!(req.params.universe in controller.universes)) {
			res.status(404).json({ error: 'universe not found' });
			return;
		}

		res.json({ state: controller.universeToObject(req.params.universe) });
	});

	app.post('/state/:universe', (req, res) => {
		if (!(req.params.universe in controller.universes)) {
			res.status(404).json({ error: 'universe not found' });
			return;
		}

		controller.update(req.params.universe, req.body);
		res.json({ state: controller.universeToObject(req.params.universe) });
	});

	app.post('/animation/:universe', (req, res) => {
		try {
			const universe = controller.universes[req.params.universe];

			// preserve old states
			const old = controller.universeToObject(req.params.universe);

			const animation = new A();
			for (const step in req.body) {
				animation.add(
					req.body[step].to,
					req.body[step].duration || 0,
					req.body[step].options  || {}
				);
			}
			animation.add(old, 0);
			animation.run(universe);
			res.json({ success: true });
		} catch (e) {
			console.log(e);
			res.json({ error: String(e) });
		}
	});

	io.sockets.on('connection', (socket) => {
		socket.emit('init', { devices: Controller.devices, setup: config });

		socket.on('request_refresh', () => {
			for (const universe in config.universes) {
				socket.emit('update', universe, controller.universeToObject(universe));
			}
		});

		socket.on('update', (universe, update) => {
			controller.update(universe, update);
		});

		controller.on('update', (universe, update) => {
			socket.emit('update', universe, update);
		});
	});
}

controllerWeb();
