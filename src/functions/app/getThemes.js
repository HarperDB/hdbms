import appState from '../state/appState';

export default (theme) => {
  const is_lumen = window.location.host.indexOf('lumen') !== -1;
  const is_verizon = window.location.host.indexOf('verizon') !== -1;
  const themes = is_lumen ? ['lumen'] : is_verizon ? ['verizon'] : ['purple', 'light', 'dark'];

  appState.update((s) => {
    s.theme = themes.length === 1 ? themes[0] : themes.indexOf(theme) !== -1 ? theme : 'purple';
    s.themes = themes;
    s.is_lumen = is_lumen;
    s.is_verizon = is_verizon;
  });
};
