import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getUserBookings, updateBookingStatus } from '../../api/bookingApi';
import type { BookingDto } from '../../types/booking';
import styles from './MyBookingsPage.module.scss';

const MyBookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<BookingDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      const response = await getUserBookings();
      if (response.success) {
        setBookings(response.bookings);
      }
    } catch (err) {
      setError('Не вдалося завантажити бронювання');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async (id: number) => {
    if (window.confirm('Ви впевнені, що хочете скасувати це бронювання?')) {
      try {
        const CANCELLED_STATUS = 2; 
        await updateBookingStatus(id, CANCELLED_STATUS);
        fetchBookings();
      } catch (err) {
        alert('Помилка при скасуванні');
      }
    }
  };

  if (isLoading) return <div className={styles.loader}>Завантаження...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Мої Бронювання</h1>
        <p className={styles.subtitle}>Історія ваших замовлень та поточний статус квитків</p>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      {bookings.length > 0 ? (
        <div className={styles.grid}>
          {bookings.map((booking) => (
            <div key={booking.id} className={styles.card}>
              <img 
                src={`https://image.tmdb.org/t/p/w500${booking.moviePosterPath}`}
                alt={booking.movieTitle}
                className={styles.poster}
             />
              
              <div className={styles.content}>
                <div className={styles.topRow}>
                  <h2 className={styles.movieTitle}>{booking.movieTitle}</h2>
                  <span className={`${styles.statusBadge} ${styles[booking.status?.toLowerCase() || '']}`}>
                    {booking.status}
                  </span>
                </div>

                <div className={styles.info}>
                  <div className={styles.item}>
                    <span className={styles.label}>Дата замовлення</span>
                    <p>{new Date(booking.bookingAt).toLocaleDateString()} • {new Date(booking.bookingAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                  </div>
                  <div className={styles.item}>
                    <span className={styles.label}>Номер замовлення</span>
                    <p># {booking.id}</p>
                  </div>
                </div>

                <div className={styles.footer}>
                  <div className={styles.priceInfo}>
                    <span className={styles.label}>Загальна сума</span>
                    <p className={styles.price}>{booking.totalPrice} грн</p>
                  </div>
                  <div className={styles.actions}>
                    <Link
                      to={`/profile/tickets?bookingId=${booking.id}`}
                      state={{status: booking.status}}
                      className={styles.detailsBtn}
                    >
                      Деталі квитків
                    </Link>
                    {booking.status !== 'Cancelled' && (
                      <button onClick={() => handleCancel(booking.id)} className={styles.cancelBtn}>
                        Скасувати
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <p>У вас поки немає бронювань.</p>
          <Link to="/schedule" className={styles.linkBtn}>Замовити перший квиток</Link>
        </div>
      )}
    </div>
  );
};

export default MyBookingsPage;