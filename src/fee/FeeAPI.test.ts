import nock from 'nock';

describe('FeeAPI', () => {
  describe('getCurrentFees', () => {
    it('returns maker & taker fee rates', async () => {
      const response = {
        advanced_trade_only_fees: 25,
        advanced_trade_only_volume: 1000,
        coinbase_pro_fees: 25,
        coinbase_pro_volume: 1000,
        fee_tier: {
          maker_fee_rate: '0.0020',
          pricing_tier: '<$10k',
          taker_fee_rate: '0.0010',
          usd_from: '0',
          usd_to: '10,000',
        },
        goods_and_services_tax: {
          rate: 'string',
          type: 'INCLUSIVE',
        },
        margin_rate: {
          value: 'string',
        },
        total_fees: 25,
        total_volume: 1000,
      };
      nock(global.REST_URL).get('/fees').reply(200, response);
      const fees = await global.client.rest.fee.getCurrentFees();
      expect(fees.fee_tier.maker_fee_rate).toBe('0.0020');
    });
  });
});
