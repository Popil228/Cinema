import React, { useEffect, useState } from 'react';
import './SessionExpiredModal.scss';

interface SessionExpiredModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SessionExpiredModal: React.FC<SessionExpiredModalProps> = ({ isOpen, onClose }) => {
  const [countdown, setCountdown] = useState(15);

  useEffect(() => {
    if (!isOpen) {
      setCountdown(15);
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="session-expired-overlay">
      <div className="session-expired-modal">
        <div className="session-expired-icon">⏱️</div>
        <h2>Час дії сеансу закінчився</h2>
        <p>Ви будете автоматично виведені з системи через:</p>
        <div className="countdown">{countdown}</div>
        <button onClick={onClose} className="close-button">
          Вийти зараз
        </button>
      </div>
    </div>
  );
};

export default SessionExpiredModal;
