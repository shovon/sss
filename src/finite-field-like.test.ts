import { modPow, modulo } from "./bigint-math";
import { lagrangePolynomial, polynomial } from "./finite-field-like";

describe("polynomial", () => {
	it("should evaluate constant polynomial", () => {
		const coefficients = [42n];
		const modulus = 97n;
		const p = polynomial(coefficients, modulus);

		expect(p(0n)).toBe(42n);
		expect(p(1n)).toBe(42n);
		expect(p(2n)).toBe(42n);
	});

	it("should evaluate linear polynomial", () => {
		const coefficients = [3n, 2n]; // 2x + 3
		const modulus = 97n;
		const p = polynomial(coefficients, modulus);

		expect(p(0n)).toBe(3n);
		expect(p(1n)).toBe(5n);
		expect(p(2n)).toBe(7n);
	});

	it("should evaluate quadratic polynomial", () => {
		const coefficients = [1n, 2n, 3n]; // 3x^2 + 2x + 1
		const modulus = 97n;
		const p = polynomial(coefficients, modulus);

		expect(p(0n)).toBe(1n);
		expect(p(1n)).toBe(6n);
		expect(p(2n)).toBe(17n);
	});

	it("should work with modular arithmetic", () => {
		const coefficients = [1n, 1n]; // x + 1
		const modulus = 5n;
		const p = polynomial(coefficients, modulus);

		expect(p(4n)).toBe(0n); // (4 + 1) mod 5 = 0
		expect(p(5n)).toBe(1n); // (5 + 1) mod 5 = 1
	});
});

describe("lagrangePolynomial", () => {
	it("should interpolate constant polynomial", () => {
		const points: [bigint, bigint][] = [
			[1n, 42n],
			[2n, 42n],
			[3n, 42n],
		];
		const modulus = 97n;
		const p = lagrangePolynomial(points, modulus);

		expect(p(0n)).toBe(42n);
		expect(p(4n)).toBe(42n);
		expect(p(5n)).toBe(42n);
	});

	it("should interpolate linear polynomial", () => {
		const points: [bigint, bigint][] = [
			[0n, 3n], // Points from 2x + 3
			[1n, 5n],
			[2n, 7n],
		];
		const modulus = 97n;
		const p = lagrangePolynomial(points, modulus);

		// Should reconstruct original polynomial
		expect(p(3n)).toBe(9n);
		expect(p(4n)).toBe(11n);
	});

	it("should interpolate quadratic polynomial", () => {
		const points: [bigint, bigint][] = [
			[0n, 1n], // Points from 3x^2 + 2x + 1
			[1n, 6n],
			[2n, 17n],
		];
		const modulus = 97n;
		const p = lagrangePolynomial(points, modulus);

		// Should reconstruct original polynomial
		expect(p(3n)).toBe(34n);
		expect(p(4n)).toBe(57n);
	});

	it("should work with modular arithmetic", () => {
		const points: [bigint, bigint][] = [
			[1n, 2n],
			[2n, 3n],
			[3n, 4n],
		];
		const modulus = 5n;
		const p = lagrangePolynomial(points, modulus);

		// Results should be properly reduced modulo 5
		expect(p(4n)).toBe(0n);
		expect(p(5n)).toBe(1n); // 5 ≡ 0 (mod 5), so this is like p(0)
	});

	it("manual should work", () => {
		const modulus = 5n;

		const f = (x: bigint) => {
			x = modulo(x, modulus);

			const q12 = (x - 2n) * modPow(modulo(1n - 2n, modulus), -1n, modulus);
			const q13 = (x - 3n) * modPow(modulo(1n - 3n, modulus), -1n, modulus);

			const b1 = modulo(2n * q12 * q13, modulus);

			const q21 = (x - 1n) * modPow(modulo(2n - 1n, modulus), -1n, modulus);
			const q23 = (x - 3n) * modPow(modulo(2n - 3n, modulus), -1n, modulus);

			const b2 = modulo(3n * q21 * q23, modulus);

			const q31 = (x - 1n) * modPow(modulo(3n - 1n, modulus), -1n, modulus);
			const q32 = (x - 2n) * modPow(modulo(3n - 2n, modulus), -1n, modulus);

			const b3 = modulo(4n * q31 * q32, modulus);

			return modulo(b1 + b2 + b3, modulus);
		};

		expect(f(4n)).toBe(0n);
		expect(f(5n)).toBe(1n); // 5 ≡ 0 (mod 5), so this is like p(0)
	});
});
