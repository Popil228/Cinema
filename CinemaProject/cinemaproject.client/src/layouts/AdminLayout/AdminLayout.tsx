import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../../components/Admin/AdminSidebar/AdminSidebar.tsx';
import styles from './AdminLayout.module.scss';

const AdminLayout: React.FC = () => {
  return (
    <div className={styles.adminWrapper}>
      <AdminSidebar />
      <main className={styles.adminMain}>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;