const requireFrom		= require('requirefrom')('/');

const util				= require('util');
const EventEmitter		= require('events').EventEmitter;

// singleton storage
let controllerInstance = null;

function Controller(options) {
	options = options || {};
	this.universes = {};
	this.drivers   = {};
	this.devices   = options.devices || requireFrom('lighting/devices');

	this.registerDriver('null',					requireFrom('lighting/drivers/null'));
	this.registerDriver('dmx4all',				requireFrom('lighting/drivers/dmx4all'));
	this.registerDriver('enttec-usb-dmx-pro',	requireFrom('lighting/drivers/enttec-usb-dmx-pro'));
	this.registerDriver('enttec-open-usb-dmx',	requireFrom('lighting/drivers/enttec-open-usb-dmx'));
	this.registerDriver('artnet',				requireFrom('lighting/drivers/artnet'));
	this.registerDriver('bbdmx',				requireFrom('lighting/drivers/bbdmx'));
	this.registerDriver('rcswitch',				requireFrom('lighting/drivers/RCSwitch'));
}

util.inherits(Controller, EventEmitter);

Controller.devices   = requireFrom('lighting/devices');
Controller.Animation = requireFrom('lighting/anim');

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
