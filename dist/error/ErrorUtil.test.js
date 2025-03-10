"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ErrorUtil_1 = require("./ErrorUtil");
describe('ErrorUtil', () => {
    describe('inAirPlaneMode', () => {
        it('recognizes connection aborts', () => {
            const error = {
                code: 'ECONNABORTED',
            };
            expect((0, ErrorUtil_1.inAirPlaneMode)(error)).toBe(true);
        });
    });
    describe('gotRateLimited', () => {
        it('recognizes errors caused by rate limiting', () => {
            const someError = new Error('Something went wrong.');
            expect((0, ErrorUtil_1.gotRateLimited)(someError)).toBe(false);
            const someResponse = {
                response: {},
            };
            expect((0, ErrorUtil_1.gotRateLimited)(someResponse)).toBe(false);
            const rateLimitError = {
                response: {
                    status: 429,
                },
            };
            expect((0, ErrorUtil_1.gotRateLimited)(rateLimitError)).toBe(true);
        });
    });
    describe('getErrorMessage', () => {
        it('parses the error message', () => {
            const message = 'Something went wrong.';
            const error = new Error(message);
            expect((0, ErrorUtil_1.getErrorMessage)(error)).toBe(message);
        });
        it('falls back to the standard error message', () => {
            const message = 'Something went wrong.';
            const error = {
                message,
                response: {
                    data: {},
                },
            };
            expect((0, ErrorUtil_1.getErrorMessage)(error)).toBe(message);
        });
        it('parses the error message from a server response', () => {
            const message = 'Something went wrong.';
            const error = {
                message,
                response: {
                    data: {
                        message,
                    },
                },
            };
            expect((0, ErrorUtil_1.getErrorMessage)(error)).toBe(message);
        });
    });
});
//# sourceMappingURL=ErrorUtil.test.js.map