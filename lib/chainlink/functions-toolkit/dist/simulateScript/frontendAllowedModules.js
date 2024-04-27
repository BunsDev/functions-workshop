"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.safeRequire = void 0;
const exhaustiveCheck = (module) => {
    throw Error(`Import of module ${module} not allowed`);
};
const safeRequire = (module) => {
    switch (module) {
        case 'buffer':
            return require('buffer');
        case 'crypto':
            return require('crypto');
        case 'querystring':
            return require('querystring');
        case 'string_decoder':
            return require('string_decoder');
        case 'url':
            return require('url');
        case 'util':
            return require('util');
        default:
            exhaustiveCheck(module);
    }
};
exports.safeRequire = safeRequire;
