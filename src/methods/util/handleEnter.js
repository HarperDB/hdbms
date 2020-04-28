export default (e, setFormState) => {
  if (e.keyCode === 13) {
    setFormState({ submitted: true });
  }
};
