import getAccount from '../test/fixtures/rest/accounts/322dfa88-e10d-4678-856d-2930eac3e62d/GET-200.json';
import listAccounts from '../test/fixtures/rest/accounts/GET-200.json';
import nock from 'nock';
import {AccountAPI} from './AccountAPI';

const btcAsset = {
  allow_deposits: true,
  allow_withdrawals: true,
  balance: {amount: '0.', currency: 'BTC'},
  created_at: '2021-02-11T05:47:41Z',
  currency: {
    address_regex:
      '^([13][a-km-zA-HJ-NP-Z1-9]{25,34})|^(bc1[qzry9x8gf2tvdw0s3jn54khce6mua7l]([qpzry9x8gf2tvdw0s3jn54khce6mua7l]{38}|[qpzry9x8gf2tvdw0s3jn54khce6mua7l]{58}))$',
    asset_id: '5b71fc48-3dd3-540c-809b-f8c94d0e68b5',
    code: 'BTC',
    color: '#F7931A',
    exponent: 8,
    name: 'Bitcoin',
    slug: 'bitcoin',
    sort_index: 100,
    type: 'crypto',
  },
  id: '0afbdffa-d088-5ae3-a5fa-3312132123123',
  name: 'BTC Wallet',
  primary: true,
  resource: 'account',
  resource_path: '/v2/accounts/0afbdffa-d088-5ae3-a5fa-123412342342',
  type: 'wallet',
  updated_at: '2021-02-23T04:44:17Z',
};

describe('AccountAPI', () => {
  afterAll(() => nock.cleanAll());

  beforeAll(() => {
    nock(global.REST_URL).persist().get(AccountAPI.URL.ACCOUNTS).query(true).reply(200, JSON.stringify(listAccounts));

    nock(global.REST_URL)
      .persist()
      .get(`${AccountAPI.URL.ACCOUNTS}/0afbdffa-d088-5ae3-a5fa-7d6c88f7d53d`)
      .query(true)
      .reply(200, JSON.stringify(getAccount));

    nock(global.SIWC_REST_URL)
      .persist()
      .get(`${AccountAPI.URL.COINBASE_ACCOUNT}/${btcAsset.id}`)
      .query(true)
      .reply(200, JSON.stringify({data: btcAsset}));

    nock(global.SIWC_REST_URL)
      .persist()
      .get(`${AccountAPI.URL.COINBASE_ACCOUNT}`)
      .query(true)
      .reply(
        200,
        JSON.stringify({
          data: [btcAsset],
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

  describe('listAccounts', () => {
    it('gets a list of trading accounts', async () => {
      const accounts = await global.client.rest.account.listAccounts();
      expect(accounts.data.length).toBeGreaterThan(0);
    });
  });

  describe('listCoinbaseAccounts', () => {
    it('returns the list of the coinbase accounts for a given user', async () => {
      const coinbaseAccounts = await global.client.rest.account.listCoinbaseAccounts();
      expect(coinbaseAccounts.data.length).toBeGreaterThanOrEqual(1);
      expect(coinbaseAccounts.data[0].currency.code).toBe('BTC');
    });
  });

  describe('getAccount', () => {
    it('gets information for a single account', async () => {
      const accountId = '0afbdffa-d088-5ae3-a5fa-7d6c88f7d53d';
      const account = await global.client.rest.account.getAccount(accountId);
      expect(account.uuid).toBe(accountId);
    });
  });

  describe('getCoinbaseAccount', () => {
    it('gets information for a single coinbase account', async () => {
      const accounts = await global.client.rest.account.listCoinbaseAccounts();
      const accountId = accounts.data[0].id;
      const account = await global.client.rest.account.getCoinbaseAccount(accountId);
      expect(account.id).toBe(btcAsset.id);
    });
  });
});
