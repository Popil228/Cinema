import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './LoginPage.module.scss';

const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={styles.container}>
      <div className={styles.authCard}>
        <h1 className={styles.title}>Логін</h1>
        
        <form className={styles.form}>
          <div className={styles.inputGroup}>
            <label>Електронна пошта</label>
            <input type="email" placeholder="example@mail.com" />
          </div>
          
          <div className={styles.inputGroup}>
            <label>Пароль</label>
            <div className={styles.passwordWrapper}>
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Введіть пароль"
              />
              <button 
                type="button" 
                className={styles.eyeIcon}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
            <Link to="/forgot-password" className={styles.forgotLink}>Забули пароль?</Link>
          </div>
          
          <button type="submit" className={styles.submitBtn}>Увійти</button>
        </form>
        
        <p className={styles.footerText}>
          Перший раз тут? <Link to="/register">Зареєструватися</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;