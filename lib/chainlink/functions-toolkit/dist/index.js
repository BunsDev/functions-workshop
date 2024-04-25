"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
const oldLog = console.log;
// Suppress "Duplicate definition of Transfer" warning message
// eslint-disable-next-line @typescript-eslint/no-explicit-any
console.log = (...args) => {
    if (typeof args[0] === 'string') {
        const msg = args.length > 0 ? args[0] : '';
        if (msg.includes('Duplicate definition of Transfer') ||
            msg.includes('secp256k1 unavailable, reverting to browser version')) {
            return;
        }
    }
    oldLog(...args);
};
__exportStar(require("./SubscriptionManager"), exports);
__exportStar(require("./SecretsManager"), exports);
__exportStar(require("./ResponseListener"), exports);
__exportStar(require("./simulateScript"), exports);
__exportStar(require("./localFunctionsTestnet"), exports);
__exportStar(require("./decodeResult"), exports);
__exportStar(require("./offchain_storage"), exports);
__exportStar(require("./types"), exports);
__exportStar(require("./buildRequestCBOR"), exports);
__exportStar(require("./simulationConfig"), exports);
__exportStar(require("./fetchRequestCommitment"), exports);
