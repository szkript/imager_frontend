import React from 'react';
import './ImageModal.css'; // CSS importálása

const ImageModal = ({ show, onClose, imageUrl }) => {
  if (!show) return null; // Ha a show false, ne jelenjen meg semmi

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <img src={imageUrl} alt="Large view" />
        <button className="modal-close" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default ImageModal;
