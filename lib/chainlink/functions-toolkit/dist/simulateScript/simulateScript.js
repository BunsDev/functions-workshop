"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.simulateScript = void 0;
const child_process_1 = require("child_process");
const fs_1 = __importDefault(require("fs"));
const os_1 = __importDefault(require("os"));
const path_1 = __importDefault(require("path"));
const simulationConfig_1 = require("../simulationConfig");
const simulateScript = async ({ source, secrets, args, bytesArgs, maxOnChainResponseBytes = simulationConfig_1.DEFAULT_MAX_ON_CHAIN_RESPONSE_BYTES, maxExecutionTimeMs = simulationConfig_1.DEFAULT_MAX_EXECUTION_DURATION_MS, maxMemoryUsageMb = simulationConfig_1.DEFAULT_MAX_MEMORY_USAGE_MB, numAllowedQueries = simulationConfig_1.DEFAULT_MAX_HTTP_REQUESTS, maxQueryDurationMs = simulationConfig_1.DEFAULT_MAX_HTTP_REQUEST_DURATION_MS, maxQueryUrlLength = simulationConfig_1.DEFAULT_MAX_HTTP_REQUEST_URL_LENGTH, maxQueryRequestBytes = simulationConfig_1.DEFAULT_MAX_HTTP_REQUEST_BYTES, maxQueryResponseBytes = simulationConfig_1.DEFAULT_MAX_HTTP_RESPONSE_BYTES, }) => {
    if (typeof source !== 'string') {
        throw Error('source param is missing or invalid');
    }
    if (secrets &&
        (typeof secrets !== 'object' ||
            !Object.values(secrets).every(s => {
                return typeof s === 'string';
            }))) {
        throw Error('secrets param not a string map');
    }
    if (args) {
        if (!Array.isArray(args)) {
            throw Error('args param not an array');
        }
        for (const arg of args) {
            if (typeof arg !== 'string') {
                throw Error('args param not a string array');
            }
        }
    }
    if (bytesArgs) {
        if (!Array.isArray(bytesArgs)) {
            throw Error('bytesArgs param not an array');
        }
        for (const arg of bytesArgs) {
            if (typeof arg !== 'string' || !/^0x[0-9A-Fa-f]+$/.test(arg)) {
                throw Error('bytesArgs param contains invalid hex string');
            }
        }
    }
    // Check if deno is installed
    try {
        (0, child_process_1.execSync)('deno --version', { stdio: 'pipe' });
    }
    catch {
        throw Error('Deno must be installed and accessible via the PATH environment variable (ie: the `deno --version` command must work).\nVisit https://deno.land/#installation for installation instructions.');
    }
    const scriptPath = createScriptTempFile(source);
    const simulation = (0, child_process_1.spawn)('deno', [
        'run',
        '--no-prompt',
        `--v8-flags=--max-old-space-size=${maxMemoryUsageMb}`,
        '--allow-net',
        scriptPath,
        Buffer.from(JSON.stringify(secrets ?? {})).toString('base64'),
        Buffer.from(JSON.stringify(args ?? {})).toString('base64'),
        Buffer.from(JSON.stringify(bytesArgs ?? {})).toString('base64'),
        numAllowedQueries.toString(),
        maxQueryDurationMs.toString(),
        maxQueryUrlLength.toString(),
        maxQueryRequestBytes.toString(),
        maxQueryResponseBytes.toString(),
    ]);
    const timeout = setTimeout(() => {
        simulation.kill('SIGKILL');
    }, maxExecutionTimeMs);
    const simulationComplete = new Promise(resolve => {
        simulation.on('exit', (code, signal) => {
            clearTimeout(timeout);
            resolve({ code, signal });
        });
    });
    let output = '';
    simulation.stdout.on('data', (data) => {
        output += data.toString();
    });
    simulation.stderr.on('data', (data) => {
        output += data.toString();
    });
    const { code, signal } = await simulationComplete;
    try {
        fs_1.default.rmSync(scriptPath);
    }
    catch {
        // The temp file may have already been deleted
    }
    let capturedTerminalOutput;
    let parsedOutput = {};
    try {
        const outputArr = output.toString().split('\n');
        const finalLine = outputArr[outputArr.length - 2];
        parsedOutput = JSON.parse(finalLine);
        capturedTerminalOutput = outputArr.slice(0, -2).join('\n');
    }
    catch {
        capturedTerminalOutput = output;
    }
    const simulationResult = {
        capturedTerminalOutput,
    };
    if (parsedOutput.success) {
        simulationResult.responseBytesHexstring = parsedOutput.success;
        if ((simulationResult.responseBytesHexstring.length - 2) / 2 > maxOnChainResponseBytes) {
            simulationResult.errorString = `response >${maxOnChainResponseBytes} bytes`;
            delete simulationResult.responseBytesHexstring;
        }
        return simulationResult;
    }
    if (parsedOutput.error) {
        simulationResult.errorString = parsedOutput.error.message;
        if (parsedOutput.error?.name === 'PermissionDenied') {
            simulationResult.errorString = 'attempted access to blocked resource detected';
        }
        return simulationResult;
    }
    if (signal === 'SIGKILL') {
        simulationResult.errorString = 'script runtime exceeded';
        return simulationResult;
    }
    if (code !== 0) {
        simulationResult.errorString = 'syntax error, RAM exceeded, or other error';
        return simulationResult;
    }
    return simulationResult;
};
exports.simulateScript = simulateScript;
const createScriptTempFile = (source) => {
    const tmpDir = os_1.default.tmpdir();
    const sandboxText = fs_1.default.readFileSync(path_1.default.join(__dirname, '/deno-sandbox/sandbox.ts'), 'utf8');
    const script = sandboxText.replace('//INJECT_USER_CODE_HERE', source);
    const tmpFilePath = path_1.default.join(tmpDir, `FunctionsScript-${Date.now()}.ts`);
    fs_1.default.writeFileSync(tmpFilePath, script);
    return tmpFilePath;
};
