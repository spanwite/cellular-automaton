import {Size} from "./size";
import {Position} from "./position";

import {style} from "./style";

import {Screen} from "./types";

export class Canvas {
	private readonly element: HTMLCanvasElement;
	private readonly context: CanvasRenderingContext2D;

	private size: Size;

	constructor() {
		this.element = document.getElementById("canvas") as HTMLCanvasElement;
		this.context = this.element.getContext('2d') as CanvasRenderingContext2D;

		this.size = new Size(window.innerWidth, window.innerHeight / 1.5);

		this.Resize();
	}

	public get Size(): Size {
		return this.size;
	}

	public Clear(): void {
		this.context.clearRect(0, 0, this.size?.Width ?? 0, this.size?.Height ?? 0);
	}

	public Resize(size?: Screen): void {
		if (size === 'full') {
			this.size = new Size(window.innerWidth, window.innerHeight);
		} else if (size === 'half') {
			this.size = new Size(
				window.innerWidth,
				window.innerHeight / 1.5
			);
		}

		this.element.width = this.size.Width;
		this.element.height = this.size.Height;
	}

	public ClearUnit({X, Y}: Position): void {
		this.context.clearRect(
			X * (style.cell.size + style.cell.margin),
			Y * (style.cell.size + style.cell.margin),
			style.cell.size,
			style.cell.size
		);
	}

	public DrawCell({X, Y}: Position): void {
		this.context.fillStyle = style.cell.color;

		this.context.fillRect(
			X * (style.cell.size + style.cell.margin),
			Y * (style.cell.size + style.cell.margin),
			style.cell.size,
			style.cell.size
		);
	}

	public DrawUnit({X, Y}: Position): void {
		this.context.fillStyle = style.unit.color;

		this.context.fillRect(
			X * (style.cell.size + style.cell.margin),
			Y * (style.cell.size + style.cell.margin),
			style.cell.size,
			style.cell.size
		);
	}
}