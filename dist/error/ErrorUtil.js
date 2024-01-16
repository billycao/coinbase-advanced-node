"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getErrorMessage = exports.gotRateLimited = exports.inAirPlaneMode = void 0;
function inAirPlaneMode(error) {
    return error.code === 'ECONNABORTED';
}
exports.inAirPlaneMode = inAirPlaneMode;
function gotRateLimited(error) {
    var _a;
    return ((_a = error.response) === null || _a === void 0 ? void 0 : _a.status) === 429;
}
exports.gotRateLimited = gotRateLimited;
/**
 * Possible errors returned from Coinbase Pro API:
 * { message: 'size is too accurate. Smallest unit is 0.00000001' }
 * { message: 'size is too small. Minimum size is 0.10000000' }
 * { message: 'Insufficient funds' }
 * { message: 'NotFound' }
 *
 * Error handling in the official API client:
 * https://github.com/coinbase/coinbase-pro-trading-toolkit/blob/e95c76eb43bda1fd86379612644a79b02948c17a/src/core/Trader.ts#L122-L126
 *
 * @param error Error response wrapped by "axios" request library
 */
function getErrorMessage(error) {
    var _a;
    const responseWithErrorMessage = error;
    return ((_a = responseWithErrorMessage.response) === null || _a === void 0 ? void 0 : _a.data.message) || error.message;
}
exports.getErrorMessage = getErrorMessage;
//# sourceMappingURL=ErrorUtil.js.map