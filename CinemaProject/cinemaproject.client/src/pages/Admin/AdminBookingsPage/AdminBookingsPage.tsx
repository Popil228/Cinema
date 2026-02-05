import React, { useEffect, useState, useMemo } from 'react';
import { getAllBookings, updateBookingStatus, deleteBooking } from '../../../api/bookingApi';
import type { BookingDtoAdmin } from '../../../types/booking';
import styles from './AdminBookingsPage.module.scss';

const AdminBookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<BookingDtoAdmin[]>([]);
  const [statusFilter, setStatusFilter] = useState<number | string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
    return bookings.filter(b => 
      b.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
      b.phoneNum.includes(searchTerm) ||
      b.movieTitle.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [bookings, searchTerm]);

  const handleChangeStatus = async (id: number, newStatus: number) => {
    try {
      await updateBookingStatus(id, newStatus);
      fetchBookings();
    } catch (err) {
      alert("Помилка оновлення статусу");
    }
  };

  const handleBulkAction = async (action: 'confirm' | 'complete' | 'cancel') => {
    if (selectedIds.length === 0) return;

    let config;
    switch (action) {
      case 'confirm':
        config = { target: 1, current: ['Pending'], label: 'підтвердження' };
        break;
      case 'complete':
        config = { target: 3, current: ['Confirmed'], label: 'завершення' };
        break;
      case 'cancel':
        config = { target: 2, current: ['Pending', 'Confirmed'], label: 'скасування' };
        break;
      default: return;
    }

    const validIds = selectedIds.filter(id => {
      const b = bookings.find(item => item.id === id);
      return b && config.current.includes(b.status || '');
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
      alert("Помилка масової зміни статусів");
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
        const firstError = rejected[0].reason;
        alert(`Помилка видалення: ${firstError?.message || 'Сервер повернув помилку'}`);
      }
      setSelectedIds([]);
      fetchBookings();
    } catch (err: any) {
      alert(`Помилка: ${err.message || 'Сервер повернув помилку'}`);
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
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
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  if (isLoading) return <div className={styles.container}><div className={styles.loader}>Оновлення...</div></div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Керування Бронюваннями</h1>
        <div className={styles.controls}>
          <input 
            type="text" 
            placeholder="Пошук..." 
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
            <button onClick={handleBulkDelete} className={styles.bulkDelete}>Видалити</button>
            <button onClick={() => setSelectedIds([])} className={styles.bulkDeselect}>Прибрати вибір</button>
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
                  onChange={(e) => {
                    if (e.target.checked) setSelectedIds(filteredBookings.map(b => b.id));
                    else setSelectedIds([]);
                  }}
                  checked={selectedIds.length === filteredBookings.length && filteredBookings.length > 0}
                />
              </th>
              <th>ID</th>
              <th>Клієнт</th>
              <th>Фільм</th>
              <th>Дата замовлення</th>
              <th>Сума</th>
              <th>Статус</th>
              <th>Дії</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.map(b => (
              <tr key={b.id} className={selectedIds.includes(b.id) ? styles.selectedRow : ''}>
                <td className={styles.checkboxCol} onClick={() => toggleSelect(b.id)}>
                  <input type="checkbox" className={styles.rowCheckbox} checked={selectedIds.includes(b.id)} onChange={() => {}} />
                </td>
                <td>{b.id}</td>
                <td>
                  <div className={styles.clientInfo}>
                    <span className={styles.email}>{b.email}</span>
                    <span className={styles.phone}>{b.phoneNum}</span>
                  </div>
                </td>
                <td>{b.movieTitle}</td>
                <td>{new Date(b.bookingAt).toLocaleString('uk-UA')}</td>
                <td>{b.totalPrice} грн</td>
                <td>
                  <span className={`${styles.badge} ${styles[b.status?.toLowerCase() || '']}`}>{b.status}</span>
                </td>
                <td>
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
                    <button onClick={() => handleDelete(b.id)} className={styles.deleteBtn} title="Видалити">🗑</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminBookingsPage;