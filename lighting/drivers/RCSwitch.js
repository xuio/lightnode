'use strict';

const SerialPort = require('serialport');

function RCSwitch(device_id, options) {
	const self = this;
	self.changed = false;
	self.changes = [false, false];
	self.options = options || {};
	self.options.map = [
		['00111', '10000'],
		['00111', '01000'],
		['00111', '00100'],
		['00111', '00010'],

		['10101', '10000'],
		['10101', '01000'],
		['10101', '00100'],
		['10101', '00010'],
	];
	this.universe = new Buffer(512);
	this.universe.fill(0);
	self.interval = 46;
	this.dev = new SerialPort(device_id, {
		baudrate: 115200
	}, (err) => {
		if (err) {
			console.log(err);
			return;
		}
		self.start();
	});
}

RCSwitch.prototype.send_universe = function() {
	if (this.changed === true) {
		for (let i = 0; i < this.options.map.length; i++) {
			if (this.changes[i]) {
				const state = (this.universe[i] > 127) ? '1' : '0';
				const message = `${this.options.map[i][0]}:${this.options.map[i][1]}:${state};`;
				this.dev.write(new Buffer(message));
				this.changes[i] = false;
			}
		}
	}
};

RCSwitch.prototype.start = function() {
	this.timeout = setInterval(this.send_universe.bind(this), this.sleepTime);
};

RCSwitch.prototype.stop = function() {
	clearInterval(this.timeout);
};

RCSwitch.prototype.close = function(cb) {
	this.stop();
	cb(null);
};

RCSwitch.prototype.update = function(u) {
	for (let c in u) {
		if ((this.universe[c] > 127) !== (u[c] > 127)) {
			this.universe[c] = u[c];
			this.changes[c] = true;
		}
	}
	this.changed = true;
};

RCSwitch.prototype.updateAll = function(v) {

	for (let i = 0; i < 512; i++) {
		this.universe[i] = v;
	}
};

RCSwitch.prototype.get = function(c) {
	return this.universe[c];
};

module.exports = RCSwitch;
