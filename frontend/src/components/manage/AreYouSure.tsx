import React from 'react';
import './AreYouSure.css';

interface AreYouSureProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const AreYouSure: React.FC<AreYouSureProps> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="AreYouSure">
      <div className="AreYouSure-modal">
        <h2>Are you sure?</h2>
        <button onClick={onConfirm}>Yes</button>
        <button onClick={onClose}>No</button>
      </div>
    </div>
  );
};

export default AreYouSure;
