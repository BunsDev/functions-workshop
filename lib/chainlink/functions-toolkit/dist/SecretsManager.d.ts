import type { Signer } from 'ethers';
import type { ThresholdPublicKey, GatewayResponse } from './types';
export declare class SecretsManager {
    private signer;
    private functionsRouter;
    private functionsCoordinator;
    private donId?;
    private initialized;
    constructor({ signer, functionsRouterAddress, donId, }: {
        signer: Signer;
        functionsRouterAddress: string;
        donId: string;
    });
    initialize(): Promise<void>;
    private isInitialized;
    /**
     * @returns a Promise that resolves to an object that contains the DONpublicKey and an object that maps node addresses to their public keys
     */
    fetchKeys(): Promise<{
        thresholdPublicKey: ThresholdPublicKey;
        donPublicKey: string;
    }>;
    encryptSecretsUrls(secretsUrls: string[]): Promise<string>;
    verifyOffchainSecrets(secretsUrls: string[]): Promise<boolean>;
    encryptSecrets(secrets?: Record<string, string>): Promise<{
        encryptedSecrets: string;
    }>;
    uploadEncryptedSecretsToDON({ encryptedSecretsHexstring, gatewayUrls, slotId, minutesUntilExpiration, }: {
        encryptedSecretsHexstring: string;
        gatewayUrls: string[];
        slotId: number;
        minutesUntilExpiration: number;
    }): Promise<{
        version: number;
        success: boolean;
    }>;
    private validateGatewayUrls;
    private sendMessageToGateways;
    private createGatewayMessage;
    private createGatewayMessageBody;
    private extractNodeResponses;
    listDONHostedEncryptedSecrets(gatewayUrls: string[]): Promise<{
        result: GatewayResponse;
        error?: string;
    }>;
    private verifyDONHostedSecrets;
    buildDONHostedEncryptedSecretsReference: ({ slotId, version, }: {
        slotId: number;
        version: number;
    }) => string;
}
