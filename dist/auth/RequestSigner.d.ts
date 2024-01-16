import { ClientAuthentication } from '../Coinbase';
export interface RequestSetup {
    httpMethod: string;
    payload: string;
    requestPath: string;
    ws?: boolean;
}
export interface SignedRequest {
    key: string | null;
    oauth: boolean;
    signature: string;
    timestamp: number;
}
export declare class RequestSigner {
    static signRequest(auth: ClientAuthentication, setup: RequestSetup, clockSkew: number): SignedRequest;
}
