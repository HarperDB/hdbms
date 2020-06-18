import queryInstance from '../queryInstance';
import instanceState from '../../state/instanceState';

export default async ({ auth, url, signal, refresh }) => {
  const result = await queryInstance({ operation: 'system_information' }, auth, url, signal);

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

  const memoryB2GB = 1073741824;
  const totalMemory = result.memory.total / memoryB2GB;
  const usedMemory = result.memory.used / memoryB2GB;
  const freeMemory = result.memory.free / memoryB2GB;
  const memoryStatus = freeMemory / totalMemory < 0.1 ? 'danger' : freeMemory / totalMemory < 0.25 ? 'warning' : 'success';

  const diskB2GB = 1000000000;
  const totalDisk = result.disk.size[0].size / diskB2GB;
  const usedDisk = result.disk.size.reduce((a, b) => a + b.used, 0) / diskB2GB;
  const freeDisk = totalDisk - usedDisk;
  const diskStatus = freeDisk / totalDisk < 0.1 ? 'danger' : freeDisk / totalDisk < 0.25 ? 'warning' : 'success';

  const cpuInfo = `${result.cpu.manufacturer} ${result.cpu.brand}`;
  const cpuCores = `${result.cpu.physicalCores} physical / ${result.cpu.cores} virtual`;
  const cpuLoad = result.cpu.current_load.currentload;
  const cpuStatus = cpuLoad > 90 ? 'danger' : cpuLoad > 75 ? 'warning' : 'success';

  const networkTransfered = result.network.stats.reduce((a, b) => a + b.tx_bytes, 0) / diskB2GB;
  const networkReceived = result.network.stats.reduce((a, b) => a + b.rx_bytes, 0) / diskB2GB;
  const networkLatency = result.network.latency.ms;
  const networkLatencyStatus = networkLatency > 1000 ? 'danger' : networkLatency > 500 ? 'warning' : 'success';

  const systemInfo = {
    totalMemory: totalMemory.toFixed(2),
    usedMemory: usedMemory.toFixed(2),
    freeMemory: freeMemory.toFixed(2),
    memoryStatus,
    totalDisk: totalDisk.toFixed(2),
    usedDisk: usedDisk.toFixed(2),
    freeDisk: freeDisk.toFixed(2),
    diskStatus,
    cpuInfo,
    cpuCores,
    cpuLoad: cpuLoad.toFixed(2),
    cpuStatus,
    networkTransfered: networkTransfered.toFixed(2),
    networkReceived: networkReceived.toFixed(2),
    networkLatency,
    networkLatencyStatus,
  };

  return instanceState.update((s) => {
    s.systemInfo = systemInfo;
  });
};
