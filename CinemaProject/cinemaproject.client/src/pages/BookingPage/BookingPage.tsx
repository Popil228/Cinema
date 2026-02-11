import React, {
  useContext,
  useEffect,
  useState,
  type ChangeEvent,
} from "react";
import styles from "./BookingPage.module.scss";
import {
  getSessionById,
  getSessionSeats,
  type SessionDto,
  type SessionSeatDto,
} from "../../api/sessionsApi";
import { dateToDayMonthStrUA } from "../../utilities/dateToStringUA";
import { Link, useNavigate, useParams } from "react-router-dom";
import BookingPageContext from "../../context/bookingPageContext/BookingPageContext";
import SessionSeat from "../../components/SessionSeat/SessionSeat";
import { checkDiscount } from "../../api/discountApi";
import { type BookingRequest } from "../../types/booking";
import { createBooking } from "../../api/bookingApi";

const BookingPage: React.FC = () => {
  const { id } = useParams();
  const selectedSessionId = Number.parseInt(id || "0");

  const bookingPageContext = useContext(BookingPageContext);
  const navigate = useNavigate();

  const displayDate: string = dateToDayMonthStrUA(
    new Date(bookingPageContext.selectedSession?.startTime || "0000-01-01"),
  );
  const displayTime: string = new Date(
    bookingPageContext.selectedSession?.startTime || "0000-01-01",
  )
    .toTimeString()
    .slice(0, 5);
  const displayHall: string =
    bookingPageContext.selectedSession?.hallName || "Зал _";

  const [selectedSessionSeats, setSelectedSessionSeats] = useState<
    SessionSeatDto[]
  >([]);
  const [promoInput, setPromoInput] = useState<string>("");
  const [promoSuccess, setPromoSuccess] = useState<boolean>(false);
  const [promoFailure, setPromoFailure] = useState<boolean>(false);
  const [promoBtnText, setPromoBtnText] = useState<string>(
    "Активувати промокод",
  );
  const [discountId, setDiscountId] = useState<number | null>(null);
  const [discountPercentage, setDiscountPercentage] = useState<number | null>(
    null,
  );

  const promoElementsAdditionalStyle =
    " " +
    (promoSuccess ? `${styles.success}` : "") +
    " " +
    (promoFailure ? `${styles.failure}` : "");

  const defaultPrice: number =
    bookingPageContext.selectedSession?.basePrice || 0;
  const totalCost: number = selectedSessionSeats
    .map((s) => Math.round(s.seatTypePricePercentage * defaultPrice * 0.01))
    .reduce((sum, singleTicketPrice) => sum + singleTicketPrice, 0);
  const discountCost = Math.round(totalCost * (discountPercentage || 0) * 0.01);
  const dislayCost = totalCost - discountCost;

  const displayStandartSeatPrice =
    bookingPageContext.sessionSeats.findIndex(
      (s) => s.seatType == "Standart",
    ) != 0
      ? Math.round(
          (bookingPageContext.sessionSeats.find((s) => s.seatType == "Standart")
            ?.seatTypePricePercentage || 100) *
            defaultPrice *
            0.01,
        ).toString() + " грн"
      : "відсутні";
  const displayVipSeatPrice =
    bookingPageContext.sessionSeats.findIndex((s) => s.seatType == "VIP") != 0
      ? Math.round(
          (bookingPageContext.sessionSeats.find((s) => s.seatType == "VIP")
            ?.seatTypePricePercentage || 100) *
            defaultPrice *
            0.01,
        ).toString() + " грн"
      : "відсутні";

  useEffect(() => {
    const loadSessionByCurrentId = async () => {
      const s: SessionDto = await getSessionById(selectedSessionId);
      bookingPageContext.setSelectedSession(s);
    };

    const loadSessionsSeats = async () => {
      const loadedSessionSeats: SessionSeatDto[] =
        await getSessionSeats(selectedSessionId);
      bookingPageContext.setSessionSeats(loadedSessionSeats);
    };

    if (bookingPageContext.selectedSession === null) {
      loadSessionByCurrentId();
    } else if (bookingPageContext.selectedSession.id != selectedSessionId) {
      loadSessionByCurrentId();
    }

    loadSessionsSeats();
  }, []);

  const handleSeatClick = (sessionSeat: SessionSeatDto) => {
    if (!sessionSeat.isActive) {
      return;
    }

    setSelectedSessionSeats((prev) =>
      prev.includes(sessionSeat)
        ? prev.filter((s) => s.sessionSeatId !== sessionSeat.sessionSeatId)
        : [...prev, sessionSeat],
    );
  };

  const formatSelectedSeats = () => {
    return selectedSessionSeats
      .map((s) => `Ряд ${s.rowNumber} Місце ${s.seatNumber}`)
      .join(", ");
  };

  const promoBtnPress = async () => {
    let newDiscountId: number | null = null;
    let isCodeUsable: boolean;
    let errorText: string = "";
    try {
      const discountCheckResponse = await checkDiscount(promoInput);
      newDiscountId = discountCheckResponse.id;
      setDiscountPercentage(discountCheckResponse.discountPercentage);
      isCodeUsable = true;
    } catch (err) {
      if (err instanceof Error) {
        errorText = err.message;
      } else {
        errorText = "Помилка";
      }
      isCodeUsable = false;
      newDiscountId = null;
      console.error(err);
    }

    if (isCodeUsable) //success scenario
    {
      setPromoSuccess(true);
      setPromoBtnText("Промокод активовано");
      setDiscountId(newDiscountId);
    } else //fail scenario
    {
      setPromoFailure(true);
      setPromoBtnText(errorText);
      setDiscountId(null);
      setDiscountPercentage(null);
    }
  };

  const confirtBookingBtnPress = async () => {
    const createBookingRequest: BookingRequest = {
      discountId: discountId,
      sessionSeatIds: selectedSessionSeats.map((s) => s.sessionSeatId),
    };

    const createdBookingId = (await createBooking(createBookingRequest))
      .bookingId;

    navigate(`/profile/tickets?bookingId=${createdBookingId}`);
  };

  const onPromoInputTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPromoInput(e.target.value);

    if (promoSuccess) {
      setPromoSuccess(false);
      setPromoBtnText("Активувати промокод");

      setDiscountId(null);
      setDiscountPercentage(null);
    }
    if (promoFailure) {
      setPromoFailure(false);
      setPromoBtnText("Активувати промокод");

      setDiscountId(null);
      setDiscountPercentage(null);
    }
  };

  const seatsSplitByRowsObj: { [key: number]: SessionSeatDto[] } = {};
  bookingPageContext.sessionSeats.forEach((s) => {
    if (!{}.propertyIsEnumerable.call(seatsSplitByRowsObj, s.rowNumber)) {
      seatsSplitByRowsObj[s.rowNumber] = [];
    }
    seatsSplitByRowsObj[s.rowNumber].push(s);
  });

  const seatsSplitByRowsArr: SessionSeatDto[][] = Object.keys(
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
              <Link to={`/movie/${bookingPageContext.selectedSession?.movieId}`}>
                <img
                  src={`https://image.tmdb.org/t/p/w500${bookingPageContext.selectedSession?.moviePosterPath}`}
                  alt={bookingPageContext.selectedSession?.movieTitle}
                />
              </Link>
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
                    key={s.sessionSeatId}
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
            <div className={`${styles.dot} ${styles.dotStandart}`}></div>
            <span>Звичайні - {displayStandartSeatPrice}</span>
          </div>
          <div className={styles.legendItem}>
            <div className={`${styles.dot} ${styles.dotPremium}`}></div>
            <span>VIP - {displayVipSeatPrice}</span>
          </div>
        </div>
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
                  <span className={styles.totalPrice}>{dislayCost} грн</span>
                  {discountPercentage ? (
                    <span className={styles.discountInfo}>
                      {totalCost} -{discountPercentage}%
                    </span>
                  ) : (
                    <></>
                  )}
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
              onClick={confirtBookingBtnPress}
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
