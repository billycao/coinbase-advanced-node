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
const nock_1 = __importDefault(require("nock"));
const account_1 = require("../account");
const GET_200_json_1 = __importDefault(require("../test/fixtures/rest/accounts/GET-200.json"));
const RESTClient_1 = require("./RESTClient");
describe('RESTClient', () => {
    function createRESTClient() {
        return new RESTClient_1.RESTClient(global.clientConnection, () => {
            return Promise.resolve({
                key: '',
                oauth: false,
                passphrase: '',
                signature: '',
                timestamp: Math.floor(Date.now() / 1000),
            });
        });
    }
    describe('defaults', () => {
        it('supports overriding the timeout limit', () => {
            const rest = createRESTClient();
            expect(rest.defaults.timeout).toBe(50000);
            rest.defaults.timeout = 2500;
            expect(rest.defaults.timeout).toBe(2500);
        });
    });
    describe('interceptors', () => {
        afterAll(() => nock_1.default.cleanAll());
        beforeAll(() => {
            (0, nock_1.default)(global.REST_URL).persist().get(account_1.AccountAPI.URL.ACCOUNTS).query(true).reply(200, JSON.stringify(GET_200_json_1.default));
        });
        it('supports custom HTTP interceptors', () => __awaiter(void 0, void 0, void 0, function* () {
            const rest = createRESTClient();
            const onRequest = jasmine.createSpy('onRequest').and.callFake((config) => config);
            const myInterceptor = rest.interceptors.request.use(onRequest);
            yield rest.account.listAccounts();
            expect(onRequest).toHaveBeenCalledTimes(1);
            rest.interceptors.request.eject(myInterceptor);
            yield rest.account.listAccounts();
            expect(onRequest).toHaveBeenCalledTimes(1);
        }));
    });
    describe('retries', () => {
        it('retries on HTTP 5xx status codes', () => __awaiter(void 0, void 0, void 0, function* () {
            (0, nock_1.default)(global.REST_URL)
                .get(account_1.AccountAPI.URL.ACCOUNTS)
                .query(true)
                .reply(() => [
                500,
                JSON.stringify({
                    message: 'Test Error',
                }),
            ]);
            (0, nock_1.default)(global.REST_URL).get(account_1.AccountAPI.URL.ACCOUNTS).query(true).reply(200, JSON.stringify(GET_200_json_1.default));
            const rest = createRESTClient();
            const promise = rest.account.listAccounts();
            yield expectAsync(promise).toBeResolved();
        }));
        it('retries when getting rate limited', () => __awaiter(void 0, void 0, void 0, function* () {
            (0, nock_1.default)(global.REST_URL).get(account_1.AccountAPI.URL.ACCOUNTS).query(true).reply(429);
            (0, nock_1.default)(global.REST_URL).get(account_1.AccountAPI.URL.ACCOUNTS).query(true).reply(200, JSON.stringify(GET_200_json_1.default));
            const rest = createRESTClient();
            const promise = rest.account.listAccounts();
            yield expectAsync(promise).toBeResolved();
        }));
    });
});
//# sourceMappingURL=RESTClient.test.js.map