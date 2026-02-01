import React, {
  useContext,
  useEffect,
  useState,
  type ChangeEvent,
} from "react";
import styles from "./BookingPage.module.scss";
import { getSessionById, type SessionDto } from "../../api/sessionsApi";
import { dateToDayMonthStrUA } from "../../utilities/dateToStringUA";
import type { SessionSeatDtoTest } from "../../types/session";
import { useParams } from "react-router-dom";
import BookingPageContext from "../../context/bookingPageContext/BookingPageContext";
import SessionSeat from "../../components/SessionSeat/SessionSeat";

const BookingPage: React.FC = () => {
  const { id } = useParams();
  const selectedSessionId = Number.parseInt(id || "0");

  const bookingPageContext = useContext(BookingPageContext);

  const displayDate: string = dateToDayMonthStrUA(
    new Date(bookingPageContext.selectedSession?.startTime || "0000-01-01"),
  );
  const displayTime: string =
    bookingPageContext.selectedSession?.startTime.split("T")[1].slice(0, 5) ||
    "00:00";
  const displayHall: string =
    bookingPageContext.selectedSession?.hallName || "Зал _";

  const [selectedSessionSeats, setSelectedSessionSeats] = useState<
    SessionSeatDtoTest[]
  >([]);
  const [promoInput, setPromoInput] = useState<string>("");
  const [promoSuccess, setPromoSuccess] = useState<boolean>(false);
  const [promoFailure, setPromoFailure] = useState<boolean>(false);
  const [promoBtnText, setPromoBtnText] = useState<string>(
    "Активувати промокод",
  );

  const promoElementsAdditionalStyle =
    " " +
    (promoSuccess ? `${styles.success}` : "") +
    " " +
    (promoFailure ? `${styles.failure}` : "");

  const defaultPrice: number =
    bookingPageContext.selectedSession?.basePrice || 0;
  const totalCost: number = selectedSessionSeats
    .map((s) => Math.round(s.seatTypePricePercent * defaultPrice * 0.01))
    .reduce((sum, singleTicketPrice) => sum + singleTicketPrice, 0);

  const sessionSeatsTemplateData: SessionSeatDtoTest[] = [
    //згенеровано жеміні
    // --- ROW 1 (5 Seats) ---
    {
      id: 101,
      rowNumber: 1,
      seatNumber: 1,
      seatTypeId: 1,
      seatTypeName: "Standard",
      seatTypePricePercent: 100,
      sessionId: 1,
      isAvailable: true,
    },
    {
      id: 102,
      rowNumber: 1,
      seatNumber: 2,
      seatTypeId: 1,
      seatTypeName: "Standard",
      seatTypePricePercent: 100,
      sessionId: 1,
      isAvailable: false,
    }, // Booked
    {
      id: 103,
      rowNumber: 1,
      seatNumber: 3,
      seatTypeId: 1,
      seatTypeName: "Standard",
      seatTypePricePercent: 100,
      sessionId: 1,
      isAvailable: true,
    },
    {
      id: 104,
      rowNumber: 1,
      seatNumber: 4,
      seatTypeId: 1,
      seatTypeName: "Standard",
      seatTypePricePercent: 100,
      sessionId: 1,
      isAvailable: true,
    },
    {
      id: 105,
      rowNumber: 1,
      seatNumber: 5,
      seatTypeId: 1,
      seatTypeName: "Standard",
      seatTypePricePercent: 100,
      sessionId: 1,
      isAvailable: true,
    },

    // --- ROW 2 (7 Seats) ---
    {
      id: 201,
      rowNumber: 2,
      seatNumber: 1,
      seatTypeId: 1,
      seatTypeName: "Standard",
      seatTypePricePercent: 100,
      sessionId: 1,
      isAvailable: true,
    },
    {
      id: 202,
      rowNumber: 2,
      seatNumber: 2,
      seatTypeId: 1,
      seatTypeName: "Standard",
      seatTypePricePercent: 100,
      sessionId: 1,
      isAvailable: true,
    },
    {
      id: 203,
      rowNumber: 2,
      seatNumber: 3,
      seatTypeId: 1,
      seatTypeName: "Standard",
      seatTypePricePercent: 100,
      sessionId: 1,
      isAvailable: false,
    }, // Booked
    {
      id: 204,
      rowNumber: 2,
      seatNumber: 4,
      seatTypeId: 1,
      seatTypeName: "Standard",
      seatTypePricePercent: 100,
      sessionId: 1,
      isAvailable: true,
    },
    {
      id: 205,
      rowNumber: 2,
      seatNumber: 5,
      seatTypeId: 1,
      seatTypeName: "Standard",
      seatTypePricePercent: 100,
      sessionId: 1,
      isAvailable: true,
    },
    {
      id: 206,
      rowNumber: 2,
      seatNumber: 6,
      seatTypeId: 1,
      seatTypeName: "Standard",
      seatTypePricePercent: 100,
      sessionId: 1,
      isAvailable: false,
    }, // Booked
    {
      id: 207,
      rowNumber: 2,
      seatNumber: 7,
      seatTypeId: 1,
      seatTypeName: "Standard",
      seatTypePricePercent: 100,
      sessionId: 1,
      isAvailable: true,
    },

    // --- ROW 3 (9 Seats) ---
    {
      id: 301,
      rowNumber: 3,
      seatNumber: 1,
      seatTypeId: 1,
      seatTypeName: "Standard",
      seatTypePricePercent: 100,
      sessionId: 1,
      isAvailable: false,
    }, // Booked
    {
      id: 302,
      rowNumber: 3,
      seatNumber: 2,
      seatTypeId: 1,
      seatTypeName: "Standard",
      seatTypePricePercent: 100,
      sessionId: 1,
      isAvailable: true,
    },
    {
      id: 303,
      rowNumber: 3,
      seatNumber: 3,
      seatTypeId: 1,
      seatTypeName: "Standard",
      seatTypePricePercent: 100,
      sessionId: 1,
      isAvailable: true,
    },
    {
      id: 304,
      rowNumber: 3,
      seatNumber: 4,
      seatTypeId: 1,
      seatTypeName: "Standard",
      seatTypePricePercent: 100,
      sessionId: 1,
      isAvailable: true,
    },
    {
      id: 305,
      rowNumber: 3,
      seatNumber: 5,
      seatTypeId: 1,
      seatTypeName: "Standard",
      seatTypePricePercent: 100,
      sessionId: 1,
      isAvailable: false,
    }, // Booked
    {
      id: 306,
      rowNumber: 3,
      seatNumber: 6,
      seatTypeId: 1,
      seatTypeName: "Standard",
      seatTypePricePercent: 100,
      sessionId: 1,
      isAvailable: true,
    },
    {
      id: 307,
      rowNumber: 3,
      seatNumber: 7,
      seatTypeId: 1,
      seatTypeName: "Standard",
      seatTypePricePercent: 100,
      sessionId: 1,
      isAvailable: true,
    },
    {
      id: 308,
      rowNumber: 3,
      seatNumber: 8,
      seatTypeId: 1,
      seatTypeName: "Standard",
      seatTypePricePercent: 100,
      sessionId: 1,
      isAvailable: false,
    }, // Booked
    {
      id: 309,
      rowNumber: 3,
      seatNumber: 9,
      seatTypeId: 1,
      seatTypeName: "Standard",
      seatTypePricePercent: 100,
      sessionId: 1,
      isAvailable: true,
    },

    // --- ROW 4 (9 Seats - VIP) ---
    {
      id: 401,
      rowNumber: 4,
      seatNumber: 1,
      seatTypeId: 2,
      seatTypeName: "VIP",
      seatTypePricePercent: 150,
      sessionId: 1,
      isAvailable: true,
    },
    {
      id: 402,
      rowNumber: 4,
      seatNumber: 2,
      seatTypeId: 2,
      seatTypeName: "VIP",
      seatTypePricePercent: 150,
      sessionId: 1,
      isAvailable: true,
    },
    {
      id: 403,
      rowNumber: 4,
      seatNumber: 3,
      seatTypeId: 2,
      seatTypeName: "VIP",
      seatTypePricePercent: 150,
      sessionId: 1,
      isAvailable: true,
    },
    {
      id: 404,
      rowNumber: 4,
      seatNumber: 4,
      seatTypeId: 2,
      seatTypeName: "VIP",
      seatTypePricePercent: 150,
      sessionId: 1,
      isAvailable: false,
    }, // Booked
    {
      id: 405,
      rowNumber: 4,
      seatNumber: 5,
      seatTypeId: 2,
      seatTypeName: "VIP",
      seatTypePricePercent: 150,
      sessionId: 1,
      isAvailable: true,
    },
    {
      id: 406,
      rowNumber: 4,
      seatNumber: 6,
      seatTypeId: 2,
      seatTypeName: "VIP",
      seatTypePricePercent: 150,
      sessionId: 1,
      isAvailable: true,
    },
    {
      id: 407,
      rowNumber: 4,
      seatNumber: 7,
      seatTypeId: 2,
      seatTypeName: "VIP",
      seatTypePricePercent: 150,
      sessionId: 1,
      isAvailable: true,
    },
    {
      id: 408,
      rowNumber: 4,
      seatNumber: 8,
      seatTypeId: 2,
      seatTypeName: "VIP",
      seatTypePricePercent: 150,
      sessionId: 1,
      isAvailable: true,
    },
    {
      id: 409,
      rowNumber: 4,
      seatNumber: 9,
      seatTypeId: 2,
      seatTypeName: "VIP",
      seatTypePricePercent: 150,
      sessionId: 1,
      isAvailable: false,
    }, // Booked
  ];

  useEffect(() => {
    const loadSessionByCurrentId = async () => {
      const s: SessionDto = await getSessionById(selectedSessionId);
      bookingPageContext.setSelectedSession(s);
    };

    const loadSessionsSeats = async () => {
      //тут має бути запит в апішку по типу await getSessionSeats(selectedSessionId);
      const loadedSessionSeats: SessionSeatDtoTest[] = sessionSeatsTemplateData;
      bookingPageContext.setSessionSeats(loadedSessionSeats);
    };

    if (bookingPageContext.selectedSession === null) {
      loadSessionByCurrentId();
    } else if (bookingPageContext.selectedSession.id != selectedSessionId) {
      loadSessionByCurrentId();
    }

    loadSessionsSeats();
  }, []);

  const handleSeatClick = (sessionSeat: SessionSeatDtoTest) => {
    if (!sessionSeat.isAvailable) {
      return;
    }

    setSelectedSessionSeats((prev) =>
      prev.includes(sessionSeat)
        ? prev.filter((s) => s.id !== sessionSeat.id)
        : [...prev, sessionSeat],
    );
  };

  const formatSelectedSeats = () => {
    return selectedSessionSeats
      .map((s) => `Ряд ${s.rowNumber} Місце ${s.seatNumber}`)
      .join(", ");
  };

  const promoBtnPress = () => {
    if (promoInput == "promo") //success scenario
    {
      setPromoSuccess(!promoSuccess);
      setPromoBtnText("Успішно активовано");
    } else //fail scenario
    {
      setPromoFailure(true);
      setPromoBtnText("Помилка");
    }
  };

  const onPromoInputTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPromoInput(e.target.value);

    if (promoSuccess) {
      setPromoSuccess(false);
      setPromoBtnText("Активувати промокод");
    }
    if (promoFailure) {
      setPromoFailure(false);
      setPromoBtnText("Активувати промокод");
    }
  };

  const seatsSplitByRowsObj: { [key: number]: SessionSeatDtoTest[] } = {};
  bookingPageContext.sessionSeats.forEach((s) => {
    if (!{}.propertyIsEnumerable.call(seatsSplitByRowsObj, s.rowNumber)) {
      seatsSplitByRowsObj[s.rowNumber] = [];
    }
    seatsSplitByRowsObj[s.rowNumber].push(s);
  });

  const seatsSplitByRowsArr: SessionSeatDtoTest[][] = Object.keys(
    seatsSplitByRowsObj,
  )
    .map((key) => seatsSplitByRowsObj[Number.parseInt(key)])
    .sort((a, b) => a[0].rowNumber - b[0].rowNumber);

  return (
    <div className={styles.overlay}>
      <div className={styles.glassCard}>
        {/* Хедер сторінки */}
        <div className={styles.movieHeader}>
          <div className={styles.movieInfo}>
            <div className={styles.poster}>
              <img
                src={`https://image.tmdb.org/t/p/w500${bookingPageContext.selectedSession?.moviePosterPath}`}
                alt={bookingPageContext.selectedSession?.movieTitle}
              />
            </div>
            <div className={styles.text}>
              <h1 className={styles.title}>
                {bookingPageContext.selectedSession?.movieTitle}
              </h1>
              <p className={styles.subtitle}>
                {bookingPageContext.selectedSession?.movieGenres?.join(", ")}
              </p>
            </div>
          </div>

          <div className={styles.sessionInfo}>
            <div className={styles.sessionProperty}>
              <label>Дата</label>
              <h3 className={styles.propValue}>{displayDate}</h3>
            </div>
            <div className={styles.sessionProperty}>
              <label>Час</label>
              <h3 className={styles.propValue}>{displayTime}</h3>
            </div>
            <div className={styles.sessionProperty}>
              <label>Зал</label>
              <h3 className={styles.propValue}>{displayHall}</h3>
            </div>
          </div>
        </div>

        {/* Екран */}
        <div className={styles.screenContainer}>
          <div className={styles.screenArc}></div>
          <span className={styles.screenText}>ЕКРАН</span>
        </div>

        {/* Показ сидінь в залі */}
        <div className={styles.hall}>
          {seatsSplitByRowsArr.map((row) => (
            <div key={row[0].rowNumber} className={styles.row}>
              <span className={styles.rowNumber}>{row[0].rowNumber}</span>
              <div className={styles.seatsList}>
                {row.map((s) => (
                  <SessionSeat
                    sessionSeat={s}
                    isSelected={selectedSessionSeats.includes(s)}
                    handleClick={handleSeatClick}
                  />
                ))}
              </div>
              <span className={styles.rowNumber}>{row[0].rowNumber}</span>
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
            {selectedSessionSeats.length > 0 ? (
              <>
                <div className={styles.seatsInfo}>
                  <strong>Обрані місця:</strong>{" "}
                  <span>{formatSelectedSeats()}</span>
                </div>
                <div className={styles.priceInfo}>
                  <strong>Загальна вартість:</strong>{" "}
                  <span className={styles.totalPrice}>{totalCost} грн</span>
                </div>
              </>
            ) : (
              <p className={styles.emptyMsg}>
                Будь ласка, оберіть місця для бронювання
              </p>
            )}
          </div>

          <div className={styles.buttonsContainer}>
            <div className={styles.promoContainer}>
              <input
                type="text"
                placeholder="Промокод"
                className={
                  `${styles.promoInput}` + promoElementsAdditionalStyle
                }
                value={promoInput}
                onChange={onPromoInputTextChange}
              ></input>
              <button
                className={`${styles.promoBtn}` + promoElementsAdditionalStyle}
                disabled={promoInput.length === 0 || promoSuccess}
                onClick={promoBtnPress}
              >
                {promoBtnText}
              </button>
            </div>

            <button
              className={styles.bookBtn}
              disabled={selectedSessionSeats.length === 0}
            >
              Забронювати квитки
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
