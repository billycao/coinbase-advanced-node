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
exports.WithdrawAPI = exports.PaymenMethodTypes = void 0;
const shared_request_1 = require("../util/shared-request");
var PaymenMethodTypes;
(function (PaymenMethodTypes) {
    /** Regular US bank account */
    PaymenMethodTypes["ACH_BANK_ACCOUNT"] = "ach_bank_account";
    /** Bank wire (US only) */
    PaymenMethodTypes["BANK_WIRE"] = "bank_wire";
    /** Credit card (can't be used for buying/selling) */
    PaymenMethodTypes["CREDIT_CARD"] = "credit_card";
    /**  Canadian EFT bank account */
    PaymenMethodTypes["EFT_BANK_ACCOUNT"] = "eft_bank_account";
    /** Fiat nominated Coinbase account */
    PaymenMethodTypes["FIAT_ACCOUNT"] = "fiat_account";
    /** iDeal bank account (Europe) */
    PaymenMethodTypes["IDEAL_BANK_ACCOUNT"] = "ideal_bank_account";
    /** Interac Online for Canadian bank accounts */
    PaymenMethodTypes["INTERAC"] = "interac";
    /** Secure3D verified payment card */
    PaymenMethodTypes["SECURE_3D_CARD"] = "secure3d_card";
    /** European SEPA bank account */
    PaymenMethodTypes["SEPA_BANK_ACCOUNT"] = "sepa_bank_account";
})(PaymenMethodTypes = exports.PaymenMethodTypes || (exports.PaymenMethodTypes = {}));
class WithdrawAPI {
    constructor(apiClient) {
        this.apiClient = apiClient;
        this.sharedService = new shared_request_1.SharedRequestService(apiClient, WithdrawAPI.SHARED_REF);
    }
    /**
     * Get a list of withdrawals of an account.
     * Withdrawals are only listed for fiat accounts and wallets.
     * To list withdrawals associated with a crypto account/wallet, use List Transactions.
     *
     * @param account - account id the deposit was to
     * @param pagination - Pagination field
     * @see https://docs.cloud.coinbase.com/sign-in-with-coinbase/docs/api-withdrawals#list-withdrawals
     */
    listWithdrawals(account, pagination) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.sharedService.queryAll(account, pagination);
        });
    }
    /**
     * Get information on a single withdrawal.
     *
     * @param accountId - id of the account
     * @param withdrawalId - id of the requested resource
     * @see https://docs.cloud.coinbase.com/sign-in-with-coinbase/docs/api-withdrawals#show-a-withdrawal
     */
    getWithdrawal(accountId, withdrawalId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.sharedService.getById(accountId, withdrawalId);
        });
    }
    /**
     * Withdraw funds to a payment method.
     *
     * @param amount - The amount to withdraw
     * @param currency - The type of currency
     * @param paymentMethodId - ID of the payment method
     * @param accountId - The account to withdraw from
     * @param commit - Commit this transaction (default is true)
     * @see https://docs.cloud.coinbase.com/sign-in-with-coinbase/docs/api-withdrawals#withdraw-funds
     */
    withdrawToPaymentMethod(amount, currency, paymentMethodId, accountId, commit = true) {
        return __awaiter(this, void 0, void 0, function* () {
            const withdrawal = {
                accountId,
                amount,
                commit,
                currency,
                payment_method: paymentMethodId,
            };
            return this.sharedService.createNew(withdrawal);
        });
    }
    /**
     * Completes a withdrawal that is created in commit: false state.
     *
     * @param accountId - The account withdrawal is pulling from
     * @param withdrawalId - The id of the transaction
     * @see https://docs.cloud.coinbase.com/sign-in-with-coinbase/docs/api-withdrawals#commit-a-withdrawal
     */
    commitWithdrawal(accountId, withdrawalId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.sharedService.commitPending(accountId, withdrawalId);
        });
    }
    /**
     * Get a list of your payment methods.
     *
     * @see https://docs.cloud.coinbase.com/sign-in-with-coinbase/docs/api-payment-methods#http-request
     */
    getPaymentMethods() {
        return __awaiter(this, void 0, void 0, function* () {
            const resource = WithdrawAPI.URL.LIST_PAYMENT_METHODS;
            const response = yield this.apiClient.get(resource);
            return response.data.data;
        });
    }
}
exports.WithdrawAPI = WithdrawAPI;
WithdrawAPI.URL = {
    LIST_PAYMENT_METHODS: '/payment-methods',
    WITHDRAWALS: {
        PAYMENT_METHOD: '/acounts',
    },
};
WithdrawAPI.SHARED_REF = 'withdrawals';
//# sourceMappingURL=WithdrawAPI.js.map