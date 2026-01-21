import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IMaskInput } from 'react-imask';
import { authApi, tokenStorage } from '../../api/authApi';
import styles from './RegisterPage.module.scss';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [passwordError, setPasswordError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validatePassword = (value: string) => {
    setPassword(value);
    if (value.length > 0 && value.length < 8) {
      setPasswordError('Мінімум 8 символів');
    } else if (value.length > 0 && !/[A-Z]/.test(value)) {
      setPasswordError('Потрібна велика літера');
    } else if (value.length > 0 && !/[0-9]/.test(value)) {
      setPasswordError('Потрібна хоча б одна цифра');
    } else {
      setPasswordError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 1. Очищаємо номер від маски (залишаємо лише цифри)
    const cleanDigits = phone.replace(/\D/g, '');

    // 2. Перевірка номера на повноту
    if (cleanDigits.length < 12) {
      setPhoneError('Введіть повний номер телефону');
      return;
    }

    // 3. Форматуємо для відправки (прибираємо 38)
    const phoneForServer = cleanDigits.startsWith('38') 
      ? cleanDigits.substring(2) 
      : cleanDigits;

    if (passwordError) {
      setError(`Помилка у паролі: ${passwordError}`);
      return;
    }

    if (password !== confirmPassword) {
      setError("Паролі не збігаються!");
      return;
    }

    setIsLoading(true);

    try {
      const response = await authApi.register({
        email,
        phoneNum: phoneForServer,
        password,
        confirmPassword,
      });

      if (response.success && response.token && response.user) {
        tokenStorage.setToken(response.token);
        tokenStorage.setUser(response.user);
        navigate('/');
      } else {
        setError(response.message || 'Помилка реєстрації');
      }
    } catch {
      setError('Помилка з\'єднання з сервером');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.authCard}>
        <h1 className={styles.title}>Зареєструватися</h1>
        
        {error && <div className={styles.error}>{error}</div>}
        
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label>Електронна пошта</label>
            <input 
              type="email" 
              placeholder="example@mail.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Номер телефону</label>
            <IMaskInput
              mask="+{38} (000) 000-00-00"
              lazy={false}
              placeholder="+38 (0__) ___-__-__"
              value={phone}
              onAccept={(value: string) => {
                setPhone(value);
                if (value.replace(/\D/g, '').length === 12) setPhoneError('');
              }}
              className={styles.maskedInput}
              required
            />
            {phoneError && <span className={styles.errorText}>{phoneError}</span>}
          </div>
          
          <div className={styles.inputGroup}>
            <label>Пароль</label>
            <div className={styles.passwordWrapper}>
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Придумайте пароль"
                value={password}
                onChange={(e) => validatePassword(e.target.value)}
                required
              />
              <button 
                type="button" 
                className={styles.eyeIcon}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
            {passwordError && <span className={styles.errorText}>{passwordError}</span>}
          </div>

          <div className={styles.inputGroup}>
            <label>Повторіть пароль</label>
            <div className={styles.passwordWrapper}>
              <input 
                type={showConfirmPassword ? "text" : "password"} 
                placeholder="Повторіть пароль"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button 
                type="button" 
                className={styles.eyeIcon}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>
          
          <button type="submit" className={styles.submitBtn} disabled={isLoading}>
            {isLoading ? 'Реєстрація...' : 'Зареєструватися'}
          </button>
        </form>
        
        <p className={styles.footerText}>
          Уже маєте аккаунт? <Link to="/login">Увійти</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;