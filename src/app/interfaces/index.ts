export interface Pair {
  id?: any;
  name?: any;
  token0?: Token;
  token1?: Token;
  totalSupply?: any;
  token0Price?: string;
  token1Price?: string;
  volumeUSD?: any;
}

export interface Token {
  liquidity: string;
  name: string;
  symbol: string;
  dayData?: [
    {
      priceUSD: string;
    }
  ];
}

export interface LiquidityChartDate {
  date: number;
  reserveUSD: number;
}
export interface VolumeChartDate {
  date: number;
  volumeUSD: number;
}
