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
import dlFile from 'download-file-sync';

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
			//'node_modules/diffsync/**',
			'node_modules/events/**',
			'node_modules/socket.io-client/**',
			'node_modules/parseuri/**',
			'node_modules/socket.io-parser/**',
			'node_modules/ms/**',
			'node_modules/json3/**',
			'node_modules/isarray/**',
			'node_modules/engine.io-parser/**',
			'node_modules/engine.io-client/**',
			'node_modules/has-*/**',
			'node_modules/arraybuffer.slice/**',
			'node_modules/after/**',
			'node_modules/base64-array*/**',
			'node_modules/blob/**',
			'node_modules/to-array/**',
			'node_modules/component-bind/**',
			'node_modules/wtf-8/**',
			'node_modules/component-emitter/**',
			'node_modules/indexof/**',
			'node_modules/backo2/**',
			'node_modules/parseqs/**',
			'node_modules/component-inherit/**',
			'node_modules/yeast/**',
			'node_modules/parsejson/**',
		],
		namedExports: {
			'node_modules/react/react.js': ['PropTypes', 'createElement', 'Component'],
			//'node_modules/tether/dist/js/tether.min.js': ['Tether'],
			//'node_modules/tether/dist/js/tether.min.js': ['Tether'],
			//'node_modules/reactstrap/dist/reactstrap.min.js': ['Button'],
	    },
	}),
	globals(),
	replace({ 'process.env.NODE_ENV': JSON.stringify('development') }),
	nresolve({
		jsnext: true,
		browser: true,
		main: true,
		skip: ['tether'],
		preferBuiltins: false,
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
	external: ['Tether', 'diffsync', 'eio',/*'engine.io',*/ 'engine.io-client'],
	plugins,
	globals: {
		tether: 'Tether',
		'engine.io-client': 'eio',
		//engine_ioClient: 'engine.io-client'
	},
	// hacky tether fix
	banner: `
// Fixing Tether:
${fs.readFileSync('node_modules/tether/dist/js/tether.min.js')}

// engine.io-client:
${fs.readFileSync('node_modules/engine.io-client/engine.io.js')}

// diffsync
${dlFile('https://wzrd.in/standalone/diffsync')}
`,
};
// ${fs.readFileSync('node_modules/engine.io-client/engine.io.js')}
