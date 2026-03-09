import React from 'react';
import './ToggleSwitch.css';

const ToggleSwitch = ({ isOn, onChange }) => {
  return (
    <button
      type="button"
      className={`toggle-switch ${isOn ? 'toggle-switch_on' : 'toggle-switch_off'}`}
      onClick={onChange}
      aria-pressed={isOn}
    >
      <span className="toggle-switch__slider" />
    </button>
  );
};

export default ToggleSwitch;
