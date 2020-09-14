export default ({ title, type, labels, theme }) => ({
  title: {
    text: title,
    style: {
      color: theme === 'light' ? '#696969' : theme === 'dark' ? '#fff' : '##212121',
    },
  },
  chart: {
    type,
    fontFamily: 'proxima-soft',
    toolbar: { offsetX: -25, tools: { selection: false, pan: false, zoom: false, zoomin: false, zoomout: false, reset: false } },
  },
  labels,
  theme: { palette: 'palette10' },
  plotOptions: { pie: { offsetY: 10 } },
  legend: { offsetY: 5 },
  markers: {
    size: [5],
  },
  tooltip: {
    custom({ series, seriesIndex, dataPointIndex, w }) {
      const tooltipLabel = ['donut', 'pie'].includes(type)
        ? `${w.globals.labels[seriesIndex]}: ${series[seriesIndex]}`
        : w.globals.categoryLabels.length
        ? `${w.globals.categoryLabels[dataPointIndex]}: ${series[seriesIndex][dataPointIndex]}`
        : `${w.globals.labels[dataPointIndex]}: ${series[seriesIndex][dataPointIndex]}`;
      return `<div class="chart-tooltip"><span>${tooltipLabel}</span></div>`;
    },
  },
  xaxis: {
    labels: {
      rotate: -60,
      maxHeight: 80,
      style: {
        fontSize: '10px',
      },
    },
  },
});
