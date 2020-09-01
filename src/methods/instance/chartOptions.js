export default ({ type, labels }) => ({
  chart: {
    type,
    fontFamily: 'proxima-soft',
    toolbar: { offsetX: -25, tools: { selection: false, pan: false, zoom: false, zoomin: false, zoomout: false, reset: false } },
  },
  labels,
  theme: { palette: 'palette10' },
  plotOptions: { pie: { offsetY: 10 } },
  legend: { offsetY: 15 },
});
