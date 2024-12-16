

/**
 * Computes the modulo of a number, such that the result is always positive.
 *
 * @param a - The number to compute the modulo of.
 * @param b - The modulus to compute the modulo of.
 * @returns The modulo of a and b.
 */
export const modulo = (a: bigint, b: bigint): bigint => ((a % b) + b) % b;

/**
 * Computes the extended euclidean algorithm, such that ax + by = gcd(a, b).
 *
 * Since we know what a and b are, then we're just returning the x and y values.
 *
 * Do note: this does not happen modulo anything.
 *
 * You are responsible for using this appropriately, such as computing the
 * modulo some prime, to compute the multiplicative inverse in some prime field.
 *
 * @param a - The first number.
 * @param b - The second number.
 * @returns The x and y values such that ax + by = gcd(a, b).
 */
const extendedGcd = (a: bigint, b: bigint): { x: bigint; y: bigint } => {
	if (a === 0n) return { x: 1n, y: 1n };
	const { x: x1, y: y1 } = extendedGcd(b % a, a);
	return { x: y1 - (b / a) * x1, y: x1 };
};

/**
 * Computes the modulo of a number, such that the result is always positive.
 *
 * @param base - The base to compute the modulo of.
 * @param exponent - The exponent to compute the modulo of.
 * @param modulus - The modulus to compute the modulo of.
 * @returns The modulo of base and exponent.
 */
export const modPow = (
	base: bigint,
	exponent: bigint,
	modulus: bigint
): bigint => {
	if (exponent === 0n) return 1n;
	if (exponent < 1n)
		return modPow(
			modulo(extendedGcd(base, modulus).x, modulus),
			-exponent,
			modulus
		);

	return base ** exponent % modulus;
};

/**
 * Represents a polynomial, where the index represents the power of x.
 *
 * In other words, the first element is the constant term.
 */
type Polynomial = bigint[];

/**
 * Creates a polynomial from a list of coefficients.
 *
 * @param coefficients - The coefficients of the polynomial.
 * @returns The polynomial function.
 */
const polynomial = (coefficients: Polynomial) => (x: bigint) =>
	coefficients
		.map((coefficient, index) => coefficient * x ** BigInt(index))
		.reduce((a, b) => a + b, 0n);


const random = (a: bigint, b: bigint) => {
  if (a > b) return random(b, a);
	if (a < 0n || b < 0n) throw new Error('Range must be positive');

  const range = b - a + 1n; // Calculate the range
  const bitLength = range.toString(2).length; // Number of bits needed
  const byteLength = Math.ceil(bitLength / 8); // Bytes needed
  
  let randomValue;
  do {
    // Generate a random BigInt of the correct length
    const randomBytes = new Uint8Array(byteLength);
    crypto.getRandomValues(randomBytes);
    
    // Convert bytes to a BigInt
    randomValue = BigInt(
			'0x' + [...randomBytes]
				.map(b => b.toString(16).padStart(2, '0')).join('')
		);
    
    // Truncate to fit the bit length
    randomValue = randomValue & ((1n << BigInt(bitLength)) - 1n);
  } while (randomValue >= range); // Ensure it's within range

  return randomValue + a; // Map to the desired range
}
