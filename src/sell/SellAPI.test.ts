import nock from 'nock';
import {TransactionStatus} from '../payload';
import {SharedRequestService} from '../util/shared-request';
import {SellAPI} from './SellAPI';

describe('SellAPI', () => {
  const mockSell = {
    amount: {
      amount: '10.00',
      currency: 'USD',
    },
    committed: false,
    created_at: '2015-01-31T20:49:02Z',
    fee: {
      amount: '0.00',
      currency: 'USD',
    },
    id: '67e0eaec-07d7-54c4-a72c-2e92826897df',
    payment_method: {
      id: '83562370-3e5c-51db-87da-752af5ab9559',
      resource: 'payment_method',
      resource_path: '/v2/payment-methods/83562370-3e5c-51db-87da-752af5ab9559',
    },
    payout_at: '2015-02-18T16:54:00-08:00',
    resource: 'sell',
    resource_path: '/v2/accounts/2bbf394c-193b-5b2a-9155-3b4732659ede/Sells/67e0eaec-07d7-54c4-a72c-2e92826897df',
    status: 'completed',
    subtotal: {
      amount: '10.00',
      currency: 'USD',
    },
    transaction: {
      id: '441b9494-b3f0-5b98-b9b0-4d82c21c252a',
      resource: 'transaction',
      resource_path:
        '/v2/accounts/2bbf394c-193b-5b2a-9155-3b4732659ede/transactions/441b9494-b3f0-5b98-b9b0-4d82c21c252a',
    },
    updated_at: '2015-02-11T16:54:02-08:00',
  };

  afterAll(() => nock.cleanAll());

  describe('createSell', () => {
    beforeAll(() => {
      nock(global.REST_URL)
        .persist()
        .post(`${SharedRequestService.BASE_URL}/83562370-3e5c-51db-87da-752af5ab9559/${SellAPI.SHARED_REF}`)
        .reply(200, JSON.stringify({data: mockSell}));
    });

    it('Sell to a payment method', async () => {
      const w = await client.rest.sell.createSell({
        accountId: '83562370-3e5c-51db-87da-752af5ab9559',
        agree_btc_amount_varies: true,
        amount: '10.00',
        commit: true,
        currency: 'USD',
        payment_method: '1111111-11111111-111111',
        quote: false,
      });
      expect(w.payout_at).toBe('2015-02-18T16:54:00-08:00');
    });
  });

  describe('getSell', () => {
    beforeAll(() => {
      nock(global.REST_URL)
        .persist()
        .get(
          `${SharedRequestService.BASE_URL}/83562370-3e5c-51db-87da-752af5ab9559/${SellAPI.SHARED_REF}/67e0eaec-07d7-54c4-a72c-2e92826897df`
        )
        .reply(200, JSON.stringify({data: mockSell}));
    });

    it('get Sell information', async () => {
      const w = await client.rest.sell.getSell(
        '83562370-3e5c-51db-87da-752af5ab9559',
        '67e0eaec-07d7-54c4-a72c-2e92826897df'
      );
      expect(w.status).toBe(TransactionStatus.COMPLETED);
    });
  });

  describe('commitSell', () => {
    beforeAll(() => {
      nock(global.REST_URL)
        .persist()
        .post(
          `${SharedRequestService.BASE_URL}/83562370-3e5c-51db-87da-752af5ab9559/${SellAPI.SHARED_REF}/67e0eaec-07d7-54c4-a72c-2e92826897df`
        )
        .reply(200, JSON.stringify({data: mockSell}));
    });

    it('commits a sell', async () => {
      const w = await client.rest.sell.commitSell(
        '83562370-3e5c-51db-87da-752af5ab9559',
        '67e0eaec-07d7-54c4-a72c-2e92826897df'
      );
      expect(w.status).toBe(TransactionStatus.COMPLETED);
    });
  });

  describe('getSells', () => {
    beforeAll(() => {
      nock(global.REST_URL)
        .persist()
        .get(`${SharedRequestService.BASE_URL}/83562370-3e5c-51db-87da-752af5ab9559/${SellAPI.SHARED_REF}`)
        .reply(
          200,
          JSON.stringify({
            data: [
              {
                amount: {
                  amount: '10.00',
                  currency: 'USD',
                },
                committed: true,
                created_at: '2015-01-31T20:49:02Z',
                fee: {
                  amount: '0.00',
                  currency: 'USD',
                },
                id: '67e0eaec-07d7-54c4-a72c-2e92826897df',
                payment_method: {
                  id: '83562370-3e5c-51db-87da-752af5ab9559',
                  resource: 'payment_method',
                  resource_path: '/v2/payment-methods/83562370-3e5c-51db-87da-752af5ab9559',
                },
                payout_at: '2015-02-18T16:54:00-08:00',
                resource: 'sell',
                resource_path:
                  '/v2/accounts/2bbf394c-193b-5b2a-9155-3b4732659ede/sells/67e0eaec-07d7-54c4-a72c-2e92826897df',
                status: 'completed',
                subtotal: {
                  amount: '10.00',
                  currency: 'USD',
                },
                transaction: {
                  id: '441b9494-b3f0-5b98-b9b0-4d82c21c252a',
                  resource: 'transaction',
                  resource_path:
                    '/v2/accounts/2bbf394c-193b-5b2a-9155-3b4732659ede/transactions/441b9494-b3f0-5b98-b9b0-4d82c21c252a',
                },
                updated_at: '2015-02-11T16:54:02-08:00',
              },
            ],
            pagination: {
              ending_before: null,
              limit: 25,
              next_uri: null,
              order: 'desc',
              previous_uri: null,
              starting_after: null,
            },
          })
        );
    });

    it('get all sell information for account', async () => {
      const w = await client.rest.sell.listSells('83562370-3e5c-51db-87da-752af5ab9559');
      expect(w.data[0].status).toBe(TransactionStatus.COMPLETED);
    });
  });
});
