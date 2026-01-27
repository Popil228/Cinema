import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import styles from './Header.module.scss';

const Header: React.FC = () => {
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
                        <NavLink 
                            to="/" 
                            className={({ isActive }) => isActive ? styles.active : ''}
                        >
                            Головна
                        </NavLink>
                        
                        <NavLink 
                            to="/schedule" 
                            className={({ isActive }) => isActive ? styles.active : ''}
                        >
                            Розклад
                        </NavLink>
                    </nav>
                </div>
                
                <div className={styles.auth}>
                    <Link to="/login" className={styles.loginBtn}>Увійти</Link>
                    <Link to="/register" className={styles.registerBtn}>Зареєструватися</Link>
                </div>
            </div>
        </header>
    );
};

export default Header;