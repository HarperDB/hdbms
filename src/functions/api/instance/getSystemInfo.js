import queryInstance from '../queryInstance';
import instanceState from '../../state/instanceState';

export default async ({ auth, url, signal, refresh, is_local, attributes=['network','disk','cpu','memory','system'] }) => {
  const result = await queryInstance({
    operation: {
      operation: 'system_information',
      attributes,
    },
    auth,
    url,
    signal,
  });

  if (result.error && refresh) {
    return instanceState.update((s) => {
      s.systemInfoError = true;
    });
  }

  if (result.error) {
    return instanceState.update((s) => {
      s.systemInfo = {
        totalMemory: '...',
        usedMemory: '...',
        freeMemory: '...',
        memoryStatus: 'grey',
        totalDisk: '...',
        usedDisk: '...',
        freeDisk: '...',
        diskStatus: 'grey',
        cpuInfo: '...',
        cpuCores: '...',
        cpuLoad: '...',
        cpuStatus: 'grey',
        networkTransfered: '...',
        networkReceived: '...',
        networkLatency: '...',
        networkLatencyStatus: 'grey',
      };
      s.systemInfoError = true;
    });
  }

  const B2GB1000 = 1000000000; // for mac disk and transfer
  const B2GB1024 = 1073741824; // for non-mac disk

  const totalMemory = result.memory.total / B2GB1024;
  const usedMemory = result.memory.active / B2GB1024;
  const freeMemory = result.memory.available / B2GB1024;
  const memoryStatus = freeMemory / totalMemory < 0.1 ? 'danger' : freeMemory / totalMemory < 0.25 ? 'warning' : 'success';

  console.log(instanceState);
  // if 'disk' in attributes, look up as it was before
  // otherwise, fetch last value from system info, or display N/A.
  const totalDisk = 
    result.system.platform === 'darwin'
      ? result.disk.size[0].size / B2GB1000
      : !is_local
      ? result.disk.size.find((disk) => disk.mount === '/home/ubuntu/hdb').size / B2GB1024
      : result.disk.size[0].size / B2GB1024;
  const usedDisk =
    result.system.platform === 'darwin'
      ? result.disk.size.reduce((a, b) => a + b.used, 0) / B2GB1000
      : !is_local
      ? result.disk.size.find((disk) => disk.mount === '/home/ubuntu/hdb').used / B2GB1024
      : result.disk.size.reduce((a, b) => a + b.used, 0) / B2GB1024;
  const freeDisk = totalDisk - usedDisk;
  const diskStatus = freeDisk / totalDisk < 0.1 ? 'danger' : freeDisk / totalDisk < 0.25 ? 'warning' : 'success';

  const cpuInfo = `${result.cpu.manufacturer} ${result.cpu.brand}`;
  const cpuCores = `${result.cpu.physicalCores} physical / ${result.cpu.cores} virtual`;
  const cpuLoad = result.cpu.current_load.currentLoad || result.cpu.current_load.currentload || 0;
  const cpuStatus = cpuLoad > 90 ? 'danger' : cpuLoad > 75 ? 'warning' : 'success';

  const networkTransfered = result.network.stats.reduce((a, b) => a + b.tx_bytes, 0) / B2GB1000;
  const networkReceived = result.network.stats.reduce((a, b) => a + b.rx_bytes, 0) / B2GB1000;
  const networkLatency = result.network.latency.ms;
  const networkLatencyStatus = networkLatency > 1000 ? 'danger' : networkLatency > 500 ? 'warning' : 'success';

  const systemInfo = {
    totalMemory: totalMemory?.toFixed(2),
    usedMemory: usedMemory?.toFixed(2),
    freeMemory: freeMemory?.toFixed(2),
    memoryStatus,
    totalDisk: totalDisk?.toFixed(2),
    usedDisk: usedDisk?.toFixed(2),
    freeDisk: freeDisk?.toFixed(2),
    diskStatus,
    cpuInfo,
    cpuCores,
    cpuLoad: cpuLoad?.toFixed(2),
    cpuStatus,
    networkTransfered: networkTransfered?.toFixed(2),
    networkReceived: networkReceived?.toFixed(2),
    networkLatency,
    networkLatencyStatus,
  };

  return instanceState.update((s) => {
    s.systemInfo = systemInfo;
  });
};
