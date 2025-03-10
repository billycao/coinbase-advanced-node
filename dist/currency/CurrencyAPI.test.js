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
const CurrencyAPI_1 = require("./CurrencyAPI");
describe('CurrencyAPI', () => {
    afterEach(() => nock_1.default.cleanAll());
    describe('listCurrencies', () => {
        it('list available currencies', () => __awaiter(void 0, void 0, void 0, function* () {
            (0, nock_1.default)(global.SIWC_REST_URL)
                .get(CurrencyAPI_1.CurrencyAPI.URL.CURRENCIES)
                .query(true)
                .reply(200, JSON.stringify({ data: [{ id: 'BIF', min_size: '1.00000000', name: 'Burundian Franc' }] }));
            const currencies = yield global.client.rest.currency.listCurrencies();
            expect(currencies.length).toBe(1);
            expect(currencies[0].id).toBe('BIF');
        }));
    });
});
//# sourceMappingURL=CurrencyAPI.test.js.map