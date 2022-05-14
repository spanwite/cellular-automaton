import { src, dest } from 'gulp';

import { plugins } from '../config/plugins';
import { path } from '../config/path';
import { isBuild } from '../../gulpfile';

// @ts-ignore
import webp from 'gulp-webp';

export const images = () => {
	return src(path.src.images)
		.pipe(plugins.plumber(
			plugins.notify.onError({
				title: 'IMAGES',
				message: 'Error: <%= error.message %>',
			}),
		))
		.pipe(plugins.newer(path.build.images))
		.pipe(
			plugins.if(isBuild, webp()),
		)
		.pipe(
			plugins.if(isBuild, dest(path.build.images)),
		)

		.pipe(
			plugins.if(isBuild, src(path.src.images)),
		)
		.pipe(
			plugins.if(isBuild, plugins.newer(path.build.images)),
		)
		.pipe(dest(path.build.images))
		.pipe(src(path.src.svg))
		.pipe(dest(path.build.images))
		.pipe(plugins.browserSync.reload({ stream: true }));
};