export default (e, setFormState) => {
  if (e.keyCode === 13 && e.metaKey) {
    setFormState({ submitted: true });
  } else if (e.keyCode === 9) {
    e.preventDefault();
    document.execCommand('insertHTML', false, '&#009');
  }
};
