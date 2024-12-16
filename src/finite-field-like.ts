// This file consists of functions that attempt to mimic finite fields.
//
// That said, these functions are 100% compatible with finite fields; in fact
// they are intended to work entirely with finite fields. However, the supplied
// modulus is not going to be checked for primality, so you should be careful.

import { modPow, modulo } from "./bigint-math";

/**
 * Creates a polynomial from a list of coefficients.
 *
 * @param coefficients - The coefficients of the polynomial.
 * @returns The polynomial function.
 */
export const polynomial =
	(coefficients: bigint[], modulus: bigint) => (x: bigint) =>
		modulo(
			coefficients
				.map((coefficient, index) =>
					modulo(modulo(coefficient, modulus) * x ** BigInt(index), modulus)
				)
				.reduce((a, b) => modulo(a + b, modulus)),
			modulus
		);

/**
 * Creates a Lagrange interpolation polynomial from a set of points.
 *
 * The Lagrange interpolation polynomial is a polynomial of minimal degree that
 * passes through all given points. This implementation works in a finite field
 * with the given modulus.
 *
 * @param points - An array of [x,y] coordinate pairs representing points to
 *     interpolate
 * @param modulus - The modulus defining the finite field
 * @returns A function representing the interpolated polynomial that takes x and
 *     returns y
 */
export const lagrangePolynomial = (
	points: [bigint, bigint][],
	modulus: bigint
) => {
	const lagrangeBases = points.map(
		([xi, yi], i) =>
			(x: bigint) =>
				points.reduce((product, [xj], j) => {
					if (i === j) return product;
					const numerator = modulo(x - xj, modulus);
					const denominator = modPow(modulo(xi - xj, modulus), -1n, modulus);
					return modulo(product * numerator * denominator, modulus);
				}, yi)
	);

	return (x: bigint) =>
		modulo(
			lagrangeBases.reduce((sum, basis) => modulo(sum + basis(x), modulus), 0n),
			modulus
		);
};
