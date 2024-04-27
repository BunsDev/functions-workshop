"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FunctionsModule = void 0;
const axios_1 = __importDefault(require("axios"));
const safePow_1 = require("./safePow");
class FunctionsModule {
    buildFunctionsmodule = (numAllowedQueries) => {
        return {
            makeHttpRequest: this.makeHttpRequestFactory(numAllowedQueries),
            encodeUint256: FunctionsModule.encodeUint256,
            encodeInt256: FunctionsModule.encodeInt256,
            encodeString: FunctionsModule.encodeString,
        };
    };
    makeHttpRequestFactory = (maxHttpRequests) => {
        let totalHttpRequests = 0;
        return async ({ url, method = 'get', params, headers, data, timeout = 5000, responseType = 'json', }) => {
            if (totalHttpRequests < maxHttpRequests) {
                totalHttpRequests++;
                let result;
                if (timeout > 9000) {
                    throw Error('HTTP request timeout >9000');
                }
                if (url.length > 2048) {
                    throw Error('HTTP request URL length >2048');
                }
                try {
                    result = (await (0, axios_1.default)({
                        method: method.toLowerCase(),
                        url,
                        params,
                        headers,
                        data,
                        timeout,
                        responseType,
                        maxBodyLength: 2000,
                        maxContentLength: 2000000, // Max response size: 2 megabytes
                    }));
                    delete result.request;
                    delete result.config;
                    result.error = false;
                    return result;
                }
                catch (untypedError) {
                    const error = untypedError;
                    delete error.request;
                    delete error.config;
                    if (error.response) {
                        delete error.response.request;
                    }
                    error.error = true;
                    return error;
                }
            }
            throw Error('exceeded numAllowedQueries');
        };
    };
    static encodeUint256 = (result) => {
        if (typeof result === 'number') {
            if (!Number.isInteger(result)) {
                throw Error('encodeUint256 invalid input');
            }
            if (result < 0) {
                throw Error('encodeUint256 invalid input');
            }
            return FunctionsModule.encodeUint256(BigInt(result));
        }
        if (typeof result === 'bigint') {
            if (result > FunctionsModule.maxUint256) {
                throw Error('encodeUint256 invalid input');
            }
            if (result < BigInt(0)) {
                throw Error('encodeUint256 invalid input');
            }
            if (result === BigInt(0)) {
                return Buffer.from('0000000000000000000000000000000000000000000000000000000000000000', 'hex');
            }
            const hex = result.toString(16).padStart(64, '0');
            return Buffer.from(hex, 'hex');
        }
        throw Error('encodeUint256 invalid input');
    };
    static encodeInt256 = (result) => {
        if (typeof result === 'number') {
            if (!Number.isInteger(result)) {
                throw Error('encodeInt256 invalid input');
            }
            return FunctionsModule.encodeInt256(BigInt(result));
        }
        if (typeof result !== 'bigint') {
            throw Error('encodeInt256 invalid input');
        }
        if (result < FunctionsModule.maxNegInt256) {
            throw Error('encodeInt256 invalid input');
        }
        if (result > FunctionsModule.maxPosInt256) {
            throw Error('encodeInt256 invalid input');
        }
        if (result < BigInt(0)) {
            return FunctionsModule.encodeNegSignedInt(result);
        }
        return FunctionsModule.encodePosSignedInt(result);
    };
    static encodeString = (result) => {
        if (typeof result !== 'string') {
            throw Error('encodeString invalid input');
        }
        return Buffer.from(result);
    };
    static encodePosSignedInt = (int) => {
        const hex = int.toString(16).padStart(64, '0');
        return Buffer.from(hex, 'hex');
    };
    static encodeNegSignedInt = (int) => {
        const overflowing = (0, safePow_1.safePow)(BigInt(2), BigInt(256)) + int;
        const overflowingHex = overflowing.toString(16);
        const int256Hex = overflowingHex.slice(-64);
        return Buffer.from(int256Hex, 'hex');
    };
    static maxUint256 = BigInt('115792089237316195423570985008687907853269984665640564039457584007913129639935');
    static maxPosInt256 = BigInt('57896044618658097711785492504343953926634992332820282019728792003956564819967');
    static maxNegInt256 = BigInt('-57896044618658097711785492504343953926634992332820282019728792003956564819968');
}
exports.FunctionsModule = FunctionsModule;
