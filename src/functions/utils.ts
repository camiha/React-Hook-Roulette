import type { Geometry, RotationDirection, RouletteItem } from "../types";

export const degreesToCanvasRadians = (degrees: number): number => {
	return ((360 - degrees) * Math.PI) / 180;
};

export const calculateLabelPosition = ({
	geometry,
	segmentStartAngle,
	anglePerSegment,
	labelOffset,
}: {
	geometry: Geometry;
	segmentStartAngle: number;
	anglePerSegment: number;
	labelOffset: number;
}): {
	labelX: number;
	labelY: number;
	labelAngle: number;
} => {
	const startDeg = degreesToCanvasRadians(segmentStartAngle);
	const endDeg = degreesToCanvasRadians(segmentStartAngle + anglePerSegment);

	const labelRadius = geometry.radius * labelOffset;
	const labelAngle = startDeg + (endDeg - startDeg) / 2;

	const labelX = geometry.center.x + labelRadius * Math.cos(labelAngle);
	const labelY = geometry.center.y + labelRadius * Math.sin(labelAngle);

	return {
		labelX,
		labelY,
		labelAngle,
	};
};

const createCalculateTotalWeight = () => {
	let lastPieList: RouletteItem[] | null = null;
	let lastTotalWeight = 0;

	// memoize
	return (pieList: RouletteItem[]): number => {
		if (lastPieList === pieList) {
			return lastTotalWeight;
		}
		const totalWeight = pieList.reduce(
			(acc, pie) => acc + (pie.weight || 1),
			0,
		);
		lastPieList = pieList;
		lastTotalWeight = totalWeight;
		return totalWeight;
	};
};
export const calculateTotalWeight = createCalculateTotalWeight();

export const getResultName = ({
	rouletteItemList,
	totalRotation,
	rotationDirection,
}: {
	rouletteItemList: RouletteItem[];
	totalRotation: number;
	rotationDirection: RotationDirection;
}) => {
	const checkDegree = Math.abs(totalRotation) % 360;
	const normalizedRotation =
		checkDegree > 360 ? checkDegree - 360 : checkDegree;
	const totalWeight = calculateTotalWeight(rouletteItemList);

	const directionResolvedData =
		rotationDirection === "clockwise"
			? [...rouletteItemList].reverse()
			: rouletteItemList;

	let currentAngle = 0;
	for (const item of directionResolvedData) {
		const itemWeight = item.weight || 1;
		const itemAngle = (itemWeight / totalWeight) * 360;
		if (
			normalizedRotation >= currentAngle &&
			normalizedRotation < currentAngle + itemAngle
		) {
			return item.name;
		}
		currentAngle += itemAngle;
	}
	return "No Result";
};

export const setupCanvas = (canvas: HTMLCanvasElement | null) => {
	if (!canvas) throw new Error("Canvas is not available.");
	const context = canvas.getContext("2d");
	if (!context) throw new Error("Could not obtain 2D context from canvas.");

	return {
		canvas,
		context,
	};
};
