export default (value) => value && value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
