import { DefaultRouletteOptions } from "../config";
import { Geometry, RotationDirection, RouletteItem } from "../types";
import { drawCanvas } from "./draw-canvas";
import { getResultName } from "./utils";

const calculateSpeed = (
	status: string,
	curSpeed: number,
	options: DefaultRouletteOptions,
): number => {
	if (status === "running" && curSpeed <= options.maxSpeed) {
		return curSpeed + options.acceleration;
	}
	if (status === "ending" && curSpeed >= 0) {
		return curSpeed - options.deceleration;
	}

	return curSpeed;
};

const calcTotalRotation = (rotationDirection: RotationDirection) => {
	if (rotationDirection === "clockwise") {
		return (totalRotation: number, curSpeed: number) => {
			return totalRotation - curSpeed;
		};
	}
	return (totalRotation: number, curSpeed: number) => {
		return totalRotation + curSpeed;
	};
};

export const animateRoulette = ({
	rouletteItemList,
	mergedOptions,
	context,
	status,
	geometry,
	rouletteRef,
	onFinish,
}: {
	rouletteItemList: RouletteItem[];
	mergedOptions: DefaultRouletteOptions;
	context: CanvasRenderingContext2D;
	status: "running" | "ending";
	geometry: Geometry;
	rouletteRef: React.MutableRefObject<{
		speed: number;
		totalRotation: number;
	}>;
	onFinish: (rouletteResult: string) => void;
}) => {
	let animationFrameId: number;
	let curSpeed = rouletteRef.current.speed;

	const getTotalRotation = calcTotalRotation(mergedOptions.rotationDirection);

	const animate = () => {
		curSpeed = calculateSpeed(status, curSpeed, mergedOptions);
		rouletteRef.current.speed = curSpeed;
		rouletteRef.current.totalRotation = getTotalRotation(
			rouletteRef.current.totalRotation,
			curSpeed,
		);

		const complete = status === "ending" && curSpeed < 0;
		if (complete) {
			const rouletteResult = getResultName({
				rouletteItemList,
				rotationDirection: mergedOptions.rotationDirection,
				totalRotation: rouletteRef.current.totalRotation,
			});
			onFinish(rouletteResult);
			return;
		}

		drawCanvas({
			rouletteItemList,
			mergedOptions,
			context,
			geometry,
			rouletteRef,
		});
		animationFrameId = requestAnimationFrame(animate);
	};

	animate();
	return () => cancelAnimationFrame(animationFrameId);
};
