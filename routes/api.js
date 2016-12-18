const express = require('express');
const api = express.Router();

const Controller = require('../lighting/controller');
const config = require('../config');

const controller = Controller.getInstance();

api.get('/state/:universe', (req, res) => {
	if (!(req.params.universe in controller.universes)) {
		res.status(404).json({ error: 'universe not found' });
		return;
	}

	res.json({ state: controller.universeToObject(req.params.universe) });
});

api.post('/state/:universe', (req, res) => {
	if (!(req.params.universe in controller.universes)) {
		res.status(404).json({ error: 'universe not found' });
		return;
	}

	controller.update(req.params.universe, req.body);
	res.json({ state: controller.universeToObject(req.params.universe) });
});

api.post('/animation/:universe', (req, res) => {
	try {
		const universe = controller.universes[req.params.universe];

		// preserve old states
		const old = controller.universeToObject(req.params.universe);

		const animation = new Controller.Animation();
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

module.exports = api;
