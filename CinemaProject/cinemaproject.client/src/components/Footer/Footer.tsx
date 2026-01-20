import React from 'react';
import styles from './Footer.module.scss';

const Footer: React.FC = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <span>(C) 2026 NUWEE</span>
                <span className={styles.divider}>|</span>
                <a href="#">Contact us</a>
                <span className={styles.divider}>|</span>
                <a href="#">For partners</a>
                <span className={styles.divider}>|</span>
                <a href="#">Terms And Conditions</a>
            </div>
        </footer>
    );
};

export default Footer;