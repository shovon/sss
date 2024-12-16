import { extendedGcd, modPow } from "./bigint-math";

describe("extendedGcd", () => {
	it("should calculate GCD and Bézout's identity coefficients for coprime numbers", () => {
		const { gcd, x, y } = extendedGcd(15n, 8n);
		expect(gcd).toBe(1n);
		// Verify that 15x + 8y = gcd
		expect(15n * x + 8n * y).toBe(1n);
	});
});

it("should calculate GCD and coefficients for numbers with common factors", () => {
	const { gcd, x, y } = extendedGcd(48n, 18n);
	expect(gcd).toBe(6n);
	// Verify that 48x + 18y = gcd
	expect(48n * x + 18n * y).toBe(6n);
});

it("should handle when first number is zero", () => {
	const { gcd, x, y } = extendedGcd(0n, 5n);
	expect(gcd).toBe(5n);
	expect(x).toBe(0n);
	expect(y).toBe(1n);
});

it("should handle when second number is zero", () => {
	const { gcd, x, y } = extendedGcd(5n, 0n);
	expect(gcd).toBe(5n);
	expect(x).toBe(1n);
	expect(y).toBe(0n);
});

it("should work with large numbers", () => {
	const a = 123456789n;
	const b = 987654321n;
	const { gcd, x, y } = extendedGcd(a, b);
	expect(a * x + b * y).toBe(gcd);
});

describe("modPow with negative exponents", () => {
	it("should compute multiplicative inverse in finite field", () => {
		const base = 3n;
		const modulus = 7n;
		// 3 * 5 ≡ 1 (mod 7), so 5 is the multiplicative inverse of 3
		expect(modPow(base, -1n, modulus)).toBe(5n);
		// Verify it works by multiplying
		expect((base * modPow(base, -1n, modulus)) % modulus).toBe(1n);
	});

	it("should work with larger numbers", () => {
		const base = 123n;
		const modulus = 997n; // prime number
		const inverse = modPow(base, -1n, modulus);
		// Verify inverse property
		expect((base * inverse) % modulus).toBe(1n);
	});

	it("should handle other negative exponents", () => {
		const base = 2n;
		const modulus = 11n;
		// 2^(-2) ≡ (2^(-1))^2 (mod 11)
		const inverseSquared = modPow(base, -2n, modulus);
		const inverse = modPow(base, -1n, modulus);
		expect((inverseSquared - ((inverse * inverse) % modulus)) % modulus).toBe(
			0n
		);
	});
});
