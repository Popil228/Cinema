import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './RegisterPage.module.scss';

const RegisterPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className={styles.container}>
      <div className={styles.authCard}>
        <h1 className={styles.title}>Зареєструватися</h1>
        
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
                placeholder="Придумайте пароль"
              />
              <button 
                type="button" 
                className={styles.eyeIcon}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label>Повторіть пароль</label>
            <div className={styles.passwordWrapper}>
              <input 
                type={showConfirmPassword ? "text" : "password"} 
                placeholder="Повторіть пароль"
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
          
          <button type="submit" className={styles.submitBtn}>Зареєструватися</button>
        </form>
        
        <p className={styles.footerText}>
          Уже маєте аккаунт? <Link to="/login">Увійти</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;