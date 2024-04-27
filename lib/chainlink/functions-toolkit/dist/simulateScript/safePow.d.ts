/**
 * safePow performs exponentiation with BigInts in browser safe mode as opposed to:
 * - `Math.pow`, which doesn't currently support BigInts.
 * - `**` operator which might get transpiled to Math.pow by browser VM or build tools like swc.
 *
 * Method supports integer numbers and bigints.
 */
export declare const safePow: (base: bigint | number, exponent: bigint | number) => bigint;
