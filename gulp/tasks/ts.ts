import { src, dest } from 'gulp';

import { path } from '../config/path';
import { plugins } from '../config/plugins';
import { isDev } from '../../gulpfile';

import webpackStream from 'webpack-stream';
import webpack from 'webpack';

export const ts = () => {
	return src(path.src.ts, { sourcemaps: isDev })
		.pipe(plugins.plumber(
			plugins.notify.onError({
				title: 'TS',
				message: 'Error: <%= error.message %>',
			}),
		))
		.pipe(webpackStream({
			entry: path.src.ts,
			mode: isDev ? 'development' : 'production',
			module: {
				rules: [
					{
						test: /\.tsx?$/,
						use: 'ts-loader',
						exclude: /node_modules/,
					},
					{
						test: /\.css$/,
						use: ['style-loader', 'css-loader'],
					},
				],
			},
			plugins: [
				new webpack.ProvidePlugin({
					$: 'jquery',
					jQuery: 'jquery',
					'window.jQuery': 'jquery',
				}),
			],
			resolve: {
				extensions: ['.tsx', '.ts', '.js'],
			},
			output: {
				filename: 'app.min.js',
			},
		}))
		.pipe(dest(path.build.js))
		.pipe(plugins.browserSync.reload({ stream: true }));
};