import type { SimulationInput, SimulationResult } from '../types';
export declare const simulateScript: ({ source, secrets, args, bytesArgs, maxOnChainResponseBytes, maxExecutionTimeMs, maxMemoryUsageMb, numAllowedQueries, maxQueryDurationMs, maxQueryUrlLength, maxQueryRequestBytes, maxQueryResponseBytes, }: SimulationInput) => Promise<SimulationResult>;
