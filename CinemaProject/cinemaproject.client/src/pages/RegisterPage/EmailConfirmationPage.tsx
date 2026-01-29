import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './EmailConfirmationPage.module.scss';

const EmailConfirmationPage: React.FC = () => {
  const [code, setCode] = useState('');
  const [timer, setTimer] = useState(60);
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || 'вашу пошту';

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer(prev => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Тут має бути виклик API для перевірки коду, поки що імітація
    if (code === '123456') {
      alert('Пошту підтверджено успішно!');
      navigate('/login');
    } else {
      alert('Неправильний код. Спробуйте ще раз (імітація: введіть 123456)');
    }
  };

  const handleResend = () => {
    setTimer(60);
    alert('Код надіслано повторно!');
  };

  return (
    <div className={styles.container}>
      <div className={styles.authCard}>
        <h1 className={styles.title}>Підтвердження</h1>
        <p className={styles.subtitle}>
          Ми надіслали код на <strong>{email}</strong>. Введіть його нижче:
        </p>
        
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <input 
              type="text" 
              maxLength={6}
              placeholder="000000"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              className={styles.codeInput}
              required 
            />
          </div>
          
          <button type="submit" className={styles.submitBtn}>Підтвердити</button>
        </form>
        
        <div className={styles.footerText}>
          {timer > 0 ? (
            <p>Надіслати код повторно через {timer} сек.</p>
          ) : (
            <button onClick={handleResend} className={styles.resendBtn}>
              Надіслати код повторно
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailConfirmationPage;