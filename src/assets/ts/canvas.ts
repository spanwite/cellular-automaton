import {Size} from "./size";
import {Position} from "./position";

import {style} from "./style";

export class Canvas {
	private readonly element: HTMLCanvasElement;
	private readonly context: CanvasRenderingContext2D;

	private readonly size: Size;

	constructor() {
		this.element = document.getElementById("canvas") as HTMLCanvasElement;
		this.context = this.element.getContext('2d') as CanvasRenderingContext2D;

		this.size = new Size(window.innerWidth, window.innerHeight);

		this.Resize();
	}

	public get Size(): Size {
		return this.size;
	}

	public Clear(): void {
		this.context.clearRect(0, 0, this.size?.Width ?? 0, this.size?.Height ?? 0);
	}

	public Resize(): void {
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