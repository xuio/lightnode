'use strict';

const util = require('util');
const EventEmitter = require('events').EventEmitter;

function controller(options) {
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

util.inherits(controller, EventEmitter);

controller.devices   = require('./devices');
controller.Animation = require('./anim');

controller.prototype.registerDriver = function(name, module) {
	this.drivers[name] = module;
};

controller.prototype.addUniverse = function(name, driver, device_id) {
	return this.universes[name] = new this.drivers[driver](device_id);
};

controller.prototype.update = function(universe, channels) {
	this.universes[universe].update(channels);
	this.emit('update', universe, channels);
};

controller.prototype.updateAll = function(universe, value) {
	this.universes[universe].updateAll(value);
	this.emit('updateAll', universe, value);
};

controller.prototype.universeToObject = function(universe) {
	universe = this.universes[universe];
	const u = {};
	for (let i = 0; i < universe.length; i++) {
		u[i] = universe.get(i);
	}
	return u;
};

module.exports = controller;
