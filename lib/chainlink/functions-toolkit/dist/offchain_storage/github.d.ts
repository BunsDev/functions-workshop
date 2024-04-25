export declare const createGist: (githubApiToken: string, content: string) => Promise<string>;
export declare const deleteGist: (githubApiToken: string, gistURL: string) => Promise<boolean>;
