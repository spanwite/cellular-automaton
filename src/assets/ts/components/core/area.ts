/* Common */
import Position from '../common/position';
import Size from '../common/size';
import { Align } from '../common/types';

/* Core */
import Canvas from './canvas';
import CellStats from './cell-stats';
import cellStyles from '../core/cell-styles';

class Area {
	public readonly Canvas = new Canvas();

	private cells: boolean[][] = [];

	public LoopingSpace = false;
	public Rule = 323;

	public CellStats = new CellStats();

	private size = new Size(0, 0);

	constructor() {
		this.Resize();
	}

	public Resize() {
		this.size = new Size(
			Math.round(this.Canvas.Size.Width / cellStyles.FullSize),
			Math.round(this.Canvas.Size.Height / cellStyles.FullSize),
		);

		this.cells = new Array(this.size.Height)
			.fill(false)
			.map(() => new Array(this.size.Width)
				.fill(false));
	}

	private aliveCellsNear(cell: Position) {
		let units = 0;

		for (let yOffset = -1; yOffset <= 1; yOffset++) {
			for (let xOffset = -1; xOffset <= 1; xOffset++) {
				if (yOffset === 0 && xOffset === 0) {
					continue;
				}

				let unitX = cell.X + xOffset;
				let unitY = cell.Y + yOffset;

				if (!this.LoopingSpace) {
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

	public GetCellStatus(cell: Position) {
		return this.cells[cell.Y][cell.X];
	}

	public AddCell(unit: Position) {
		this.cells[unit.Y][unit.X] = true;
		this.Canvas.DrawCell(unit);
	}

	public KillCell(unit: Position) {
		this.cells[unit.Y][unit.X] = false;
		this.Canvas.ClearCell(unit);
	}

	private rule110(upUnit: boolean, prevUnit: boolean, nextUnit: boolean) {
		if (upUnit) {
			if (
				(prevUnit && !nextUnit) ||
				(!prevUnit && nextUnit) ||
				(!prevUnit && !nextUnit)
			) {
				return true;
			}
		} else {
			if (
				(prevUnit && nextUnit) ||
				(!prevUnit && nextUnit)
			) {
				return true;
			}
		}

		return false;
	}

	private rule30and90(upUnit: boolean, prevUnit: boolean, nextUnit: boolean) {
		if (!upUnit) {
			if (
				(prevUnit && !nextUnit) ||
				(!prevUnit && nextUnit)
			) {
				return true;
			}
		}

		if (this.Rule === 90) {
			return false;
		}

		if (upUnit) {
			if (
				(prevUnit && !nextUnit) ||
				(!nextUnit && !nextUnit)
			) {
				return true;
			}
		}

		return false;
	}

	private rule184(upUnit: boolean, prevUnit: boolean, nextUnit: boolean) {
		if (upUnit) {
			if (
				(prevUnit && nextUnit) ||
				(!prevUnit && nextUnit)
			) {
				return true;
			}
		} else {
			if (
				(prevUnit && nextUnit) ||
				(prevUnit && !nextUnit)
			) {
				return true;
			}
		}

		return false;
	}

	private rule323(currentPos: Position) {
		const { CellStats } = this;
		const unitsCount = this.aliveCellsNear(currentPos);

		if (!this.GetCellStatus(currentPos)) {
			if (unitsCount === 3) {
				CellStats.Born.push(currentPos);
			}
			return;
		}

		if ([2, 3].includes(unitsCount)) {
			CellStats.Alive.push(currentPos);
		} else {
			CellStats.Died.push(currentPos);
		}
	}

	public UpdateUnits() {
		const { Height, Width } = this.size;

		for (let y = 0; y < Height; ++y) {
			for (let x = 0; x < Width; ++x) {
				const currentPos = new Position(x, y);
				if (this.Rule === 323) {
					this.rule323(currentPos);
					continue;
				}

				const currentUnit = this.cells[y][x];

				if (currentUnit) {
					this.CellStats.Alive.push(currentPos);
					continue;
				}

				let upUnitStatus = false;
				let prevUnitStatus = false;
				let nextUnitStatus = false;

				let upUnitY = y - 1;
				let prevUnitX = x - 1;
				let nextUnitX = x + 1;

				if (this.LoopingSpace) {
					upUnitY += upUnitY < 0 ? Height : 0;
					prevUnitX += prevUnitX < 0 ? Width : 0;
					nextUnitX -= prevUnitX >= Width ? Width : 0;

					upUnitStatus = this.cells[upUnitY][x];
					prevUnitStatus = this.cells[upUnitY][prevUnitX];
					nextUnitStatus = this.cells[upUnitY][nextUnitX];
				} else {
					if (upUnitY >= 0) {
						upUnitStatus = this.cells[upUnitY][x];
						prevUnitStatus = x - 1 >= 0 ? this.cells[upUnitY][prevUnitX] : false;
						nextUnitStatus = x + 1 <= this.size.Width ? this.cells[upUnitY][nextUnitX] : false;
					}
				}

				let isBorn = false;

				switch (this.Rule) {
					case 110: {
						isBorn = this.rule110(upUnitStatus, prevUnitStatus, nextUnitStatus);
						break;
					}
					case 30:
					case 90: {
						isBorn = this.rule30and90(upUnitStatus, prevUnitStatus, nextUnitStatus);
						break;
					}
					case 184: {
						isBorn = this.rule184(upUnitStatus, prevUnitStatus, nextUnitStatus);
					}
				}

				if (isBorn) {
					this.CellStats.Born.push(currentPos);
				}
			}
		}
	}

	public RandomizeUnits() {
		const { Width, Height } = this.size;

		this.Clear();

		const cellsCount = Width * Height;
		const half = (cellsCount / 2) | 0;

		for (let i = 0; i < half; ++i) {
			let randomX = (Math.random() * Width) | 0;
			let randomY = (Math.random() * Height) | 0;

			if (this.cells[randomY][randomX]) {
				--i;
			} else {
				const currentPos = new Position(randomX, randomY);
				this.CellStats.Alive.push(currentPos);
			}
		}

		this.CellStats.Update();
		this.Draw();
	}

	public Clear() {
		for (let y = 0; y < this.size.Height; ++y) {
			for (let x = 0; x < this.size.Width; ++x) {
				this.cells[y][x] = false;
			}
		}

		this.CellStats.ResetAll();
		this.Canvas.Clear();
	}

	public GetConfig() {
		const units: Position[] = [];

		for (let y = 0; y < this.size.Height; ++y) {
			for (let x = 0; x < this.size.Width; ++x) {
				if (this.cells[y][x]) {
					units.push(new Position(x, y));
				}
			}
		}

		return JSON.stringify(units, null, '');
	}

	public LoadConfig(config: string | object, align?: Align, offset?: Position): boolean {
		let units: Position[];

		try {
			units = typeof config === 'string' ? JSON.parse(config) : config;
		} catch (error) {
			return false;
		}

		let unitMin = new Position(Infinity, Infinity);
		let unitMax = new Position(-Infinity, -Infinity);

		for (const unit of units) {
			if (unitMin.X > unit.X) {
				unitMin.X = unit.X;
			} else if (unitMin.Y > unit.Y) {
				unitMin.Y = unit.Y;
			}

			if (unitMax.X < unit.X) {
				unitMax.X = unit.X;
			} else if (unitMax.Y < unit.Y) {
				unitMax.Y = unit.Y;
			}
		}

		let alignOffset = new Position(
			((this.size.Width - unitMax.X - unitMin.X) / 2) | 0,
			((this.size.Height - unitMax.Y - unitMin.Y) / 2) | 0,
		);

		switch (align) {
			case 'left': {
				alignOffset.X = this.size.Width - (this.size.Width + unitMin.X);
				break;
			}
			case 'right': {
				alignOffset.X = this.size.Width - unitMax.X - 1;
				break;
			}
			case 'top': {
				alignOffset.Y = this.size.Height - (this.size.Height + unitMin.Y);
				break;
			}
			case 'bot': {
				alignOffset.Y = this.size.Height - unitMax.Y - 1;
				break;
			}
		}

		alignOffset.X += offset?.X ?? 0;
		alignOffset.Y += offset?.Y ?? 0;

		for (let unit of units) {
			unit.X += alignOffset.X;
			unit.Y += alignOffset.Y;

			if (
				unit.X >= this.size.Width ||
				unit.Y >= this.size.Height ||
				unit.X < 0 ||
				unit.Y < 0
			) {
				continue;
			}

			this.CellStats.Alive.push(unit);
		}

		this.Draw();

		return true;
	}

	public Draw() {
		const { CellStats } = this;
		this.Canvas.Clear();

		for (const unit of CellStats.Born) {
			this.AddCell(unit);
		}
		for (const unit of CellStats.Alive) {
			this.AddCell(unit);
		}
		for (const unit of CellStats.Died) {
			this.cells[unit.Y][unit.X] = false;
		}

		CellStats.Update();
		CellStats.ResetArrays();
	}
}

export default Area;