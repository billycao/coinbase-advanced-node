"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RequestSigner_1 = require("./RequestSigner");
describe('RequestSigner', () => {
    describe('signRequest', () => {
        beforeAll(() => {
            jasmine.clock().install();
            const baseTime = new Date(1580066918897);
            jasmine.clock().mockDate(baseTime);
        });
        afterAll(() => {
            jasmine.clock().uninstall();
        });
        it('signs GET requests with parameters', () => {
            const auth = {
                apiKey: '163c69bf6c849427616c7e04ee99df52',
                apiSecret: 'kv+3DPw2yHWQWkDsmpN4uXWtgtuBrFFLu7zRk9gipjdrFpUjwZ0mK6KzGAPFpxOjDLdna20xozy+9fqRU5zJZQ==',
            };
            const setup = {
                httpMethod: 'GET',
                payload: '?product_id=BTC-USD',
                requestPath: '/brokerage/transaction_summary',
            };
            const clockSkew = 0;
            const expected = {
                key: '163c69bf6c849427616c7e04ee99df52',
                oauth: false,
                signature: '8aec032b925e03099e5957bb83c063067859b81e902899b5dbde49b3432ce26e',
                timestamp: 1580066918,
            };
            const signature = RequestSigner_1.RequestSigner.signRequest(auth, setup, clockSkew);
            // console.log('SIGNED REQUEST ', signature);
            expect(signature.signature).toBe(expected.signature);
        });
    });
});
//# sourceMappingURL=RequestSigner.test.js.map