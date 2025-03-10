import { AxiosInstance } from 'axios';
export interface Currency {
    details?: CurrencyDetail;
    id: string;
    max_precision?: string;
    min_size: string;
    name: string;
    status?: string;
}
export declare enum CurrencyType {
    CRYPTO = "crypto",
    FIAT = "fiat"
}
export interface CurrencyDetail {
    crypto_address_link: string;
    crypto_transaction_link: string;
    min_withdrawal_amount: number;
    network_confirmations: number;
    processing_time_seconds?: number;
    push_payment_methods: CurrencyType[];
    sort_order: number;
    symbol: string;
    type: CurrencyType;
}
export declare class CurrencyAPI {
    private readonly apiClient;
    static readonly URL: {
        CURRENCIES: string;
    };
    constructor(apiClient: AxiosInstance);
    /**
     * List known currencies.
     * Currency codes will conform to the ISO 4217 standard where possible.
     * Currencies which have or had no representation in ISO 4217 may use a custom code.
     *
     * @see https://docs.cloud.coinbase.com/sign-in-with-coinbase/docs/api-currencies
     */
    listCurrencies(): Promise<Currency[]>;
}
