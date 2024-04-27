"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseListener = void 0;
const ethers_1 = require("ethers");
const v1_contract_sources_1 = require("./v1_contract_sources");
const types_1 = require("./types");
class ResponseListener {
    functionsRouter;
    provider;
    constructor({ provider, functionsRouterAddress, }) {
        this.provider = provider;
        this.functionsRouter = new ethers_1.Contract(functionsRouterAddress, v1_contract_sources_1.FunctionsRouterSource.abi, provider);
    }
    async listenForResponse(requestId, timeout = 300000) {
        let expirationTimeout;
        const responsePromise = new Promise((resolve, reject) => {
            expirationTimeout = setTimeout(() => {
                reject('Response not received within timeout period');
            }, timeout);
            this.functionsRouter.on('RequestProcessed', (_requestId, subscriptionId, totalCostJuels, _, resultCode, response, err, returnData) => {
                if (requestId === _requestId && resultCode !== types_1.FulfillmentCode.INVALID_REQUEST_ID) {
                    clearTimeout(expirationTimeout);
                    this.functionsRouter.removeAllListeners('RequestProcessed');
                    resolve({
                        requestId,
                        subscriptionId: Number(subscriptionId.toString()),
                        totalCostInJuels: BigInt(totalCostJuels.toString()),
                        responseBytesHexstring: response,
                        errorString: Buffer.from(err.slice(2), 'hex').toString(),
                        returnDataBytesHexstring: returnData,
                        fulfillmentCode: resultCode,
                    });
                }
            });
        });
        return responsePromise;
    }
    async listenForResponseFromTransaction(txHash, timeout = 3000000, confirmations = 2, checkInterval = 2000) {
        return new Promise((resolve, reject) => {
            ;
            (async () => {
                let requestId;
                // eslint-disable-next-line prefer-const
                let checkTimeout;
                const expirationTimeout = setTimeout(() => {
                    reject('Response not received within timeout period');
                }, timeout);
                const check = async () => {
                    const receipt = await this.provider.waitForTransaction(txHash, confirmations, timeout);
                    const updatedId = receipt.logs[0].topics[1];
                    if (updatedId !== requestId) {
                        requestId = updatedId;
                        const response = await this.listenForResponse(requestId, timeout);
                        if (updatedId === requestId) {
                            // Resolve only if the ID hasn't changed in the meantime
                            clearTimeout(expirationTimeout);
                            clearInterval(checkTimeout);
                            resolve(response);
                        }
                    }
                };
                // Check periodically if the transaction has been re-orged and requestID changed
                checkTimeout = setInterval(check, checkInterval);
                check();
            })();
        });
    }
    listenForResponses(subscriptionId, 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    callback) {
        if (typeof subscriptionId === 'string') {
            subscriptionId = Number(subscriptionId);
        }
        this.functionsRouter.on('RequestProcessed', (requestId, _subscriptionId, totalCostJuels, _, resultCode, response, err, returnData) => {
            if (subscriptionId === Number(_subscriptionId.toString()) &&
                resultCode !== types_1.FulfillmentCode.INVALID_REQUEST_ID) {
                this.functionsRouter.removeAllListeners('RequestProcessed');
                callback({
                    requestId,
                    subscriptionId: Number(subscriptionId.toString()),
                    totalCostInJuels: BigInt(totalCostJuels.toString()),
                    responseBytesHexstring: response,
                    errorString: Buffer.from(err.slice(2), 'hex').toString(),
                    returnDataBytesHexstring: returnData,
                    fulfillmentCode: resultCode,
                });
            }
        });
    }
    stopListeningForResponses() {
        this.functionsRouter.removeAllListeners('RequestProcessed');
    }
}
exports.ResponseListener = ResponseListener;
