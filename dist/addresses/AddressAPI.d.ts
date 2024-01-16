import { AxiosInstance } from 'axios';
import { ISO_8601_MS_UTC, PaginatedData, Pagination, TransactionInformation } from '../payload/common';
export interface AddressResource {
    address: string;
    created_at: ISO_8601_MS_UTC;
    id: string;
    name: string;
    network: string;
    resource: string;
    resource_path: string;
    updated_at: ISO_8601_MS_UTC;
}
export declare class AddressAPI {
    private readonly apiClient;
    static readonly URL: {
        Address: string;
        COINBASE_Address: string;
    };
    static readonly SHARED_REF = "addresses";
    private sharedService;
    constructor(apiClient: AxiosInstance);
    /**
     * Lists addresses for an account. An address can only be associated with one account.
     *
     * @param account - account id the address is linked to
     * @param pagination - Pagination field
     * @see https://docs.cloud.coinbase.com/sign-in-with-coinbase/docs/api-addresses#list-addresses
     */
    listAddresses(account: string, pagination?: Pagination): Promise<PaginatedData<AddressResource>>;
    /**
     * Get an single address for an account. A regular cryptocurrency address...
     * can be used in place of addressId but the address must be associated with the correct account.
     *
     * @param accountId - id of the account
     * @param addressId - id of the requested resource
     * @see https://docs.cloud.coinbase.com/sign-in-with-coinbase/docs/api-addresses#http-request-1
     */
    getAddress(accountId: string, depositId: string): Promise<AddressResource>;
    /**
     * List transactions that have been sent to a specific address. A regular cryptocurrency address
     * can be used in place of addressId but the address must be associated with the correct account.
     *
     * @param accountId - address id the address is linked to
     * @param addressId - id of the requested resource
     * @param pagination - Pagination field
     * @see https://docs.cloud.coinbase.com/sign-in-with-coinbase/docs/api-addresses#list-transactions
     */
    getAddressTransactions(accountId: string, addressId: string, pagination?: Pagination): Promise<PaginatedData<TransactionInformation>>;
    /**
     * Creates a new address for an account. Addresses can be created for wallet account types.
     *
     * @param accountId - the accounts id
     * @param name - a name for this address
     *
     * @see https://docs.cloud.coinbase.com/sign-in-with-coinbase/docs/api-addresses#create-address
     */
    createAddress(accountId: string, name?: string): Promise<AddressResource>;
}
