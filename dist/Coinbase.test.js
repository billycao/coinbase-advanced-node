"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Coinbase_1 = require("./Coinbase");
describe('Coinbase', () => {
    describe('constructor', () => {
        it("uses Coinbase Pro's production environment by default", () => {
            const client = new Coinbase_1.Coinbase();
            expect(client.url.REST_ADV_TRADE).toBe(Coinbase_1.Coinbase.SETUP.PRODUCTION.REST_ADV_TRADE);
        });
        it("supports Coinbase Pro's production environment", () => {
            const client = new Coinbase_1.Coinbase({
                apiKey: '',
                apiSecret: '',
            });
            expect(client.url.REST_ADV_TRADE).toBe(Coinbase_1.Coinbase.SETUP.PRODUCTION.REST_ADV_TRADE);
        });
        it('supports custom URLs to use a proxy server', () => {
            const proxyUrl = 'http://localhost:3000/rest-proxy-advance';
            const proxyUrl2 = 'http://localhost:3000/rest-proxy-siwc';
            const client = new Coinbase_1.Coinbase({
                advTradeHttpUrl: proxyUrl,
                apiKey: '',
                apiSecret: '',
                oauthToken: '',
                siwcHttpUrl: proxyUrl2,
            });
            expect(client.url.REST_ADV_TRADE).toBe(proxyUrl);
        });
    });
});
//# sourceMappingURL=Coinbase.test.js.map