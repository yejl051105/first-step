import * as echarts from 'echarts';

export function getEchart(totalLength, activeUsers, inActiveUsers, adminUsers) {
  const chartDom = document.getElementById('visualize-data');
  const myChart = echarts.init(chartDom);

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

  option && myChart.setOption(option);
}
