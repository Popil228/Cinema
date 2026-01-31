import React from 'react';
import { Link } from 'react-router-dom';
import styles from './TicketsPage.module.scss';

const mockTickets = [
  {
    id: 1,
    movieId: 101,
    movieTitle: 'Minecraft',
    imageUrl: '/Minecraft.png',
    date: '3 квітня',
    time: '13:00',
    hall: 'Зал А',
    seats: ['Ряд 2 Місце 5', 'Ряд 2 Місце 6'],
    totalPrice: 300,
  },
  {
    id: 2,
    movieId: 102,
    movieTitle: 'Dune: Part Two',
    imageUrl: '/dune.jpg',
    date: '10 квітня',
    time: '19:00',
    hall: 'Зал B',
    seats: ['Ряд 5 Місце 10'],
    totalPrice: 150,
  }
];

const TicketsPage: React.FC = () => {
  const handleCancelBooking = (id: number) => {
    if (window.confirm('Ви впевнені, що хочете скасувати це бронювання?')) {
      console.log(`Скасування квитка з ID: ${id}`);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Мої Квитки</h1>
        <p className={styles.subtitle}>Керуйте замовленнями та переглядайте деталі сеансів</p>
      </div>

      {mockTickets.length > 0 ? (
        <div className={styles.ticketsGrid}>
          {mockTickets.map((ticket) => (
            <div key={ticket.id} className={styles.ticketCard}>
              <Link to={`/movie/${ticket.movieId}`} className={styles.posterSection}>
                <img src={ticket.imageUrl} alt={ticket.movieTitle} />
              </Link>

              <div className={styles.infoSection}>
                <div className={styles.movieHeader}>
                  <h2 className={styles.movieName}>{ticket.movieTitle}</h2>
                  <span className={styles.hallTag}>{ticket.hall}</span>
                </div>
                
                <div className={styles.details}>
                  <div className={styles.detailItem}>
                    <span className={styles.label}>Дата та час</span>
                    <p>{ticket.date} • {ticket.time}</p>
                  </div>
                  
                  <div className={styles.detailItem}>
                    <span className={styles.label}>Місця</span>
                    <p>{ticket.seats.join(', ')}</p>
                  </div>
                </div>

                <div className={styles.footer}>
                  <div className={styles.price}>
                    <span className={styles.label}>До сплати</span>
                    <p>{ticket.totalPrice} грн</p>
                  </div>
                  <button 
                    className={styles.cancelBtn}
                    onClick={() => handleCancelBooking(ticket.id)}
                  >
                    Скасувати
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <p>У вас поки немає активних квитків.</p>
          <Link to="/schedule" className={styles.linkBtn}>Перейти до розкладу</Link>
        </div>
      )}
    </div>
  );
};

export default TicketsPage;