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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConvertAPI = void 0;
class ConvertAPI {
    constructor(apiClient) {
        this.apiClient = apiClient;
    }
    createConvertQuote(newQuote) {
        return __awaiter(this, void 0, void 0, function* () {
            const resource = ConvertAPI.URL.CONVERT + '/quote';
            const response = yield this.apiClient.post(resource, newQuote);
            return response.data;
        });
    }
    commitConvertTrade(tradeId, commitQuote) {
        return __awaiter(this, void 0, void 0, function* () {
            const resource = ConvertAPI.URL.CONVERT + `/trade/${tradeId}`;
            const response = yield this.apiClient.post(resource, commitQuote);
            return response.data;
        });
    }
}
exports.ConvertAPI = ConvertAPI;
ConvertAPI.URL = {
    CONVERT: `/brokerage/convert`,
};
//# sourceMappingURL=ConvertAPI.js.map