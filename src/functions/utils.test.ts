import { describe, expect, it } from "vitest";
import { degreesToCanvasRadians } from "./utils";

describe("utils", () => {
	describe("degreesToCanvasRadians", () => {
		it("should convert 90 to 1.5 * PI", () => {
			expect(degreesToCanvasRadians(90)).toBe(1.5 * Math.PI);
		});
		it("should convert 180 to PI", () => {
			expect(degreesToCanvasRadians(180)).toBe(Math.PI);
		});
		it("should convert 270 to 0.5 * PI", () => {
			expect(degreesToCanvasRadians(270)).toBe(0.5 * Math.PI);
		});
		it("should convert 360 to 0", () => {
			expect(degreesToCanvasRadians(360)).toBe(0);
		});
	});
});
