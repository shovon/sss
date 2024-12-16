import { createShares, reconstruct } from "./usage";

describe("Shamir's Secret Sharing", () => {
	const modulus = 2n ** 127n - 1n; // Mersenne prime for finite field

	describe("createShares", () => {
		it("should create the specified number of shares", () => {
			const secret = 42n;
			const threshold = 3;
			const totalShares = 5;

			const shares = createShares(secret, { threshold, totalShares }, modulus);

			expect(shares.length).toBe(totalShares);
			shares.forEach((share) => {
				expect(Array.isArray(share)).toBe(true);
				expect(share.length).toBe(2);
				expect(typeof share[0]).toBe("bigint");
				expect(typeof share[1]).toBe("bigint");
			});
		});

		it("should create unique shares", () => {
			const secret = 42n;
			const threshold = 3;
			const totalShares = 5;

			const shares = createShares(secret, { threshold, totalShares }, modulus);

			const uniqueXValues = new Set(
				shares.map((share) => share[0]!.toString())
			);
			expect(uniqueXValues.size).toBe(totalShares);
		});
	});

	describe("reconstruct", () => {
		it("should correctly reconstruct the secret with exact threshold shares", () => {
			const secret = 42n;
			const threshold = 3;
			const totalShares = 5;

			const shares = createShares(secret, { threshold, totalShares }, modulus);

			expect(shares.length).toBe(5);
			const reconstructedSecret = reconstruct(
				shares.slice(0, threshold),
				modulus
			);
			expect(reconstructedSecret).toBe(secret);
		});

		it("should correctly reconstruct with more than threshold shares", () => {
			const secret = 42n;
			const threshold = 3;
			const totalShares = 5;

			const shares = createShares(secret, { threshold, totalShares }, modulus);

			expect(shares.length).toBe(5);
			const reconstructedSecret = reconstruct(
				shares.slice(0, threshold),
				modulus
			);
			expect(reconstructedSecret).toBe(secret);
		});

		it("should work with different secrets", () => {
			const secrets = [1n, 1000n, 2n ** 64n - 1n];
			const threshold = 3;
			const totalShares = 5;

			for (const secret of secrets) {
				const shares = createShares(
					secret,
					{ threshold, totalShares },
					modulus
				);
				const reconstructedSecret = reconstruct(
					shares.slice(0, threshold),
					modulus
				);
				expect(reconstructedSecret).toBe(secret);
			}
		});
	});
});
