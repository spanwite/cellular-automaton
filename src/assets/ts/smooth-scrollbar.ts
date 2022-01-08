import Scrollbar from 'smooth-scrollbar';
import OverscrollPlugin from 'smooth-scrollbar/plugins/overscroll';

const isMobile: boolean = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
	.test(navigator.userAgent);

const options = {
	damping: isMobile ? 0.05 : 0.1,
	thumbMinSize: 20,
	renderByPixels: !('ontouchstart' in document),
	alwaysShowTracks: false,
	continuousScrolling: true,
};

const overscrollOptions = {
	enable: true,
	effect: 'bounce',
	damping: 0.2,
	maxOverscroll: 150,
	glowColor: '#222a2d',
};

export function initScrollbar(): void {
	if (isMobile) {
		return;
	}

	Scrollbar.use(OverscrollPlugin);
	Scrollbar.init(<HTMLElement>document.querySelector('body'), {
		...options,
		delegateTo: document,
		plugins: {
			overscroll: { ...overscrollOptions },
		},
	});

}