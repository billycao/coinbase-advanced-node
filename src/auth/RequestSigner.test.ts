import {RequestSetup, RequestSigner, SignedRequest} from './RequestSigner';
import {ClientAuthentication} from '../Coinbase';

describe('RequestSigner', () => {
  describe('signRequest', () => {
    beforeAll(() => {
      jasmine.clock().install();
      const baseTime = new Date(1580066918897);
      jasmine.clock().mockDate(baseTime);
    });

    afterAll(() => {
      jasmine.clock().uninstall();
    });

    it('signs GET requests with parameters', () => {
      const auth: ClientAuthentication = {
        apiKey: '163c69bf6c849427616c7e04ee99df52',
        apiSecret: 'kv+3DPw2yHWQWkDsmpN4uXWtgtuBrFFLu7zRk9gipjdrFpUjwZ0mK6KzGAPFpxOjDLdna20xozy+9fqRU5zJZQ==',
      };
      const setup: RequestSetup = {
        httpMethod: 'GET',
        payload: '?product_id=BTC-USD',
        requestPath: '/brokerage/transaction_summary',
      };
      const clockSkew = 0;

      const expected: SignedRequest = {
        key: '163c69bf6c849427616c7e04ee99df52',
        signature: '8dd864f2b61e6b6ded55333aff7902b9d32115f49afa380a4af6a5ff2142adc2',
        timestamp: 1673913588,
      };

      const signature = RequestSigner.signRequest(auth, setup, clockSkew);

      expect(signature.signature).toBe(expected.signature);
    });
  });
});
