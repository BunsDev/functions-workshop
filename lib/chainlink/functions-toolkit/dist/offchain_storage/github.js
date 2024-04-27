"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteGist = exports.createGist = void 0;
const axios_1 = __importDefault(require("axios"));
const createGist = async (githubApiToken, content) => {
    if (typeof content !== 'string') {
        throw new Error('Gist content must be a string');
    }
    if (!githubApiToken) {
        throw new Error('Github API token is required');
    }
    await checkTokenGistScope(githubApiToken);
    const headers = {
        Authorization: `token ${githubApiToken}`,
    };
    // construct the API endpoint for creating a Gist
    const url = 'https://api.github.com/gists';
    const body = {
        public: false,
        files: {
            [`encrypted-functions-request-data-${Date.now()}.json`]: {
                content: content,
            },
        },
    };
    try {
        const response = await axios_1.default.post(url, body, { headers });
        const gistUrl = response.data.html_url + '/raw';
        return gistUrl;
    }
    catch (error) {
        throw Error(`Failed to create Gist: ${error}`);
    }
};
exports.createGist = createGist;
const checkTokenGistScope = async (githubApiToken) => {
    const headers = {
        Authorization: `Bearer ${githubApiToken}`,
    };
    let response;
    try {
        response = await axios_1.default.get('https://api.github.com/user', { headers });
    }
    catch (error) {
        throw new Error(`Failed to get token data. Check that your access token is valid. Error: ${error}`);
    }
    // Github's newly-added fine-grained token do not currently allow for verifying that the token scope is restricted to Gists.
    // This verification feature only works with classic Github tokens and is otherwise ignored
    const scopes = response.headers['x-oauth-scopes']?.split(', ');
    if (scopes && scopes?.[0] !== 'gist') {
        throw Error('The provided Github API token does not have permissions to read and write Gists');
    }
    if (scopes && scopes.length > 1) {
        console.log('WARNING: The provided Github API token has additional permissions beyond reading and writing to Gists');
    }
    return true;
};
const deleteGist = async (githubApiToken, gistURL) => {
    const headers = {
        Authorization: `Bearer ${githubApiToken}`,
    };
    if (!githubApiToken) {
        throw Error('Github API token is required');
    }
    if (!gistURL) {
        throw Error('Github Gist URL is required');
    }
    const matchArr = gistURL.match(/gist\.github\.com\/[^/]+\/([a-zA-Z0-9]+)/);
    if (!matchArr || !matchArr[1]) {
        throw Error('Invalid Gist URL');
    }
    const gistId = matchArr[1];
    try {
        await axios_1.default.delete(`https://api.github.com/gists/${gistId}`, { headers });
        return true;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }
    catch (error) {
        throw Error(`Error deleting Gist ${gistURL} : ${error}`);
    }
};
exports.deleteGist = deleteGist;
