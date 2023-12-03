import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { RouletteOptions, defaultOptions } from "../config";
import { animateRoulette } from "../functions/animation-roulette";
import { drawCanvas } from "../functions/draw-canvas";
import { setupCanvas } from "../functions/utils";
import { RouletteCanvas, RouletteItem } from "../types";

export const useRoulette = ({
	items,
	options = {},
}: {
	items: RouletteItem[];
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
	const [result, setResult] = useState("");

	const onStart = useCallback(() => {
		if (status !== "stop") return;
		setStatus("running");
		setResult("");
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
				setResult(rouletteResult);
			},
		});
		return () => {
			cancelAnimation();
		};
	}, [status, geometry, items, mergedOptions]);

	return {
		roulette: {
			size: mergedOptions.size,
			canvasRef,
		},

		result,
		onStart,
		onStop,
	};
};
