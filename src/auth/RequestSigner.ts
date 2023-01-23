import crypto from 'crypto';
import {ClientAuthentication} from '../Coinbase';
// import {Buffer} from 'buffer/';

export interface RequestSetup {
  httpMethod: string;
  payload: string;
  requestPath: string;
  ws?: boolean;
}

export interface SignedRequest {
  key: string | null;
  signature: string;
  timestamp: number;
}

export class RequestSigner {
  // https://docs.cloud.coinbase.com/exchange/docs/authorization-and-authentication#creating-a-request
  static signRequest(auth: ClientAuthentication, setup: RequestSetup, clockSkew: number): SignedRequest {
    const timestamp = Math.floor(Date.now() / 1000) + clockSkew;
    const what = `${timestamp}${setup.httpMethod.toUpperCase()}${setup.requestPath}${setup.payload}`;
    const sig = crypto.createHmac('sha256', auth.apiSecret).update(what);
    const signature = sig.digest('hex');

    return {
      key: auth.oauthToken ? null : auth.apiKey,
      signature: auth.oauthToken || signature,
      timestamp,
    };
  }
}
