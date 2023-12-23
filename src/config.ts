import { RotationDirection, StyleOption, StyleOptionDefault } from "./types";

export interface RouletteOptions {
	size: number;
	initialAngle: number;
	rotationDirection: RotationDirection;
	maxSpeed: number;
	acceleration: number;
	deceleration: number;
	determineAngle: number;
	showArrow: boolean;
	style: StyleOption;
}

export interface DefaultRouletteOptions extends RouletteOptions {
	style: StyleOptionDefault;
}

// default color theming by tailwindcss (https://tailwindcss.com/docs/customizing-colors)
export const defaultOptions: DefaultRouletteOptions = {
	size: 400,
	maxSpeed: 100,
	rotationDirection: "clockwise",
	acceleration: 1,
	deceleration: 1,
	initialAngle: 0,
	determineAngle: 45,
	showArrow: true,
	style: {
		canvas: {
			bg: "#fff",
		},
		arrow: {
			bg: "#000",
			size: 16,
		},
		label: {
			font: "16px Arial",
			align: "right",
			baseline: "middle",
			offset: 0.75,
			defaultColor: "#000",
		},
		pie: {
			border: false,
			borderColor: "#000",
			borderWidth: 2,
			theme: [
				{
					bg: "#e0e7ff",
				},
				{
					bg: "#a5b4fc",
				},
				{
					bg: "#6366f1",
					color: "#fff",
				},
				{
					bg: "#4338ca",
					color: "#fff",
				},
			],
		},
	},
} as const;
