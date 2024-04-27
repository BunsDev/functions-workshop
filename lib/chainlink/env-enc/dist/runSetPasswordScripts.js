"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runShellScriptInSameTerminal = void 0;
const child_process_1 = require("child_process");
const os_1 = __importDefault(require("os"));
const path_1 = __importDefault(require("path"));
const runShellScriptInSameTerminal = () => {
    let scriptPath, command, args;
    if (os_1.default.platform() === 'win32') {
        scriptPath = path_1.default.join(__dirname, 'scripts', 'setPassword.ps1');
        command = 'powershell.exe';
        args = ['-ExecutionPolicy', 'Unrestricted', '-NoLogo', '-File', scriptPath];
    }
    else if (isRunningInUnixTerminal()) {
        scriptPath = path_1.default.join(__dirname, 'scripts', 'setPassword.sh');
        command = 'bash';
        args = [scriptPath];
    }
    else {
        console.log('This script is designed to run in Unix terminal or PowerShell only.');
        return;
    }
    const child = (0, child_process_1.spawn)(command, args, { stdio: 'inherit' });
    child.on('error', (error) => {
        console.error(`Error executing the shell script: ${error.message}`);
    });
    child.on('exit', (code) => {
        console.log(`Shell script exited with code: ${code}`);
    });
};
exports.runShellScriptInSameTerminal = runShellScriptInSameTerminal;
const isRunningInUnixTerminal = () => {
    return ['aix', 'darwin', 'freebsd', 'linux', 'openbsd', 'sunos'].includes(os_1.default.platform());
};
