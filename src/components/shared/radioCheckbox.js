import React from 'react';

export default class ThemedComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: [] };
    this.handleClick = this.handleClick.bind(this);
    this.setValue = this.setValue.bind(this);
  }

  /* eslint-disable react/no-did-mount-set-state */
  componentDidMount() {
    const { defaultValue } = this.props;
    if (defaultValue) {
      const valueArray = !defaultValue.length ? [defaultValue] : defaultValue;
      valueArray.map((v) => this.setValue(v.value));
    }
  }

  setValue(v) {
    let { value } = this.state;
    const { required, onChange, options, type } = this.props;
    const isRadio = type === 'radio';

    if (value.indexOf(v) !== -1 && isRadio && required) {
      console.log('not unsetting required radio');
    } else if (value.indexOf(v) === -1 && isRadio) {
      value = [v];
    } else if (value.indexOf(v) === -1) {
      value.push(v);
    } else {
      value.splice(value.indexOf(v), 1);
    }
    this.setState({ value });
    onChange(!options.length || isRadio ? value[0] : value);
  }

  handleClick(v) {
    this.setValue(v);
  }

  render() {
    const { options, type, ...rest } = this.props;
    const optionsArray = !options.length ? [options] : options;

    return (
      <div {...rest}>
        {optionsArray &&
          optionsArray.map((option) => (
            <div key={`${type}${option.value}${option.label}`} onClick={() => this.handleClick(option.value)}>
              <div className={`radio-checkbox ${this.state.value.indexOf(option.value) !== -1 ? 'show' : 'hidden'}`}>
                {type === 'checkbox' ? <span className="checkmark">&#10004;</span> : <div className="dot" />}
              </div>
              <div className="radio-checkbox-label">{option.label}</div>
            </div>
          ))}
      </div>
    );
  }
}
