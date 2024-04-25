export type AllowedModules = 'buffer' | 'crypto' | 'querystring' | 'string_decoder' | 'url' | 'util';
export declare const safeRequire: (module: AllowedModules) => void;
