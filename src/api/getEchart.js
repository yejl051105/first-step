import * as echarts from 'echarts';

export function getEchart(chartDom, totalLength, activeUsers, inActiveUsers, adminUsers, chartInstance = null) {
  const myChart = chartInstance ?? echarts.init(chartDom);

  const option = {
    backgroundColor: 'transparent',
    textStyle: {
      color: '#475569'
    },
    xAxis: {
      type: 'category',
      data: ['TotalUsers', 'ActiveUsers', 'InactiveUser', 'AdminUsers'],
      axisLine: {
        lineStyle: {
          color: '#cbd5e1'
        }
      },
      axisTick: {
        lineStyle: {
          color: '#cbd5e1'
        }
      },
      axisLabel: {
        color: '#64748b'
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        lineStyle: {
          color: '#cbd5e1'
        }
      },
      axisLabel: {
        color: '#64748b'
      },
      splitLine: {
        lineStyle: {
          color: '#e5ecf4'
        }
      }
    },
    series: [
      {
        data: [totalLength, activeUsers, inActiveUsers, adminUsers],
        type: 'bar',
        itemStyle: {
          color: '#1d4ed8'
        }
      }
    ]
  };

  myChart.setOption(option);
  return myChart;
}
