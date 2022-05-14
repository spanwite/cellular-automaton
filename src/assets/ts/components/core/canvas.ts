/* Common */
import Position from '../common/position';
import Size from '../common/size';
import { Screen } from '../common/types';

/* Core */
import cellStyles from '../core/cell-styles';

class Canvas {
	private readonly element: HTMLCanvasElement;
	private readonly context: CanvasRenderingContext2D;

	public Size = new Size(0, 0);
	private lastScreen: Screen = 'half';

	public RainbowUnits = false;

	private colors = [
		'#D268F8FF', '#D268F8FF', '#F868B2FF', '#F868B2FF',
		'#F88A68FF', '#F88A68FF', '#F8F568FF', '#F8F568FF',
		'#8EF868FF', '#8EF868FF', '#68F8AEFF', '#68F8AEFF',
		'#68D6F8FF', '#68D6F8FF', '#686AF8FF', '#686AF8FF',
	];

	constructor() {
		this.element = document.getElementById('canvas') as HTMLCanvasElement;
		this.context = this.element.getContext('2d') as CanvasRenderingContext2D;

		this.Resize('half');
	}

	public Clear() {
		this.context.clearRect(0, 0, this.Size.Width, this.Size.Height);
	}

	public Resize(screen: Screen) {
		this.Size = new Size(window.innerWidth, window.innerHeight);

		if (screen === 'last') {
			screen = this.lastScreen;
		}

		if (screen === 'half') {
			this.Size.Height /= 1.22;

			const cellSize = cellStyles.FullSize;
			const yCellsCount = (this.Size.Height % cellSize) + cellStyles.Margin;

			this.Size.Height -= yCellsCount;
		}

		this.element.width = this.Size.Width;
		this.element.height = this.Size.Height;

		this.lastScreen = screen;
	}

	public ClearCell({ X, Y }: Position) {
		this.context.clearRect(
			X * cellStyles.FullSize,
			Y * cellStyles.FullSize,
			cellStyles.Size,
			cellStyles.Size,
		);
	}

	public DrawCell({ X, Y }: Position) {
		let color = cellStyles.Color;

		if (this.RainbowUnits) {
			const randomIndex = (Math.random() * this.colors.length) | 0;
			color = this.colors[randomIndex];
		}

		this.context.fillStyle = color;

		this.context.fillRect(
			X * cellStyles.FullSize,
			Y * cellStyles.FullSize,
			cellStyles.Size,
			cellStyles.Size,
		);
	}
}

export default Canvas;