import {ClientConnection, Coinbase} from '../../Coinbase';
import nock from 'nock';
import {TimeAPI} from '../../time/TimeAPI';

declare global {
  /* eslint-disable no-var */
  var client: Coinbase;
  var REST_URL: string;
  var clientConnection: ClientConnection;
  /* eslint-enable no-var */
}

// URL to mock a server using "nock":
global.REST_URL = Coinbase.SETUP.PRODUCTION.REST_ADV_TRADE;
global.clientConnection = Coinbase.SETUP.PRODUCTION;

beforeEach(() => {
  nock(global.REST_URL)
    .persist()
    .get(TimeAPI.URL.TIME)
    .query(true)
    .reply(() => {
      const now = new Date();
      return [
        200,
        JSON.stringify({
          epoch: now.getTime() / 1000,
          iso: now.toISOString(),
        }),
      ];
    });

  global.client = new Coinbase({
    apiKey: '',
    apiSecret: '',
  });
});
