import fs from 'fs';
import ttf2woff2 from 'gulp-ttf2woff2';

import { src, dest } from 'gulp';

import { path, srcPath } from '../config/path';
import { plugins } from '../config/plugins';

const fonter = require('gulp-fonter');

export const otfToTtf = () => {
	return src(srcPath + 'assets/fonts/*.otf')
		.pipe(plugins.plumber(
			plugins.notify.onError({
				title: 'OTF_TO_TTF',
				message: 'Error: <%= error.message %>',
			}),
		))
		.pipe(fonter({
			formats: ['ttf'],
		}))
		.pipe(dest(srcPath + 'assets/fonts/'));
};

export const ttfToWoff = () => {
	return src(srcPath + 'assets/fonts/*.ttf')
		.pipe(plugins.plumber(
			plugins.notify.onError({
				title: 'TTF_TO_WOFF',
				message: 'Error: <%= error.message %>',
			}),
		))
		.pipe(fonter({
			formats: ['woff'],
		}))
		.pipe(dest(path.build.fonts))
		.pipe(src(srcPath + 'assets/fonts/*.ttf'))
		.pipe(ttf2woff2())
		.pipe(dest(path.build.fonts));
};

export const copyWoff = () => {
	return src(srcPath + 'assets/fonts/*.{woff,woff2}')
		.pipe(plugins.plumber(
			plugins.notify.onError({
				title: 'COPY_WOFF',
				message: 'Error: <%= error.message %>',
			}),
		))
		.pipe(dest(path.build.fonts))
}

function stub() {
}

export const fontsStyles = () => {
	const fontsFileScss: string = srcPath + 'assets/scss/components/_/fonts.scss';

	fs.readdir(path.build.fonts, function (err, fontFiles) {
		if (!fontFiles) {
			return src(srcPath)
				.pipe(plugins.notify({
					title: 'FONTS',
					message: 'Fonts directory is empty!',
				}));
		}

		fs.writeFile(fontsFileScss, '', stub);

		let lastFileName: string = '';

		for (const font of fontFiles) {
			const fontFileName: string = font.split('.')[0];
			if (fontFileName === lastFileName) {
				continue;
			}

			const fontName = fontFileName.split('-')[0];
			let fontWeight: string | number = fontFileName.split('-')[1];

			lastFileName = fontFileName;
			fontWeight = fontWeight.toLowerCase();

			if (fontWeight === 'thin') {
				fontWeight = 100;
			} else if (fontWeight === 'extralight') {
				fontWeight = 200;
			} else if (fontWeight === 'light') {
				fontWeight = 300;
			} else if (fontWeight === 'medium') {
				fontWeight = 500;
			} else if (fontWeight === 'semibold') {
				fontWeight = 600;
			} else if (fontWeight === 'bold') {
				fontWeight = 700;
			} else if (fontWeight === 'extrabold') {
				fontWeight = 800;
			} else if (fontWeight === 'black') {
				fontWeight = 900;
			} else {
				fontWeight = 400;
			}

			const append = `@font-face {\n\tfont-family: ${fontName};\n\tfont-display: swap;\n\tsrc: url("../fonts/${fontFileName}.woff2") format("woff2"),\n\t\turl("../fonts/${fontFileName}.woff") format("woff");\n\tfont-weight: ${fontWeight};\n\tfont-style: normal;\n}\n\r\n`;

			fs.appendFile(fontsFileScss, append, stub);
		}

	});

	return src(srcPath);
};