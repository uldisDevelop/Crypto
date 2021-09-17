import * as currency from 'currency.js';
import * as React from 'react';
import SvgIcons from '../../../../assets/SvgIcons';
import { Pair } from '../../interfaces';
// @ts-ignore
import styles from './PairItem.module.scss';

export default function MainPanel({
  tokenIndex,
  pair,
}: {
  pair: Pair;
  tokenIndex: 0 | 1;
}) {
  const token = tokenIndex === 0 ? pair.token0 : pair.token1;
  const tokenOther = tokenIndex === 0 ? pair.token1 : pair.token0;
  const price = tokenIndex === 0 ? pair.token1Price : pair.token0Price;

  return (
    <div className={styles.mainPanel}>
      <span className={styles.iconContainer}>
        {SvgIcons[token.symbol]}
        </span>
      <span className={styles.liquidity}>
        {currency(+token.liquidity, { precision: 0 }).format({ symbol: '' })}
      </span>
      <span className={styles.symbol}>{token.symbol}</span>
      <div>
        <span>
          1 {token.symbol} = {currency(price, { precision: 5 }).format()}{' '}
          {tokenOther.symbol}
        </span>

        <span className={styles.priceUSD}>
          {' ('}          
          {currency(+token.dayData[0].priceUSD, { precision: 2 }).format()}
          {')'}
        </span>
      </div>
    </div>
  );
}
