import axios from 'axios';

export interface TimeSkew {
  /** The epoch field represents decimal seconds since Unix Epoch, i.e. "1420674445.201" */
  epoch: number;
  /** Time in ISO 8601 format, i.e. "2015-01-07T23:47:25.201Z" */
  iso: string;
}

export class TimeAPI {
  static readonly URL = {
    TIME: `/time`,
  };

  constructor(private readonly baseURL: string) {}

  /**
   * Get the server time from Coinbase Pro API. It has been reported that sometimes the return value is a string:
   * https://github.com/bennycode/coinbase-advanced-node/issues/354
   *
   * @see https://docs.cloud.coinbase.com/sign-in-with-coinbase/docs/api-time
   */
  async getTime(): Promise<TimeSkew> {
    const client = axios.create({
      baseURL: this.baseURL,
      timeout: 50_000,
    });
    client.interceptors.request.use(config => {
      config.headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      };
      return config;
    });
    const response = await client.get<any>(`${this.baseURL}${TimeAPI.URL.TIME}`, {
      // This trick forces axios to set JSON headers
      // data: {},
      // headers: {
      //   'Content-Type': 'application/json',
      //   'Accept': 'application/json',
      // },
      // responseType: 'text',
      // transformResponse: undefined
      // responseType: 'text',
    });
    // const buffer =  Buffer.from(response.data, 'binary');
    // // const textdata = buffer.toString(); // for string
    // // console.log(textdata);
    // const jsondata = buffer.toJSON(); // for json
    // console.log(jsondata);
    // console.log('what is this ', Buffer.from(response.data.toJSON().data).toString('utf8'));
    return response.data.data;
  }

  /**
   * Get the absolute difference between server time and local time.
   */
  getClockSkew(time: TimeSkew): number {
    const now = Math.floor(Date.now() / 1000);
    return time.epoch - now;
  }
}
