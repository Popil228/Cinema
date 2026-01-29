import React, { useContext } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/authContext/AuthContext';
import styles from './Header.module.scss';

const Header: React.FC = () => {
    const auth = useContext(AuthContext);
    const navigate = useNavigate();

    if (!auth) return null;

    const handleLogout = () => {
        auth.logout();
        navigate('/');
    };

    return (
        <header className={styles.header}>
            <div className={styles.container}>
                <div className={styles.leftSide}>
                    <Link to="/" className={styles.logo}>
                        <div className={styles.logoCircle}>
                            <img src="/logo.png" alt="Cinema Hall Logo" />
                        </div>
                    </Link>
                    
                    <nav className={styles.nav}>
                        <NavLink to="/" className={({ isActive }) => isActive ? styles.active : ''}>Головна</NavLink>
                        <NavLink to="/schedule" className={({ isActive }) => isActive ? styles.active : ''}>Розклад</NavLink>

                        {auth.isAdmin && (
                            <Link to="/admin" className={styles.adminLink}>Адмін-панель</Link>
                        )}
                    </nav>
                </div>

                <div className={styles.auth}>
                    {auth.isAuthenticated ? (
                        <div className={styles.userSection}>
                            <span className={styles.userEmail}>{auth.user?.email}</span>
                            <button onClick={handleLogout} className={styles.logoutBtn}>Вийти</button>
                        </div>
                    ) : (
                        <>
                            <Link to="/login" className={styles.loginBtn}>Увійти</Link>
                            <Link to="/register" className={styles.registerBtn}>Зареєструватися</Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;