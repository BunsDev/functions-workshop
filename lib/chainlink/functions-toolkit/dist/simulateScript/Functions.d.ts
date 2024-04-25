/// <reference types="node" />
import type { AxiosResponse, AxiosError } from 'axios';
interface RequestOptions {
    url: string;
    method?: HttpMethod;
    params?: Record<string, unknown>;
    headers?: Record<string, string>;
    data?: Record<string, unknown>;
    timeout?: number;
    responseType?: ResponseType;
}
type HttpMethod = 'get' | 'head' | 'post' | 'put' | 'delete' | 'connect' | 'options' | 'trace';
type ResponseType = 'json' | 'arraybuffer' | 'document' | 'text' | 'stream';
type HttpResponse = SuccessHttpResponse | ErrorHttpResponse;
interface SuccessHttpResponse extends AxiosResponse {
    error: false;
    config: never;
}
interface ErrorHttpResponse extends AxiosError {
    error: true;
    config: never;
}
export interface UserHttpQuery {
    url?: string;
    method?: string;
    timeout?: number;
    success?: boolean;
}
export declare class FunctionsModule {
    buildFunctionsmodule: (numAllowedQueries: number) => {
        makeHttpRequest: ({ url, method, params, headers, data, timeout, responseType, }: RequestOptions) => Promise<HttpResponse>;
        encodeUint256: (result: number | bigint) => Buffer;
        encodeInt256: (result: number | bigint) => Buffer;
        encodeString: (result: string) => Buffer;
    };
    private makeHttpRequestFactory;
    static encodeUint256: (result: number | bigint) => Buffer;
    static encodeInt256: (result: number | bigint) => Buffer;
    static encodeString: (result: string) => Buffer;
    static encodePosSignedInt: (int: bigint) => Buffer;
    static encodeNegSignedInt: (int: bigint) => Buffer;
    static maxUint256: bigint;
    static maxPosInt256: bigint;
    static maxNegInt256: bigint;
}
export {};
