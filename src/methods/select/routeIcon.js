export default (iconCode) => {
  return {
    alignItems: 'center',
    display: 'flex',

    ':before': {
      content: `"\\${iconCode}"`,
      display: 'inline-block',
      font: 'normal normal normal 14px/1 FontAwesome',
      marginRight: 8,
    },
  };
};
