#! /usr/bin/env node
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
const yargs_1 = __importDefault(require("yargs"));
const helpers_1 = require("yargs/helpers");
const runSetPasswordScripts_1 = require("./runSetPasswordScripts");
const EncryptedEnv_1 = __importDefault(require("./EncryptedEnv"));
let encryptedEnv;
(0, yargs_1.default)((0, helpers_1.hideBin)(process.argv))
    .option('path', {
    alias: 'p',
    type: 'string',
    description: 'Path to encrypted env file',
})
    .command('set-pw', 'Sets the password to encrypt and decrypt the environment variable file', (yargs) => yargs, (args) => {
    (0, runSetPasswordScripts_1.runShellScriptInSameTerminal)();
})
    .command('view', 'Shows all currently saved variables in the encrypted environment variable file', (yargs) => yargs, (args) => __awaiter(void 0, void 0, void 0, function* () {
    encryptedEnv = new EncryptedEnv_1.default({ path: args.path });
    yield encryptedEnv.viewVars();
    process.exit(0);
}))
    .command('set', 'Saves new variables to the encrypted environment variable file', (yargs) => yargs, (args) => __awaiter(void 0, void 0, void 0, function* () {
    encryptedEnv = new EncryptedEnv_1.default({ path: args.path });
    yield encryptedEnv.setVars();
    process.exit(0);
}))
    .command('remove <name>', 'Removes a variable from the encrypted environment variable file', (yargs) => yargs.positional('name', {
    type: 'string',
    describe: 'Name of the environment variable to remove',
}), (args) => {
    if (!args.name || args.name.length === 0) {
        throw Error('Invalid command format. Expected "remove <name>"');
    }
    encryptedEnv = new EncryptedEnv_1.default({ path: args.path });
    encryptedEnv.removeVar(args.name);
    process.exit(0);
})
    .command('remove-all', 'Deletes the encrypted environment variable file', () => { }, (args) => {
    encryptedEnv = new EncryptedEnv_1.default({ path: args.path });
    encryptedEnv.removeAll();
    process.exit(0);
})
    .demandCommand(1, 'You must provide a valid command.')
    .help()
    .alias('h', 'help')
    .strict().argv;
