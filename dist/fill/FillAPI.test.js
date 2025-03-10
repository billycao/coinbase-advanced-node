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
const GET_200_json_1 = __importDefault(require("../test/fixtures/rest/fills/product_id/BTC-EUR/GET-200.json"));
const FillAPI_1 = require("./FillAPI");
const querystring_1 = __importDefault(require("querystring"));
describe('FillAPI', () => {
    afterAll(() => nock_1.default.cleanAll());
    beforeAll(() => {
        (0, nock_1.default)(global.REST_URL)
            .persist()
            .get(FillAPI_1.FillAPI.URL.FILLS)
            .query(true)
            .reply(uri => {
            const query = querystring_1.default.parse(`${global.REST_URL}${uri}`);
            const payload = GET_200_json_1.default;
            if (Object.keys(query).includes('?product_id')) {
                payload.fills = payload.fills.filter(filled => (filled.product_id = query['?product_id']));
            }
            if (Object.keys(query).includes('?order_id')) {
                payload.fills = payload.fills.filter(filled => (filled.order_id = query['?order_id']));
            }
            return [200, JSON.stringify(payload)];
        });
    });
    describe('getFillsByOrderId', () => {
        it('filters filled orders by order ID', () => __awaiter(void 0, void 0, void 0, function* () {
            const filledOrders = yield global.client.rest.fill.getFillsByOrderId('0000-000000-000000');
            expect(filledOrders.data[0].trade_id).toBe('1111-11111-111111');
        }));
    });
    describe('getFillsByProductId', () => {
        it('filters filled orders by product ID', () => __awaiter(void 0, void 0, void 0, function* () {
            const filledOrders = yield global.client.rest.fill.getFillsByProductId('BTC-USD');
            expect(filledOrders.data.length).toBe(1);
        }));
    });
});
//# sourceMappingURL=FillAPI.test.js.map