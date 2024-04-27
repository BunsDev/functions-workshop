"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deployFunctionsOracle = exports.startLocalFunctionsTestnet = void 0;
const ethers_1 = require("ethers");
const ganache_1 = __importDefault(require("ganache"));
const cbor_1 = __importDefault(require("cbor"));
const simulateScript_1 = require("./simulateScript");
const simulationConfig_1 = require("./simulationConfig");
const v1_contract_sources_1 = require("./v1_contract_sources");
const startLocalFunctionsTestnet = async (simulationConfigPath, options, port = 8545) => {
    const server = ganache_1.default.server(options);
    server.listen(port, 'localhost', (err) => {
        if (err) {
            throw Error(`Error starting local Functions testnet server:\n${err}`);
        }
        console.log(`Local Functions testnet server started on port ${port}`);
    });
    const accounts = server.provider.getInitialAccounts();
    const firstAccount = Object.keys(accounts)[0];
    const admin = new ethers_1.Wallet(accounts[firstAccount].secretKey.slice(2), new ethers_1.providers.JsonRpcProvider(`http://localhost:${port}`));
    const contracts = await (0, exports.deployFunctionsOracle)(admin);
    contracts.functionsMockCoordinatorContract.on('OracleRequest', (requestId, requestingContract, requestInitiator, subscriptionId, subscriptionOwner, data, dataVersion, flags, callbackGasLimit, commitment) => {
        const requestEvent = {
            requestId,
            requestingContract,
            requestInitiator,
            subscriptionId,
            subscriptionOwner,
            data,
            dataVersion,
            flags,
            callbackGasLimit,
            commitment,
        };
        handleOracleRequest(requestEvent, contracts.functionsMockCoordinatorContract, admin, simulationConfigPath);
    });
    const getFunds = async (address, { weiAmount, juelsAmount }) => {
        if (!juelsAmount) {
            juelsAmount = BigInt(0);
        }
        if (!weiAmount) {
            weiAmount = BigInt(0);
        }
        if (typeof weiAmount !== 'string' && typeof weiAmount !== 'bigint') {
            throw Error(`weiAmount must be a BigInt or string, got ${typeof weiAmount}`);
        }
        if (typeof juelsAmount !== 'string' && typeof juelsAmount !== 'bigint') {
            throw Error(`juelsAmount must be a BigInt or string, got ${typeof juelsAmount}`);
        }
        weiAmount = BigInt(weiAmount);
        juelsAmount = BigInt(juelsAmount);
        const ethTx = await admin.sendTransaction({
            to: address,
            value: weiAmount.toString(),
        });
        const linkTx = await contracts.linkTokenContract.connect(admin).transfer(address, juelsAmount);
        await ethTx.wait(1);
        await linkTx.wait(1);
        console.log(`Sent ${ethers_1.utils.formatEther(weiAmount.toString())} ETH and ${ethers_1.utils.formatEther(juelsAmount.toString())} LINK to ${address}`);
    };
    const close = async () => {
        contracts.functionsMockCoordinatorContract.removeAllListeners('OracleRequest');
        await server.close();
    };
    return {
        server,
        adminWallet: {
            address: admin.address,
            privateKey: admin.privateKey,
        },
        ...contracts,
        getFunds,
        close,
    };
};
exports.startLocalFunctionsTestnet = startLocalFunctionsTestnet;
const handleOracleRequest = async (requestEventData, mockCoordinator, admin, simulationConfigPath) => {
    const response = await simulateDONExecution(requestEventData, simulationConfigPath);
    const errorHexstring = response.errorString
        ? '0x' + Buffer.from(response.errorString.toString()).toString('hex')
        : undefined;
    const encodedReport = encodeReport(requestEventData.requestId, requestEventData.commitment, response.responseBytesHexstring, errorHexstring);
    const reportTx = await mockCoordinator
        .connect(admin)
        .callReport(encodedReport, { gasLimit: simulationConfig_1.callReportGasLimit });
    await reportTx.wait(1);
};
const simulateDONExecution = async (requestEventData, simulationConfigPath) => {
    let requestData;
    try {
        requestData = await buildRequestObject(requestEventData.data);
    }
    catch {
        return {
            errorString: 'CBOR parsing error',
        };
    }
    const simulationConfig = simulationConfigPath ? require(simulationConfigPath) : {};
    // Perform the simulation numberOfSimulatedNodeExecution times
    const simulations = [...Array(simulationConfig_1.numberOfSimulatedNodeExecutions)].map(async () => {
        try {
            return await (0, simulateScript_1.simulateScript)({
                source: requestData.source,
                secrets: simulationConfig.secrets,
                args: requestData.args,
                bytesArgs: requestData.bytesArgs,
                maxOnChainResponseBytes: simulationConfig.maxOnChainResponseBytes,
                maxExecutionTimeMs: simulationConfig.maxExecutionTimeMs,
                maxMemoryUsageMb: simulationConfig.maxMemoryUsageMb,
                numAllowedQueries: simulationConfig.numAllowedQueries,
                maxQueryDurationMs: simulationConfig.maxQueryDurationMs,
                maxQueryUrlLength: simulationConfig.maxQueryUrlLength,
                maxQueryRequestBytes: simulationConfig.maxQueryRequestBytes,
                maxQueryResponseBytes: simulationConfig.maxQueryResponseBytes,
            });
        }
        catch (err) {
            const errorString = err.message.slice(0, simulationConfig.maxOnChainResponseBytes ?? simulationConfig_1.DEFAULT_MAX_ON_CHAIN_RESPONSE_BYTES);
            return {
                errorString,
                capturedTerminalOutput: '',
            };
        }
    });
    const responses = await Promise.all(simulations);
    const successfulResponses = responses.filter(response => response.errorString === undefined);
    const errorResponses = responses.filter(response => response.errorString !== undefined);
    if (successfulResponses.length > errorResponses.length) {
        return {
            responseBytesHexstring: aggregateMedian(successfulResponses.map(response => response.responseBytesHexstring)),
        };
    }
    else {
        return {
            errorString: aggregateModeString(errorResponses.map(response => response.errorString)),
        };
    }
};
const aggregateMedian = (responses) => {
    const bufResponses = responses.map(response => Buffer.from(response.slice(2), 'hex'));
    bufResponses.sort((a, b) => {
        if (a.length !== b.length) {
            return a.length - b.length;
        }
        for (let i = 0; i < a.length; ++i) {
            if (a[i] !== b[i]) {
                return a[i] - b[i];
            }
        }
        return 0;
    });
    return '0x' + bufResponses[Math.floor((bufResponses.length - 1) / 2)].toString('hex');
};
const aggregateModeString = (items) => {
    const counts = new Map();
    for (const str of items) {
        const existingCount = counts.get(str) || 0;
        counts.set(str, existingCount + 1);
    }
    let modeString = items[0];
    let maxCount = counts.get(modeString) || 0;
    for (const [str, count] of counts.entries()) {
        if (count > maxCount) {
            maxCount = count;
            modeString = str;
        }
    }
    return modeString;
};
const encodeReport = (requestId, commitment, result, error) => {
    const encodedCommitment = ethers_1.utils.defaultAbiCoder.encode([
        'bytes32',
        'address',
        'uint96',
        'address',
        'uint64',
        'uint32',
        'uint72',
        'uint72',
        'uint40',
        'uint40',
        'uint32',
    ], [
        commitment.requestId,
        commitment.coordinator,
        commitment.estimatedTotalCostJuels,
        commitment.client,
        commitment.subscriptionId,
        commitment.callbackGasLimit,
        commitment.adminFee,
        commitment.donFee,
        commitment.gasOverheadBeforeCallback,
        commitment.gasOverheadAfterCallback,
        commitment.timeoutTimestamp,
    ]);
    const encodedReport = ethers_1.utils.defaultAbiCoder.encode(['bytes32[]', 'bytes[]', 'bytes[]', 'bytes[]', 'bytes[]'], [[requestId], [result ?? []], [error ?? []], [encodedCommitment], [[]]]);
    return encodedReport;
};
const buildRequestObject = async (requestDataHexString) => {
    const decodedRequestData = await cbor_1.default.decodeAll(Buffer.from(requestDataHexString.slice(2), 'hex'));
    if (typeof decodedRequestData[0] === 'object') {
        if (decodedRequestData[0].bytesArgs) {
            decodedRequestData[0].bytesArgs = decodedRequestData[0].bytesArgs?.map((bytesArg) => {
                return '0x' + bytesArg?.toString('hex');
            });
        }
        decodedRequestData[0].secrets = undefined;
        return decodedRequestData[0];
    }
    const requestDataObject = {};
    // The decoded request data is an array of alternating keys and values, therefore we can iterate over it in steps of 2
    for (let i = 0; i < decodedRequestData.length - 1; i += 2) {
        const requestDataKey = decodedRequestData[i];
        const requestDataValue = decodedRequestData[i + 1];
        switch (requestDataKey) {
            case 'codeLocation':
                requestDataObject.codeLocation = requestDataValue;
                break;
            case 'secretsLocation':
                // Unused as secrets provided as an argument to startLocalFunctionsTestnet() are used instead
                break;
            case 'language':
                requestDataObject.codeLanguage = requestDataValue;
                break;
            case 'source':
                requestDataObject.source = requestDataValue;
                break;
            case 'secrets':
                // Unused as secrets provided as an argument to startLocalFunctionsTestnet() are used instead
                break;
            case 'args':
                requestDataObject.args = requestDataValue;
                break;
            case 'bytesArgs':
                requestDataObject.bytesArgs = requestDataValue?.map((bytesArg) => {
                    return '0x' + bytesArg?.toString('hex');
                });
                break;
            default:
            // Ignore unknown keys
        }
    }
    return requestDataObject;
};
const deployFunctionsOracle = async (deployer) => {
    const linkTokenFactory = new ethers_1.ContractFactory(v1_contract_sources_1.LinkTokenSource.abi, v1_contract_sources_1.LinkTokenSource.bytecode, deployer);
    const linkToken = await linkTokenFactory.connect(deployer).deploy();
    const linkPriceFeedFactory = new ethers_1.ContractFactory(v1_contract_sources_1.MockV3AggregatorSource.abi, v1_contract_sources_1.MockV3AggregatorSource.bytecode, deployer);
    const linkPriceFeed = await linkPriceFeedFactory
        .connect(deployer)
        .deploy(18, simulationConfig_1.simulatedLinkEthPrice);
    const routerFactory = new ethers_1.ContractFactory(v1_contract_sources_1.FunctionsRouterSource.abi, v1_contract_sources_1.FunctionsRouterSource.bytecode, deployer);
    const router = await routerFactory
        .connect(deployer)
        .deploy(linkToken.address, simulationConfig_1.simulatedRouterConfig);
    const mockCoordinatorFactory = new ethers_1.ContractFactory(v1_contract_sources_1.FunctionsCoordinatorTestHelperSource.abi, v1_contract_sources_1.FunctionsCoordinatorTestHelperSource.bytecode, deployer);
    const mockCoordinator = await mockCoordinatorFactory
        .connect(deployer)
        .deploy(router.address, simulationConfig_1.simulatedCoordinatorConfig, linkPriceFeed.address);
    const allowlistFactory = new ethers_1.ContractFactory(v1_contract_sources_1.TermsOfServiceAllowListSource.abi, v1_contract_sources_1.TermsOfServiceAllowListSource.bytecode, deployer);
    const allowlist = await allowlistFactory.connect(deployer).deploy(simulationConfig_1.simulatedAllowListConfig);
    const setAllowListIdTx = await router.setAllowListId(ethers_1.utils.formatBytes32String(simulationConfig_1.simulatedAllowListId));
    await setAllowListIdTx.wait(1);
    const allowlistId = await router.getAllowListId();
    const proposeContractsTx = await router.proposeContractsUpdate([allowlistId, ethers_1.utils.formatBytes32String(simulationConfig_1.simulatedDonId)], [allowlist.address, mockCoordinator.address], {
        gasLimit: 1000000,
    });
    await proposeContractsTx.wait(1);
    await router.updateContracts({ gasLimit: 1000000 });
    await mockCoordinator.connect(deployer).setDONPublicKey(simulationConfig_1.simulatedSecretsKeys.donKey.publicKey);
    await mockCoordinator
        .connect(deployer)
        .setThresholdPublicKey('0x' + Buffer.from(simulationConfig_1.simulatedSecretsKeys.thresholdKeys.publicKey).toString('hex'));
    return {
        donId: simulationConfig_1.simulatedDonId,
        linkTokenContract: linkToken,
        functionsRouterContract: router,
        functionsMockCoordinatorContract: mockCoordinator,
    };
};
exports.deployFunctionsOracle = deployFunctionsOracle;
