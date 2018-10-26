import React, { Component } from 'react';

export default class FormInput extends Component {
  focused = false;
  inputRef = null;
  state = {
    active: false,
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    if (this.props.autoFocus) this.focusInput();
    else {
      setTimeout(() => {
        if (this.inputRef.value) {
          this.setState({ active: true });
        }
      }, 200);
    }
  }

  // - the reason this lifecycle hook and this.focused exist is because
  //   when the input value is controlled, and is cleared from the outside
  //   like after submitting a form and clearing the input values,
  //   the inputs need to go back to the inactive state
  // - theoretically this only happens when the scenario above is encountered
  //   (clearing out form input values programmatically) so it should
  //   always set the active value to 'false'
  componentDidUpdate(prevProps) {
    if (prevProps.value !== this.props.value) {
      if (!this.focused) this.setState({ active: !!this.props.value });
    }
  }

  setToActive = () => {
    this.setState({ active: true });
    this.focused = true;
  }

  setToInactive = (e) => {
    if (!e.target.value) {
      this.setState({ active: false });
      this.focused = false;
    }
  }

  focusInput = () => {
    this.inputRef.focus();
  }

  onChange = (e) => {
    const { name, onChange } = this.props;
    const { value } = e.target;

    onChange(name, value);
  }

  render() {
    const { labelText, type, name, value, message, isWhite } = this.props;
    const { active } = this.state;
    const classBase = isWhite ? 'form-input-white' : 'form-input';
    let klass = classBase;
    if (active) klass = classBase + '-active';

    return (
      <div className={klass}>
        <div className='form-input__label-input-wrapper'>
          <label className='form-input__label' onClick={this.focusInput}>
            { labelText }
          </label>
          <input
            ref={(input) => { this.inputRef = input; }}
            name={name}
            value={value}
            type={type}
            className='form-input__input'
            onFocus={this.setToActive}
            onBlur={this.setToInactive}
            onChange={this.onChange} />
          <div className='form-input__input-border' />
        </div>
        <footer className='form-input__message'>
           { message }
        </footer>
      </div>
    );
  }
}
