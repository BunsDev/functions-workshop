import type { providers } from 'ethers';
import { type FunctionsResponse } from './types';
export declare class ResponseListener {
    private functionsRouter;
    private provider;
    constructor({ provider, functionsRouterAddress, }: {
        provider: providers.Provider;
        functionsRouterAddress: string;
    });
    listenForResponse(requestId: string, timeout?: number): Promise<FunctionsResponse>;
    listenForResponseFromTransaction(txHash: string, timeout?: number, confirmations?: number, checkInterval?: number): Promise<FunctionsResponse>;
    listenForResponses(subscriptionId: number | string, callback: (functionsResponse: FunctionsResponse) => any): void;
    stopListeningForResponses(): void;
}
