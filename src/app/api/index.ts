import helper from '../app/Helper';
import { LiquidityChartDate, Pair, VolumeChartDate } from '../interfaces';

export async function fetchPair(pairId: string): Promise<Pair> {
  const tokenSelect = `
    liquidity
    name
    symbol
    dayData(first:1, orderBy:date, orderDirection:desc){
      priceUSD  
    }
  `;

  const result = await helper.fetch({
    query: `
    {
        pair(id: "${pairId}") {
            name
            token0 {
                ${tokenSelect}
            }
            token1{
                ${tokenSelect}
            }
            token0Price
            token1Price
        }     
    }
    `
  });
  return result.data.pair;
}

export async function fetchLiquidityChartData(
  pairId: string,
  period: number
): Promise<LiquidityChartDate[]> {
  const currentUnix = Date.now();
  const startDateTime = currentUnix / 1000 - period * 24 * 60 * 60;

  const result = await helper.fetch({
    query: `
      {
        pairDayDatas(last: ${period},
          where:
          {
            pair: "${pairId}",
            date_gt:${startDateTime.toFixed(0)}
          },
          orderBy:date,
          orderDirection:asc) {
            id
            date
            reserveUSD
          }
      }
      `,
  });
  return result.data.pairDayDatas;
}

export async function fetchVolumeChartData(
  pairId: string,
  period: number
): Promise<VolumeChartDate[]> {
  const currentUnix = Date.now();
  const startDateTime = currentUnix / 1000 - period * 24 * 60 * 60;

  const result = await helper.fetch({
    query: `
    {
      pairDayDatas(last: ${period},where:
        {
          pair:"${pairId}",
          date_gt:${startDateTime.toFixed(0)}
      },
        orderBy:date,orderDirection:asc) {
        id
        date
        volumeUSD          
      }       
    }
    `,
  });
  return result.data.pairDayDatas;
}

