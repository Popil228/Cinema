import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authApi } from '../../api/authApi';
import styles from './EmailConfirmationPage.module.scss';

const EmailConfirmationPage: React.FC = () => {
  const [code, setCode] = useState('');
  const [timer, setTimer] = useState(60);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      navigate('/register');
    }
  }, [email, navigate]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer(prev => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await authApi.confirmEmail(email, code);
      
      if (response.success) {
        alert('Реєстрацію завершено! Тепер ви можете увійти.');
        navigate('/login');
      } else {
        setError(response.message || 'Неправильний код');
      }
    } catch (err: any) {
      setError(err.message || 'Сталася помилка при підтвердженні');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setError('');
    try {
      const response = await authApi.resendConfirmationCode(email);
      if (response.success) {
        setTimer(60);
        setCode('');
        alert('Новий код надіслано на вашу пошту!');
      }
    } catch (err: any) {
      setError(err.message || 'Не вдалося надіслати код повторно');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.authCard}>
        <h1 className={styles.title}>Підтвердження</h1>
        <p className={styles.subtitle}>
          Ми надіслали код на <strong>{email || 'вашу пошту'}</strong>. Введіть його нижче:
        </p>

        {error && <div className={styles.errorBanner}>{error}</div>}
        
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <input 
              type="text" 
              maxLength={6}
              placeholder="000000"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              className={styles.codeInput}
              disabled={isLoading}
              required 
            />
          </div>
          
          <button 
            type="submit" 
            className={styles.submitBtn} 
            disabled={isLoading || code.length < 6}
          >
            {isLoading ? 'Перевірка...' : 'Підтвердити'}
          </button>
        </form>
        
        <div className={styles.footerText}>
          {timer > 0 ? (
            <p>Надіслати код повторно через <b>{timer}</b> сек.</p>
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