"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_MAX_HTTP_RESPONSE_BYTES = exports.DEFAULT_MAX_HTTP_REQUEST_BYTES = exports.DEFAULT_MAX_HTTP_REQUEST_URL_LENGTH = exports.DEFAULT_MAX_HTTP_REQUEST_DURATION_MS = exports.DEFAULT_MAX_HTTP_REQUESTS = exports.DEFAULT_MAX_MEMORY_USAGE_MB = exports.DEFAULT_MAX_EXECUTION_DURATION_MS = exports.DEFAULT_MAX_ON_CHAIN_RESPONSE_BYTES = exports.simulatedSecretsKeys = exports.simulatedTransmitters = exports.simulatedWallets = exports.numberOfSimulatedNodeExecutions = exports.callReportGasLimit = exports.simulatedAllowListConfig = exports.simulatedCoordinatorConfig = exports.simulatedRouterConfig = exports.simulatedAllowListId = exports.simulatedDonId = exports.simulatedLinkEthPrice = void 0;
exports.simulatedLinkEthPrice = BigInt('1000000000000000');
exports.simulatedDonId = 'local-functions-testnet';
exports.simulatedAllowListId = 'allowlist';
exports.simulatedRouterConfig = {
    maxConsumersPerSubscription: 100,
    adminFee: 0,
    handleOracleFulfillmentSelector: '0x0ca76175',
    gasForCallExactCheck: 5000,
    maxCallbackGasLimits: [300000, 500000, 1000000],
    subscriptionDepositMinimumRequests: 0,
    subscriptionDepositJuels: 0,
};
exports.simulatedCoordinatorConfig = {
    maxCallbackGasLimit: 1000000,
    feedStalenessSeconds: 86400,
    gasOverheadBeforeCallback: 44615,
    gasOverheadAfterCallback: 44615,
    requestTimeoutSeconds: 0,
    donFee: 0,
    maxSupportedRequestDataVersion: 1,
    fulfillmentGasPriceOverEstimationBP: 0,
    fallbackNativePerUnitLink: BigInt('5000000000000000'),
};
exports.simulatedAllowListConfig = {
    enabled: false,
    signerPublicKey: '0x0000000000000000000000000000000000000000',
};
exports.callReportGasLimit = 5000000;
exports.numberOfSimulatedNodeExecutions = 4;
exports.simulatedWallets = {
    node0: {
        address: '0xAe24F6e7e046a0C764DF51F333dE5e2fE360AC72',
        privateKey: '0x493f20c367e9c5190b14b8071a6c765da973d41428b841c25e4aaba3577f8ece',
    },
    node1: {
        address: '0x37d7bf16f6fd8c37b766Fa87e047c68c51dfdf4a',
        privateKey: '0x7abd90843922984dda18358a179679e5cabda5ad8d0ebab5714ac044663a6a14',
    },
    node2: {
        address: '0x6e7EF53D9811B70834902D2D9137DaD2720eAC47',
        privateKey: '0xcb8801121add786869aac78ceb4003bf3aa8a68ae8dd31f80d61f5f98eace3c5',
    },
    node3: {
        address: '0xBe83eA9868AE964f8C46EFa0fea798EbE16441c5',
        privateKey: '0x06c7ca21f24edf450251e87097264b1fd184c9570084a78aa3300e937e1954b8',
    },
};
exports.simulatedTransmitters = Object.values(exports.simulatedWallets).map(wallet => wallet.address);
exports.simulatedSecretsKeys = {
    thresholdKeys: {
        publicKey: '{"Group":"P256","G_bar":"BLCl28PjjGt8JyL/p6AHToD6265gEBfl12mBiCVZShSPHVwvx5GwJ0QMqpQ7yPZEM8E6U015XFHvsDuq8X/S/c8=","H":"BEDshIeMEgr2kjNdjkG12M0A9P0uwg5Hl7jbKjbIcweHi07tu8rITgMZ9dTfqLhtFu+cRwwZaLLZdhqdg1JyLYY=","HArray":["BCj9afGghnfy3Nubj7onMPkApbF9r4GbLvSSi1wrQ1uMwRYMr6DCt5RCm95vKx75JPuOFdKBkBTOpX4p5Dtt0l0=","BJCmC0+jkl/WTK8sfb6ulQjBWTZnQEasPRVdCIYv94RkZWfVk6CbFS2Dv9C090He4UaYBaOGGyw7HGAtqKUqX1Y=","BPPnFxrq+9VI8Bb6KUBJalt/EZdU+G/l4iyosvB5bulwWDxJ26mw3hJZtZfjUcJPGIajabNFOa+5pVBd6Y3oGB8=","BJ1tWD2RhKB/uQEJ1x54mBddAW0KoFghplSswp/F3BYksyZIRIhEiLDsNgw3NfhmQh2OR6Vgv4APqAt9+RKxzzk="]}',
        privateKeyShares: {
            '0xAe24F6e7e046a0C764DF51F333dE5e2fE360AC72': '{"Group":"P256","Index":0,"V":"XuDZcsMc5ebjgbHx+zQ/Hhbwn24MgJ5oBL+ORQGqM8c="}',
            '0x37d7bf16f6fd8c37b766Fa87e047c68c51dfdf4a': '{"Group":"P256","Index":1,"V":"x3UbVxPoPQvRTL6ILjuBSGep3UUPY2q7j6LjHR2tU2A="}',
            '0x6e7EF53D9811B70834902D2D9137DaD2720eAC47': '{"Group":"P256","Index":2,"V":"MAldPGSzlC+/F8seYULDcvt8IG5rLpiKJsxtMj1NTag="}',
            '0xBe83eA9868AE964f8C46EFa0fea798EbE16441c5': '{"Group":"P256","Index":3,"V":"mJ2fILV+61Ss4te0lEoFnUw1XkVuEWTdsa/CCllQbUE="}',
        },
    },
    donKey: {
        publicKey: '0x46e62235e8ac8a4f84aa62baf7c67d73a23c5641821bab8d24a161071b90ed8295195d81ba34e4492f773c84e63617879c99480a7d9545385b56b5fdfd88d0da',
        privateKey: '0x32d6fac6ddc22adc2144aa75de175556c0095b795cb1bc7b2a53c8a07462e8e3',
    },
};
exports.DEFAULT_MAX_ON_CHAIN_RESPONSE_BYTES = 256;
exports.DEFAULT_MAX_EXECUTION_DURATION_MS = 10000; // 10 seconds
exports.DEFAULT_MAX_MEMORY_USAGE_MB = 128;
exports.DEFAULT_MAX_HTTP_REQUESTS = 5;
exports.DEFAULT_MAX_HTTP_REQUEST_DURATION_MS = 9000; // 9 seconds
exports.DEFAULT_MAX_HTTP_REQUEST_URL_LENGTH = 2048; // 2 KB
exports.DEFAULT_MAX_HTTP_REQUEST_BYTES = 2048; // 2 KB
exports.DEFAULT_MAX_HTTP_RESPONSE_BYTES = 2097152; // 2 MB
