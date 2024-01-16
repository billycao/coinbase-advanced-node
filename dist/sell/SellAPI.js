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
exports.SellAPI = void 0;
const shared_request_1 = require("../util/shared-request");
class SellAPI {
    constructor(apiClient) {
        this.sharedService = new shared_request_1.SharedRequestService(apiClient, SellAPI.SHARED_REF);
    }
    /**
     * Lists sells for an account.
     *
     * @param account - account id of the purchase
     * @param pagination - Pagination field
     * @see https://docs.cloud.coinbase.com/sign-in-with-coinbase/docs/api-sells#list-sells
     */
    listSells(account, pagination) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.sharedService.queryAll(account, pagination);
        });
    }
    /**
     * Show a sell
     *
     * @param accountId - id of the account
     * @param sellId - id of the requested resource
     * @see https://docs.cloud.coinbase.com/exchange/reference/exchangerestapi_getSell
     */
    getSell(accountId, sellId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.sharedService.getById(accountId, sellId);
        });
    }
    /**
     * Place sell order
     *
     * @param data - Information for this sell
     * @see https://docs.cloud.coinbase.com/sign-in-with-coinbase/docs/api-sells#place-sell-order
     */
    createSell(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.sharedService.createNew(data);
        });
    }
    /**
     * Completes a sell order that is created in commit: false state.
     *
     * @param accountId - The account withdrawal is pulling from
     * @param sellId - The id of the transaction
     * @see https://docs.cloud.coinbase.com/sign-in-with-coinbase/docs/api-sells#commit-a-sell
     */
    commitSell(accountId, sellId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.sharedService.commitPending(accountId, sellId);
        });
    }
}
exports.SellAPI = SellAPI;
SellAPI.URL = {
    Sells: `/accounts`,
};
SellAPI.SHARED_REF = 'sells';
//# sourceMappingURL=SellAPI.js.map