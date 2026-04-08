import * as echarts from 'echarts';
export function getEchart() {
  const chartDom = document.getElementById('visualize-data');
  const myChart = echarts.init(chartDom);

  const option = {
    xAxis: {
      type: 'category',
      data: ['Total Users', 'Active Today', 'New Registrations', 'Admin Accounts']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: [1248, 312, 48, 50],
        type: 'bar'
      }
    ]
  };

  option && myChart.setOption(option);
}