'use strict';

const {src, dest} = require('gulp');
const gulp = require('gulp');
const rename = require('gulp-rename');
const plumber = require('gulp-plumber');
const panini = require('panini');
const del = require('del');
const notify = require('gulp-notify');
const webpackStream = require('webpack-stream');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass')(require('sass'));
const removeComments = require('gulp-strip-css-comments');
const cleanCSS = require('gulp-clean-css');

const srcPath = './src/';
const distPath = './docs/';

const path = {
	build: {
		html: distPath,
		js: distPath + 'assets/js/',
		css: distPath + 'assets/css/',
		images: distPath + 'assets/images/',
		fonts: distPath + 'assets/fonts/',
		media: distPath + 'assets/media/',
	},
	src: {
		html: srcPath + '*.html',
		js: srcPath + 'assets/ts/*.ts',
		css: srcPath + 'assets/scss/style.scss',
		images: srcPath + 'assets/images/**/*.{jpg,png,svg,gif,ico,webp,webmanifest,xml,json}',
		fonts: srcPath + 'assets/fonts/**/*.{eot,woff,woff2,ttf,svg}',
		media: srcPath + 'assets/media/**/*.{mp3,mp4,wav,mov,avi}',
	},
	watch: {
		html: srcPath + '**/*.html',
		js: srcPath + 'assets/ts/**/*.ts',
		css: srcPath + 'assets/scss/**/*.scss',
		images: srcPath + 'assets/images/**/*.{jpg,png,svg,gif,ico,webp,webmanifest,xml,json}',
		fonts: srcPath + 'assets/fonts/**/*.{eot,woff,woff2,ttf,svg}',
		media: srcPath + 'assets/media/**/*.{mp3,mp4,wav,mov,avi}',
	},
	clean: './' + distPath,
};

/* Tasks */

function serve() {
	browserSync.init({
		server: {
			baseDir: './' + distPath,
		},
	});
}

function html(cb: Function) {
	panini.refresh();
	return src(path.src.html, {base: srcPath})
		.pipe(plumber())
		.pipe(
			panini({
				root: srcPath,
				layouts: srcPath + 'layouts/',
				partials: srcPath + 'partials/',
				helpers: srcPath + 'helpers/',
				data: srcPath + 'data/',
			})
		)
		.pipe(dest(path.build.html))
		.on('finish', cb)
		.pipe(browserSync.reload({stream: true}));
}

function css(cb: Function) {
	return src(path.src.css, {base: srcPath + 'assets/scss/'})
		.pipe(
			plumber({
				errorHandler: function (err: any) {
					notify.onError({
						title: 'SCSS Error',
						message: 'Error: <%= error.message %>',
					})(err);
					this.emit('end');
				},
			})
		)
		.pipe(
			sass({
				includePaths: './node_modules/',
			})
		)
		.pipe(removeComments())
		.pipe(cleanCSS())
		.pipe(
			rename({
				suffix: '.min',
				extname: '.css',
			})
		)
		.pipe(dest(path.build.css))
		.on('finish', cb)
		.pipe(browserSync.stream());
}

function cssWatch(cb: Function) {
	return src(path.src.css, {base: srcPath + 'assets/scss/'})
		.pipe(
			plumber({
				errorHandler: function (err: any) {
					notify.onError({
						title: 'SCSS Error',
						message: 'Error: <%= error.message %>',
					})(err);
					this.emit('end');
				},
			})
		)
		.pipe(
			sass({
				includePaths: './node_modules/',
			})
		)
		.pipe(
			rename({
				suffix: '.min',
				extname: '.css',
			})
		)
		.pipe(dest(path.build.css))
		.on('finish', cb)
		.pipe(browserSync.stream());
}

function js(cb: Function) {
	return src(path.src.js, {base: srcPath + 'assets/ts/'})
		.pipe(
			plumber({
				errorHandler: function (err: any) {
					notify.onError({
						title: 'JS Error',
						message: 'Error: <%= error.message %>',
					})(err);
					this.emit('end');
				},
			})
		)
		.pipe(
			webpackStream(
				{
					entry: srcPath + 'assets/ts/index.ts',
					module: {
						rules: [
							{
								test: /\.tsx?$/,
								use: 'ts-loader',
								exclude: /node_modules/,
							},
						],
					},
					resolve: {
						extensions: ['.tsx', '.ts', '.js'],
					},
					output: {
						filename: 'app.js',
					},
				},
				undefined,
				(err: any, stats: any) => {
					if (err) {
						console.log(stats.toString());
					}
					setTimeout(() => {
						browserSync.reload();
						cb();
					}, 100);
				}
			)
		)
		.pipe(dest(path.build.js))
}

function jsWatch(cb: Function) {
	return src(path.src.js, {base: srcPath + 'assets/ts/'})
		.pipe(
			plumber({
				errorHandler: function (err: any) {
					notify.onError({
						title: 'JS Error',
						message: 'Error: <%= error.message %>',
					})(err);
					this.emit('end');
				},
			})
		)
		.pipe(
			webpackStream(
				{
					entry: srcPath + 'assets/ts/index.ts',
					module: {
						rules: [
							{
								test: /\.tsx?$/,
								use: 'ts-loader',
								exclude: /node_modules/,
							},
						],
					},
					resolve: {
						extensions: ['.tsx', '.ts', '.js'],
					},
					output: {
						filename: 'app.js',
					},
				},
				undefined,
				(err: any, stats: any) => {
					if (err) {
						console.log(stats.toString());
					}
					setTimeout(() => {
						browserSync.reload();
						cb();
					}, 100);
				}
			)
		)
		.pipe(dest(path.build.js))
}

function images(cb: Function) {
	return src(path.src.images)
		.pipe(dest(path.build.images))
		.on('finish', cb)
		.pipe(browserSync.reload({stream: true}));
}

function fonts(cb: Function) {
	return src(path.src.fonts)
		.pipe(dest(path.build.fonts))
		.on('finish', cb)
		.pipe(browserSync.reload({stream: true}));
}

function media(cb: Function) {
	return src(path.src.media)
		.pipe(dest(path.build.media))
		.on('finish', cb)
		.pipe(browserSync.reload({stream: true}));
}

function clean() {
	return del(path.clean);
}

function watchFiles() {
	gulp.watch([path.watch.html], html);
	gulp.watch([path.watch.css], function cssWatchWrapper(cb: Function) {
		setTimeout(() => {
			cssWatch(cb);
		}, 300);
	});
	gulp.watch([path.watch.js], jsWatch);
	gulp.watch([path.watch.images], images);
	gulp.watch([path.watch.fonts], fonts);
	gulp.watch([path.watch.media], media);
}

const build = gulp.series(clean, gulp.parallel(html, css, js, images, fonts, media));
const watch = gulp.parallel(build, watchFiles, serve);

/* Exports Tasks */
exports.html = html;
exports.css = css;
exports.js = js;
exports.images = images;
exports.fonts = fonts;
exports.media = media;
exports.clean = clean;
exports.build = build;
exports.watch = watch;
exports.default = watch;