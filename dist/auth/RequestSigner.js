"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestSigner = void 0;
const crypto_1 = __importDefault(require("crypto"));
class RequestSigner {
    // https://docs.cloud.coinbase.com/exchange/docs/authorization-and-authentication#creating-a-request
    static signRequest(auth, setup, clockSkew) {
        var _a;
        const timestamp = Math.floor(Date.now() / 1000 + clockSkew);
        const what = `${timestamp}${setup.httpMethod.toUpperCase()}${setup.requestPath}${setup.payload}`;
        const sig = crypto_1.default.createHmac('sha256', auth.apiSecret).update(what);
        const signature = sig.digest('hex');
        return {
            key: auth.oauthToken || auth.apiKey,
            oauth: new Boolean((auth === null || auth === void 0 ? void 0 : auth.oauthToken) && ((_a = auth === null || auth === void 0 ? void 0 : auth.oauthToken) === null || _a === void 0 ? void 0 : _a.length) > 0).valueOf(),
            signature,
            timestamp,
        };
    }
}
exports.RequestSigner = RequestSigner;
//# sourceMappingURL=RequestSigner.js.map