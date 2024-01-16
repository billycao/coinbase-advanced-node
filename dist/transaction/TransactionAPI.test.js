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
const TransactionAPI_1 = require("./TransactionAPI");
describe('TransactionAPI', () => {
    afterAll(() => nock_1.default.cleanAll());
    const accountId = '2bbf394c-193b-5b2a-9155-3b4732659ede';
    const transactionID = '57ffb4ae-0c59-5430-bcd3-3f98f797a66c';
    const mockSendResponse = {
        data: {
            amount: {
                amount: '-0.10000000',
                currency: 'BTC',
            },
            created_at: '2015-01-31T20:49:02Z',
            description: null,
            details: {
                subtitle: 'to User 2',
                title: 'Send bitcoin',
            },
            id: '3c04e35e-8e5a-5ff1-9155-00675db4ac02',
            native_amount: {
                amount: '-1.00',
                currency: 'USD',
            },
            network: {
                hash: '463397c87beddd9a61ade61359a13adc9efea26062191fe07147037bce7f33ed',
                name: 'bitcoin',
                status: 'unconfirmed',
            },
            resource: 'transaction',
            resource_path: '/v2/accounts/2bbf394c-193b-5b2a-9155-3b4732659ede/transactions/3c04e35e-8e5a-5ff1-9155-00675db4ac02',
            status: 'pending',
            to: {
                address: '1AUJ8z5RuHRTqD1eikyfUUetzGmdWLGkpT',
                resource: 'bitcoin_address',
            },
            type: 'send',
            updated_at: '2015-03-31T17:25:29-07:00',
        },
    };
    const mockAllTransactions = {
        data: [
            {
                amount: {
                    amount: '486.34313725',
                    currency: 'BTC',
                },
                buy: {
                    id: '9e14d574-30fa-5d85-b02c-6be0d851d61d',
                    resource: 'buy',
                    resource_path: '/v2/accounts/2bbf394c-193b-5b2a-9155-3b4732659ede/buys/9e14d574-30fa-5d85-b02c-6be0d851d61d',
                },
                created_at: '2015-03-26T23:44:08-07:00',
                description: null,
                details: {
                    subtitle: 'using Capital One Bank',
                    title: 'Bought bitcoin',
                },
                id: '4117f7d6-5694-5b36-bc8f-847509850ea4',
                native_amount: {
                    amount: '4863.43',
                    currency: 'USD',
                },
                resource: 'transaction',
                resource_path: '/v2/accounts/2bbf394c-193b-5b2a-9155-3b4732659ede/transactions/4117f7d6-5694-5b36-bc8f-847509850ea4',
                status: 'pending',
                type: 'buy',
                updated_at: '2015-03-26T23:44:08-07:00',
            },
            {
                amount: {
                    amount: '0.10000000',
                    currency: 'BTC',
                },
                created_at: '2015-03-24T18:32:35-07:00',
                description: '',
                details: {
                    subtitle: 'from rb@coinbase.com',
                    title: 'Requested bitcoin',
                },
                id: '005e55d1-f23a-5d1e-80a4-72943682c055',
                native_amount: {
                    amount: '1.00',
                    currency: 'USD',
                },
                resource: 'transaction',
                resource_path: '/v2/accounts/2bbf394c-193b-5b2a-9155-3b4732659ede/transactions/005e55d1-f23a-5d1e-80a4-72943682c055',
                status: 'pending',
                to: {
                    email: 'rb@coinbase.com',
                    resource: 'email',
                },
                type: 'request',
                updated_at: '2015-01-31T20:49:02Z',
            },
            {
                amount: {
                    amount: '-5.00000000',
                    currency: 'BTC',
                },
                created_at: '2015-03-12T15:51:38-07:00',
                description: '',
                details: {
                    subtitle: 'to Secondary Account',
                    title: 'Transfered bitcoin',
                },
                id: 'ff01bbc6-c4ad-59e1-9601-e87b5b709458',
                native_amount: {
                    amount: '-50.00',
                    currency: 'USD',
                },
                resource: 'transaction',
                resource_path: '/v2/accounts/2bbf394c-193b-5b2a-9155-3b4732659ede/transactions/ff01bbc6-c4ad-59e1-9601-e87b5b709458',
                status: 'completed',
                to: {
                    id: '58542935-67b5-56e1-a3f9-42686e07fa40',
                    resource: 'account',
                    resource_path: '/v2/accounts/58542935-67b5-56e1-a3f9-42686e07fa40',
                },
                type: 'transfer',
                updated_at: '2015-01-31T20:49:02Z',
            },
            {
                amount: {
                    amount: '-0.00100000',
                    currency: 'BTC',
                },
                created_at: '2015-03-11T13:13:35-07:00',
                description: null,
                details: {
                    subtitle: 'to User 2',
                    title: 'Send bitcoin',
                },
                id: '57ffb4ae-0c59-5430-bcd3-3f98f797a66c',
                native_amount: {
                    amount: '-0.01',
                    currency: 'USD',
                },
                network: {
                    name: 'bitcoin',
                    status: 'off_blockchain',
                },
                resource: 'transaction',
                resource_path: '/v2/accounts/2bbf394c-193b-5b2a-9155-3b4732659ede/transactions/57ffb4ae-0c59-5430-bcd3-3f98f797a66c',
                status: 'completed',
                to: {
                    id: 'a6b4c2df-a62c-5d68-822a-dd4e2102e703',
                    resource: 'user',
                    resource_path: '/v2/users/a6b4c2df-a62c-5d68-822a-dd4e2102e703',
                },
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
    };
    const mockTransaction = {
        amount: {
            amount: '-0.00100000',
            currency: 'BTC',
        },
        created_at: '2015-03-11T13:13:35-07:00',
        description: null,
        details: {
            subtitle: 'to User 2',
            title: 'Send bitcoin',
        },
        id: '57ffb4ae-0c59-5430-bcd3-3f98f797a66c',
        native_amount: {
            amount: '-0.01',
            currency: 'USD',
        },
        network: {
            name: 'bitcoin',
            status: 'off_blockchain',
        },
        resource: 'transaction',
        resource_path: '/v2/accounts/2bbf394c-193b-5b2a-9155-3b4732659ede/transactions/57ffb4ae-0c59-5430-bcd3-3f98f797a66c',
        status: 'completed',
        to: {
            id: 'a6b4c2df-a62c-5d68-822a-dd4e2102e703',
            resource: 'user',
            resource_path: '/v2/users/a6b4c2df-a62c-5d68-822a-dd4e2102e703',
        },
        type: 'send',
        updated_at: '2015-03-26T15:55:43-07:00',
    };
    beforeAll(() => {
        (0, nock_1.default)(global.SIWC_REST_URL)
            .persist()
            .get(`${shared_request_1.SharedRequestService.BASE_URL}/${accountId}/${TransactionAPI_1.TransactionAPI.SHARED_REF}/${transactionID}`)
            .reply(200, JSON.stringify({ data: mockTransaction }));
        (0, nock_1.default)(global.SIWC_REST_URL)
            .persist()
            .get(`${shared_request_1.SharedRequestService.BASE_URL}/${accountId}/${TransactionAPI_1.TransactionAPI.SHARED_REF}`)
            .reply(200, JSON.stringify(mockAllTransactions));
        (0, nock_1.default)(global.SIWC_REST_URL)
            .persist()
            .post(`/accounts/${accountId}/transactions`)
            .reply(200, JSON.stringify(mockSendResponse));
    });
    describe('getTransaction', () => {
        it('returns a transaction', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield global.client.rest.transaction.getTransaction(accountId, transactionID);
            expect(res.id).toBe('57ffb4ae-0c59-5430-bcd3-3f98f797a66c');
        }));
    });
    describe('listTransactions', () => {
        it('returns all transactions', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield global.client.rest.transaction.listTransactions(accountId);
            expect(res.data[0].id).toBe(mockAllTransactions.data[0].id);
        }));
    });
    describe('sendTransactions', () => {
        it('creates a new transaction', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield global.client.rest.transaction.sendTransaction(accountId, {
                amount: '0.0001',
                currency: 'BTC',
                description: 'test transaction',
                to: '1AUJ8z5RuHRTqD1eikyfUUetzGmdWLGkpT',
                type: payload_1.TransactionType.SEND,
            });
            expect(res.id).toBe(mockSendResponse.data.id);
        }));
    });
});
//# sourceMappingURL=TransactionAPI.test.js.map