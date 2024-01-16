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
const payload_1 = require("../payload");
const shared_request_1 = require("../util/shared-request");
const SellAPI_1 = require("./SellAPI");
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
            resource_path: '/v2/accounts/2bbf394c-193b-5b2a-9155-3b4732659ede/transactions/441b9494-b3f0-5b98-b9b0-4d82c21c252a',
        },
        updated_at: '2015-02-11T16:54:02-08:00',
    };
    afterAll(() => nock_1.default.cleanAll());
    describe('createSell', () => {
        beforeAll(() => {
            (0, nock_1.default)(global.SIWC_REST_URL)
                .persist()
                .post(`${shared_request_1.SharedRequestService.BASE_URL}/83562370-3e5c-51db-87da-752af5ab9559/${SellAPI_1.SellAPI.SHARED_REF}`)
                .reply(200, JSON.stringify({ data: mockSell }));
        });
        it('Sell to a payment method', () => __awaiter(void 0, void 0, void 0, function* () {
            const w = yield client.rest.sell.createSell({
                accountId: '83562370-3e5c-51db-87da-752af5ab9559',
                agree_btc_amount_varies: true,
                amount: '10.00',
                commit: true,
                currency: 'USD',
                payment_method: '1111111-11111111-111111',
                quote: false,
            });
            expect(w.payout_at).toBe('2015-02-18T16:54:00-08:00');
        }));
    });
    describe('getSell', () => {
        beforeAll(() => {
            (0, nock_1.default)(global.SIWC_REST_URL)
                .persist()
                .get(`${shared_request_1.SharedRequestService.BASE_URL}/83562370-3e5c-51db-87da-752af5ab9559/${SellAPI_1.SellAPI.SHARED_REF}/67e0eaec-07d7-54c4-a72c-2e92826897df`)
                .reply(200, JSON.stringify({ data: mockSell }));
        });
        it('get Sell information', () => __awaiter(void 0, void 0, void 0, function* () {
            const w = yield client.rest.sell.getSell('83562370-3e5c-51db-87da-752af5ab9559', '67e0eaec-07d7-54c4-a72c-2e92826897df');
            expect(w.status).toBe(payload_1.TransactionStatus.COMPLETED);
        }));
    });
    describe('commitSell', () => {
        beforeAll(() => {
            (0, nock_1.default)(global.SIWC_REST_URL)
                .persist()
                .post(`${shared_request_1.SharedRequestService.BASE_URL}/83562370-3e5c-51db-87da-752af5ab9559/${SellAPI_1.SellAPI.SHARED_REF}/67e0eaec-07d7-54c4-a72c-2e92826897df/commit`)
                .reply(200, JSON.stringify({ data: mockSell }));
        });
        it('commits a sell', () => __awaiter(void 0, void 0, void 0, function* () {
            const w = yield client.rest.sell.commitSell('83562370-3e5c-51db-87da-752af5ab9559', '67e0eaec-07d7-54c4-a72c-2e92826897df');
            expect(w.status).toBe(payload_1.TransactionStatus.COMPLETED);
        }));
    });
    describe('getSells', () => {
        beforeAll(() => {
            (0, nock_1.default)(global.SIWC_REST_URL)
                .persist()
                .get(`${shared_request_1.SharedRequestService.BASE_URL}/83562370-3e5c-51db-87da-752af5ab9559/${SellAPI_1.SellAPI.SHARED_REF}`)
                .reply(200, JSON.stringify({
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
                        resource_path: '/v2/accounts/2bbf394c-193b-5b2a-9155-3b4732659ede/sells/67e0eaec-07d7-54c4-a72c-2e92826897df',
                        status: 'completed',
                        subtotal: {
                            amount: '10.00',
                            currency: 'USD',
                        },
                        transaction: {
                            id: '441b9494-b3f0-5b98-b9b0-4d82c21c252a',
                            resource: 'transaction',
                            resource_path: '/v2/accounts/2bbf394c-193b-5b2a-9155-3b4732659ede/transactions/441b9494-b3f0-5b98-b9b0-4d82c21c252a',
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
            }));
        });
        it('get all sell information for account', () => __awaiter(void 0, void 0, void 0, function* () {
            const w = yield client.rest.sell.listSells('83562370-3e5c-51db-87da-752af5ab9559');
            expect(w.data[0].status).toBe(payload_1.TransactionStatus.COMPLETED);
        }));
    });
});
//# sourceMappingURL=SellAPI.test.js.map