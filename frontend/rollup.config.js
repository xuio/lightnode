import scss from 'rollup-plugin-scss';
import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';
import cjs from 'rollup-plugin-commonjs';
import nresolve from 'rollup-plugin-node-resolve';
import license from 'rollup-plugin-license';
import path from 'path';
import globals from 'rollup-plugin-node-globals';
import replace from 'rollup-plugin-replace';
import progress from 'rollup-plugin-progress';
import browser from 'rollup-plugin-browser';
import fs from 'fs';

var Visualizer = require('rollup-plugin-visualizer');


const plugins = [
	scss(),
	babel({
		babelrc: false,
		exclude: 'node_modules/**',
		//include: 'node_modules/iodash.isobject/**',
		presets: ['es2015-rollup', 'react'],
		plugins: ['transform-object-rest-spread', 'external-helpers', 'lodash'],
	}),
	cjs({
		exclude: 'node_modules/process-es6/**',
		include: [
			'node_modules/fbjs/**',
			'node_modules/object-assign/**',
			'node_modules/react/**',
			'node_modules/react-dom/**',
			'node_modules/reactstrap/**',
			'node_modules/classnames/**',
			'node_modules/lodash.*/**',
			//'node_modules/tether/**',
			'node_modules/react-addons-*/**',
			'node_modules/react-color/**',
			'node_modules/reactcss/**',
			'node_modules/lodash/**',
			'node_modules/diffsync/**',
		],
		namedExports: {
			'node_modules/react/react.js': ['PropTypes', 'createElement', 'Component'],
			//'node_modules/tether/dist/js/tether.min.js': ['Tether'],
			//'node_modules/tether/dist/js/tether.min.js': ['Tether'],
			//'node_modules/reactstrap/dist/reactstrap.min.js': ['Button'],
	    }
	}),
	globals(),
	replace({ 'process.env.NODE_ENV': JSON.stringify('development') }),
	nresolve({
		jsnext: true,
		browser: true,
		main: true,
		skip: ['tether'],
	}),
	license({
		sourceMap: true,

		banner: {
			file: path.join(__dirname, './static/banner.b'),
		},
	}),
	progress(),
	Visualizer(),
];

if (process.env.NODE_ENV === 'production') {
	plugins.push(uglify());
}

export default {
	entry: path.join(__dirname, './src/index.jsx'),
	dest: path.join(__dirname, './dist/app.js'),
	sourceMap: true,
	format: 'iife',
	external: ['Tether'],
	plugins,
	globals: {
		tether: 'Tether',
	},
	// hacky tether fix
	banner: `
// Fixing Tether:
${fs.readFileSync('node_modules/tether/dist/js/tether.min.js')}
`,
};
