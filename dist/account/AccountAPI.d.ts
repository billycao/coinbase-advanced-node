import { AxiosInstance } from 'axios';
import { ISO_8601_MS_UTC, PaginatedData, Pagination } from '../payload/common';
export interface SIWCAvailableBalance {
    amount: string;
    currency: string;
}
export interface AvailableBalance {
    currency: string;
    value: string;
}
export interface AccountHold extends AvailableBalance {
}
export declare enum AdvanceAccountTypes {
    ACCOUNT_TYPE_CRYPTO = "ACCOUNT_TYPE_CRYPTO",
    ACCOUNT_TYPE_FIAT = "ACCOUNT_TYPE_FIAT",
    ACCOUNT_TYPE_UNSPECIFIED = "ACCOUNT_TYPE_UNSPECIFIED",
    ACCOUNT_TYPE_VAULT = "ACCOUNT_TYPE_VAULT"
}
export interface Account {
    active: boolean;
    available_balance: AvailableBalance;
    created_at: ISO_8601_MS_UTC;
    currency: string;
    default: boolean;
    deleted_at: ISO_8601_MS_UTC;
    hold: AccountHold;
    name: string;
    ready: boolean;
    type: AdvanceAccountTypes;
    updated_at: ISO_8601_MS_UTC;
    uuid: string;
}
export declare enum CoinbaseAccountType {
    FIAT = "fiat",
    VAULT = "vault",
    WALLET = "wallet"
}
export interface CoinbaseCurrencyDetails {
    address_regex: string;
    asset_id: string;
    code: string;
    color: string;
    destination_tag_name: string;
    destination_tag_regex: string;
    exponent: number;
    name: string;
    slug: string;
    sort_index: number;
    type: CoinbaseAccountType;
}
export interface CoinbaseRewardDetails {
    apy: string;
    formatted_apy: string;
    label: string;
}
export interface CoinbaseAccount {
    allow_deposits: boolean;
    allow_withdrawals: boolean;
    balance: SIWCAvailableBalance;
    created_at: ISO_8601_MS_UTC;
    currency: CoinbaseCurrencyDetails;
    id: string;
    name: string;
    primary: boolean;
    resource: string;
    resource_path: string;
    rewards: CoinbaseRewardDetails;
    type: CoinbaseAccountType;
    updated_at: ISO_8601_MS_UTC;
}
export interface AddressInfo {
    address: string;
    destination_tag?: string;
}
export declare class AccountAPI {
    private readonly apiClient;
    static readonly URL: {
        ACCOUNTS: string;
        COINBASE_ACCOUNT: string;
    };
    constructor(apiClient: AxiosInstance);
    /**
     * Get information for a single account.
     *
     * @param accountId - Account ID is the Account.uuid
     * @see https://docs.cloud.coinbase.com/advanced-trade-api/reference/retailbrokerageapi_getaccount
     */
    getAccount(accountId: string): Promise<Account>;
    /**
     * Get information for a single account. API key must belong to the same profile as the account.
     *
     * @param accountId - Account ID is either Account.uuid || Account.currency || CoinbaseAccoount.currency.code
     * @see https://docs.cloud.coinbase.com/sign-in-with-coinbase/docs/api-accounts#http-request-1
     */
    getCoinbaseAccount(accountId: string): Promise<CoinbaseAccount>;
    /**
     * Get a list of trading accounts from the profile of the API key.
     *
     * @see https://docs.cloud.coinbase.com/advanced-trade-api/reference/retailbrokerageapi_getaccounts
     */
    listAccounts(pagination?: Pagination): Promise<PaginatedData<Account>>;
    /**
     * Get a list of your coinbase accounts.
     *
     * @see https://docs.cloud.coinbase.com/exchange/reference/exchangerestapi_getcoinbaseaccounts
     */
    listCoinbaseAccounts(pagination?: Pagination): Promise<PaginatedData<CoinbaseAccount>>;
}
