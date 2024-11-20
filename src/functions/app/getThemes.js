import appState from '../state/appState';
export default theme => {
  const isLumen = window.location.host.indexOf('lumen') >= 0;
  const isVerizon = window.location.host.indexOf('verizon') >= 0;
  const isAkamai = window.location.host.indexOf('akamai') >= 0;
  const themes = isLumen ? ['lumen'] : isVerizon ? ['verizon'] : isAkamai ? ['akamai'] : ['purple', 'light', 'dark'];
  const defaultTheme = 'dark';
  appState.update(s => {
    s.theme = themes.length === 1 ? themes[0] : themes.indexOf(theme) >= 0 ? theme : defaultTheme;
    s.themes = themes;
    s.isLumen = isLumen;
    s.isVerizon = isVerizon;
    s.isAkamai = isAkamai;
  });
};