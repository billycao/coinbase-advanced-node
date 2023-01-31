import {ClientConnection, Coinbase} from '../../Coinbase';
import nock from 'nock';
import {TimeAPI} from '../../time/TimeAPI';

declare global {
  /* eslint-disable no-var */
  var client: Coinbase;
  var REST_URL: string;
  var SIWC_REST_URL: string;
  var clientConnection: ClientConnection;
  /* eslint-enable no-var */
}

// URL to mock a server using "nock":
global.REST_URL = Coinbase.SETUP.PRODUCTION.REST_ADV_TRADE;
global.SIWC_REST_URL = Coinbase.SETUP.PRODUCTION.REST_SIWC;
global.clientConnection = Coinbase.SETUP.PRODUCTION;

beforeEach(() => {
  nock(global.SIWC_REST_URL)
    .persist()
    .get(TimeAPI.URL.TIME)
    .query(true)
    .reply(() => {
      const date = new Date();
      return [
        200,
        JSON.stringify({
          data: {
            epoch: date.getTime() / 1000,
            iso: date.toISOString(),
          },
        }),
      ];
    });

  global.client = new Coinbase({
    apiKey: 'xxxxx',
    apiSecret: 'xxxxx',
  });
});
