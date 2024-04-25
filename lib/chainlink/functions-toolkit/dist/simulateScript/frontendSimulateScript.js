"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.simulateScript = void 0;
const vm_1 = __importDefault(require("vm"));
const Functions_1 = require("./Functions");
const frontendAllowedModules_1 = require("./frontendAllowedModules");
const DEFAULT_MAX_HTTP_REQUESTS = 5;
const DEFAULT_MAX_RESPONSE_BYTES = 256;
const DEFAULT_MAX_EXECUTION_DURATION_MS = 10000;
const allowedGlobalObjectsAndFunctions = {
    Buffer,
    URL,
    Date,
    Object,
    Array,
    Function,
    String,
    Number,
    Boolean,
    RegExp,
    Math,
    JSON,
    Promise,
    Map,
    Set,
    WeakMap,
    WeakSet,
    Proxy,
    Reflect,
    Symbol,
    BigInt,
};
// This function has been deprecated, but is currently used by the Functions Playground frontend
const simulateScript = async ({ source, secrets, args, maxHttpRequests = DEFAULT_MAX_HTTP_REQUESTS, maxResponseBytes = DEFAULT_MAX_RESPONSE_BYTES, maxExecutionDurationMs = DEFAULT_MAX_EXECUTION_DURATION_MS, }) => {
    try {
        validateInput({ source, args, secrets });
    }
    catch (error) {
        return {
            error: Error(`${error}`),
        };
    }
    const functionsModule = new Functions_1.FunctionsModule();
    const Functions = functionsModule.buildFunctionsmodule(maxHttpRequests);
    let capturedStdout = '';
    const sandbox = {
        args,
        secrets,
        Functions,
        require: frontendAllowedModules_1.safeRequire,
        eval: () => {
            throw Error('eval not allowed');
        },
        console: {
            ...console,
            log: (...args) => {
                const message = args.map(arg => `${arg}`).join(' ');
                capturedStdout += message + '\n';
            },
        },
        ...allowedGlobalObjectsAndFunctions,
    };
    let result;
    try {
        const startTime = Date.now();
        result = getValidOutput(await vm_1.default.runInNewContext(`(async () => {\n${source}\n})()`, sandbox), maxResponseBytes);
        const totalTime = Date.now() - startTime;
        if (totalTime > maxExecutionDurationMs) {
            throw Error(`Execution time exceeded\nScript took ${totalTime}ms to complete but must be completed within ${maxExecutionDurationMs}ms`);
        }
    }
    catch (error) {
        return { error: Error(`${error}`), capturedStdout };
    }
    return {
        result: result,
        capturedStdout,
    };
};
exports.simulateScript = simulateScript;
const validateInput = ({ secrets, args, source, }) => {
    if (typeof source !== 'string') {
        throw Error('Invalid source code');
    }
    if (args) {
        if (!Array.isArray(args)) {
            throw Error('Invalid args');
        }
        for (const arg of args) {
            if (typeof arg !== 'string') {
                throw Error('Invalid args');
            }
        }
    }
    if (secrets &&
        (typeof secrets !== 'object' ||
            !Object.values(secrets).every(s => {
                return typeof s === 'string';
            }))) {
        throw Error('secrets param not a string map');
    }
};
const getValidOutput = (sandboxOutput, maxResponseBytes) => {
    if (Buffer.isBuffer(sandboxOutput)) {
        if (sandboxOutput.length > maxResponseBytes) {
            throw Error(`returned Buffer >${maxResponseBytes} bytes`);
        }
        if (sandboxOutput.length === 0) {
            return '0x0';
        }
        return `0x${sandboxOutput.toString('hex')}`;
    }
    throw Error('returned value not a Buffer');
};
