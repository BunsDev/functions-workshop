type Hexstring = `0x${string}`;
interface SimulationParams {
    source: string;
    secrets?: Record<string, string>;
    args?: string[];
    maxHttpRequests?: number;
    maxResponseBytes?: number;
    maxExecutionDurationMs?: number;
}
export declare const simulateScript: ({ source, secrets, args, maxHttpRequests, maxResponseBytes, maxExecutionDurationMs, }: SimulationParams) => Promise<{
    result?: `0x${string}` | undefined;
    error?: Error | undefined;
    capturedStdout?: string | undefined;
}>;
export {};
