import type { Overrides, Contract, providers } from 'ethers';
import type { Server } from 'ganache';
export declare enum Location {
    Inline = 0,
    Remote = 1,
    DONHosted = 2
}
export declare enum CodeLanguage {
    JavaScript = 0
}
export declare enum ReturnType {
    uint = "uint256",
    uint256 = "uint256",
    int = "int256",
    int256 = "int256",
    string = "string",
    bytes = "bytes"
}
export type FunctionsRequestParams = {
    codeLocation: Location;
    secretsLocation?: Location;
    codeLanguage: CodeLanguage;
    source: string;
    encryptedSecretsReference?: string;
    args?: string[];
    bytesArgs?: string[];
};
export type ThresholdPublicKey = {
    Group: string;
    G_bar: string;
    H: string;
    HArray: string[];
};
export type RequestCommitmentFetchConfig = {
    requestId: string;
    provider: providers.JsonRpcProvider;
    functionsRouterAddress: string;
    donId: string;
    toBlock?: number | 'latest';
    pastBlocksToSearch?: number;
};
export type TransactionOptions = {
    overrides?: Overrides;
    confirmations?: number;
};
export type SubCreateConfig = {
    consumerAddress?: string;
    txOptions?: TransactionOptions;
};
export type SubConsumerConfig = {
    subscriptionId: bigint | number | string;
    consumerAddress: string;
    txOptions?: TransactionOptions;
};
export type SubFundConfig = {
    juelsAmount: bigint | string;
    subscriptionId: bigint | number | string;
    txOptions?: TransactionOptions;
};
export type SubCancelConfig = {
    subscriptionId: bigint | number | string;
    refundAddress?: string;
    txOptions?: TransactionOptions;
};
export type SubTransferConfig = {
    subscriptionId: bigint | number | string;
    newOwner: string;
    txOptions?: TransactionOptions;
};
export type SubTransferAcceptConfig = {
    subscriptionId: bigint | number | string;
    txOptions?: TransactionOptions;
};
export type SubTimeoutConfig = {
    requestCommitments: RequestCommitment[];
    txOptions?: TransactionOptions;
};
export type EstimateCostConfig = {
    donId: string;
    subscriptionId: bigint | number | string;
    callbackGasLimit: number;
    gasPriceWei: bigint;
};
export type SubscriptionInfo = {
    balance: bigint;
    owner: string;
    blockedBalance: bigint;
    proposedOwner: string;
    consumers: string[];
    flags: string;
};
export type RequestCommitment = {
    requestId: string;
    coordinator: string;
    estimatedTotalCostJuels: bigint;
    client: string;
    subscriptionId: number;
    callbackGasLimit: bigint;
    adminFee: bigint;
    donFee: bigint;
    gasOverheadBeforeCallback: bigint;
    gasOverheadAfterCallback: bigint;
    timeoutTimestamp: bigint;
};
export type DONStoragePayload = {
    slot_id: number;
    version: number;
    payload: string;
    expiration: number;
    signature: string;
};
export type GatewayMessageConfig = {
    gatewayUrls: string[];
    method: string;
    don_id: string;
    payload?: DONStoragePayload;
};
export type GatewayMessageBody = {
    message_id: string;
    method: string;
    don_id: string;
    receiver: string;
    payload?: DONStoragePayload;
};
export type GatewayMessage = {
    id: string;
    jsonrpc: '2.0';
    method: string;
    params: {
        body: GatewayMessageBody;
        signature: string;
    };
};
type EncryptedSecretsEntry = {
    slot_id: number;
    version: number;
    expiration: number;
};
export type NodeResponse = {
    success: boolean;
    rows?: EncryptedSecretsEntry[];
};
export type GatewayResponse = {
    gatewayUrl: string;
    nodeResponses: NodeResponse[];
};
export declare enum FulfillmentCode {
    FULFILLED = 0,
    USER_CALLBACK_ERROR = 1,
    INVALID_REQUEST_ID = 2,
    COST_EXCEEDS_COMMITMENT = 3,
    INSUFFICIENT_GAS_PROVIDED = 4,
    SUBSCRIPTION_BALANCE_INVARIANT_VIOLATION = 5,
    INVALID_COMMITMENT = 6
}
export type FunctionsResponse = {
    requestId: string;
    subscriptionId: number;
    totalCostInJuels: bigint;
    responseBytesHexstring: string;
    errorString: string;
    returnDataBytesHexstring: string;
    fulfillmentCode: FulfillmentCode;
};
export interface SimulationInput {
    source: string;
    args?: string[];
    bytesArgs?: string[];
    secrets?: Record<string, string>;
    maxOnChainResponseBytes?: number;
    maxExecutionTimeMs?: number;
    maxMemoryUsageMb?: number;
    numAllowedQueries?: number;
    maxQueryDurationMs?: number;
    maxQueryUrlLength?: number;
    maxQueryRequestBytes?: number;
    maxQueryResponseBytes?: number;
}
export type SimulationResult = {
    responseBytesHexstring?: string;
    errorString?: string;
    capturedTerminalOutput: string;
};
export interface RequestEventData {
    requestId: string;
    requestingContract: string;
    requestInitiator: string;
    subscriptionId: number;
    subscriptionOwner: string;
    data: string;
    dataVersion: number;
    flags: string;
    callbackGasLimit: number;
    commitment: RequestCommitment;
}
export interface FunctionsContracts {
    donId: string;
    linkTokenContract: Contract;
    functionsRouterContract: Contract;
    functionsMockCoordinatorContract: Contract;
}
export type GetFunds = (address: string, { weiAmount, juelsAmount }: {
    weiAmount?: bigint | string;
    juelsAmount?: bigint | string;
}) => Promise<void>;
export type LocalFunctionsTestnet = {
    server: Server;
    adminWallet: {
        address: string;
        privateKey: string;
    };
    getFunds: GetFunds;
    close: () => Promise<void>;
} & FunctionsContracts;
export {};
