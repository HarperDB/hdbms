const processNewData = (data) => {
  const keys = data.shift();
  const formattedKeys = keys.map(k => k.replace(/\W+/g, '_').toLowerCase());
  const returnArray = [];

  console.time('processCSV');
  while (data.length) {
    const nextRowArray = data.shift();
    const nextRowObject = {};
    formattedKeys.map((k, i) => nextRowObject[k] = nextRowArray[i]);
    returnArray.push(nextRowObject);
  }
  console.timeEnd('processCSV');

  return returnArray;
};

// eslint-disable-next-line no-restricted-globals
self.addEventListener('message', (event) => self.postMessage(processNewData(event.data)));
