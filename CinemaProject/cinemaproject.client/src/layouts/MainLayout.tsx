import React from 'react';
import { Outlet } from 'react-router-dom'; // Додаємо Outlet
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import styles from './MainLayout.module.scss';
import UserMoviesContextProvider from '../context/userMoviesContext/UserMoviesContextProvider';
import BookingPageContextProvider from '../context/bookingPageContext/BookingPageContextProvider';

const MainLayout: React.FC = () => {
  return (
    <UserMoviesContextProvider>
      <BookingPageContextProvider>
        <div className={styles.wrapper}>
          <Header />
          <main className={styles.content}>
            <Outlet /> 
          </main>
          <Footer />
        </div>
      </BookingPageContextProvider>
    </UserMoviesContextProvider>
  );
};

export default MainLayout;