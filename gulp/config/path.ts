export const distPath = './docs/';
export const srcPath = './src/';

export const path = {
	build: {
		html: distPath,
		css: distPath + 'assets/css/',
		js: distPath + 'assets/js/',
		images: distPath + 'assets/images/',
		fonts: distPath + 'assets/fonts/',
	},
	src: {
		html: srcPath + 'index.html',
		scss: srcPath + 'assets/scss/style.scss',
		ts: srcPath + 'assets/ts/app.ts',
		images: srcPath + 'assets/images/**/*.{jpg,jpeg,png,gif,webp,ico}',
		svg: srcPath + 'assets/images/**/*.svg',
		root: srcPath,
	},
	watch: {
		html: srcPath + '**/*.html',
		scss: srcPath + 'assets/scss/**/*.scss',
		ts: srcPath + 'assets/ts/**/*.ts',
		images: srcPath + 'assets/images/**/*.{jpg,jpeg,svg,png,gif,webp}',
	},
};