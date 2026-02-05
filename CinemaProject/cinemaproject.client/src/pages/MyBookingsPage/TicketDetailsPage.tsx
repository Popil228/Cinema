import React, { useEffect, useState } from "react";
import { useSearchParams, Link, useLocation } from "react-router-dom";
import { getTicketsByUser, deleteTicketByUser } from "../../api/ticketsApi";
import type { TicketDto } from "../../types/ticket";
import styles from "./TicketDetailsPage.module.scss";
import { dateToDayMonthStrUA } from "../../utilities/dateToStringUA";

const TicketDetailsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const bookingId = searchParams.get("bookingId");

  const [tickets, setTickets] = useState<TicketDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [bookingStatus, setBookingStatus] = useState<string>(() => {
    const stateStatus = location.state?.status;
    const savedStatus = localStorage.getItem(`status_${bookingId}`);

    if (stateStatus) {
      localStorage.setItem(`status_${bookingId}`, stateStatus);
      return stateStatus;
    }

    return savedStatus || "";
  });

  useEffect(() => {
    if (bookingId) {
      fetchTickets(Number(bookingId));
    }
  }, [bookingId]);

  useEffect(() => {
    if (location.state?.status && bookingId) {
      setBookingStatus(location.state.status);
      localStorage.setItem(`status_${bookingId}`, location.state.status);
    }
  }, [location.state, bookingId]);

  const fetchTickets = async (id: number) => {
    try {
      setIsLoading(true);
      const response = await getTicketsByUser(id);
      if (response.success && response.tickets) {
        setTickets(response.tickets);
      }
    } catch {
      setError("Не вдалося завантажити квитки");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelTicket = async (ticketId: number) => {
    if (!window.confirm("Ви впевнені, що хочете скасувати цей квиток?")) return;

    try {
      const response = await deleteTicketByUser(ticketId);
      if (response.success) {
        setTickets((prev) => prev.filter((t) => t.id !== ticketId));
        if (tickets.length === 1) fetchTickets(Number(bookingId));
      }
    } catch {
      alert("Помилка при скасуванні квитка");
    }
  };

  if (isLoading)
    return (
      <div className={styles.loaderContainer}>
        <div className={styles.loader}></div>
        <p>Завантаження квитків...</p>
      </div>
    );

  if (error || !tickets.length)
    return (
      <div className={styles.errorContainer}>
        <p className={styles.error}>{error || "Квитки не знайдено"}</p>
        <Link to="/profile/my-bookings" className={styles.backBtn}>
          До списку бронювань
        </Link>
      </div>
    );

  const movie = tickets[0];
  const isCancelled = bookingStatus === "Cancelled";
  const dateObj = new Date(movie.showTime);
  const displayTime =
    dateToDayMonthStrUA(dateObj) + " - " + dateObj.toTimeString().slice(0, 5);

  return (
    <div className={styles.container}>
      <Link to="/profile/my-bookings" className={styles.backLink}>
        ← Назад до бронювань
      </Link>

      <div className={styles.mainCard}>
        <div className={styles.header}>
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.moviePosterPath}`}
            alt={movie.movieTitle}
            className={styles.poster}
          />
          <div className={styles.movieDetails}>
            <div className={styles.titleRow}>
              <span className={styles.bookingId}>Бронювання #{bookingId}</span>
              {isCancelled && (
                <span className={styles.cancelledBadge}>Скасовано</span>
              )}
            </div>
            <h1 className={styles.movieTitle}>{movie.movieTitle}</h1>

            <div className={styles.sessionHighlight}>
              <div className={styles.infoBlock}>
                <span className={styles.label}>Кінозал</span>
                <p className={styles.value}>{movie.hallName}</p>
              </div>
              <div className={styles.divider}></div>
              <div className={styles.infoBlock}>
                <span className={styles.label}>Дата та час сеансу</span>
                <p className={styles.value}>{displayTime}</p>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.ticketsSection}>
          <h3 className={styles.sectionTitle}>Ваші місця</h3>
          <div className={styles.ticketsList}>
            {tickets.map((ticket) => (
              <div key={ticket.id} className={styles.ticketItem}>
                <div className={styles.seatInfo}>
                  <div className={styles.place}>
                    <span>
                      Ряд <b>{ticket.rowNumber}</b>
                    </span>
                    <span>
                      Місце <b>{ticket.seatNumber}</b>
                    </span>
                  </div>
                  <span className={styles.price}>{ticket.price} грн</span>
                </div>
                {!isCancelled && (
                  <button
                    className={styles.cancelBtn}
                    onClick={() => handleCancelTicket(ticket.id)}
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetailsPage;
