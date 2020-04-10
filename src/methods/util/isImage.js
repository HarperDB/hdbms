export default (string) => string && ['jpg', 'png', 'gif'].includes(string.split('.').pop());
