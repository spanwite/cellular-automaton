import del from 'del';

import { path } from '../config/path';

export const clean = () => {
	return del([
		path.build.js,
		path.build.css,
		path.build.html + 'index.html',
		path.build.images,
	]);
};

export const cleanFonts = () => {
	return del(path.build.fonts);
}