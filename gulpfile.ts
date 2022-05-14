import gulp from 'gulp';

import { path } from './gulp/config/path';

import { clean, cleanFonts } from './gulp/tasks/clean';
import { html } from './gulp/tasks/html';
import { server } from './gulp/tasks/server';
import { scss } from './gulp/tasks/scss';
import { ts } from './gulp/tasks/ts';
import { images } from './gulp/tasks/images';
import { otfToTtf, ttfToWoff, copyWoff, fontsStyles } from './gulp/tasks/fonts';

export const isBuild: boolean = process.argv.includes('--build');
export const isDev: boolean = !isBuild;

function watcher() {
	gulp.watch(path.watch.html, html);
	gulp.watch(path.watch.scss, scss);
	gulp.watch(path.watch.ts, ts);
	gulp.watch(path.watch.images, images);
}

const fonts = gulp.series(cleanFonts, otfToTtf, ttfToWoff, copyWoff, fontsStyles);
const mainTasks = gulp.parallel(html, scss, ts, images);

const dev = gulp.series(clean, mainTasks, gulp.parallel(watcher, server));
const build = gulp.series(clean, mainTasks);

gulp.task('default', dev);

export { dev, build, fonts };