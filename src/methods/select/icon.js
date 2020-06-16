export default (is_local) => ({
  alignItems: 'center',
  display: 'flex',

  ':before': {
    content: is_local ? '"\f233"' : '"\f0c2"',
    display: 'inline-block',
    font: 'normal normal normal 14px/1 FontAwesome',
    marginRight: 8,
  },
});
