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
exports.AddressAPI = void 0;
const shared_request_1 = require("../util/shared-request");
class AddressAPI {
    constructor(apiClient) {
        this.apiClient = apiClient;
        this.sharedService = new shared_request_1.SharedRequestService(apiClient, AddressAPI.SHARED_REF);
    }
    /**
     * Lists addresses for an account. An address can only be associated with one account.
     *
     * @param account - account id the address is linked to
     * @param pagination - Pagination field
     * @see https://docs.cloud.coinbase.com/sign-in-with-coinbase/docs/api-addresses#list-addresses
     */
    listAddresses(account, pagination) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.sharedService.queryAll(account, pagination);
        });
    }
    /**
     * Get an single address for an account. A regular cryptocurrency address...
     * can be used in place of addressId but the address must be associated with the correct account.
     *
     * @param accountId - id of the account
     * @param addressId - id of the requested resource
     * @see https://docs.cloud.coinbase.com/sign-in-with-coinbase/docs/api-addresses#http-request-1
     */
    getAddress(accountId, depositId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.sharedService.getById(accountId, depositId);
        });
    }
    /**
     * List transactions that have been sent to a specific address. A regular cryptocurrency address
     * can be used in place of addressId but the address must be associated with the correct account.
     *
     * @param accountId - address id the address is linked to
     * @param addressId - id of the requested resource
     * @param pagination - Pagination field
     * @see https://docs.cloud.coinbase.com/sign-in-with-coinbase/docs/api-addresses#list-transactions
     */
    getAddressTransactions(accountId, addressId, pagination) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.sharedService.queryAll(accountId, pagination, `/accounts/${accountId}/addresses/${addressId}/transactions`);
        });
    }
    /**
     * Creates a new address for an account. Addresses can be created for wallet account types.
     *
     * @param accountId - the accounts id
     * @param name - a name for this address
     *
     * @see https://docs.cloud.coinbase.com/sign-in-with-coinbase/docs/api-addresses#create-address
     */
    createAddress(accountId, name) {
        return __awaiter(this, void 0, void 0, function* () {
            const resource = `accounts/${accountId}/addresses`;
            const response = yield this.apiClient.post(resource, name ? { name } : {});
            return response.data.data;
        });
    }
}
exports.AddressAPI = AddressAPI;
AddressAPI.URL = {
    Address: `/brokerage/Addresss`,
    COINBASE_Address: `/Addresss`,
};
AddressAPI.SHARED_REF = 'addresses';
//# sourceMappingURL=AddressAPI.js.map