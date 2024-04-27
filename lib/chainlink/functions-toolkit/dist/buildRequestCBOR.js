"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildRequestCBOR = void 0;
const cbor_1 = __importDefault(require("cbor"));
const ethers_1 = require("ethers");
const types_1 = require("./types");
const buildRequestCBOR = (requestParams) => {
    if (typeof requestParams.codeLocation !== 'number' ||
        requestParams.codeLocation !== types_1.Location.Inline) {
        throw Error('Invalid codeLocation');
    }
    if (typeof requestParams.codeLanguage !== 'number' ||
        requestParams.codeLanguage !== types_1.CodeLanguage.JavaScript) {
        throw Error('Invalid codeLanguage');
    }
    if (typeof requestParams.source !== 'string') {
        throw Error('Invalid source');
    }
    const request = {
        codeLocation: requestParams.codeLocation,
        codeLanguage: requestParams.codeLanguage,
        source: requestParams.source,
    };
    if (requestParams.encryptedSecretsReference) {
        if (!ethers_1.utils.isHexString(requestParams.encryptedSecretsReference)) {
            throw Error('Invalid encryptedSecretsReference');
        }
        if (typeof requestParams.secretsLocation !== 'number' ||
            (requestParams.secretsLocation !== types_1.Location.DONHosted &&
                requestParams.secretsLocation !== types_1.Location.Remote)) {
            throw Error('Invalid secretsLocation');
        }
        request.secretsLocation = requestParams.secretsLocation;
        request.secrets = Buffer.from(requestParams.encryptedSecretsReference.slice(2), 'hex');
    }
    if (requestParams.args) {
        if (!Array.isArray(requestParams.args) ||
            !requestParams.args.every(arg => typeof arg === 'string')) {
            throw Error('Invalid args');
        }
        request.args = requestParams.args;
    }
    if (requestParams.bytesArgs) {
        if (!Array.isArray(requestParams.bytesArgs) ||
            !requestParams.bytesArgs.every(arg => ethers_1.utils.isHexString(arg))) {
            throw Error('Invalid bytesArgs');
        }
        request.bytesArgs = requestParams.bytesArgs.map(arg => Buffer.from(arg.slice(2), 'hex'));
    }
    return '0x' + cbor_1.default.encodeCanonical(request).toString('hex');
};
exports.buildRequestCBOR = buildRequestCBOR;
