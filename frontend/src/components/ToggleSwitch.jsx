import React, { useState } from 'react';
import './ToggleSwitch.css';

const ToggleSwitch = ({ isOn, onChange, label }) => {
  const [isActive, setIsActive] = useState(isOn || false);

  const handleToggle = () => {
    const newState = !isActive;
    setIsActive(newState);
    if (onChange) {
      onChange(newState);
    }
  };

  return (
    <div className="toggle-switch-container">
      {label && <label className="toggle-label">{label}</label>}
      <button
        className={`toggle-switch ${isActive ? 'on' : 'off'}`}
        onClick={handleToggle}
        type="button"
        aria-pressed={isActive}
        title="Toggle"
      >
        <span className="toggle-slider" />
      </button>
    </div>
  );
};

export default ToggleSwitch;
