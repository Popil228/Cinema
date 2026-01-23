import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../../components/Admin/AdminSidebar/AdminSidebar.tsx';
import styles from './AdminLayout.module.scss';
import MovieEditContextProvider from '../../context/movieEditContext/MovieEditContextProvider.tsx';

const AdminLayout: React.FC = () => {
  return (
    <MovieEditContextProvider>
      <div className={styles.adminWrapper}>
        <AdminSidebar />
        <main className={styles.adminMain}>
          <Outlet />
        </main>
      </div>
    </MovieEditContextProvider>
  );
};

export default AdminLayout;