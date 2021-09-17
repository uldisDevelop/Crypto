import * as React from 'react';
// @ts-ignore
import styles from './Pair.module.scss';
import ChartVolume from './ChartVolume';
import ChartLiquidity from './ChartLiquidity';
import MainPanel from './PairItem';
import { Pair } from '../../interfaces';
import { fetchPair } from '../../api';

function PairComponent({ pairId }: { pairId: string }) {
  const [pair, setPair] = React.useState<Pair>(null);

  const loadPair = async () => {
    const pair = await fetchPair(pairId);
    setPair(pair);
  };

  React.useEffect(() => {
    loadPair();
  }, []);

  return (
    <div className={styles.pairContainer}>
      <div>
        <span className={styles.header}>FE Test exercise</span>
        <span className={styles.subHeader}>Good luck :)</span>
      </div>
      {pair && (
        <div>
          <div className={styles.row}>
            <div className={styles.cell}>
              <MainPanel tokenIndex={0} pair={pair} />
            </div>
            <div className={styles.cell}>
              <MainPanel tokenIndex={1} pair={pair} />
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.cell}>
              <ChartLiquidity pairId={pairId} />
            </div>
            <div className={styles.cell}>
              <ChartVolume pairId={pairId} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PairComponent;
