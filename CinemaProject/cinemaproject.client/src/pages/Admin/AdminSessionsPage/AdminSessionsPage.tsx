import React, { useState, useEffect } from 'react';
import AdminSessionCard from '../../../components/Admin/AdminSessionCard/AdminSessionCard.tsx';
import styles from './AdminSessionsPage.module.scss';
import type { SessionDto, HallDto } from '../../../api/sessionsApi';
import type { Movie } from '../../../types/movie';
import type { CreateSessionDto } from '../../../api/sessionsApi';
import { getAllSessions, createSession, deleteSession, getHalls } from '../../../api/sessionsApi';
import { getAllMovies } from '../../../api/moviesApi';

const AdminSessionsPage: React.FC = () => {
  const [filterMovie, setFilterMovie] = useState('all');
  const [sessions, setSessions] = useState<SessionDto[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [halls, setHalls] = useState<HallDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [creating, setCreating] = useState(false);

  // Form state
  const [selectedMovieId, setSelectedMovieId] = useState<number>(0);
  const [selectedHallId, setSelectedHallId] = useState<number>(0);
  const [sessionDate, setSessionDate] = useState('');
  const [sessionTime, setSessionTime] = useState('');
  const [ticketPrice, setTicketPrice] = useState<number>(150);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [sessionsData, moviesData, hallsData] = await Promise.all([
        getAllSessions(),
        getAllMovies(),
        getHalls()
      ]);
      setSessions(sessionsData);
      setMovies(moviesData);
      setHalls(hallsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Помилка завантаження');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSession = async () => {
    if (!selectedMovieId || !selectedHallId || !sessionDate || !sessionTime) {
      alert('Заповніть всі поля');
      return;
    }

    try {
      setCreating(true);
      const startTime = `${sessionDate}T${sessionTime}:00`;
      const newSession: CreateSessionDto = {
        movieId: selectedMovieId,
        hallId: selectedHallId,
        startTime,
        ticketPrice
      };
      await createSession(newSession);
      setShowModal(false);
      resetForm();
      await loadData();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Помилка створення сеансу');
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteSession = async (id: number) => {
    if (!confirm('Видалити цей сеанс?')) return;
    try {
      await deleteSession(id);
      await loadData();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Помилка видалення');
    }
  };

  const resetForm = () => {
    setSelectedMovieId(0);
    setSelectedHallId(0);
    setSessionDate('');
    setSessionTime('');
    setTicketPrice(150);
  };

  const movieTitles = Array.from(new Set(sessions.map(s => s.movieTitle)));

  const filteredSessions = filterMovie === 'all' 
    ? sessions 
    : sessions.filter(session => session.movieTitle === filterMovie);

  // Групуємо за залами
  const sessionsByHall = halls.map(hall => ({
    hall,
    sessions: filteredSessions.filter(s => s.hallName === hall.name)
  }));

  if (loading) {
    return (
      <div className={styles.container}>
        <p className={styles.loading}>Завантаження...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <p className={styles.error}>{error}</p>
        <button onClick={loadData} className={styles.retryBtn}>Спробувати знову</button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <h1>Сеанси ({sessions.length})</h1>
          <select 
            className={styles.movieSelect}
            value={filterMovie}
            onChange={(e) => setFilterMovie(e.target.value)}
          >
            <option value="all">Всі фільми</option>
            {movieTitles.map(title => (
              <option key={title} value={title}>{title}</option>
            ))}
          </select>
        </div>
        <button className={styles.addBtn} onClick={() => setShowModal(true)}>+</button>
      </header>

      <div className={styles.hallsGrid}>
        {sessionsByHall.map(({ hall, sessions: hallSessions }) => (
          <section key={hall.hallId} className={styles.hallColumn}>
            <h2 className={styles.hallTitle}>{hall.name.toUpperCase()}</h2>
            {hallSessions.length > 0 ? (
              hallSessions.map(session => (
                <AdminSessionCard 
                  key={session.id} 
                  session={session}
                  onDelete={() => handleDeleteSession(session.id)}
                />
              ))
            ) : (
              <p className={styles.noSessions}>Немає сеансів</p>
            )}
          </section>
        ))}
      </div>

      {/* Modal for creating session */}
      {showModal && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <h2 className={styles.modalTitle}>Новий сеанс</h2>
            
            <div className={styles.formGroup}>
              <label>Фільм</label>
              <select 
                value={selectedMovieId} 
                onChange={e => setSelectedMovieId(Number(e.target.value))}
              >
                <option value={0}>Оберіть фільм</option>
                {movies.map(movie => (
                  <option key={movie.id} value={movie.id}>{movie.title}</option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Зал</label>
              <select 
                value={selectedHallId} 
                onChange={e => setSelectedHallId(Number(e.target.value))}
              >
                <option value={0}>Оберіть зал</option>
                {halls.map(hall => (
                  <option key={hall.hallId} value={hall.hallId}>{hall.name}</option>
                ))}
              </select>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Дата</label>
                <input 
                  type="date" 
                  value={sessionDate}
                  onChange={e => setSessionDate(e.target.value)}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Час</label>
                <input 
                  type="time" 
                  value={sessionTime}
                  onChange={e => setSessionTime(e.target.value)}
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Ціна квитка (грн)</label>
              <input 
                type="number" 
                value={ticketPrice}
                onChange={e => setTicketPrice(Number(e.target.value))}
                min={1}
              />
            </div>

            <div className={styles.modalButtons}>
              <button 
                className={styles.cancelBtn} 
                onClick={() => setShowModal(false)}
              >
                Скасувати
              </button>
              <button 
                className={styles.submitBtn} 
                onClick={handleCreateSession}
                disabled={creating}
              >
                {creating ? 'Створення...' : 'Створити'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSessionsPage;