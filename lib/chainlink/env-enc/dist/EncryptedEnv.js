"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const os_1 = __importDefault(require("os"));
const crypto_1 = __importDefault(require("crypto"));
const readline_1 = __importDefault(require("readline"));
const stream_1 = require("stream");
class EncryptedEnv {
    constructor(options) {
        this.envVars = {};
        this.setVars = () => __awaiter(this, void 0, void 0, function* () {
            if (fs_1.default.existsSync(this.envPath) && !this.isFileEmpty(this.envPath)) {
                if (!this.readEnvEncFile()) {
                    return;
                }
            }
            else {
                if (!this.password) {
                    console.log(`Please set an encryption password by running: ${text.yellow}npx env-enc set-pw${text.reset}\n`);
                    return;
                }
            }
            const mutableStream = new stream_1.Writable({
                write: (chunk, encoding, callback) => {
                    process.stdout.write(chunk, encoding);
                    callback();
                },
            });
            let linesToClear = 0;
            let numVars = 0;
            while (true) {
                const prompt = readline_1.default.createInterface({
                    input: process.stdin,
                    output: mutableStream,
                });
                const name = yield new Promise((resolve) => {
                    prompt.question(`${text.yellow}${numVars > 0 ? 'Would you like to set another variable? ' : ''}Please enter the variable name (or press ${text.green}ENTER${text.yellow} to finish): \n${text.reset}`, (input) => {
                        resolve(input);
                    });
                });
                prompt.close();
                linesToClear += 2;
                if (name === '') {
                    for (let i = 0; i < linesToClear; i++) {
                        this.clearLine();
                    }
                    mutableStream.end();
                    return;
                }
                if (!this.isValidEnvVarName(name)) {
                    mutableStream.write(`${name} is an invalid name for an environment variable.\nVariable names must start with an underscore or upper-case character may only contain upper-case characters, underscores, and numbers.\n`);
                    linesToClear += 2;
                    continue;
                }
                const value = yield this.getHiddenInput(`${text.yellow}Please enter the variable value (input will be hidden): \n${text.reset}`);
                linesToClear += 2;
                this.envVars[name] = value;
                numVars += 1;
                this.writeEnvEncFile();
            }
        });
        this.removeVar = (name) => {
            if (!fs_1.default.existsSync(this.envPath)) {
                console.log(`Encrypted environment variable file ${text.yellow}${this.envPath}${text.reset} not found`);
                return;
            }
            if (!this.readEnvEncFile()) {
                return;
            }
            if (!this.envVars[name]) {
                console.log(`No saved variable with the name ${text.yellow}${name}${text.reset} was found`);
                return;
            }
            delete this.envVars[name];
            this.writeEnvEncFile();
        };
        this.removeAll = () => {
            if (!fs_1.default.existsSync(this.envPath)) {
                console.log(`Encrypted environment variable file ${text.yellow}${this.envPath}${text.reset} not found`);
                return;
            }
            fs_1.default.unlinkSync(this.envPath);
        };
        this.viewVars = () => __awaiter(this, void 0, void 0, function* () {
            if (!fs_1.default.existsSync(this.envPath)) {
                console.log(`Encrypted environment variable file ${text.yellow}${this.envPath}${text.reset} not found`);
                return;
            }
            if (!this.readEnvEncFile()) {
                return;
            }
            const mutableStream = new stream_1.Writable({
                write: (chunk, encoding, callback) => {
                    process.stdout.write(chunk, encoding);
                    callback();
                },
            });
            const prompt = readline_1.default.createInterface({
                input: process.stdin,
                output: mutableStream,
            });
            if (Object.keys(this.envVars).length === 0) {
                mutableStream.write(`There are currently no variables stored in ${text.yellow}${this.envPath}${text.reset}\n`);
                yield new Promise((resolve) => {
                    prompt.question(`${text.green}Press ENTER to continue${text.reset}`, resolve);
                });
                this.clearLine();
                this.clearLine();
                mutableStream.end();
                return;
            }
            mutableStream.write(`${text.underline}The following variables are encrypted and stored in ${text.yellow}${this.envPath}${text.reset}\n`);
            for (const name in this.envVars) {
                mutableStream.write(`${text.yellow}${name} = ${text.reset}${this.envVars[name]}\n`);
            }
            yield new Promise((resolve) => {
                prompt.question(`${text.green}Press ENTER to continue${text.reset}`, resolve);
            });
            for (let i = 0; i < Object.keys(this.envVars).length + 2; i++) {
                this.clearLine();
            }
            mutableStream.end();
        });
        this.load = () => {
            if (fs_1.default.existsSync(this.envPath) && this.readEnvEncFile()) {
                for (const name in this.envVars) {
                    process.env[name] = this.envVars[name];
                }
            }
        };
        this.resolveHome = (envPath) => {
            return envPath[0] === '~' ? path_1.default.join(os_1.default.homedir(), envPath.slice(1)) : envPath;
        };
        this.getHiddenInput = (promptText) => __awaiter(this, void 0, void 0, function* () {
            const hiddenStream = new stream_1.Writable({
                write: (_chunk, _encoding, callback) => {
                    callback();
                },
            });
            return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                const rl = readline_1.default.createInterface({
                    input: process.stdin,
                    output: hiddenStream,
                    terminal: true,
                });
                readline_1.default.emitKeypressEvents(process.stdin, rl);
                process.stdout.write(promptText);
                let input = '';
                const keypressHandler = (str, key) => __awaiter(this, void 0, void 0, function* () {
                    if (!str) {
                        return;
                    }
                    const keyCode = str.charCodeAt(0);
                    if (keyCode === 13) {
                        // Enter key
                        process.stdin.removeListener('keypress', keypressHandler);
                        process.stdout.write('\n');
                        rl.close();
                        resolve(input);
                    }
                    else if (keyCode === 8 || keyCode === 127) {
                        // Backspace key (8 on Windows, 127 on Unix systems)
                        if (input.length > 0) {
                            input = input.slice(0, -1);
                            process.stdout.write('\b \b'); // Move cursor back, write a space to overwrite, and move cursor back again
                        }
                    }
                    else {
                        input += str;
                        process.stdout.write('*'.repeat(str.length));
                    }
                });
                process.stdin.on('keypress', keypressHandler);
                process.stdin.setRawMode(true);
            }));
        });
        this.isFileEmpty = (path) => {
            return fs_1.default.readFileSync(path).toString().replace(/\s+/g, '').length === 0;
        };
        this.readEnvEncFile = () => {
            if (!this.password) {
                console.log(`Please set the encryption password by running: ${text.yellow}npx env-enc set-pw${text.reset}\nIf you do not know your password, delete the file ${text.yellow}${this.envPath}${text.reset} and set a new password. (Note: This will cause you to lose all encrypted variables.)\n`);
                return false;
            }
            try {
                const lines = fs_1.default.readFileSync(this.envPath).toString().split('\n');
                for (const line of lines) {
                    const sanitizedLine = line.replace(/[ \t]+/g, '');
                    if (sanitizedLine.length > 2) {
                        const [name, value] = sanitizedLine.split(':');
                        if (typeof name !== 'string' || typeof value !== 'string') {
                            throw Error('Invalid encrypted environment variable file format');
                        }
                        // Slice off "ENCRYPTED|" prefix
                        this.envVars[name] = this.decrypt(value.slice(10));
                    }
                }
            }
            catch (e) {
                console.log(`Error loading encrypted environment variables from file ${text.yellow}${this.envPath}${text.reset}.\nIf you do not know your password, delete the file ${text.yellow}${this.envPath}${text.reset} and set a new password. (Note: This will cause you to lose all encrypted variables.)\n${e}`);
                return false;
            }
            return true;
        };
        this.writeEnvEncFile = () => {
            const lines = [];
            for (const name in this.envVars) {
                lines.push(`${name}: ENCRYPTED|${this.encrypt(this.envVars[name])}`);
            }
            fs_1.default.writeFileSync(this.envPath, lines.join('\n'));
        };
        this.encrypt = (plaintext) => {
            // Generate a random salt and initialization vector (IV)
            const salt = crypto_1.default.randomBytes(16);
            const iv = crypto_1.default.randomBytes(16);
            // Derive a cryptographic key from the password using the salt
            const key = crypto_1.default.scryptSync(this.password, salt, 32);
            // Encrypt the plaintext using the key and IV
            const cipher = crypto_1.default.createCipheriv('aes-256-gcm', key, iv);
            const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
            const tag = cipher.getAuthTag();
            // Combine the encrypted data, IV, salt, and tag
            const encryptedData = Buffer.concat([salt, iv, tag, encrypted]).toString('base64');
            return encryptedData;
        };
        this.decrypt = (encrypted) => {
            // Decode the encrypted data and extract the salt, IV, tag, and encrypted text
            const dataBuffer = Buffer.from(encrypted, 'base64');
            const salt = dataBuffer.slice(0, 16);
            const iv = dataBuffer.slice(16, 32);
            const tag = dataBuffer.slice(32, 48);
            const encryptedText = dataBuffer.slice(48);
            // Derive the same cryptographic key using the password and salt
            const key = crypto_1.default.scryptSync(this.password, salt, 32);
            // Decrypt the encrypted text using the key, IV, and tag
            const decipher = crypto_1.default.createDecipheriv('aes-256-gcm', key, iv);
            decipher.setAuthTag(tag);
            const decrypted = Buffer.concat([decipher.update(encryptedText), decipher.final()]);
            return decrypted.toString('utf8');
        };
        this.isValidEnvVarName = (name) => {
            const regex = /^[A-Z_][A-Z0-9_]*$/;
            return regex.test(name);
        };
        this.clearLine = () => {
            // Move the cursor up by 1 line
            process.stdout.write('\x1b[1A');
            // Clear the current line
            process.stdout.write('\x1b[0K');
        };
        this.password = process.env['ENV_ENC_PASSWORD'];
        // Resolve file path if provided, else default to ".env.enc" in current working directory
        if (options === null || options === void 0 ? void 0 : options.path) {
            this.envPath = this.resolveHome(options.path);
        }
        else {
            this.envPath = path_1.default.resolve(process.cwd(), '.env.enc');
        }
    }
}
exports.default = EncryptedEnv;
const text = {
    reset: '\x1b[0m',
    underline: '\x1b[4m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
};
