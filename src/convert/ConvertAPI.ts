import {AxiosInstance} from 'axios';

export interface NewQuote {
  from_account: string;
  to_account: string;
  amount: string;
  trade_incentive_metadata?: {
    user_incentive_id?: string;
    code_val?: string;
  }
}

export interface CommitQuote {
  from_account: string;
  to_account: string;
}

interface ConvertTrade {
  id: string;
  status: string;
  user_entered_amount: {
    value: string;
    currency: string;
  };
  amount: {
    value: string;
    currency: string;
  };
  subtotal: {
    value: string;
    currency: string;
  };
  total: {
    value: string;
    currency: string;
  };
  fees: {
    title: string;
    description: string;
    amount: {
      value: string;
      currency: string;
    };
    label: string;
    disclosure: {
      title: string;
      description: string;
      link: {
        text: string;
        url: string;
      }
    }
  }[];
  total_fee: {
    title: string;
    description: string;
    amount: {
      value: string;
      currency: string;
    };
    label: string;
    disclosure: {
      title: string;
      description: string;
      link: {
        text: string;
        url: string;
      }
    }
  };
  source: {
    type: string;
    network: string;
    ledger_account: {
      account_id: string;
      currency: string;
      owner: {
        id: string;
        uuid: string;
        user_uuid: string;
        type: string;
      };
    };
  };
  target: {
    type: string;
    network: string;
    ledger_account: {
      account_id: string;
      currency: string;
      owner: {
        id: string;
        uuid: string;
        user_uuid: string;
        type: string;
      };
    };
  };
  unit_price: {
    target_to_fiat: {
      amount: {
        value: string;
        currency: string;
      };
      scale: number;
    };
    target_to_source: {
      amount: {
        value: string;
        currency: string;
      };
      scale: number;
    };
    source_to_fiat: {
      amount: {
        value: string;
        currency: string;
      };
      scale: number;
    };
  };
  user_warnings: {
    id: string;
    link: {
      text: string;
      url: string;
    };
    context: {
      details: string[];
      title: string;
      link_text: string;
    };
    code: string;
    message: string;
  }[];
  user_reference: string;
  source_currency: string;
  target_currency: string;
  cancellation_reason: {
    message: string;
    code: string;
    error_code: string;
    error_cta: string;
  };
  source_id: string;
  target_id: string;
  exchange_rate: {
    value: string;
    currency: string;
  };
  tax_details: {
    name: string;
    amount: {
      value: string;
      currency: string;
    }
  }[];
  trade_incentive_info: {};
  total_fee_without_tax: {};
  fiat_denoted_total: {
    value: string;
    currency: string;
  }
}

export interface CreateQuoteResponse {
  trade: ConvertTrade;
}

export interface CommitQuoteResponse {
  trade: ConvertTrade;
}

export class ConvertAPI {
  static readonly URL = {
    CONVERT: `/brokerage/convert`,
  }

  constructor(private readonly apiClient: AxiosInstance) {}

  async createConvertQuote(newQuote: NewQuote) {
    const resource = ConvertAPI.URL.CONVERT + '/quote';
    const response = await this.apiClient.post<CreateQuoteResponse>(resource, newQuote);
    return response.data;
  }

  async commitConvertTrade(tradeId: string, commitQuote: CommitQuote) {
    const resource = ConvertAPI.URL.CONVERT + `/trade/${tradeId}`;
    const response = await this.apiClient.post<CommitQuoteResponse>(resource, commitQuote);
    return response.data
  }
}