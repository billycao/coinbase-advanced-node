import { AxiosInstance } from 'axios';
import { PaginatedData, Pagination, TransactionInformation, TransactionType } from '../payload/common';
declare type BasicNewTransaction = {
    amount: string;
    currency: string;
    description?: string;
    /** A blockchain address, or an email of the recipient */
    to: string;
};
export interface InternalTransfer extends BasicNewTransaction {
    type: TransactionType.TRANSFER;
}
export interface OutboundTransaction extends BasicNewTransaction {
    /** The website of the financial institution or exchange. Required if to_financial_institution is true */
    financial_institution_website?: string;
    /** [Recommended] A token to ensure idempotence. If a previous transaction with the same idem parameter exists for this sender,
     *  that previous transaction is returned and a new one is not created. Max length is 100 characters. */
    idem?: string;
    skip_notifications?: boolean;
    to_financial_institution?: boolean;
    type: TransactionType.SEND;
}
export declare type NewTransaction = InternalTransfer | OutboundTransaction;
export declare class TransactionAPI {
    private readonly apiClient;
    private sharedService;
    static readonly SHARED_REF = "transactions";
    constructor(apiClient: AxiosInstance);
    /**
     * Lists the transactions of an account by account ID.
     *
     * @param accountID - can use account.uuid or currency symbol... ex BTC || ETh
     * @param pagination - Pagination field
     * @see https://docs.cloud.coinbase.com/sign-in-with-coinbase/docs/api-transactions#list-transactions
     */
    listTransactions(accountID: string, params?: Pagination): Promise<PaginatedData<TransactionInformation>>;
    /**
     * Get information on a single transaction.
     *
     * @param accountID - can use account.uuid or currency symbol... ex BTC || ETh
     * @param transactionId - id of the requested resource
     * @see https://docs.cloud.coinbase.com/sign-in-with-coinbase/docs/api-transactions#show-a-transaction
     */
    getTransaction(accountID: string, transactionId: string): Promise<TransactionInformation>;
    /**
     * Send Transaction
     *
     * @param accountID - account you're sending $ out of
     * @param info - information of the transaction
     * @see https://docs.cloud.coinbase.com/sign-in-with-coinbase/docs/api-transactions#http-request-2
     */
    sendTransaction(accountID: string, info: NewTransaction): Promise<TransactionInformation>;
    /**
     * Transfer any Coinbase supported digital asset between two of a single user's accounts. The following transfers are allowed:
     *
     * @param accountID - account you're sending $ out of
     * @param info - information of the transaction
     * @see https://docs.cloud.coinbase.com/sign-in-with-coinbase/docs/api-transactions#transfer-money-between-accounts
     */
    transferFunds(accountID: string, info: InternalTransfer): Promise<TransactionInformation>;
}
export {};
