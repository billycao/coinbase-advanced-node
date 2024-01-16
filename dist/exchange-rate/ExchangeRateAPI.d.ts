export interface ExchangeRate {
    currency: string;
    rates: {
        [currency: string]: string;
    };
}
/**
 * @see https://docs.cloud.coinbase.com/sign-in-with-coinbase/docs/api-exchange-rates
 */
export declare class ExchangeRateAPI {
    private readonly baseURL;
    static readonly URL: {
        V2_EXCHANGE_RATES: string;
    };
    constructor(baseURL?: string);
    /**
     * Get current exchange rates. Default base currency is USD, but it can be defined as any supported currency.
     * Returned rates will define the exchange rate for one unit of the base currency.
     *
     * @see https://docs.cloud.coinbase.com/sign-in-with-coinbase/docs/api-exchange-rates#get-exchange-rates
     */
    getExchangeRates(currency?: string): Promise<ExchangeRate>;
}
