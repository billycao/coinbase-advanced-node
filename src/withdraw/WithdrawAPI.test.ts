import nock from 'nock';
import {TransactionStatus} from '../payload';
import {SharedRequestService} from '../util/shared-request';
import {WithdrawAPI} from './WithdrawAPI';

describe('WithdrawAPI', () => {
  const mockWithdrawal = {
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
    resource: 'withdrawal',
    resource_path: '/v2/accounts/2bbf394c-193b-5b2a-9155-3b4732659ede/withdrawals/67e0eaec-07d7-54c4-a72c-2e92826897df',
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

  describe('getPaymentMethods', () => {
    it('gets a list of your payment methods', async () => {
      nock(global.SIWC_REST_URL)
        .persist()
        .get(WithdrawAPI.URL.LIST_PAYMENT_METHODS)
        .reply(
          200,
          JSON.stringify({
            data: [
              {
                allow_buy: true,
                allow_deposit: true,
                allow_sell: true,
                allow_withdraw: true,
                currency: 'USD',
                id: '83562370-3e5c-51db-87da-752af5ab9559',
                limits: {
                  buy: [
                    {
                      period_in_days: 1,
                      remaining: {
                        amount: '10000.00',
                        currency: 'USD',
                      },
                      total: {
                        amount: '10000.00',
                        currency: 'USD',
                      },
                    },
                  ],
                  instant_buy: [
                    {
                      period_in_days: 7,
                      remaining: {
                        amount: '0.00',
                        currency: 'USD',
                      },
                      total: {
                        amount: '0.00',
                        currency: 'USD',
                      },
                    },
                  ],
                  sell: [
                    {
                      period_in_days: 1,
                      remaining: {
                        amount: '10000.00',
                        currency: 'USD',
                      },
                      total: {
                        amount: '10000.00',
                        currency: 'USD',
                      },
                    },
                  ],
                  withdrawal: [
                    {
                      period_in_days: 1,
                      remaining: {
                        amount: '10000.00',
                        currency: 'USD',
                      },
                      total: {
                        amount: '10000.00',
                        currency: 'USD',
                      },
                    },
                  ],
                },
                name: 'Bank of America - eBan... ********7134',
                primary_buy: true,
                primary_sell: true,
                type: 'ach_bank_account',
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

      const paymentMethods = await global.client.rest.withdraw.getPaymentMethods();
      expect(paymentMethods[0].limits.instant_buy[0].period_in_days).toBe(7);
    });
  });

  describe('withdrawToPaymentMethod', () => {
    beforeAll(() => {
      nock(global.SIWC_REST_URL)
        .persist()
        .post(`${SharedRequestService.BASE_URL}/83562370-3e5c-51db-87da-752af5ab9559/${WithdrawAPI.SHARED_REF}`)
        .reply(200, JSON.stringify({data: mockWithdrawal}));
    });

    it('withdraw to a payment method', async () => {
      const w = await client.rest.withdraw.withdrawToPaymentMethod(
        '100.00',
        'USD',
        '2bbf394c-193b-5b2a-9155-3b4732659ede',
        '83562370-3e5c-51db-87da-752af5ab9559'
      );
      expect(w.payout_at).toBe('2015-02-18T16:54:00-08:00');
    });
  });

  describe('getWithdrawal', () => {
    beforeAll(() => {
      nock(global.SIWC_REST_URL)
        .persist()
        .get(
          `${SharedRequestService.BASE_URL}/83562370-3e5c-51db-87da-752af5ab9559/${WithdrawAPI.SHARED_REF}/67e0eaec-07d7-54c4-a72c-2e92826897df`
        )
        .reply(200, JSON.stringify({data: mockWithdrawal}));
    });

    it('get withdrawal information', async () => {
      const w = await client.rest.withdraw.getWithdrawal(
        '83562370-3e5c-51db-87da-752af5ab9559',
        '67e0eaec-07d7-54c4-a72c-2e92826897df'
      );
      expect(w.status).toBe(TransactionStatus.COMPLETED);
    });
  });

  describe('commitWithdrawal', () => {
    beforeAll(() => {
      nock(global.SIWC_REST_URL)
        .persist()
        .post(
          `${SharedRequestService.BASE_URL}/83562370-3e5c-51db-87da-752af5ab9559/${WithdrawAPI.SHARED_REF}/67e0eaec-07d7-54c4-a72c-2e92826897df/commit`
        )
        .reply(200, JSON.stringify({data: mockWithdrawal}));
    });

    it('commits a Withdrawal', async () => {
      const w = await client.rest.withdraw.commitWithdrawal(
        '83562370-3e5c-51db-87da-752af5ab9559',
        '67e0eaec-07d7-54c4-a72c-2e92826897df'
      );
      expect(w.status).toBe(TransactionStatus.COMPLETED);
    });
  });

  describe('listWithdrawals', () => {
    beforeAll(() => {
      nock(global.SIWC_REST_URL)
        .persist()
        .get(`${SharedRequestService.BASE_URL}/83562370-3e5c-51db-87da-752af5ab9559/${WithdrawAPI.SHARED_REF}`)
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
                resource: 'withdrawal',
                resource_path:
                  '/v2/accounts/2bbf394c-193b-5b2a-9155-3b4732659ede/Withdrawals/67e0eaec-07d7-54c4-a72c-2e92826897df',
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

    it('get all Withdrawal information for account', async () => {
      const w = await client.rest.withdraw.listWithdrawals('83562370-3e5c-51db-87da-752af5ab9559');
      expect(w.data[0].status).toBe(TransactionStatus.COMPLETED);
    });
  });
});
