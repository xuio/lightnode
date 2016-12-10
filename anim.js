'use strict';

const ease = require('./easing.js').ease;
const resolution = 25;

function Anim() {
	this.fx_stack = [];
}

Anim.prototype.add = (to, duration, options) => {
	options  = options  || {};
	duration = duration || resolution;
	options.easing = options.easing || 'linear';
	this.fx_stack.push({ to, duration, options });
	return this;
};

Anim.prototype.delay = (duration) =>
	this.add({}, duration);

Anim.prototype.run = (universe, onFinish) => {
	let config = {};
	let t = 0;
	let d = 0;
	let a;

	const fx_stack = this.fx_stack;
	const ani_setup = () => {
		a = fx_stack.shift();
		t = 0;
		d = a.duration;
		config = {};
		for (const k in a.to) {
			config[k] = {
				start: universe.get(k),
				end: a.to[k]
			};
		}
	};
	const ani_step = () => {
		const new_vals = {};
		for (const k in config) {
			new_vals[k] =
				Math.round(config[k].start
				+ ease.linear(t, 0, 1, d)
				* (config[k].end - config[k].start));
		}
		t = t + resolution;
		universe.update(new_vals);
		if (t > d) {
			if (fx_stack.length > 0) {
				ani_setup();
			} else {
				clearInterval(iid);
				if (onFinish) onFinish();
			}
		}
	};

	ani_setup();
	const iid = setInterval(ani_step, resolution);
};

module.exports = Anim;
