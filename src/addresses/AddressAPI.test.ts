import nock from 'nock';
import {SharedRequestService} from '../util/shared-request';
import {AddressAPI} from './AddressAPI';

const addressPayload = {
  data: [
    {
      address: 'mswUGcPHp1YnkLCgF1TtoryqSc5E9Q8xFa',
      created_at: '2015-01-31T20:49:02Z',
      id: 'dd3183eb-af1d-5f5d-a90d-cbff946435ff',
      name: null,
      network: 'bitcoin',
      resource: 'address',
      resource_path: '/v2/accounts/2bbf394c-193b-5b2a-9155-3b4732659ede/addresses/dd3183eb-af1d-5f5d-a90d-cbff946435ff',
      updated_at: '2015-03-31T17:25:29-07:00',
    },
    {
      address: 'mgSvu1z1amUFAPkB4cUg8ujaDxKAfZBt5Q',
      created_at: '2015-03-31T17:23:52-07:00',
      id: 'ac5c5f15-0b1d-54f5-8912-fecbf66c2a64',
      name: null,
      network: 'bitcoin',
      resource: 'address',
      resource_path: '/v2/accounts/2bbf394c-193b-5b2a-9155-3b4732659ede/addresses/ac5c5f15-0b1d-54f5-8912-fecbf66c2a64',
      updated_at: '2015-01-31T20:49:02Z',
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
};

describe('AddressAPI', () => {
  afterAll(() => nock.cleanAll());

  beforeAll(() => {
    nock(global.REST_URL)
      .persist()
      .get(`${SharedRequestService.BASE_URL}/2bbf394c-193b-5b2a-9155-3b4732659ede/${AddressAPI.SHARED_REF}`)
      .query(true)
      .reply(200, JSON.stringify(addressPayload));

    nock(global.REST_URL)
      .persist()
      .get(
        `${SharedRequestService.BASE_URL}/2bbf394c-193b-5b2a-9155-3b4732659ede/${AddressAPI.SHARED_REF}/dd3183eb-af1d-5f5d-a90d-cbff946435ff`
      )
      .query(true)
      .reply(200, JSON.stringify({data: addressPayload.data[0]}));

    nock(global.REST_URL)
      .persist()
      .get(
        `${SharedRequestService.BASE_URL}/2bbf394c-193b-5b2a-9155-3b4732659ede/${AddressAPI.SHARED_REF}/dd3183eb-af1d-5f5d-a90d-cbff946435ff/transactions`
      )
      .query(true)
      .reply(
        200,
        JSON.stringify({
          data: [
            {
              amount: {
                amount: '0.00100000',
                currency: 'BTC',
              },
              created_at: '2015-03-11T13:13:35-07:00',
              description: null,
              from: {
                id: 'a6b4c2df-a62c-5d68-822a-dd4e2102e703',
                resource: 'user',
              },
              id: '57ffb4ae-0c59-5430-bcd3-3f98f797a66c',
              native_amount: {
                amount: '0.01',
                currency: 'USD',
              },
              network: {
                name: 'bitcoin',
                status: 'off_blockchain',
              },
              resource: 'transaction',
              resource_path:
                '/v2/accounts/2bbf394c-193b-5b2a-9155-3b4732659ede/transactions/57ffb4ae-0c59-5430-bcd3-3f98f797a66c',
              status: 'completed',
              type: 'send',
              updated_at: '2015-03-26T15:55:43-07:00',
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

    nock(global.REST_URL)
      .persist()
      .post(`${SharedRequestService.BASE_URL}/2bbf394c-193b-5b2a-9155-3b4732659ede/${AddressAPI.SHARED_REF}`)
      .query(true)
      .reply(
        200,
        JSON.stringify({
          address: 'mgSvu1z1amUFAPkB4cUg8ujaDxKAfZBt5Q',
          created_at: '2015-03-31T17:23:52-07:00',
          id: 'ac5c5f15-0b1d-54f5-8912-fecbf66c2a64',
          name: 'A nice name',
          network: 'bitcoin',
          resource: 'address',
          resource_path:
            '/v2/accounts/2bbf394c-193b-5b2a-9155-3b4732659ede/addresses/ac5c5f15-0b1d-54f5-8912-fecbf66c2a64',
          updated_at: '2015-01-31T20:49:02Z',
        })
      );
  });

  describe('listAddresses', () => {
    it('gets a list of trading Addresss', async () => {
      const Addresss = await global.client.rest.address.listAddresses('2bbf394c-193b-5b2a-9155-3b4732659ede');
      expect(Addresss.data.length).toBeGreaterThan(0);
    });
  });

  describe('getAddress', () => {
    it('gets an address', async () => {
      const Addresss = await global.client.rest.address.getAddress(
        '2bbf394c-193b-5b2a-9155-3b4732659ede',
        'dd3183eb-af1d-5f5d-a90d-cbff946435ff'
      );
      expect(Addresss.id).toBe(addressPayload.data[0].id);
    });
  });

  describe('getAddressTransactions', () => {
    it('gets a list of transactions', async () => {
      const t = await global.client.rest.address.getAddressTransactions(
        '2bbf394c-193b-5b2a-9155-3b4732659ede',
        'dd3183eb-af1d-5f5d-a90d-cbff946435ff'
      );
      expect(t.data).toBeGreaterThan(0);
    });
  });

  describe('createAddress', () => {
    it('create an address', async () => {
      const t = await global.client.rest.address.createAddress('2bbf394c-193b-5b2a-9155-3b4732659ede', 'A nice name');
      expect(t.name).toBe('A nice name');
    });
  });
});
