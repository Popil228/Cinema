import React from 'react';
import { Outlet } from 'react-router-dom'; // Додаємо Outlet
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import styles from './MainLayout.module.scss';

const MainLayout: React.FC = () => {
  return (
    <div className={styles.wrapper}>
      <Header />
      <main className={styles.content}>
        <Outlet /> 
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;