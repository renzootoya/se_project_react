import React from 'react';
import './Modal.css';

export default function ModalWithForm({ 
  title, 
  buttonText, 
  children, 
  onClose, 
  onSubmit, 
  isLoading 
}) {
  return (
    <div className="modal modal_opened">
      <div className="modal__content">
        <button className="modal__close" onClick={onClose}>×</button>
        <h2>{title}</h2>
        <form onSubmit={onSubmit}>
          {children}
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Loading...' : buttonText}
          </button>
        </form>
      </div>
    </div>
  );
}
