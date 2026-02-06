import React, { useEffect, useState, useMemo } from 'react';
import { getAllBookings, updateBookingStatus, deleteBooking } from '../../../api/bookingApi';
import { getTicketsByAdmin, deleteTicketByAdmin } from '../../../api/ticketsApi';
import type { BookingDtoAdmin } from '../../../types/booking';
import type { TicketDto } from '../../../types/ticket';
import styles from './AdminBookingsPage.module.scss';
import modalStyles from './AdminEditTickets.module.scss';

const AdminBookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<BookingDtoAdmin[]>([]);
  const [statusFilter, setStatusFilter] = useState<number | string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [editingBookingId, setEditingBookingId] = useState<number | null>(null);
  const [editTickets, setEditTickets] = useState<TicketDto[]>([]);
  const [isModalLoading, setIsModalLoading] = useState(false);

  useEffect(() => {
    fetchBookings();
    setSelectedIds([]);
  }, [statusFilter]);

  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      const filterValue = statusFilter === "" ? undefined : Number(statusFilter);
      const res = await getAllBookings(filterValue);
      if (res.success) {
        setBookings(res.bookings.sort((a, b) => 
          new Date(b.bookingAt).getTime() - new Date(a.bookingAt).getTime()
        ));
      }
    } catch (err) {
      console.error("Помилка завантаження:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredBookings = useMemo(() => {
    const s = searchTerm.toLowerCase();
    return bookings.filter(b => 
      b.email.toLowerCase().includes(s) || 
      b.phoneNum.includes(s) ||
      b.movieTitle.toLowerCase().includes(s)
    );
  }, [bookings, searchTerm]);

  const handleOpenEditModal = async (bookingId: number) => {
    setEditingBookingId(bookingId);
    try {
      setIsModalLoading(true);
      const res = await getTicketsByAdmin(bookingId);
      if (res.success) {
        setEditTickets(res.tickets ?? []); 
      }
    } catch (err: any) {
      alert(`Помилка: ${err.message}`);
      setEditingBookingId(null);
    } finally {
      setIsModalLoading(false);
    }
  };

  const handleDeleteTicket = async (ticketId: number) => {
    if (!window.confirm("Видалити цей квиток з бази?")) return;
    try {
      const res = await deleteTicketByAdmin(ticketId);
      if (res.success) {
        setEditTickets(prev => prev.filter(t => t.id !== ticketId));
        fetchBookings();
      }
    } catch (err: any) {
      alert(`Помилка: ${err.message}`);
    }
  };

  // --- Статуси та видалення ---
  const handleChangeStatus = async (id: number, newStatus: number) => {
    try {
      await updateBookingStatus(id, newStatus);
      fetchBookings();
    } catch (err) {
      alert("Не вдалося оновити статус");
    }
  };

  const handleBulkAction = async (action: 'confirm' | 'complete' | 'cancel') => {
    if (selectedIds.length === 0) return;

    const config = {
      confirm: { target: 1, current: 'Pending', label: 'підтвердження' },
      complete: { target: 3, current: 'Confirmed', label: 'завершення' },
      cancel: { target: 2, current: ['Pending', 'Confirmed'], label: 'скасування' }
    }[action];

    // Фільтруємо вибрані ID, залишаючи тільки ті, які відповідають допустимому поточному статусу
    const validIds = selectedIds.filter(id => {
      const b = bookings.find(item => item.id === id);
      return Array.isArray(config.current) 
        ? config.current.includes(b?.status || '') 
        : b?.status === config.current;
    });

    if (validIds.length === 0) {
      alert(`Немає замовлень, доступних для дії: ${config.label}`);
      return;
    }

    try {
      setIsLoading(true);
      await Promise.all(validIds.map(id => updateBookingStatus(id, config.target)));
      
      const skipped = selectedIds.length - validIds.length;
      if (skipped > 0) alert(`Успішно: ${validIds.length}. Пропущено: ${skipped}`);
      
      setSelectedIds([]);
      fetchBookings();
    } catch (err) {
      alert("Помилка масового оновлення");
      setIsLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!window.confirm(`Видалити ${selectedIds.length} замовлень назавжди?`)) return;

    try {
      setIsLoading(true);
      const results = await Promise.allSettled(selectedIds.map(id => deleteBooking(id)));
      const rejected = results.filter((r): r is PromiseRejectedResult => r.status === 'rejected');

      if (rejected.length > 0) {
        alert(`Успішно видалено: ${selectedIds.length - rejected.length}. Помилок видалення: ${rejected.length || 'Сервер відхилив запит'}`);
      }
      setSelectedIds([]);
      fetchBookings();
    } catch (err: any) {
      alert(`Помилка: ${err.message || 'Сервер повернув помилку'}`);
      setIsLoading(false);
    }
  };

  const handleDeleteBooking = async (id: number) => {
    if (window.confirm("Видалити це бронювання назавжди?")) {
      try {
        await deleteBooking(id);
        fetchBookings();
      } catch (err: any) {
        alert(`Помилка видалення: ${err.message || 'Сервер повернув помилку'}`);
      }
    }
  };

  const toggleSelect = (id: number) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  if (isLoading) return (
    <div className={styles.container}>
      <div className={styles.loader}>Оновлення бази даних...</div>
    </div>
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Керування Бронюваннями</h1>
        <div className={styles.controls}>
          <input 
            type="text" 
            placeholder="Пошук (Email, Тел, Фільм)..." 
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className={styles.filters}>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="">Всі статуси</option>
              <option value="0">Pending</option>
              <option value="1">Confirmed</option>
              <option value="2">Cancelled</option>
              <option value="3">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {selectedIds.length > 0 && (
        <div className={styles.bulkActions}>
          <span>Вибрано: <b>{selectedIds.length}</b></span>
          <div className={styles.bulkButtons}>
            <button onClick={() => handleBulkAction('confirm')} className={styles.bulkConfirm}>Підтвердити</button>
            <button onClick={() => handleBulkAction('complete')} className={styles.bulkComplete}>Завершити</button>
            <button onClick={() => handleBulkAction('cancel')} className={styles.bulkCancel}>Скасувати</button>
            <button onClick={handleBulkDelete} className={styles.bulkDelete}>Видалити обрані</button>
            <button onClick={() => setSelectedIds([])} className={styles.bulkDeselect}>Скинути</button>
          </div>
        </div>
      )}

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.checkboxCol}>
                <input 
                  type="checkbox" 
                  className={styles.mainCheckbox} 
                  onChange={(e) => setSelectedIds(e.target.checked ? filteredBookings.map(b => b.id) : [])}
                  checked={selectedIds.length === filteredBookings.length && filteredBookings.length > 0} 
                />
              </th>
              <th>ID</th>
              <th>Клієнт</th>
              <th>Фільм</th>
              <th>Дата</th>
              <th>Сума</th>
              <th>Статус</th>
              <th className={styles.actionsCol}>Дії</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.map(b => (
              <tr key={b.id} className={selectedIds.includes(b.id) ? styles.selectedRow : ''}>
                <td className={styles.checkboxCol} onClick={() => toggleSelect(b.id)}>
                  <input type="checkbox" className={styles.rowCheckbox} checked={selectedIds.includes(b.id)} readOnly />
                </td>
                <td>{b.id}</td>
                <td>
                  <div className={styles.clientInfo}>
                    <span className={styles.email}>{b.email}</span>
                    <span className={styles.phone}>{b.phoneNum}</span>
                  </div>
                </td>
                <td>{b.movieTitle}</td>
                <td>{new Date(b.bookingAt).toLocaleString('uk-UA', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}</td>
                <td>{b.totalPrice} грн</td>
                <td><span className={`${styles.badge} ${styles[b.status?.toLowerCase() || '']}`}>{b.status}</span></td>
                <td className={styles.actionsCol}>
                  <div className={styles.actions}>
                    {b.status === 'Pending' && (
                      <button onClick={() => handleChangeStatus(b.id, 1)} className={styles.confirmBtn} title="Підтвердити">✓</button>
                    )}
                    {b.status === 'Confirmed' && (
                      <button onClick={() => handleChangeStatus(b.id, 3)} className={styles.completeBtn} title="Завершити">★</button>
                    )}
                    {(b.status === 'Pending' || b.status === 'Confirmed') && (
                      <button onClick={() => handleChangeStatus(b.id, 2)} className={styles.cancelBtn} title="Скасувати">✕</button>
                    )}
                    {b.status === 'Pending' && (
                      <button onClick={() => handleOpenEditModal(b.id)} className={styles.editBtn} title="Квитки">✏️</button>
                    )}
                    {b.status === 'Pending' && (
                      <button onClick={() => handleDeleteBooking(b.id)} className={styles.deleteBtn} title="Видалити">🗑</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL: EDIT TICKETS */}
      {editingBookingId && (
        <div className={modalStyles.modalOverlay} onClick={() => setEditingBookingId(null)}>
          <div className={modalStyles.modalContent} onClick={e => e.stopPropagation()}>
            <div className={modalStyles.modalHeader}>
              <h3>Квитки замовлення #{editingBookingId}</h3>
              <button className={modalStyles.closeBtn} onClick={() => setEditingBookingId(null)}>✕</button>
            </div>
            <div className={modalStyles.modalBody}>
              {isModalLoading ? (
                <div className={styles.loader}>Завантаження...</div>
              ) : editTickets.length > 0 ? (
                <div className={modalStyles.ticketGrid}>
                  {editTickets.map(t => (
                    <div key={t.id} className={modalStyles.ticketMiniCard}>
                      <div className={modalStyles.ticketInfo}>
                        <span>Ряд: <b>{t.rowNumber}</b>, Місце: <b>{t.seatNumber}</b></span>
                        <span className={modalStyles.ticketPrice}>{t.price} грн</span>
                        <span><b>{t.hallName}</b></span>
                      </div>
                      <button className={modalStyles.removeTicketBtn} onClick={() => handleDeleteTicket(t.id)}>
                        Видалити
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className={modalStyles.emptyTickets}>Квитків не знайдено.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBookingsPage;