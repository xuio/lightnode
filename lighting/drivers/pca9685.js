'use strict';

const makePwmDriver = require('adafruit-i2c-pwm-driver');
const pwmDriver = makePwmDriver({
	address: 0x40, device: '/dev/i2c-2'
});

const gammaCorr = 2.8; // Correction factor
const gamma = [];

for (let i = 0; i <= 255; i++) {
	gamma[i] = parseInt((Math.pow(i / 255, gammaCorr) * 4095 + 0.5), 10);
}

function PCA9685(device_id, options) {
	const self = this;
	self.changed = true;
	self.options = options || {};
	self.universe = new Buffer(512);
	self.universe.fill(0);
	self.sleepTime = 24;
	console.log(self);
	self.start();
}

PCA9685.prototype.send_universe = function() {
	if (this.changed === true) {
		for (let i = 0; i < 3; i++) {
			pwmDriver.setPWM(i, 0, gamma[this.universe.data[i]]);
		}
		this.changed = false;
	}
};

PCA9685.prototype.start = function() {
	pwmDriver.setPWMFreq(5000);
	this.timeout = setInterval(this.send_universe.bind(this), this.sleepTime);
};

PCA9685.prototype.stop = function() {
	clearInterval(this.timeout);
};

PCA9685.prototype.close = function(cb) {
	this.stop();
	cb(null);
};

PCA9685.prototype.update = function(u) {
	for (let c in u) {
		this.universe[c] = u[c];
	}
	this.changed = true;
};

PCA9685.prototype.updateAll = function(v) {
	for (let i = 0; i < 512; i++) {
		this.universe[i] = v;
	}
};

PCA9685.prototype.get = function(c) {
	return this.universe[c];
};

module.exports = PCA9685;
