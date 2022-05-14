import { src, dest } from 'gulp';

import fileInclude from 'gulp-file-include';

import { path } from '../config/path';
import { plugins } from '../config/plugins';

import { isBuild } from '../../gulpfile';

const webpHtmlNoSvg = require('gulp-webp-html-nosvg');

export const html = () => {
	return src(path.src.html)
		.pipe(plugins.plumber(
			plugins.notify.onError({
				title: 'HTML',
				message: 'Error: <%= error.message %>',
			}),
		))
		.pipe(fileInclude({}))
		.pipe(
			plugins.if(isBuild, webpHtmlNoSvg()),
		)
		.pipe(dest(path.build.html))
		.pipe(plugins.browserSync.reload({ stream: true }));
};