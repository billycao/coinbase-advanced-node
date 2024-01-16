import { RESTClient } from './client/RESTClient';
import { WebSocketClient } from './client/WebSocketClient';
export interface ClientAuthenticationBase {
    apiKey: string;
    apiSecret: string;
    oauthToken?: string | undefined | null;
}
export interface ClientAuthenticationBaseUrls extends ClientAuthenticationBase {
    apiKey: string;
    apiSecret: string;
    oauthToken?: string | undefined | null;
}
export interface ClientAuthenticationCustomUrls extends ClientAuthenticationBase {
    advTradeHttpUrl: string;
    apiKey: string;
    apiSecret: string;
    oauthToken?: string | undefined | null;
    siwcHttpUrl: string;
    wsUrl: string;
}
export declare type ClientAuthentication = ClientAuthenticationBaseUrls | ClientAuthenticationCustomUrls;
export interface ClientConnection {
    REST_ADV_TRADE: string;
    REST_SIWC: string;
    WebSocket: string;
}
export declare class Coinbase {
    readonly rest: RESTClient;
    readonly url: ClientConnection;
    readonly ws: WebSocketClient;
    static readonly SETUP: {
        PRODUCTION: ClientConnection;
    };
    private clockSkew;
    constructor(auth?: ClientAuthentication);
}
