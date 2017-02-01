import scss from 'rollup-plugin-scss';
import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';
import cjs from 'rollup-plugin-commonjs';
import nresolve from 'rollup-plugin-node-resolve';
import license from 'rollup-plugin-license';
import path from 'path';
import globals from 'rollup-plugin-node-globals';
import replace from 'rollup-plugin-replace';

const plugins = [
	scss(),
	babel({
		babelrc: false,
		exclude: 'node_modules/**',
		presets: ['es2015-rollup', 'react'],
		plugins: ['transform-object-rest-spread', 'external-helpers'],
	}),
	cjs({
		exclude: 'node_modules/process-es6/**',
		include: [
			'node_modules/fbjs/**',
			'node_modules/object-assign/**',
			'node_modules/react/**',
			'node_modules/react-dom/**'
		]
	}),
	globals(),
	replace({ 'process.env.NODE_ENV': JSON.stringify('development') }),
	nresolve({
		jsnext: true,
		browser: true,
		main: true
	}),
	license({
		sourceMap: true,

		banner: {
			file: path.join(__dirname, './src/banner.b'),
		},
	})
];

if (process.env.NODE_ENV === 'production') {
	plugins.push(uglify());
}

export default {
	entry: path.join(__dirname, '../', '/src/index.jsx'),
	dest: path.join(__dirname, '../', '/dist/app.js'),
	sourceMap: true,
	format: 'iife',
	// external: ['react'],
	plugins
};
