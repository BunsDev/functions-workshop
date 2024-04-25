"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeResult = void 0;
const types_1 = require("./types");
const decodeResult = (resultHexstring, expectedReturnType) => {
    if (!isValidHexadecimal(resultHexstring) && resultHexstring.slice(0, 2) !== '0x') {
        throw Error(`'${resultHexstring}' is not a valid hexadecimal string`);
    }
    expectedReturnType = expectedReturnType.toLowerCase();
    if (!Object.values(types_1.ReturnType).includes(expectedReturnType)) {
        throw Error(`'${expectedReturnType}' is not valid.  Must be one of the following: ${Object.values(types_1.ReturnType)}`);
    }
    const resultHexBits = resultHexstring.slice(2).length * 4;
    let decodedOutput;
    switch (expectedReturnType) {
        case types_1.ReturnType.uint256:
            if (resultHexBits > 256) {
                throw Error(`'${resultHexstring}' has '${resultHexBits}' bits which is too large for uint256`);
            }
            if (resultHexstring === '0x') {
                return BigInt(0);
            }
            decodedOutput = BigInt('0x' + resultHexstring.slice(2).slice(-64));
            break;
        case types_1.ReturnType.int256:
            if (resultHexBits > 256) {
                throw Error(`'${resultHexstring}' has '${resultHexBits}' bits which is too large for int256`);
            }
            if (resultHexstring === '0x') {
                return BigInt(0);
            }
            decodedOutput = signedInt256toBigInt('0x' + resultHexstring.slice(2).slice(-64));
            break;
        case types_1.ReturnType.string:
            if (resultHexstring === '0x') {
                return '';
            }
            decodedOutput = Buffer.from(resultHexstring.slice(2), 'hex').toString();
            break;
        case types_1.ReturnType.bytes:
            decodedOutput = resultHexstring;
            break;
        default:
            throw new Error(`unexpected return type to decode: '${expectedReturnType}'.`);
    }
    return decodedOutput;
};
exports.decodeResult = decodeResult;
const signedInt256toBigInt = (hex) => {
    const binary = BigInt(hex).toString(2).padStart(256, '0');
    // if the first bit is 0, number is positive
    if (binary[0] === '0') {
        return BigInt(hex);
    }
    return -(BigInt(2) ** BigInt(255)) + BigInt(`0b${binary.slice(1)}`);
};
const isValidHexadecimal = (str) => {
    const regex = /^0x[0-9a-fA-F]+$/;
    return regex.test(str);
};
