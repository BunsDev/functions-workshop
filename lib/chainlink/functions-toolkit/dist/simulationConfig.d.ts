export declare const simulatedLinkEthPrice: bigint;
export declare const simulatedDonId = "local-functions-testnet";
export declare const simulatedAllowListId = "allowlist";
export declare const simulatedRouterConfig: {
    maxConsumersPerSubscription: number;
    adminFee: number;
    handleOracleFulfillmentSelector: string;
    gasForCallExactCheck: number;
    maxCallbackGasLimits: number[];
    subscriptionDepositMinimumRequests: number;
    subscriptionDepositJuels: number;
};
export declare const simulatedCoordinatorConfig: {
    maxCallbackGasLimit: number;
    feedStalenessSeconds: number;
    gasOverheadBeforeCallback: number;
    gasOverheadAfterCallback: number;
    requestTimeoutSeconds: number;
    donFee: number;
    maxSupportedRequestDataVersion: number;
    fulfillmentGasPriceOverEstimationBP: number;
    fallbackNativePerUnitLink: bigint;
};
export declare const simulatedAllowListConfig: {
    enabled: boolean;
    signerPublicKey: string;
};
export declare const callReportGasLimit = 5000000;
export declare const numberOfSimulatedNodeExecutions = 4;
export declare const simulatedWallets: {
    node0: {
        address: string;
        privateKey: string;
    };
    node1: {
        address: string;
        privateKey: string;
    };
    node2: {
        address: string;
        privateKey: string;
    };
    node3: {
        address: string;
        privateKey: string;
    };
};
export declare const simulatedTransmitters: string[];
export declare const simulatedSecretsKeys: {
    thresholdKeys: {
        publicKey: string;
        privateKeyShares: {
            [address: string]: string;
        };
    };
    donKey: {
        publicKey: string;
        privateKey: string;
    };
};
export declare const DEFAULT_MAX_ON_CHAIN_RESPONSE_BYTES = 256;
export declare const DEFAULT_MAX_EXECUTION_DURATION_MS = 10000;
export declare const DEFAULT_MAX_MEMORY_USAGE_MB = 128;
export declare const DEFAULT_MAX_HTTP_REQUESTS = 5;
export declare const DEFAULT_MAX_HTTP_REQUEST_DURATION_MS = 9000;
export declare const DEFAULT_MAX_HTTP_REQUEST_URL_LENGTH = 2048;
export declare const DEFAULT_MAX_HTTP_REQUEST_BYTES = 2048;
export declare const DEFAULT_MAX_HTTP_RESPONSE_BYTES = 2097152;
