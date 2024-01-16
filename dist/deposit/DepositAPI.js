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
exports.DepositAPI = void 0;
const shared_request_1 = require("../util/shared-request");
class DepositAPI {
    constructor(apiClient) {
        this.sharedService = new shared_request_1.SharedRequestService(apiClient, DepositAPI.SHARED_REF);
    }
    /**
     * Get a list of deposits from the profile of the API key, in descending order by created time.
     * Deposits are only listed for fiat accounts and wallets. To list deposits associated with a crypto account/wallet, use List Transactions.
     *
     * @param account - account id the deposit was to
     * @param pagination - Pagination field
     * @see https://docs.cloud.coinbase.com/sign-in-with-coinbase/docs/api-deposits
     */
    getDeposits(account, pagination) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.sharedService.queryAll(account, pagination);
        });
    }
    /**
     * Get information on a single deposit.
     *
     * @param accountId - id of the account
     * @param depositId - id of the requested resource
     * @see https://docs.cloud.coinbase.com/exchange/reference/exchangerestapi_getDeposit
     */
    getDeposit(accountId, depositId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.sharedService.getById(accountId, depositId);
        });
    }
    /**
     * Deposit funds to a payment method.
     *
     * @param data - Information for this deposit
     * @see https://docs.cloud.coinbase.com/sign-in-with-coinbase/docs/api-deposits#deposit-funds
     */
    depositFunds(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.sharedService.createNew(data);
        });
    }
    /**
     * Completes a deposit that is created with commit: false state.
     *
     * @param accountId - The account withdrawal is pulling from
     * @param depositId - The id of the transaction
     * @see https://docs.cloud.coinbase.com/sign-in-with-coinbase/docs/api-deposits#commit-a-deposit
     */
    commitDeposit(accountId, depositId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.sharedService.commitPending(accountId, depositId);
        });
    }
}
exports.DepositAPI = DepositAPI;
DepositAPI.URL = {
    DepositS: `/accounts`,
};
DepositAPI.SHARED_REF = 'deposits';
//# sourceMappingURL=DepositAPI.js.map