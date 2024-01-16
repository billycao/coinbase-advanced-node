/// <reference types="node" />
import { AxiosDefaults, AxiosInterceptorManager, AxiosRequestConfig, AxiosResponse } from 'axios';
import { AccountAPI } from '../account';
import { RequestSetup, SignedRequest } from '../auth/RequestSigner';
import { OrderAPI } from '../order';
import { Candle, CandleGranularity, ProductAPI, ProductEvent } from '../product';
import { UserAPI } from '../user';
import { FeeAPI } from '../fee';
import { FillAPI } from '../fill';
import { EventEmitter } from 'events';
import { CurrencyAPI } from '../currency';
import { WithdrawAPI } from '../withdraw';
import { TimeAPI } from '../time';
import { ExchangeRateAPI } from '../exchange-rate/ExchangeRateAPI';
import { ClientConnection } from '../Coinbase';
import { TransactionAPI } from '../transaction/TransactionAPI';
import { DepositAPI } from '../deposit';
import { AddressAPI } from '../addresses';
import { BuyAPI } from '../buy';
import { SellAPI } from '../sell';
import { ConvertAPI } from '../convert';
export interface RESTClient {
    on(event: ProductEvent.NEW_CANDLE, listener: (productId: string, granularity: CandleGranularity, candle: Candle) => void): this;
}
export declare class RESTClient extends EventEmitter {
    private readonly signRequest;
    get defaults(): AxiosDefaults;
    get interceptors(): {
        request: AxiosInterceptorManager<AxiosRequestConfig>;
        response: AxiosInterceptorManager<AxiosResponse>;
    };
    readonly account: AccountAPI;
    readonly address: AddressAPI;
    readonly buy: BuyAPI;
    readonly currency: CurrencyAPI;
    readonly convert: ConvertAPI;
    readonly deposit: DepositAPI;
    readonly exchangeRate: ExchangeRateAPI;
    readonly fee: FeeAPI;
    readonly fill: FillAPI;
    readonly order: OrderAPI;
    readonly product: ProductAPI;
    readonly sell: SellAPI;
    readonly time: TimeAPI;
    readonly transaction: TransactionAPI;
    readonly user: UserAPI;
    readonly withdraw: WithdrawAPI;
    private readonly httpClient;
    private readonly logger;
    constructor(connectionData: ClientConnection, signRequest: (setup: RequestSetup) => Promise<SignedRequest>);
    static stringifyPayload(config: AxiosRequestConfig, excludeParams?: boolean): string;
    coinbaseRequest(config: AxiosRequestConfig): Promise<AxiosResponse<any, any>>;
}
