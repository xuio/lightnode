const requireFrom	= require('requirefrom')('/');

const Controller	= requireFrom('lighting/controller');
const config		= requireFrom('config');
const controller	= Controller.getInstance();

const handler = (socket) => {
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
};

module.exports = handler;
