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
exports.BuyAPI = void 0;
const shared_request_1 = require("../util/shared-request");
class BuyAPI {
    constructor(apiClient) {
        this.sharedService = new shared_request_1.SharedRequestService(apiClient, BuyAPI.SHARED_REF);
    }
    /**
     * Lists buys for an account.
     *
     * @param account - account id of the purchase
     * @param pagination - Pagination field
     * @see https://docs.cloud.coinbase.com/sign-in-with-coinbase/docs/api-buys#list-buys
     */
    listBuys(account, pagination) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.sharedService.queryAll(account, pagination);
        });
    }
    /**
     * Show a buy
     *
     * @param accountId - id of the account
     * @param buyId - id of the requested resource
     * @see https://docs.cloud.coinbase.com/exchange/reference/exchangerestapi_getBuy
     */
    getBuy(accountId, buyId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.sharedService.getById(accountId, buyId);
        });
    }
    /**
     * Place buy order
     *
     * @param data - Information for this buy
     * @see https://docs.cloud.coinbase.com/sign-in-with-coinbase/docs/api-buys#place-buy-order
     */
    createBuy(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.sharedService.createNew(data);
        });
    }
    /**
     * Completes a buy order that is created in commit: false state.
     *
     * @param accountId - The account withdrawal is pulling from
     * @param buyId - The id of the transaction
     * @see https://docs.cloud.coinbase.com/sign-in-with-coinbase/docs/api-buys#commit-a-buy
     */
    commitBuy(accountId, buyId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.sharedService.commitPending(accountId, buyId);
        });
    }
}
exports.BuyAPI = BuyAPI;
BuyAPI.URL = {
    Buys: `/accounts`,
};
BuyAPI.SHARED_REF = 'buys';
//# sourceMappingURL=BuyAPI.js.map