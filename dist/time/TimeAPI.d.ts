export interface TimeSkew {
    /** The epoch field represents decimal seconds since Unix Epoch, i.e. "1420674445.201" */
    epoch: number;
    /** Time in ISO 8601 format, i.e. "2015-01-07T23:47:25.201Z" */
    iso: string;
}
export declare class TimeAPI {
    private readonly baseURL;
    static readonly URL: {
        TIME: string;
    };
    constructor(baseURL: string);
    /**
     * Get the server time from Coinbase Pro API. It has been reported that sometimes the return value is a string:
     * https://github.com/bennycode/coinbase-pro-node/issues/354
     *
     * @see https://docs.cloud.coinbase.com/sign-in-with-coinbase/docs/api-time
     */
    getTime(): Promise<TimeSkew>;
    /**
     * Get the absolute difference between server time and local time.
     */
    getClockSkew(time: TimeSkew): number;
}
