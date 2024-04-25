import type { Signer } from 'ethers';
import type { TransactionReceipt } from '@ethersproject/abstract-provider';
import type { SubConsumerConfig, SubFundConfig, SubscriptionInfo, SubCancelConfig, SubTransferConfig, SubTransferAcceptConfig, SubTimeoutConfig, SubCreateConfig, EstimateCostConfig } from './types';
export declare class SubscriptionManager {
    private signer;
    private linkToken;
    private functionsRouter;
    private functionsAllowList?;
    private initialized;
    constructor({ signer, linkTokenAddress, functionsRouterAddress, }: {
        signer: Signer;
        linkTokenAddress: string;
        functionsRouterAddress: string;
    });
    initialize(): Promise<void>;
    private isInitialized;
    isAllowlisted(addr: string): Promise<void>;
    createSubscription(subCreateConfig?: SubCreateConfig): Promise<number>;
    addConsumer({ subscriptionId, consumerAddress, txOptions, }: SubConsumerConfig): Promise<TransactionReceipt>;
    fundSubscription(config: SubFundConfig): Promise<TransactionReceipt>;
    getSubscriptionInfo(subscriptionId: bigint | number | string): Promise<SubscriptionInfo>;
    cancelSubscription({ subscriptionId, refundAddress, txOptions, }: SubCancelConfig): Promise<TransactionReceipt>;
    removeConsumer({ subscriptionId, consumerAddress, txOptions, }: SubConsumerConfig): Promise<TransactionReceipt>;
    requestSubscriptionTransfer({ subscriptionId, newOwner, txOptions, }: SubTransferConfig): Promise<TransactionReceipt>;
    acceptSubTransfer({ subscriptionId, txOptions, }: SubTransferAcceptConfig): Promise<TransactionReceipt>;
    timeoutRequests({ requestCommitments, txOptions, }: SubTimeoutConfig): Promise<TransactionReceipt>;
    estimateFunctionsRequestCost({ donId, subscriptionId, callbackGasLimit, gasPriceWei, }: EstimateCostConfig): Promise<bigint>;
}
