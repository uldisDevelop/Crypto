import * as React from 'react';
// @ts-ignore
import styles from './Chart.module.scss';
import Chart from 'react-apexcharts';
import helper from '../../app/Helper';
import * as currency from 'currency.js';
import { fetchVolumeChartData } from '../../api';
import { VolumeChartDate } from '../../interfaces';
import PeriodOption from '../chartPeriodOption';

export default function VolumeChart({ pairId }: { pairId: string }) {
  const [period, setPeriod] = React.useState(30);
  const [selectedDate, setSelectedDate] = React.useState<VolumeChartDate>(null);
  const [days, setDays] = React.useState<VolumeChartDate[]>([]);
  const [loading, setLoading] = React.useState(false);

  const fetchGraphicData = async () => {
    if (loading) {
      return;
    }
    setLoading(true);
    try {
      const data = await fetchVolumeChartData(pairId, period);
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
    plotOptions: {
      bar: {
        columnWidth: '100%',
        distributed: true,
        borderRadius: 6,
      },
    },
    chart: {
      id: 'line2',
      toolbar: {
        show: false,
      },

      type: 'bar',
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
      categories: days.map((day) =>
        helper.timeConverter(day.date, days.length === 7 ? 'day' : 'date')
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
       //@ts-ignore
      labels: {
        show: false,
      },
    },
    legend: {
      show: false,
    },
    yaxis: {
      labels: {
        show: false,
      },
      tooltip: {
        enabled: false,
      },
    },

    fill: {
      type: 'gradient',
      colors: ['#EB7A4A'],
      gradient: {
        shadeIntensity: 1,
        type: 'vertical',
        opacityFrom: 0.7,
        opacityTo: 0.9,
        //@ts-ignore
        colorStops: [
          {
            offset: 0,
            color: '#EB7A4A',
            opacity: 1,
          },
          {
            offset: 104,
            color: 'rgba(246, 67, 207, 0)',
            opacity: 1,
          },
        ],
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
      data: days.map((day, index) => day.volumeUSD),
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

  let visibleVolume = null;
  let visibleDate = null;

  if (days.length) {
    visibleVolume = selectedDate
      ? +selectedDate.volumeUSD
      : +days[days.length - 1].volumeUSD;

    visibleDate = selectedDate ? selectedDate.date : days[days.length - 1].date;
  }

  return (
    <div className={styles.graphContainer}>
      <div className={styles.borderContainer}></div>
      {!!days.length && (
        <div className={styles.selectedItem}>
          {'Volume '}
          <span className={styles.date}>
            {helper.timeConverter(visibleDate, 'date')}
          </span>
          <br />
          <span className={styles.liquidity}>
            {currency(visibleVolume).format()}
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
      <div className={styles.chartContainer}>
        <MemoizedChart
          //@ts-ignore
          options={options}
          series={series}
          type='bar'
          width={'100%'}
          height={'240px'}
        />
      </div>
    </div>
  );
}

export const MemoizedChart = React.memo(
  (props) => {
    return <Chart {...props} />;
  },
  (prevChart: any, nextChart: any) => {
    return prevChart.series[0].data.length === nextChart.series[0].data.length;
  }
);
