export default (e, setFormState, requiresCtrl = false) => {
  if (e.keyCode === 13 && (!requiresCtrl || e.metaKey)) setFormState({ submitted: true });
};
