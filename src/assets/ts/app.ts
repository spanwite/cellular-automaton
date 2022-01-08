import {Area} from "./area";
import $ from "jquery";

export class App {
	private readonly area: Area;

	private isRunning: boolean = false;
	private allowTick: boolean = false;

	private $buttonStart: JQuery = $(".main__group-button_start");

	private stepsPerSecond: number = 30;
	private lastTime: number = 0;

	constructor() {
		this.area = new Area();
		this.area.Draw();
	}

	public Tick = async () => {
		if (!this.allowTick) {
			return;
		}
		if ((Date.now() - this.lastTime) > (1000 / this.stepsPerSecond)) {
			this.area.UpdateUnits();
			this.area.Draw();
			this.lastTime = Date.now();
		}
		requestAnimationFrame(this.Tick);
	};

	public set StepsPerSecond(steps: number) {
		this.stepsPerSecond = steps;
	}

	public GetArea(): Area {
		return this.area;
	}

	public Start(): void {
		this.Stop();
		this.area.ResetStatistics();
		this.isRunning = true;
		this.$buttonStart.text("stop");
		this.StartInterval();
	}

	public Stop(): void {
		this.isRunning = false;
		this.$buttonStart.text("start");
		this.StopInterval();
	}

	public StartInterval() {
		this.allowTick = true;
		void this.Tick();
	}
	public StopInterval(){
		this.allowTick = false;
	}
}