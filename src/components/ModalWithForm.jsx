import React from 'react';
import './Modal.css';

const ModalWithForm = ({
  isOpen,
  onClose,
  title,
  onSubmit,
  children,
  submitButtonText = 'Submit',
  loading = false,
  error = null,
  footer = null,
}) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" type="button" onClick={onClose}>
          ×
        </button>
        <h2 className="modal-title">{title}</h2>
        <form onSubmit={onSubmit}>
          {children}
          {error && <p className="modal-error">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="modal-submit-btn"
          >
            {loading ? 'Loading...' : submitButtonText}
          </button>
        </form>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
};

export default ModalWithForm;
