'use strict';

const dgram = require('dgram');

function BBDMX(device_id, options) {
	const self = this;
	self.changed = true;
	self.options = options || {};
	self.universe = new Buffer(512);
	self.universe.fill(0);
	self.host = device_id || '127.0.0.1';
	self.port = self.options.port || 9930;
	self.dev = dgram.createSocket('udp4');
	self.sleepTime = 24;
	self.start();
}

BBDMX.prototype.send_universe = function() {
	if (this.changed === true) {
		let messageBuffer = new Buffer(this.universe.length.toString());

		for (let i = 0; i < this.universe.length; i++) {
			const channel = new Buffer(' ' + this.universe[i]);
			const length = channel.length + messageBuffer.length;
			messageBuffer = Buffer.concat([messageBuffer, channel], length);
		}
		this.dev.send(messageBuffer, 0, messageBuffer.length, this.port, this.host);
		this.changed = false;
	}
};

BBDMX.prototype.start = function() {
	this.timeout = setInterval(this.send_universe.bind(this), this.sleepTime);
};

BBDMX.prototype.stop = function() {
	clearInterval(this.timeout);
};

BBDMX.prototype.close = function(cb) {
	this.stop();
	cb(null);
};

BBDMX.prototype.update = function(u) {
	for (let c in u) {
		this.universe[c] = u[c];
	}
	this.changed = true;
};

BBDMX.prototype.updateAll = function(v) {
	for (let i = 0; i < 512; i++) {
		this.universe[i] = v;
	}
};

BBDMX.prototype.get = function(c) {
	return this.universe[c];
};

module.exports = BBDMX;
