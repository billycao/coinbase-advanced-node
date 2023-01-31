import nock from 'nock';
import verifyPayload from '../test/fixtures/rest/users/self/verify/GET-200.json';
import {UserAPI} from './UserAPI';

describe('UserAPI', () => {
  afterAll(() => nock.cleanAll());

  beforeAll(() => {
    nock(global.SIWC_REST_URL)
      .persist()
      .get(`${UserAPI.URL.USERS}/9da7a204-544e-5fd1-9a12-61176c5d4cd8`)
      .query(true)
      .reply(() => {
        return [200, JSON.stringify(verifyPayload)];
      });

    nock(global.SIWC_REST_URL)
      .persist()
      .get(`${UserAPI.URL.USERS}/auth`)
      .query(true)
      .reply(() => {
        return [
          200,
          JSON.stringify({
            data: {
              method: 'oauth',
              oauth_meta: {},
              scopes: ['wallet:user:read', 'wallet:user:email'],
            },
          }),
        ];
      });
  });

  describe('fetchUserInfo', () => {
    it('verifies the authentication data', async () => {
      const verifiedUser = await global.client.rest.user.fetchUserInfo('9da7a204-544e-5fd1-9a12-61176c5d4cd8');
      expect(verifiedUser.name).toBe('User One');
    });
  });

  describe('fetchAuthorizationInfo', () => {
    it('verifies the authentication data', async () => {
      const verifiedUser = await global.client.rest.user.fetchAuthorizationInfo();
      expect(verifiedUser.scopes.length).toBeGreaterThan(1);
    });
  });
});
