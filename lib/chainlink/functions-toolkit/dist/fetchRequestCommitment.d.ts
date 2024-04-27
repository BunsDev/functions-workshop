import type { RequestCommitmentFetchConfig, RequestCommitment } from './types';
export declare const fetchRequestCommitment: ({ requestId, provider, functionsRouterAddress, donId, toBlock, pastBlocksToSearch, }: RequestCommitmentFetchConfig) => Promise<RequestCommitment>;
