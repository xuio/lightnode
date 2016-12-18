const util = require('util');
const EventEmitter = require('events').EventEmitter;

// singleton storage
let controllerInstance = null;

function Controller(options) {
	options = options || {};
	this.universes = {};
	this.drivers   = {};
	this.devices   = options.devices || require('./devices');

	this.registerDriver('null',					require('./drivers/null'));
	this.registerDriver('dmx4all',				require('./drivers/dmx4all'));
	this.registerDriver('enttec-usb-dmx-pro',	require('./drivers/enttec-usb-dmx-pro'));
	this.registerDriver('enttec-open-usb-dmx',	require('./drivers/enttec-open-usb-dmx'));
	this.registerDriver('artnet',				require('./drivers/artnet'));
	this.registerDriver('bbdmx',				require('./drivers/bbdmx'));
	this.registerDriver('rcswitch',				require('./drivers/RCSwitch'));
}

util.inherits(Controller, EventEmitter);

Controller.devices   = require('./devices');
Controller.Animation = require('./anim');

Controller.prototype.registerDriver = function(name, module) {
	this.drivers[name] = module;
};

Controller.prototype.addUniverse = function(name, driver, device_id) {
	return this.universes[name] = new this.drivers[driver](device_id);
};

Controller.prototype.update = function(universe, channels) {
	this.universes[universe].update(channels);
	this.emit('update', universe, channels);
};

Controller.prototype.updateAll = function(universe, value) {
	this.universes[universe].updateAll(value);
	this.emit('updateAll', universe, value);
};

Controller.prototype.universeToObject = function(universe) {
	universe = this.universes[universe];
	const u = {};
	for (let i = 0; i < universe.length; i++) {
		u[i] = universe.get(i);
	}
	return u;
};

module.exports = {
	// 'controller': controller,
	getInstance: (options) => {
		if (controllerInstance === null) {
			controllerInstance = new Controller(options);
		}
		return controllerInstance;
	}
};
