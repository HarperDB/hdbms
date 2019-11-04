export default (value) => {
  const dataType = Object.prototype.toString.call(value);

  switch (dataType) {
    case '[object Array]':
    case '[object Object]':
      return JSON.stringify(value);
    case '[object Boolean]':
      return value ? 'True' : 'False';
    default:
      return value;
  }
};
