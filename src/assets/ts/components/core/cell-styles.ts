class CellStyles {
	private size = 20;
	private margin = 1;

	public FullSize = this.size + this.margin;
	public Color = '#37ff45';

	public set Size(size: number) {
		this.size = size;
		this.FullSize = size + this.margin;
	}

	public set Margin(margin: number) {
		this.margin = margin;
		this.FullSize = this.size + margin;
	}

	public get Size() {
		return this.size;
	}

	public get Margin() {
		return this.margin;
	}
}

const cellStyles = new CellStyles();

export default cellStyles;