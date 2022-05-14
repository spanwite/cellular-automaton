import plumber from 'gulp-plumber';
import browserSyncPlugin from 'browser-sync';
import newer from 'gulp-newer';
import ifPlugin from 'gulp-if';

const browserSync = browserSyncPlugin.create();

// @ts-ignore
import notify from 'gulp-notify';

export const plugins = {
	notify: notify,
	plumber: plumber,
	browserSync: browserSync,
	newer: newer,
	if: ifPlugin,
};