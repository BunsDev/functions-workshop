"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecretsManager = void 0;
const axios_1 = __importDefault(require("axios"));
const cbor_1 = __importDefault(require("cbor"));
const ethers_1 = require("ethers");
const eth_crypto_1 = __importDefault(require("eth-crypto"));
const tdh2_js_1 = require("./tdh2.js");
const v1_contract_sources_1 = require("./v1_contract_sources");
class SecretsManager {
    signer;
    functionsRouter;
    functionsCoordinator;
    donId;
    initialized = false;
    constructor({ signer, functionsRouterAddress, donId, }) {
        this.signer = signer;
        this.donId = donId;
        if (!signer.provider) {
            throw Error('The signer used to instantiate the Secrets Manager must have a provider');
        }
        this.functionsRouter = new ethers_1.Contract(functionsRouterAddress, v1_contract_sources_1.FunctionsRouterSource.abi, signer);
    }
    async initialize() {
        const donIdBytes32 = ethers_1.utils.formatBytes32String(this.donId);
        let functionsCoordinatorAddress;
        try {
            functionsCoordinatorAddress = await this.functionsRouter.getContractById(donIdBytes32);
        }
        catch (error) {
            throw Error(`${error}\n\nError encountered when attempting to fetch the FunctionsCoordinator address.\nEnsure the FunctionsRouter address and donId are correct and that that the provider is able to connect to the blockchain.`);
        }
        this.functionsCoordinator = new ethers_1.Contract(functionsCoordinatorAddress, v1_contract_sources_1.FunctionsCoordinatorSource.abi, this.signer);
        this.initialized = true;
    }
    isInitialized = () => {
        if (!this.initialized) {
            throw Error('SecretsManager has not been initialized. Call the initialize() method first.');
        }
    };
    /**
     * @returns a Promise that resolves to an object that contains the DONpublicKey and an object that maps node addresses to their public keys
     */
    async fetchKeys() {
        this.isInitialized();
        const thresholdPublicKeyBytes = await this.functionsCoordinator.getThresholdPublicKey();
        const thresholdPublicKey = JSON.parse(Buffer.from(thresholdPublicKeyBytes.slice(2), 'hex').toString('utf-8'));
        const donPublicKey = (await this.functionsCoordinator.getDONPublicKey()).slice(2);
        return { thresholdPublicKey, donPublicKey };
    }
    async encryptSecretsUrls(secretsUrls) {
        if (!Array.isArray(secretsUrls) || secretsUrls.length === 0) {
            throw Error('Must provide an array of secrets URLs');
        }
        if (!secretsUrls.every(url => typeof url === 'string')) {
            throw Error('All secrets URLs must be strings');
        }
        try {
            secretsUrls.forEach(url => new URL(url));
        }
        catch (e) {
            throw Error(`Error encountered when attempting to validate a secrets URL: ${e}`);
        }
        const donPublicKey = (await this.fetchKeys()).donPublicKey;
        const encrypted = await eth_crypto_1.default.encryptWithPublicKey(donPublicKey, secretsUrls.join(' '));
        return '0x' + eth_crypto_1.default.cipher.stringify(encrypted);
    }
    async verifyOffchainSecrets(secretsUrls) {
        let lastFetchedEncryptedSecrets;
        for (const url of secretsUrls) {
            let response;
            try {
                response = await axios_1.default.get(url);
            }
            catch (e) {
                throw Error(`Error encountered when attempting to fetch URL ${url}: ${e}`);
            }
            if (!response.data?.encryptedSecrets) {
                throw Error(`URL ${url} did not return a JSON object with an encryptedSecrets field`);
            }
            if (!ethers_1.utils.isHexString(response.data.encryptedSecrets)) {
                throw Error(`URL ${url} did not return a valid hex string for the encryptedSecrets field`);
            }
            if (lastFetchedEncryptedSecrets &&
                lastFetchedEncryptedSecrets !== response.data.encryptedSecrets) {
                throw Error(`URL ${url} returned a different encryptedSecrets field than the previous URL`);
            }
            lastFetchedEncryptedSecrets = response.data.encryptedSecrets;
        }
        return true;
    }
    async encryptSecrets(secrets) {
        if (!secrets || Object.keys(secrets).length === 0) {
            throw Error('Secrets are empty');
        }
        if (typeof secrets !== 'object' ||
            !Object.values(secrets).every(s => {
                return typeof s === 'string';
            })) {
            throw Error('Secrets are not a string map');
        }
        const { thresholdPublicKey, donPublicKey } = await this.fetchKeys();
        const message = JSON.stringify(secrets);
        const signature = await this.signer.signMessage(message);
        const signedSecrets = JSON.stringify({
            message,
            signature,
        });
        const encryptedSignedSecrets = eth_crypto_1.default.cipher.stringify(await eth_crypto_1.default.encryptWithPublicKey(donPublicKey, signedSecrets));
        const donKeyEncryptedSecrets = {
            '0x0': Buffer.from(encryptedSignedSecrets, 'hex').toString('base64'),
        };
        const encryptedSecretsHexstring = '0x' +
            Buffer.from((0, tdh2_js_1.encrypt)(thresholdPublicKey, Buffer.from(JSON.stringify(donKeyEncryptedSecrets)))).toString('hex');
        return {
            encryptedSecrets: encryptedSecretsHexstring,
        };
    }
    async uploadEncryptedSecretsToDON({ encryptedSecretsHexstring, gatewayUrls, slotId, minutesUntilExpiration, }) {
        this.isInitialized();
        this.validateGatewayUrls(gatewayUrls);
        if (!ethers_1.utils.isHexString(encryptedSecretsHexstring)) {
            throw Error('encryptedSecretsHexstring must be a valid hex string');
        }
        if (!Number.isInteger(slotId) || slotId < 0) {
            throw Error('slotId must be a integer of at least 0');
        }
        if (!Number.isInteger(minutesUntilExpiration) || minutesUntilExpiration < 5) {
            throw Error('minutesUntilExpiration must be an integer of at least 5');
        }
        const encryptedSecretsBase64 = Buffer.from(encryptedSecretsHexstring.slice(2), 'hex').toString('base64');
        const signerAddress = await this.signer.getAddress();
        const signerAddressBase64 = Buffer.from(signerAddress.slice(2), 'hex').toString('base64');
        const secretsVersion = Math.floor(Date.now() / 1000);
        const secretsExpiration = Date.now() + minutesUntilExpiration * 60 * 1000;
        const message = {
            address: signerAddressBase64,
            slotid: slotId,
            payload: encryptedSecretsBase64,
            version: secretsVersion,
            expiration: secretsExpiration,
        };
        const storageSignature = await this.signer.signMessage(JSON.stringify(message));
        const storageSignatureBase64 = Buffer.from(storageSignature.slice(2), 'hex').toString('base64');
        const payload = {
            slot_id: slotId,
            version: secretsVersion,
            payload: encryptedSecretsBase64,
            expiration: secretsExpiration,
            signature: storageSignatureBase64,
        };
        const gatewayResponse = await this.sendMessageToGateways({
            gatewayUrls,
            method: 'secrets_set',
            don_id: this.donId,
            payload,
        });
        let totalErrorCount = 0;
        for (const nodeResponse of gatewayResponse.nodeResponses) {
            if (!nodeResponse.success) {
                console.log(`WARNING: Node connected to gateway URL ${gatewayResponse.gatewayUrl} failed to store the encrypted secrets:\n${nodeResponse}`);
                totalErrorCount++;
            }
        }
        if (totalErrorCount === gatewayResponse.nodeResponses.length) {
            throw Error('All nodes failed to store the encrypted secrets');
        }
        if (totalErrorCount > 0) {
            return { version: secretsVersion, success: false };
        }
        return { version: secretsVersion, success: true };
    }
    validateGatewayUrls(gatewayUrls) {
        if (!Array.isArray(gatewayUrls) || gatewayUrls.length === 0) {
            throw Error('gatewayUrls must be a non-empty array of strings');
        }
        for (const url of gatewayUrls) {
            try {
                new URL(url);
            }
            catch (e) {
                throw Error(`gatewayUrl ${url} is not a valid URL`);
            }
        }
    }
    async sendMessageToGateways(gatewayRpcMessageConfig) {
        let gatewayResponse;
        let i = 0;
        for (const url of gatewayRpcMessageConfig.gatewayUrls) {
            i++;
            try {
                const response = await axios_1.default.post(url, await this.createGatewayMessage(gatewayRpcMessageConfig));
                if (!response.data?.result?.body?.payload?.success) {
                    throw Error(`Gateway response indicated failure:\n${JSON.stringify(response.data)}`);
                }
                const nodeResponses = this.extractNodeResponses(response);
                gatewayResponse = {
                    gatewayUrl: url,
                    nodeResponses,
                };
                break; // Break after first successful message is sent to a gateway
            }
            catch (e) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const error = e;
                const errorResponseData = error?.response?.data;
                console.log(`Error encountered when attempting to send request to DON gateway URL #${i} of ${gatewayRpcMessageConfig.gatewayUrls.length}\n${url}:\n${errorResponseData ? JSON.stringify(errorResponseData) : error}`);
            }
        }
        if (!gatewayResponse) {
            throw Error(`Failed to send request to any of the DON gateway URLs:\n${JSON.stringify(gatewayRpcMessageConfig.gatewayUrls)}`);
        }
        return gatewayResponse;
    }
    async createGatewayMessage({ method, don_id, payload, }) {
        const body = {
            message_id: `${Math.floor(Math.random() * Math.pow(2, 32))}`,
            method,
            don_id,
            receiver: '',
            payload,
        };
        const gatewaySignature = await this.signer.signMessage(this.createGatewayMessageBody(body));
        return JSON.stringify({
            id: body.message_id,
            jsonrpc: '2.0',
            method: body.method,
            params: {
                body,
                signature: gatewaySignature,
            },
        });
    }
    createGatewayMessageBody({ message_id, method, don_id, receiver, payload, }) {
        const MessageIdMaxLen = 128;
        const MessageMethodMaxLen = 64;
        const MessageDonIdMaxLen = 64;
        const MessageReceiverLen = 2 + 2 * 20;
        const alignedMessageId = Buffer.alloc(MessageIdMaxLen);
        Buffer.from(message_id).copy(alignedMessageId);
        const alignedMethod = Buffer.alloc(MessageMethodMaxLen);
        Buffer.from(method).copy(alignedMethod);
        const alignedDonId = Buffer.alloc(MessageDonIdMaxLen);
        Buffer.from(don_id).copy(alignedDonId);
        const alignedReceiver = Buffer.alloc(MessageReceiverLen);
        Buffer.from(receiver).copy(alignedReceiver);
        let payloadJson = '';
        if (payload) {
            payloadJson = JSON.stringify(payload);
        }
        return Buffer.concat([
            alignedMessageId,
            alignedMethod,
            alignedDonId,
            alignedReceiver,
            Buffer.from(payloadJson),
        ]);
    }
    extractNodeResponses(gatewayResponse) {
        if (!gatewayResponse.data?.result?.body?.payload?.node_responses) {
            throw Error(`Unexpected response data from DON gateway:\n${JSON.stringify(gatewayResponse.data)}`);
        }
        if (gatewayResponse.data?.result?.body?.payload?.node_responses.length < 1) {
            throw Error('No nodes responded to gateway request');
        }
        const responses = gatewayResponse.data.result.body.payload.node_responses;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const nodeResponses = responses.map((r) => {
            const nodeResponse = {
                success: r.body.payload.success,
            };
            if (r.body.payload.rows) {
                nodeResponse.rows = r.body.payload.rows;
            }
            return nodeResponse;
        });
        return nodeResponses;
    }
    async listDONHostedEncryptedSecrets(gatewayUrls) {
        this.isInitialized();
        this.validateGatewayUrls(gatewayUrls);
        const gatewayResponse = await this.sendMessageToGateways({
            gatewayUrls,
            method: 'secrets_list',
            don_id: this.donId,
        });
        try {
            this.verifyDONHostedSecrets([gatewayResponse]);
            return { result: gatewayResponse };
        }
        catch (e) {
            return { result: gatewayResponse, error: e?.toString() };
        }
    }
    verifyDONHostedSecrets(gatewayResponses) {
        // Create a single array of all the node responses
        const nodeResponses = [];
        for (const gatewayResponse of gatewayResponses) {
            nodeResponses.push(...gatewayResponse.nodeResponses);
        }
        const didAllNodesReturnFailure = nodeResponses.every(nodeResponse => {
            return nodeResponse.success === false;
        });
        if (didAllNodesReturnFailure) {
            throw Error('All nodes returned a failure response');
        }
        // Verify that every node response was successful
        for (const nodeResponse of nodeResponses) {
            if (!nodeResponse.success) {
                throw Error('One or more nodes failed to respond to the request with a success confirmation');
            }
        }
        // Verify that every node responded with the same rows
        const rows = nodeResponses[0].rows;
        for (const nodeResponse of nodeResponses) {
            if (!nodeResponse.rows || nodeResponse.rows.length !== rows.length) {
                throw Error('One or more nodes responded with a different number of secrets entries');
            }
            for (let i = 0; i < rows.length; i++) {
                if (nodeResponse.rows[i].slot_id !== rows[i].slot_id ||
                    nodeResponse.rows[i].version !== rows[i].version ||
                    nodeResponse.rows[i].expiration !== rows[i].expiration) {
                    throw Error('One or more nodes responded with different secrets entries');
                }
            }
        }
    }
    buildDONHostedEncryptedSecretsReference = ({ slotId, version, }) => {
        if (typeof slotId !== 'number' || slotId < 0 || !Number.isInteger(slotId)) {
            throw Error('Invalid slotId');
        }
        if (typeof version !== 'number' || version < 0 || !Number.isInteger(version)) {
            throw Error('Invalid version');
        }
        return ('0x' +
            cbor_1.default
                .encodeCanonical({
                slotId,
                version,
            })
                .toString('hex'));
    };
}
exports.SecretsManager = SecretsManager;
