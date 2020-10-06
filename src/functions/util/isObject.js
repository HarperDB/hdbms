export default (item) => typeof item === 'object' && !Array.isArray(item) && item !== null;
