import Position from '../common/position';

class CellStats {
	public Born: Position[] = [];
	public Alive: Position[] = [];
	public Died: Position[] = [];

	public DiedCount = 0;
	public BornCount = 0;

	private $valueBorn = $('.cell-stats__value_born');
	private $valueDied = $('.cell-stats__value_died');
	private $valueAlive = $('.cell-stats__value_alive');

	public ResetArrays() {
		this.Born = [];
		this.Alive = [];
		this.Died = [];
	}

	public ResetLabels() {
		this.DiedCount = 0;
		this.BornCount = 0;

		this.$valueAlive.text(0);
		this.$valueBorn.text(0);
		this.$valueDied.text(0);
	}

	public ResetAll() {
		this.ResetArrays();
		this.ResetLabels();
	}

	public Update() {
		const aliveUnitsCount = this.Alive.length + this.Born.length;
		this.BornCount += this.Born.length;
		this.DiedCount += this.Died.length;

		this.$valueAlive.text(aliveUnitsCount);
		this.$valueBorn.text(this.BornCount);
		this.$valueDied.text(this.DiedCount);
	}
}

export default CellStats;