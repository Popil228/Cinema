import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import styles from './AdminSidebar.module.scss';

const AdminSidebar: React.FC = () => {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.topSection}>
        <nav className={styles.nav}>
          <NavLink 
            to="/admin/movies" 
            className={({ isActive }) => isActive ? styles.active : ''}
          >
            Фільми
          </NavLink>
          <NavLink 
            to="/admin/sessions" 
            className={({ isActive }) => isActive ? styles.active : ''}
          >
            Сеанси
          </NavLink>
        </nav>
      </div>

      <div className={styles.bottomSection}>
        <Link to="/" className={styles.homeLink}>
          ← На головну
        </Link>
      </div>
    </aside>
  );
};

export default AdminSidebar;