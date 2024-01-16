import { AxiosInstance } from 'axios';
import { BasicTransactionInformation, ISO_8601_MS_UTC, PaginatedData, Pagination, ResourceRef, SIWCOrder, TransactionAmount, TransactionStatus } from '../payload/common';
export interface SellInformation extends BasicTransactionInformation {
    amount: TransactionAmount;
    committed: boolean;
    created_at: ISO_8601_MS_UTC;
    fee: TransactionAmount;
    id: string;
    payment_method: ResourceRef;
    payout_at: ISO_8601_MS_UTC;
    resource: string;
    resource_path: string;
    status: TransactionStatus;
    subtotal: TransactionAmount;
    transaction: ResourceRef;
    updated_at: ISO_8601_MS_UTC;
}
export declare class SellAPI {
    static readonly URL: {
        Sells: string;
    };
    static readonly SHARED_REF = "sells";
    private sharedService;
    constructor(apiClient: AxiosInstance);
    /**
     * Lists sells for an account.
     *
     * @param account - account id of the purchase
     * @param pagination - Pagination field
     * @see https://docs.cloud.coinbase.com/sign-in-with-coinbase/docs/api-sells#list-sells
     */
    listSells(account: string, pagination?: Pagination): Promise<PaginatedData<SellInformation>>;
    /**
     * Show a sell
     *
     * @param accountId - id of the account
     * @param sellId - id of the requested resource
     * @see https://docs.cloud.coinbase.com/exchange/reference/exchangerestapi_getSell
     */
    getSell(accountId: string, sellId: string): Promise<SellInformation>;
    /**
     * Place sell order
     *
     * @param data - Information for this sell
     * @see https://docs.cloud.coinbase.com/sign-in-with-coinbase/docs/api-sells#place-sell-order
     */
    createSell(data: SIWCOrder): Promise<SellInformation>;
    /**
     * Completes a sell order that is created in commit: false state.
     *
     * @param accountId - The account withdrawal is pulling from
     * @param sellId - The id of the transaction
     * @see https://docs.cloud.coinbase.com/sign-in-with-coinbase/docs/api-sells#commit-a-sell
     */
    commitSell(accountId: string, sellId: string): Promise<SellInformation>;
}
