import {RESTClient} from './client/RESTClient';
import {WebSocketClient} from './client/WebSocketClient';
import {RequestSetup, RequestSigner, SignedRequest} from './auth/RequestSigner';

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

export type ClientAuthentication = ClientAuthenticationBaseUrls | ClientAuthenticationCustomUrls;

export interface ClientConnection {
  REST_ADV_TRADE: string;
  REST_SIWC: string;
  WebSocket: string;
}

export class Coinbase {
  readonly rest: RESTClient;
  readonly url: ClientConnection;
  readonly ws: WebSocketClient;

  static readonly SETUP: {
    PRODUCTION: ClientConnection;
  } = {
    PRODUCTION: {
      REST_ADV_TRADE: 'https://api.coinbase.com/api/v3',
      REST_SIWC: 'https://api.coinbase.com/v2',
      WebSocket: 'wss://advanced-trade-ws.coinbase.com',
    },
  };

  private clockSkew: number = -1;

  constructor(
    auth: ClientAuthentication = {
      apiKey: '',
      apiSecret: '',
      oauthToken: undefined,
    }
  ) {
    const {siwcHttpUrl, advTradeHttpUrl, wsUrl} = auth as ClientAuthenticationCustomUrls;
    this.url = {
      REST_ADV_TRADE: advTradeHttpUrl || Coinbase.SETUP.PRODUCTION.REST_ADV_TRADE,
      REST_SIWC: siwcHttpUrl || Coinbase.SETUP.PRODUCTION.REST_SIWC,
      WebSocket: wsUrl || Coinbase.SETUP.PRODUCTION.WebSocket,
    };

    const signRequest = async (setup: RequestSetup): Promise<SignedRequest> => {
      /**
       * Cache clock skew to reduce the amount of API requests:
       * https://github.com/bennycode/coinbase-advanced-node/issues/368#issuecomment-762122575
       */
      if (this.clockSkew === -1) {
        const time = await this.rest.time.getTime();
        this.clockSkew = this.rest.time.getClockSkew(time);
      }

      return RequestSigner.signRequest(auth, setup, this.clockSkew);
    };

    this.rest = new RESTClient(this.url, signRequest);
    this.ws = new WebSocketClient(this.url.WebSocket, signRequest, this.rest);
  }
}
