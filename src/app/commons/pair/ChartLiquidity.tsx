import * as React from 'react';
// @ts-ignore
import styles from './Chart.module.scss';
import Chart from 'react-apexcharts';
import helper from '../../app/Helper';
import * as currency from 'currency.js';
import { fetchLiquidityChartData } from '../../api';
import { LiquidityChartDate } from '../../interfaces';
import PeriodOption from '../chartPeriodOption';



export default function GraphicLiquidity({pairId}:{pairId:string}) {
  const [period, setPeriod] = React.useState<number>(7);
  const [selectedDate, setSelectedDate] =
    React.useState<LiquidityChartDate>(null);
  const [days, setDays] = React.useState<LiquidityChartDate[]>([]);
  const [loading, setLoading] = React.useState(false);

  const fetchGraphicData = async () => {
    if (loading) {
      return;
    }
    setLoading(true);
    try {
      const data = await fetchLiquidityChartData(pairId, period);
      setDays(data);
    } catch (err) {
      console.warn(err);
    }
    setLoading(false);
  };

  React.useEffect(() => {
    fetchGraphicData();
  }, [period]);

  const options: ApexCharts.ApexOptions = {
    chart: {
      id: 'line',
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
      selection: {
        enabled: false,
      },
      events: {
        mouseLeave: () => {
          setSelectedDate(null);
        },
        mouseMove: function (event, chartContext, config) {
          if (config.dataPointIndex !== -1) {
            if (days[config.dataPointIndex] !== selectedDate) {
              setSelectedDate(days[config.dataPointIndex]);
            }
          } else {
            setSelectedDate(null);
          }
        },
      },
    },
    grid: {
      show: false,
    },
    xaxis: {
      categories: days.map(
        (day, index) =>
          helper.timeConverter(day.date, days.length === 7 ? 'day' : 'date') +
          (days.length === 7 && index === days.length - 1
            ? '\u2004\u2004\u2004\u2004\u2004\u2004'
            : '')
      ),
      tooltip: {
        enabled: false,
      },
      floating: false,
      labels: {
        hideOverlappingLabels: true,
        rotate: 0,
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        show: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    stroke: {
      curve: 'smooth',
      width: 2,
      colors: ['#14A887'],
    },

    fill: {
      type: 'gradient',
      colors: ['rgba(0,57,57,0.8)'],
      gradient: {
        gradientToColors: ['black'],
        type: 'vertical',
        stops: [0, 100],
      },
    },
    dataLabels: {
      enabled: false,
    },
    markers: {
      size: 0,
    },
  };

  const series = [
    {
      name: 'series-1',
      data: days.map((day) => day.reserveUSD),
    },
  ];

  const getPeriodOption = (value: number, text: string) => {
    return (
      <PeriodOption
        isSelected={period === value}
        text={text}
        onClick={() => {
          setPeriod(value);
        }}
      />
    );
  };  

  let visibleLiquidity = null;
  let visibleDate = null;

  if (days.length) {
    visibleLiquidity = selectedDate
      ? +selectedDate.reserveUSD
      : +days[days.length - 1].reserveUSD;

    visibleDate = selectedDate ? selectedDate.date : days[days.length - 1].date;
  }
  return (
    <div className={styles.graphContainer}>
      <div className={styles.borderContainer}></div>
      {!!days.length && (
        <div className={styles.selectedItem}>
          {'Liquidity '}
          <span className={styles.date}>
            {helper.timeConverter(visibleDate, 'date')}
          </span>
          <br />
          <span className={styles.liquidity}>
            {currency(visibleLiquidity).format()}
          </span>
        </div>
      )}
      <div className={styles.periodContainer}>
        {getPeriodOption(7, '1W')}
        {getPeriodOption(30, '1M')}
        {getPeriodOption(100, 'All')}
      </div>
      {loading && (
        <div className={styles.loader}>
          <div className={styles.loaderText}>
            <div className='lds-ripple'>
              <div></div>
              <div></div>
            </div>
          </div>
        </div>
      )}
      <div className={styles.chartWrapper}>
        <MemoizedChart
        //@ts-ignore
          options={options}
          series={series}
          type='area'
          width={'100%'}
          height={'240px'}
        />
      </div>
      {!!series.length && (
        <div>
          <div className={styles.graphicFadeContainerRight}></div>
          <div className={styles.graphicFadeContainerLeft}></div>
        </div>
      )}
    </div>
  );
}



const MemoizedChart = React.memo(
  (props) => {
    return <Chart {...props} />;
  },
  (prevChart: any, nextChart: any) => {
    return prevChart.series[0].data.length === nextChart.series[0].data.length;
  }
);