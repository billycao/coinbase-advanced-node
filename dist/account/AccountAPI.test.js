"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GET_200_json_1 = __importDefault(require("../test/fixtures/rest/accounts/322dfa88-e10d-4678-856d-2930eac3e62d/GET-200.json"));
const GET_200_json_2 = __importDefault(require("../test/fixtures/rest/accounts/GET-200.json"));
const nock_1 = __importDefault(require("nock"));
const AccountAPI_1 = require("./AccountAPI");
const btcAsset = {
    allow_deposits: true,
    allow_withdrawals: true,
    balance: { amount: '0.', currency: 'BTC' },
    created_at: '2021-02-11T05:47:41Z',
    currency: {
        address_regex: '^([13][a-km-zA-HJ-NP-Z1-9]{25,34})|^(bc1[qzry9x8gf2tvdw0s3jn54khce6mua7l]([qpzry9x8gf2tvdw0s3jn54khce6mua7l]{38}|[qpzry9x8gf2tvdw0s3jn54khce6mua7l]{58}))$',
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
    afterAll(() => nock_1.default.cleanAll());
    beforeAll(() => {
        (0, nock_1.default)(global.REST_URL).persist().get(AccountAPI_1.AccountAPI.URL.ACCOUNTS).query(true).reply(200, JSON.stringify(GET_200_json_2.default));
        (0, nock_1.default)(global.REST_URL)
            .persist()
            .get(`${AccountAPI_1.AccountAPI.URL.ACCOUNTS}/0afbdffa-d088-5ae3-a5fa-7d6c88f7d53d`)
            .query(true)
            .reply(200, JSON.stringify(GET_200_json_1.default));
        (0, nock_1.default)(global.SIWC_REST_URL)
            .persist()
            .get(`${AccountAPI_1.AccountAPI.URL.COINBASE_ACCOUNT}/${btcAsset.id}`)
            .query(true)
            .reply(200, JSON.stringify({ data: btcAsset }));
        (0, nock_1.default)(global.SIWC_REST_URL)
            .persist()
            .get(`${AccountAPI_1.AccountAPI.URL.COINBASE_ACCOUNT}`)
            .query(true)
            .reply(200, JSON.stringify({
            data: [btcAsset],
            pagination: {
                ending_before: null,
                limit: 25,
                next_uri: null,
                order: 'desc',
                previous_uri: null,
                starting_after: null,
            },
        }));
    });
    describe('listAccounts', () => {
        it('gets a list of trading accounts', () => __awaiter(void 0, void 0, void 0, function* () {
            const accounts = yield global.client.rest.account.listAccounts();
            expect(accounts.data.length).toBeGreaterThan(0);
        }));
    });
    describe('listCoinbaseAccounts', () => {
        it('returns the list of the coinbase accounts for a given user', () => __awaiter(void 0, void 0, void 0, function* () {
            const coinbaseAccounts = yield global.client.rest.account.listCoinbaseAccounts();
            expect(coinbaseAccounts.data.length).toBeGreaterThanOrEqual(1);
            expect(coinbaseAccounts.data[0].currency.code).toBe('BTC');
        }));
    });
    describe('getAccount', () => {
        it('gets information for a single account', () => __awaiter(void 0, void 0, void 0, function* () {
            const accountId = '0afbdffa-d088-5ae3-a5fa-7d6c88f7d53d';
            const account = yield global.client.rest.account.getAccount(accountId);
            expect(account.uuid).toBe(accountId);
        }));
    });
    describe('getCoinbaseAccount', () => {
        it('gets information for a single coinbase account', () => __awaiter(void 0, void 0, void 0, function* () {
            const accounts = yield global.client.rest.account.listCoinbaseAccounts();
            const accountId = accounts.data[0].id;
            const account = yield global.client.rest.account.getCoinbaseAccount(accountId);
            expect(account.id).toBe(btcAsset.id);
        }));
    });
});
//# sourceMappingURL=AccountAPI.test.js.map