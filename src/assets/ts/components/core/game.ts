import Area from './area';

class Game {
	public readonly Area = new Area();

	private isRunning = false;
	private lastTime = 0;

	private $buttonStart = $('.button_start');

	public StepsPerSecond = 100;

	constructor() {
		this.Area.Draw();
	}

	public Tick = async () => {
		if (!this.isRunning) {
			return;
		}

		if ((Date.now() - this.lastTime) > (1000 / this.StepsPerSecond)) {
			this.Area.UpdateUnits();
			this.Area.Draw();
			this.lastTime = Date.now();
		}

		requestAnimationFrame(this.Tick);
	};

	public Start() {
		this.Area.CellStats.ResetLabels();
		this.$buttonStart.text('stop');

		this.isRunning = true;
		void this.Tick();
	}

	public Stop() {
		this.$buttonStart.text('start');

		this.isRunning = false;
	}
}

export default Game;