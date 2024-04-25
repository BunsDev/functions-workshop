"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FulfillmentCode = exports.ReturnType = exports.CodeLanguage = exports.Location = void 0;
var Location;
(function (Location) {
    Location[Location["Inline"] = 0] = "Inline";
    Location[Location["Remote"] = 1] = "Remote";
    Location[Location["DONHosted"] = 2] = "DONHosted";
})(Location = exports.Location || (exports.Location = {}));
var CodeLanguage;
(function (CodeLanguage) {
    CodeLanguage[CodeLanguage["JavaScript"] = 0] = "JavaScript";
})(CodeLanguage = exports.CodeLanguage || (exports.CodeLanguage = {}));
var ReturnType;
(function (ReturnType) {
    ReturnType["uint"] = "uint256";
    // eslint-disable-next-line @typescript-eslint/no-duplicate-enum-values
    ReturnType["uint256"] = "uint256";
    ReturnType["int"] = "int256";
    // eslint-disable-next-line @typescript-eslint/no-duplicate-enum-values
    ReturnType["int256"] = "int256";
    ReturnType["string"] = "string";
    ReturnType["bytes"] = "bytes";
})(ReturnType = exports.ReturnType || (exports.ReturnType = {}));
var FulfillmentCode;
(function (FulfillmentCode) {
    FulfillmentCode[FulfillmentCode["FULFILLED"] = 0] = "FULFILLED";
    FulfillmentCode[FulfillmentCode["USER_CALLBACK_ERROR"] = 1] = "USER_CALLBACK_ERROR";
    FulfillmentCode[FulfillmentCode["INVALID_REQUEST_ID"] = 2] = "INVALID_REQUEST_ID";
    FulfillmentCode[FulfillmentCode["COST_EXCEEDS_COMMITMENT"] = 3] = "COST_EXCEEDS_COMMITMENT";
    FulfillmentCode[FulfillmentCode["INSUFFICIENT_GAS_PROVIDED"] = 4] = "INSUFFICIENT_GAS_PROVIDED";
    FulfillmentCode[FulfillmentCode["SUBSCRIPTION_BALANCE_INVARIANT_VIOLATION"] = 5] = "SUBSCRIPTION_BALANCE_INVARIANT_VIOLATION";
    FulfillmentCode[FulfillmentCode["INVALID_COMMITMENT"] = 6] = "INVALID_COMMITMENT";
})(FulfillmentCode = exports.FulfillmentCode || (exports.FulfillmentCode = {}));
