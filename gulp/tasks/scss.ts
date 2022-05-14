import gulp from 'gulp';

import { path } from '../config/path';
import { plugins } from '../config/plugins';
import { isBuild, isDev } from '../../gulpfile';

import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import rename from 'gulp-rename';
import cleanCss from 'gulp-clean-css';
import autoprefixerCss from 'gulp-autoprefixer';

// @ts-ignore
import groupMediaQueriesCss from 'gulp-group-css-media-queries';

const sass = gulpSass(dartSass);

export const scss = () => {
	return gulp.src(path.src.scss, { sourcemaps: isDev })
		.pipe(plugins.plumber(
			plugins.notify.onError({
				title: 'SCSS',
				message: 'Error: <%= error.message %>',
			}),
		))
		.pipe(sass({
			includePaths: ['./node_modules/'],
			outputStyle: 'expanded',
		}))
		.pipe(
			plugins.if(isBuild, groupMediaQueriesCss()),
		)
		.pipe(
			plugins.if(isBuild, autoprefixerCss({
				cascade: true,
				browsers: ['last 4 versions'],
			})),
		)
		.pipe(
			plugins.if(isBuild, gulp.dest(path.build.css)),
		)
		.pipe(
			plugins.if(isBuild, cleanCss()),
		)
		.pipe(rename({
			extname: '.min.css',
		}))
		.pipe(gulp.dest(path.build.css))
		.pipe(plugins.browserSync.reload({ stream: true }));
};