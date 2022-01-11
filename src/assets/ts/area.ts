import $ from 'jquery'

import {Position} from "./position";
import {Size} from "./size";
import {Canvas} from "./canvas";

import {style} from "./style";

import {Align, Screen} from "./types";

export class Area {
	private readonly canvas: Canvas;

	private cells: boolean[][] = [];

	private loopingSpace: boolean = false;

	private bornUnits: Position[] = [];
	private diedUnits: Position[] = [];
	private aliveUnits: Position[] = [];

	private diedUnitsCount: number = 0;
	private bornUnitsCount: number = 0;

	private $valueBorn: JQuery = $(".statistics-item__value_born");
	private $valueDied: JQuery = $(".statistics-item__value_died");
	private $valueAlive: JQuery = $(".statistics-item__value_alive");

	private size: Size;

	constructor() {
		this.canvas = new Canvas();
		this.size = new Size(0, 0);

		this.Resize();
	}

	private unitsNearCell({X, Y}: Position): number {
		let units: number = 0;

		for (let yOffset = -1; yOffset <= 1; yOffset++) {
			for (let xOffset = -1; xOffset <= 1; xOffset++) {
				if (yOffset === 0 && xOffset === 0) {
					continue;
				}

				let unitX = X + xOffset;
				let unitY = Y + yOffset;

				if (!this.loopingSpace) {
					if (unitX < 0 || unitX >= this.size.Width) {
						continue;
					}
					if (unitY < 0 || unitY >= this.size.Height) {
						continue;
					}
				} else {
					if (unitX < 0) {
						unitX = this.size.Width + unitX;
					} else if (unitX >= this.size.Width) {
						unitX = unitX - this.size.Width;
					}

					if (unitY < 0) {
						unitY = this.size.Height + unitY;
					} else if (unitY >= this.size.Height) {
						unitY = unitY - this.size.Height;
					}
				}

				if (this.cells[unitY][unitX]) {
					++units;
				}
			}
		}

		return units;
	}

	public set LoopingSpace(value: boolean) {
		this.loopingSpace = value;
	}

	public Resize(): void {
		const cellSize: number = style.cell.size + style.cell.margin;

		this.size = new Size(
			Math.round(this.canvas.Size.Width / cellSize),
			Math.round(this.canvas.Size.Height / cellSize)
		);

		this.cells = new Array(this.size.Height)
			.fill(false)
			.map(el => new Array(this.size.Width)
				.fill(false));
	}

	public GetUnitStatus({X, Y}: Position) {
		return this.cells[Y][X];
	}

	public AddUnit(unit: Position): void {
		this.cells[unit.Y][unit.X] = true;
		this.canvas.DrawUnit(unit);
	}

	public RemoveUnit(unit: Position): void {
		this.cells[unit.Y][unit.X] = false;
		this.canvas.ClearUnit(unit);
	}

	public UpdateUnits() {
		for (let y: number = 0; y < this.size.Height; ++y) {
			for (let x: number = 0; x < this.size.Width; ++x) {
				const currentPos = new Position(x, y);
				const unitsCount = this.unitsNearCell(currentPos);

				if (!this.cells[y][x]) {
					if (unitsCount === 3) {
						this.bornUnits.push(currentPos);
					}
				} else {
					if (unitsCount === 2 || unitsCount === 3) {
						this.aliveUnits.push(currentPos);
					} else {
						this.diedUnits.push(currentPos);
					}
				}
			}
		}
	}

	public GetCanvas(): Canvas {
		return this.canvas;
	}

	public RandomizeUnits(): void {
		this.ResetUnits();

		for (let y: number = 0; y < this.size.Height; ++y) {
			for (let x: number = 0; x < this.size.Width; ++x) {
				if (Math.floor(Math.random() * 2)) {
					this.aliveUnits.push(new Position(x, y));
				}
			}
		}

		this.UpdateStatistics();
		this.Draw();
	}

	public ResetUnits(): void {
		this.diedUnits = [];
		this.aliveUnits = [];
		this.bornUnits = [];
	}

	public ResetStatistics(): void {
		this.diedUnitsCount = 0;
		this.bornUnitsCount = 0;
	}

	public Clear(): void {
		for (let y: number = 0; y < this.size.Height; ++y) {
			for (let x: number = 0; x < this.size.Width; ++x) {
				this.cells[y][x] = false;
			}
		}
		this.ResetUnits();

		this.ResetStatistics();
		this.UpdateStatistics();

		this.canvas.Clear();
	}

	public UpdateStatistics(): void {
		this.bornUnitsCount += this.bornUnits.length;
		this.diedUnitsCount += this.diedUnits.length;
		const aliveUnitsCount = this.aliveUnits.length + this.bornUnits.length;

		this.$valueBorn.text(this.bornUnitsCount);
		this.$valueDied.text(this.diedUnitsCount);
		this.$valueAlive.text(aliveUnitsCount);
	}

	public GetConfig(): string {
		const units: Position[] = [];

		for (let y: number = 0; y < this.size.Height; ++y) {
			for (let x: number = 0; x < this.size.Width; ++x) {
				if (this.cells[y][x]) {
					units.push(new Position(x, y));
				}
			}
		}

		return JSON.stringify(units, null, '');
	}

	public async LoadConfig(config: string | object, align?: Align, offset?: Position) {
		const units: Array<Position> = typeof config === 'string' ? JSON.parse(config) : config;

		let unitMin: Position = new Position(Infinity, Infinity);
		let unitMax: Position = new Position(-Infinity, -Infinity);

		for (const unit of units) {
			if (unitMin.X > unit.X) {
				unitMin.X = unit.X;
			}
			if (unitMin.Y > unit.Y) {
				unitMin.Y = unit.Y;
			}
			if (unitMax.X < unit.X) {
				unitMax.X = unit.X;
			}
			if (unitMax.Y < unit.Y) {
				unitMax.Y = unit.Y;
			}
		}

		let alignOffset: Position = new Position(
			Math.floor((this.size.Width - unitMax.X - unitMin.X) / 2),
			Math.floor((this.size.Height - unitMax.Y - unitMin.Y) / 2)
		);

		if (align === 'left') {
			alignOffset.X = this.size.Width - (this.size.Width + unitMin.X);
		} else if (align === 'right') {
			alignOffset.X = this.size.Width - unitMax.X - 1;
		} else if (align === 'bot') {
			alignOffset.Y = this.size.Height - unitMax.Y - 1;
		} else if (align === 'top') {
			alignOffset.Y = this.size.Height - (this.size.Height + unitMin.Y);
		}

		alignOffset.X += offset?.X ?? 0;
		alignOffset.Y += offset?.Y ?? 0;

		for (let unit of units) {
			unit.X += alignOffset.X;
			unit.Y += alignOffset.Y;

			if (
				unit.X > this.size.Width 	||
				unit.Y > this.size.Height 	||
				unit.X < 0 					||
				unit.Y < 0
			) {
				continue;
			}

			this.AddUnit(unit);
		}
	}

	public Draw(): void {
		this.canvas.Clear();

		for (const unit of this.aliveUnits) {
			this.canvas.DrawUnit(unit);
			this.cells[unit.Y][unit.X] = true;
		}
		for (const unit of this.bornUnits) {
			this.canvas.DrawUnit(unit);
			this.cells[unit.Y][unit.X] = true;
		}
		for (const unit of this.diedUnits) {
			this.cells[unit.Y][unit.X] = false;
		}

		this.UpdateStatistics();
		this.ResetUnits();
	}

}