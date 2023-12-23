export type RotationDirection = "clockwise" | "counterclockwise";

export interface Point {
	x: number;
	y: number;
}

export interface Geometry {
	center: Point;
	radius: number;
}
export interface Pie {
	bg: string;
	name: string;
	color: string;
}

export interface RouletteItem {
	name: string;
	bg?: string;
	color?: string;
	weight?: number;
}

interface CanvasStyle {
	bg: string;
}
interface ArrowStyle {
	bg: string;
	size: number;
}

interface LabelStyle {
	font: string;
	defaultColor: string;
	align: CanvasTextAlign;
	baseline: CanvasTextBaseline;
	offset: number;
}

interface PieTheme {
	bg: string;
	color?: string;
}

interface PieStyle {
	border: boolean;
	borderColor: string;
	borderWidth: number;
	theme: PieTheme[];
}

export interface StyleOptionDefault {
	canvas: CanvasStyle;
	label: LabelStyle;
	arrow: ArrowStyle;
	pie: PieStyle;
}

export interface StyleOption {
	canvas?: Partial<CanvasStyle>;
	label?: Partial<LabelStyle>;
	arrow?: Partial<ArrowStyle>;
	pie?: Partial<PieStyle>;
}

export interface RouletteCanvas {
	size: number;
	canvasRef: React.RefObject<HTMLCanvasElement>;
}
