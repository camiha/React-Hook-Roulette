import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { RouletteOptions, defaultOptions } from "../config";
import { animateRoulette } from "../functions/animation-roulette";
import { drawCanvas } from "../functions/draw-canvas";
import { setupCanvas } from "../functions/utils";
import { RouletteCanvas, RouletteItem } from "../types";

export const useRoulette = ({
	items,
	onSpinUp,
	onSpinDown,
	onSpinEnd,
	options = {},
}: {
	items: RouletteItem[];
	onSpinUp?: () => void;
	onSpinDown?: () => void;
	onSpinEnd?: (result: string) => void;
	options?: Partial<RouletteOptions>;
}): {
	roulette: RouletteCanvas;
	result: string;
	onStart: () => void;
	onStop: () => void;
} => {
	const mergedOptions = useMemo(() => {
		return {
			...defaultOptions,
			...options,
			style: {
				canvas: {
					...defaultOptions.style.canvas,
					...options.style?.canvas,
				},
				label: {
					...defaultOptions.style.label,
					...options.style?.label,
				},
				arrow: {
					...defaultOptions.style.arrow,
					...options.style?.arrow,
				},
				pie: {
					...defaultOptions.style.pie,
					...options.style?.pie,
					theme: [
						...(options.style?.pie?.theme || defaultOptions.style.pie.theme),
					],
				},
			},
		};
	}, [options]);

	const canvasRef = useRef<HTMLCanvasElement>(null);
	const rouletteRef = useRef<{
		speed: number;
		totalRotation: number;
	}>({
		speed: 0,
		totalRotation: mergedOptions.initialAngle,
	});
	const resultRef = useRef<string>("");

	const geometry = useMemo(() => {
		const half = mergedOptions.size / 2;
		return {
			radius: half,
			center: {
				x: half,
				y: half,
			},
		};
	}, [mergedOptions]);

	const [status, setStatus] = useState<"stop" | "running" | "ending">("stop");

	const onStart = useCallback(() => {
		if (status !== "stop") return;
		setStatus("running");
	}, [status]);

	const onStop = useCallback(() => {
		if (status !== "running") return;
		setStatus("ending");
	}, [status]);

	useEffect(() => {
		if (status !== "stop") return;

		const { context } = setupCanvas(canvasRef.current);
		drawCanvas({
			rouletteItemList: items,
			mergedOptions,
			context,
			geometry,
			rouletteRef,
		});
	}, [status, geometry, items, mergedOptions]);

	useEffect(() => {
		if (status !== "running" && status !== "ending") return;

		if (status === "running") {
			onSpinUp?.();
		}
		if (status === "ending") {
			onSpinDown?.();
		}
		const { context } = setupCanvas(canvasRef.current);
		const cancelAnimation = animateRoulette({
			rouletteItemList: items,
			mergedOptions,
			context,
			status,
			geometry,
			rouletteRef,
			onFinish: (rouletteResult: string) => {
				setStatus("stop");
				resultRef.current = rouletteResult;
				onSpinEnd?.(rouletteResult);
			},
		});
		return () => {
			cancelAnimation();
		};
	}, [status, geometry, items, mergedOptions, onSpinEnd, onSpinDown, onSpinUp]);

	return {
		roulette: {
			size: mergedOptions.size,
			canvasRef,
		},

		result: resultRef.current,
		onStart,
		onStop,
	};
};
