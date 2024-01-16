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
exports.AccountAPI = exports.CoinbaseAccountType = exports.AdvanceAccountTypes = void 0;
const shared_request_1 = require("../util/shared-request");
var AdvanceAccountTypes;
(function (AdvanceAccountTypes) {
    AdvanceAccountTypes["ACCOUNT_TYPE_CRYPTO"] = "ACCOUNT_TYPE_CRYPTO";
    AdvanceAccountTypes["ACCOUNT_TYPE_FIAT"] = "ACCOUNT_TYPE_FIAT";
    AdvanceAccountTypes["ACCOUNT_TYPE_UNSPECIFIED"] = "ACCOUNT_TYPE_UNSPECIFIED";
    AdvanceAccountTypes["ACCOUNT_TYPE_VAULT"] = "ACCOUNT_TYPE_VAULT";
})(AdvanceAccountTypes = exports.AdvanceAccountTypes || (exports.AdvanceAccountTypes = {}));
var CoinbaseAccountType;
(function (CoinbaseAccountType) {
    CoinbaseAccountType["FIAT"] = "fiat";
    CoinbaseAccountType["VAULT"] = "vault";
    CoinbaseAccountType["WALLET"] = "wallet";
})(CoinbaseAccountType = exports.CoinbaseAccountType || (exports.CoinbaseAccountType = {}));
class AccountAPI {
    constructor(apiClient) {
        this.apiClient = apiClient;
    }
    /**
     * Get information for a single account.
     *
     * @param accountId - Account ID is the Account.uuid
     * @see https://docs.cloud.coinbase.com/advanced-trade-api/reference/retailbrokerageapi_getaccount
     */
    getAccount(accountId) {
        return __awaiter(this, void 0, void 0, function* () {
            const resource = `${AccountAPI.URL.ACCOUNTS}/${accountId}`;
            const response = yield this.apiClient.get(resource);
            return response.data.account;
        });
    }
    /**
     * Get information for a single account. API key must belong to the same profile as the account.
     *
     * @param accountId - Account ID is either Account.uuid || Account.currency || CoinbaseAccoount.currency.code
     * @see https://docs.cloud.coinbase.com/sign-in-with-coinbase/docs/api-accounts#http-request-1
     */
    getCoinbaseAccount(accountId) {
        return __awaiter(this, void 0, void 0, function* () {
            const resource = `${AccountAPI.URL.COINBASE_ACCOUNT}/${accountId}`;
            const response = yield this.apiClient.get(resource);
            return response.data.data;
        });
    }
    /**
     * Get a list of trading accounts from the profile of the API key.
     *
     * @see https://docs.cloud.coinbase.com/advanced-trade-api/reference/retailbrokerageapi_getaccounts
     */
    listAccounts(pagination) {
        return __awaiter(this, void 0, void 0, function* () {
            const resource = AccountAPI.URL.ACCOUNTS;
            if (pagination) {
                pagination = (0, shared_request_1.formatPaginationIntoParams)(pagination);
            }
            const response = yield this.apiClient.get(resource, { params: Object.assign({ limit: 250 }, pagination) });
            const position = response.data.cursor && response.data.cursor !== '' ? response.data.cursor : response.data.accounts.length;
            return {
                data: response.data.accounts,
                pagination: {
                    after: (Number(position) - response.data.accounts.length).toString(),
                    before: position.toString(),
                    has_next: response.data.has_next || false,
                },
            };
        });
    }
    /**
     * Get a list of your coinbase accounts.
     *
     * @see https://docs.cloud.coinbase.com/exchange/reference/exchangerestapi_getcoinbaseaccounts
     */
    listCoinbaseAccounts(pagination) {
        return __awaiter(this, void 0, void 0, function* () {
            const resource = AccountAPI.URL.COINBASE_ACCOUNT;
            if (pagination) {
                pagination = (0, shared_request_1.formatPaginationIntoParams)(pagination, true);
            }
            const response = yield this.apiClient.get(resource, { params: Object.assign({ limit: 250 }, pagination) });
            return {
                data: response.data.data,
                pagination: {
                    after: response.data.pagination.starting_after,
                    before: response.data.pagination.ending_before,
                    has_next: response.data.has_next || false,
                },
            };
        });
    }
}
exports.AccountAPI = AccountAPI;
AccountAPI.URL = {
    ACCOUNTS: `/brokerage/accounts`,
    COINBASE_ACCOUNT: `/accounts`,
};
//# sourceMappingURL=AccountAPI.js.map