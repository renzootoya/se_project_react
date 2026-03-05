import React from 'react';
import '../components/Modal.css';

const ModalWithForm = ({
  isOpen,
  onClose,
  title,
  onSubmit,
  children,
  submitButtonText = 'Submit',
  loading = false,
  error = null,
  success = null
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
        <button className="modal-close" onClick={onClose}>×</button>
        <h2>{title}</h2>
        <form onSubmit={onSubmit}>
          {children}
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}
          <div className="form-actions">
            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? `${submitButtonText}...` : submitButtonText}
            </button>
            <button type="button" onClick={onClose} disabled={loading} className="cancel-btn">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalWithForm;
