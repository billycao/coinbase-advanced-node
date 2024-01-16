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
exports.TransactionAPI = void 0;
const shared_request_1 = require("../util/shared-request");
class TransactionAPI {
    constructor(apiClient) {
        this.apiClient = apiClient;
        this.sharedService = new shared_request_1.SharedRequestService(apiClient, TransactionAPI.SHARED_REF);
    }
    /**
     * Lists the transactions of an account by account ID.
     *
     * @param accountID - can use account.uuid or currency symbol... ex BTC || ETh
     * @param pagination - Pagination field
     * @see https://docs.cloud.coinbase.com/sign-in-with-coinbase/docs/api-transactions#list-transactions
     */
    listTransactions(accountID, params) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.sharedService.queryAll(accountID, params);
        });
    }
    /**
     * Get information on a single transaction.
     *
     * @param accountID - can use account.uuid or currency symbol... ex BTC || ETh
     * @param transactionId - id of the requested resource
     * @see https://docs.cloud.coinbase.com/sign-in-with-coinbase/docs/api-transactions#show-a-transaction
     */
    getTransaction(accountID, transactionId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.sharedService.getById(accountID, transactionId);
        });
    }
    /**
     * Send Transaction
     *
     * @param accountID - account you're sending $ out of
     * @param info - information of the transaction
     * @see https://docs.cloud.coinbase.com/sign-in-with-coinbase/docs/api-transactions#http-request-2
     */
    sendTransaction(accountID, info) {
        return __awaiter(this, void 0, void 0, function* () {
            const resource = `/accounts/${accountID}/transactions`;
            const response = yield this.apiClient.post(resource, info);
            return response.data.data;
        });
    }
    /**
     * Transfer any Coinbase supported digital asset between two of a single user's accounts. The following transfers are allowed:
     *
     * @param accountID - account you're sending $ out of
     * @param info - information of the transaction
     * @see https://docs.cloud.coinbase.com/sign-in-with-coinbase/docs/api-transactions#transfer-money-between-accounts
     */
    transferFunds(accountID, info) {
        return __awaiter(this, void 0, void 0, function* () {
            const resource = `/accounts/${accountID}/transactions`;
            const response = yield this.apiClient.post(resource, info);
            return response.data.data;
        });
    }
}
exports.TransactionAPI = TransactionAPI;
TransactionAPI.SHARED_REF = 'transactions';
//# sourceMappingURL=TransactionAPI.js.map