import React from 'react';
import './ToggleSwitch.css';

const ToggleSwitch = ({ isOn, onChange, label }) => {
  return (
    <div className="toggle-switch-container">
      {label && <label className="toggle-label">{label}</label>}
      <button
        className={`toggle-switch ${isOn ? 'on' : 'off'}`}
        onClick={() => onChange(!isOn)}
        type="button"
        aria-pressed={isOn}
      >
        <span className="toggle-slider" />
      </button>
    </div>
  );
};

export default ToggleSwitch;
