import { Wallet } from 'ethers';
import type { ServerOptions } from 'ganache';
import type { LocalFunctionsTestnet, FunctionsContracts } from './types';
export declare const startLocalFunctionsTestnet: (simulationConfigPath?: string, options?: ServerOptions, port?: number) => Promise<LocalFunctionsTestnet>;
export declare const deployFunctionsOracle: (deployer: Wallet) => Promise<FunctionsContracts>;
