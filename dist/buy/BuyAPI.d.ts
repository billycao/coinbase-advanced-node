import { AxiosInstance } from 'axios';
import { BasicTransactionInformation, ISO_8601_MS_UTC, PaginatedData, Pagination, ResourceRef, SIWCOrder, TransactionAmount, TransactionStatus } from '../payload/common';
export interface BuyInformation extends BasicTransactionInformation {
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
export declare class BuyAPI {
    static readonly URL: {
        Buys: string;
    };
    static readonly SHARED_REF = "buys";
    private sharedService;
    constructor(apiClient: AxiosInstance);
    /**
     * Lists buys for an account.
     *
     * @param account - account id of the purchase
     * @param pagination - Pagination field
     * @see https://docs.cloud.coinbase.com/sign-in-with-coinbase/docs/api-buys#list-buys
     */
    listBuys(account: string, pagination?: Pagination): Promise<PaginatedData<BuyInformation>>;
    /**
     * Show a buy
     *
     * @param accountId - id of the account
     * @param buyId - id of the requested resource
     * @see https://docs.cloud.coinbase.com/exchange/reference/exchangerestapi_getBuy
     */
    getBuy(accountId: string, buyId: string): Promise<BuyInformation>;
    /**
     * Place buy order
     *
     * @param data - Information for this buy
     * @see https://docs.cloud.coinbase.com/sign-in-with-coinbase/docs/api-buys#place-buy-order
     */
    createBuy(data: SIWCOrder): Promise<BuyInformation>;
    /**
     * Completes a buy order that is created in commit: false state.
     *
     * @param accountId - The account withdrawal is pulling from
     * @param buyId - The id of the transaction
     * @see https://docs.cloud.coinbase.com/sign-in-with-coinbase/docs/api-buys#commit-a-buy
     */
    commitBuy(accountId: string, buyId: string): Promise<BuyInformation>;
}
