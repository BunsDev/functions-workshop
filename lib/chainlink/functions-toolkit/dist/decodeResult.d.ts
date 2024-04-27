import { ReturnType } from './types';
export type DecodedResult = bigint | string;
export declare const decodeResult: (resultHexstring: string, expectedReturnType: ReturnType) => DecodedResult;
