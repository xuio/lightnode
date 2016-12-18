const sass			= require('node-sass');
const figlet		= require('figlet');
const appRoot		= require('app-root-path');
const blockComment	= require('block-comment');
const fsp			= require('fs-promise');

blockComment.linePrefix = ' *     ';
blockComment.close      = ' */';

const banner = blockComment(`${figlet.textSync(process.env.npm_package_name)}\n
	${process.env.npm_package_name}@${process.env.npm_package_version}`, { start: '@preserve' });

const conf = {
	src: {
		bundle: `${appRoot}/frontend/src/scss/main.scss`,
	},
	dest: {
		css: `${appRoot}/static/css/bundle.css`,
		map: `${appRoot}/static/css/bundle.map`,
	}
};

// promise wrapper for sass.render
function sassRender(config) {
	return new Promise((resolve, reject) => {
		sass.render(config, (err, res) => {
			if (err) {
				reject();
			} else {
				resolve(res);
			}
		});
	});
}

sassRender({
	file: conf.src.bundle,
	// outputStyle: 'compressed',
	sourceMap: true,
})
.catch(err => {
	console.log(`${err.line}:${err.column} ${err.message}`);
})
.then(bundle => {
	fsp.writeFile(conf.dest.css, `${banner}\n${bundle.css.toString()}`)
	.then(console.log(`CSS successfully written to ${conf.dest.css}`));
});
