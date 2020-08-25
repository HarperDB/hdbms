export default ({ theme }) => ({
  iconStyle: 'solid',
  style: {
    base: {
      iconColor: '#403b8a',
      color: theme === 'dark' ? '#ffffff' : '#212121',
      fontWeight: 100,
      fontFamily: 'Raleway, Open Sans, Segoe UI, sans-serif',
      fontSize: '14px',
      fontSmoothing: 'antialiased',
      '::placeholder': {
        color: '#bcbcbc',
      },
    },
    invalid: {
      iconColor: '#ea4c89',
      color: '#ea4c89',
    },
  },
});
