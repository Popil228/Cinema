import React, { useState } from 'react';
import styles from './BookingPage.module.scss';

const PRICE_PER_SEAT = 150;

const BookingPage: React.FC = () => {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [selectedHall, setSelectedHall] = useState('Зал А');
  const [selectedDate, setSelectedDate] = useState('3 квітня');
  const [selectedTime, setSelectedTime] = useState('13:00');

  // Дані для вибору (заглушки)
  const halls = ['Зал А', 'Зал B'];
  const dates = ['3 квітня', '4 квітня', '5 квітня'];
  const times = ['10:00', '13:00', '16:30', '19:00', '21:30'];
  const rowsLayout = [5, 7, 9, 9]; 
  const occupiedSeats = ["2-3", "2-4", "3-5", "4-1", "4-11"];

  const handleSeatClick = (row: number, seat: number) => {
    const seatId = `${row}-${seat}`;
    if (occupiedSeats.includes(seatId)) return;

    setSelectedSeats(prev => 
      prev.includes(seatId) ? prev.filter(s => s !== seatId) : [...prev, seatId]
    );
  };

  const formatSelectedSeats = () => {
    return selectedSeats
      .map(id => {
        const [row, seat] = id.split('-');
        return `Ряд ${row} Місце ${seat}`;
      })
      .join(', ');
  };

  const totalCost = selectedSeats.length * PRICE_PER_SEAT;

  return (
    <div className={styles.overlay}>
      <div className={styles.glassCard}>
        {/* Хедер сторінки */}
        <div className={styles.movieHeader}>
          <div className={styles.movieInfo}>
            <div className={styles.poster}>
               <img src="/Minecraft.png" alt="Movie" />
            </div>
            <div className={styles.text}>
              <h1 className={styles.title}>Minecraft</h1>
              <p className={styles.subtitle}>Action, Adventure, Fantasy</p>
            </div>
          </div>

          <div className={styles.controls}>
            <div className={styles.controlGroup}>
              <label>Зал</label>
              <select 
                value={selectedHall} 
                onChange={(e) => setSelectedHall(e.target.value)}
              >
                {halls.map(h => <option key={h} value={h}>{h}</option>)}
              </select>
            </div>
            <div className={styles.controlGroup}>
              <label>Дата</label>
              <select 
                value={selectedDate} 
                onChange={(e) => setSelectedDate(e.target.value)}
              >
                {dates.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className={styles.controlGroup}>
              <label>Час</label>
              <select 
                value={selectedTime} 
                onChange={(e) => setSelectedTime(e.target.value)}
              >
                {times.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Екран */}
        <div className={styles.screenContainer}>
          <div className={styles.screenArc}></div>
          <span className={styles.screenText}>ЕКРАН</span>
        </div>

        {/* Побудова залу */}
        <div className={styles.hall}>
          {rowsLayout.map((seatCount, rowIndex) => (
            <div key={rowIndex} className={styles.row}>
              <span className={styles.rowNumber}>{rowIndex + 1}</span>
              <div className={styles.seatsList}>
                {Array.from({ length: seatCount }).map((_, seatIndex) => {
                  const seatNum = seatIndex + 1;
                  const seatId = `${rowIndex + 1}-${seatNum}`;
                  const isOccupied = occupiedSeats.includes(seatId);
                  const isSelected = selectedSeats.includes(seatId);

                  return (
                    <div
                      key={seatId}
                      className={`${styles.seat} ${
                        isOccupied ? styles.occupied : isSelected ? styles.selected : ''
                      }`}
                      onClick={() => handleSeatClick(rowIndex + 1, seatNum)}
                    >
                      <span className={styles.tooltip}>{seatNum}</span>
                    </div>
                  );
                })}
              </div>
              <span className={styles.rowNumber}>{rowIndex + 1}</span>
            </div>
          ))}
        </div>

        {/* Легенда */}
        <div className={styles.legend}>
          <div className={styles.legendItem}>
            <div className={`${styles.dot} ${styles.dotAvailable}`}></div>
            <span>Вільно</span>
          </div>
          <div className={styles.legendItem}>
            <div className={`${styles.dot} ${styles.dotOccupied}`}></div>
            <span>Зайнято</span>
          </div>
          <div className={styles.legendItem}>
            <div className={`${styles.dot} ${styles.dotSelected}`}></div>
            <span>Обрано</span>
          </div>
        </div>

        {/* Блок підсумку та Кнопка */}
        <div className={styles.footer}>
          <div className={styles.summary}>
            {selectedSeats.length > 0 ? (
              <>
                <div className={styles.seatsInfo}>
                  <strong>Обрані місця:</strong> <span>{formatSelectedSeats()}</span>
                </div>
                <div className={styles.priceInfo}>
                  <strong>Загальна вартість:</strong> <span className={styles.totalPrice}>{totalCost} грн</span>
                </div>
              </>
            ) : (
              <p className={styles.emptyMsg}>Будь ласка, оберіть місця для бронювання</p>
            )}
          </div>

          <button 
            className={styles.bookBtn} 
            disabled={selectedSeats.length === 0}
          >
            Придбати квитки
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;