export default class EncryptedEnv {
    private password?;
    private envPath;
    private envVars;
    constructor(options?: {
        path?: string;
    });
    setVars: () => Promise<void>;
    removeVar: (name: string) => void;
    removeAll: () => void;
    viewVars: () => Promise<void>;
    load: () => void;
    private resolveHome;
    private getHiddenInput;
    private isFileEmpty;
    private readEnvEncFile;
    private writeEnvEncFile;
    private encrypt;
    private decrypt;
    private isValidEnvVarName;
    private clearLine;
}
