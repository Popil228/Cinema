import React, { useContext, useState } from 'react';
import { AuthContext } from '../../context/authContext/AuthContext';
import { IMaskInput } from 'react-imask';
import styles from './ProfilePage.module.scss';

const ProfilePage: React.FC = () => {
  const auth = useContext(AuthContext);
  const user = auth?.user;

  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phoneNum || '');
  
  const [oldPassword, setOldPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  if (!auth?.isAuthenticated) {
    return <div className={styles.errorPage}>Будь ласка, увійдіть в систему</div>;
  }

  const validatePassword = (value: string) => {
    setPassword(value);
    if (value.length > 0 && value.length < 8) {
      setPasswordError('Мінімум 8 символів');
    } else if (value.length > 0 && !/[A-Z]/.test(value)) {
      setPasswordError('Потрібна велика літера');
    } else if (value.length > 0 && !/[0-9]/.test(value)) {
      setPasswordError('Потрібна цифра');
    } else {
      setPasswordError('');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEmail(user?.email || '');
    setPhone(user?.phoneNum || '');
    setOldPassword('');
    setPassword('');
    setConfirmPassword('');
    setError('');
    setPasswordError('');
  };

  const handleSave = () => {
    setError('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Введіть коректну електронну пошту');
      return;
    }

    if (password || oldPassword || confirmPassword) {
      if (!oldPassword) {
        setError('Введіть старий пароль для підтвердження змін');
        return;
      }
      if (passwordError || !password) {
        setError('Введіть коректний новий пароль');
        return;
      }
      if (password !== confirmPassword) {
        setError('Нові паролі не збігаються');
        return;
      }
    }

    console.log("Дані оновлено успішно");
    setIsEditing(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.glassCard}>
        <div className={styles.header}>
          <h1 className={styles.title}>Мій Профіль</h1>
          {!isEditing && (
            <button className={styles.editBtn} onClick={() => setIsEditing(true)}>
              Редагувати ✎
            </button>
          )}
        </div>

        {error && <div className={styles.formError}>{error}</div>}

        <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
          <div className={styles.inputGroup}>
            <label>Електронна пошта</label>
            <input 
              type="email" 
              value={email}
              disabled={!isEditing}
              onChange={(e) => setEmail(e.target.value)}
              className={!isEditing ? styles.readOnlyInput : ''}
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Номер телефону</label>
            <IMaskInput
              mask="+{38} (000) 000-00-00"
              value={phone}
              disabled={!isEditing}
              onAccept={(value) => setPhone(value)}
              className={`${styles.maskedInput} ${!isEditing ? styles.readOnlyInput : ''}`}
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Пароль</label>
            {!isEditing ? (
              <input type="text" value="••••••••" disabled className={styles.readOnlyInput} />
            ) : (
              <div className={styles.passwordSection}>
                <div className={styles.passwordWrapper}>
                  <input 
                    type={showOldPassword ? "text" : "password"} 
                    placeholder="Старий пароль" 
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                  />
                  <button type="button" className={styles.eyeIcon} onClick={() => setShowOldPassword(!showOldPassword)}>
                    {showOldPassword ? '🙈' : '👁️'}
                  </button>
                </div>

                <hr className={styles.divider} />
                <p className={styles.hint}>Введіть новий пароль:</p>

                <div className={styles.passwordWrapper}>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Новий пароль" 
                    value={password}
                    onChange={(e) => validatePassword(e.target.value)}
                  />
                  <button type="button" className={styles.eyeIcon} onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
                {passwordError && <span className={styles.fieldError}>{passwordError}</span>}

                <div className={styles.passwordWrapper}>
                  <input 
                    type={showConfirmPassword ? "text" : "password"} 
                    placeholder="Повторіть пароль" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <button type="button" className={styles.eyeIcon} onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                    {showConfirmPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className={styles.actions}>
            {isEditing ? (
              <>
                <button type="button" className={styles.saveBtn} onClick={handleSave}>Зберегти зміни</button>
                <button type="button" className={styles.cancelBtn} onClick={handleCancel}>Скасувати</button>
              </>
            ) : (
              <button type="button" className={styles.logoutBtn} onClick={auth.logout}>Вийти з акаунту</button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;