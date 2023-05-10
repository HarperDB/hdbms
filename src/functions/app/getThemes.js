import appState from '../state/appState';

export default (theme) => {
  const is_lumen = window.location.host.indexOf('lumen') >= 0;
  const is_verizon = window.location.host.indexOf('verizon') >= 0;
  const is_akamai = window.location.host.indexOf('akamai') >= 0;
  const themes = is_lumen ? ['lumen'] : is_verizon ? ['verizon'] : is_akamai ? ['akamai'] : ['purple', 'light', 'dark'];
  const defaultTheme = 'dark';

  appState.update((s) => {
    s.theme = themes.length === 1 ? themes[0] : themes.indexOf(theme) >= 0 ? theme : defaultTheme;
    s.themes = themes;
    s.is_lumen = is_lumen;
    s.is_verizon = is_verizon;
    s.is_akamai = is_akamai;
  });
};
