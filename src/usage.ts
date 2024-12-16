import { random } from "./bigint-math";
import { lagrangePolynomial, polynomial } from "./finite-field-like";

/**
 * Creates shares for a secret using Shamir's Secret Sharing scheme.
 *
 * This implementation works in a finite field with the given modulus. It creates
 * a random polynomial of degree (threshold-1) where the constant term is the secret,
 * and evaluates it at random points to create the shares.
 *
 * @param secret - The secret to be shared, represented as a bigint
 * @param options - Configuration object containing:
 *   @param options.threshold - Minimum number of shares needed to reconstruct the secret
 *   @param options.totalShares - Total number of shares to generate
 * @param modulus - The modulus defining the finite field (should be prime)
 * @returns An array of [x,y] coordinate pairs representing the shares
 */
export const createShares = (
	secret: bigint,
	{ threshold, totalShares }: { threshold: number; totalShares: number },
	modulus: bigint
): [bigint, bigint][] => {
	const p = polynomial(
		[
			secret,
			...Array.from({ length: threshold - 1 }, () => random(2n, modulus - 1n)),
		],
		modulus
	);
	return Array.from({ length: totalShares }, () =>
		random(2n, modulus - 1n)
	).map((x) => [x, p(x)]);
};

/**
 * Reconstructs a secret from shares using Lagrange interpolation.
 *
 * Given enough shares (at least threshold number), this function will reconstruct
 * the original secret by evaluating the Lagrange interpolation polynomial at x=0.
 * The reconstruction happens in a finite field defined by the given modulus.
 *
 * @param points - An array of [x,y] coordinate pairs representing the shares
 * @param modulus - The modulus defining the finite field (should be prime)
 * @returns The reconstructed secret as a bigint
 */
export const reconstruct = (points: [bigint, bigint][], modulus: bigint) =>
	lagrangePolynomial(points, modulus)(0n);
