const rollup		= require('rollup');
const babel			= require('rollup-plugin-babel');
const figlet		= require('figlet');
const appRoot		= require('app-root-path');
const blockComment	= require('block-comment');
const uglify		= require('uglify-js');
const fsp			= require('fs-promise');

blockComment.linePrefix = ' *     ';
blockComment.close      = ' */';

const Banner = blockComment(`${figlet.textSync(process.env.npm_package_name)}\n
	${process.env.npm_package_name}@${process.env.npm_package_version}`, { start: '@preserve' });

// promise wrapper for fs.writeFile()
function writeFile(path, data) {
	return new Promise((resolve, reject) => {
		fs.writeFile(path, data, (err) => {
			if (err) {
				reject();
			} else {
				resolve();
			}
		});
	});
}

// roll up
rollup.rollup({
	entry: `${appRoot}/client/js/main.bundle`,
	plugins: [
		babel({
			exclude: 'node_modules/**',
			presets: 'es2015-rollup',
			sourceMaps: true
		})
	]
})
.then(bundle => { // wtf eslint
	return bundle.generate({
		sourceMapFile: 'bundle.js.map',
		sourceMap: true,
		format: 'iife',
	});
})
.then(bundle => {
	return uglify.minify(
		bundle.code,
		{
			fromString: true,
			sourceMap: true,
			inSourceMap: bundle.map,
			outSourceMap: 'bundle.min.map',
			'source-map-root': '/src', // TODO build script to bublish src
			output: {
				preamble: Banner,
			},
		});
})
.then(bundle => {
	writeFile(`${appRoot}/static/js/bundle.min.js`, bundle.code)
	.then(console.log(`JS successfully written to ${appRoot}/static/js/bundle.min.js`));
	writeFile(`${appRoot}/static/js/bundle.min.map`, bundle.map)
	.then(console.log(`JS successfully written to ${appRoot}/static/js/bundle.min.map`));
});
