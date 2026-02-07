import styles from "./AdminDiscountPage.module.scss";
import { type DiscountDto } from "../../../api/discountApi";
import * as discountApi from "../../../api/discountApi";
import AdminDiscountCard from "../../../components/Admin/AdminDiscountCard/AdminDiscountCard";
import { useEffect, useState } from "react";

const AdminDiscountPage: React.FC = () => {
  const [discounts, setDiscounts] = useState<DiscountDto[]>([]);
  const [newDiscount, setNewDiscount] = useState<DiscountDto | null>(null);
  const [discountsError, setDiscountsError] = useState<{
    is: boolean;
    message: string;
  }>({ is: false, message: "Помилка відсутня" });

  const [codeSorting, setCodeSorting] = useState<number>(0);
  const [startDateSorting, setStartDateSorting] = useState<number>(0);
  const [endDateSorting, setEndDateSorting] = useState<number>(0);
  const [percentSorting, setPercentSorting] = useState<number>(0);
  const [usesLeftSorting, setUsesLeftSorting] = useState<number>(0);

  //const [sortedDiscounts, setSortedDiscounts] = useState<DiscountDto[]>([]);

  const fetchDiscounts = async () => {
    try {
      const fetchedDiscounts = await discountApi.getDiscounts();
      setDiscounts(fetchedDiscounts);
      //setSortedDiscounts(fetchedDiscounts);
      setDiscountsError({ is: false, message: "Помилка відсутня" });
    } catch (err) {
      if (err instanceof Error) {
        setDiscountsError({ is: true, message: err.message });
      } else {
        setDiscountsError({ is: true, message: "Discounts fetch error" });
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchDiscounts();
    };

    fetchData();
  }, []);

  const checkDifference = (d1: DiscountDto, d2: DiscountDto) => {
    return (
      d1.discountPercentage != d2.discountPercentage ||
      d1.startDate != d2.startDate ||
      d1.endDate != d2.endDate ||
      d1.usesLeft != d2.usesLeft
    );
  };

  const handleDiscountEditConfirm = async (
    d_old: DiscountDto,
    d_new: DiscountDto,
  ) => {
    if (d_old.id == -1) // identifier for newly created
    {
      try {
        await discountApi.createDiscount(d_new);
        fetchDiscounts();
      } catch (err) {
        if (err instanceof Error) {
          setDiscountsError({ is: true, message: err.message });
        } else {
          setDiscountsError({ is: true, message: "Discount create error" });
        }
      }

      setNewDiscount(null);
      return true;
    }

    const idOld = discounts.findIndex((d) => d.id == d_old.id); // should not be -1
    const idNew = discounts
      .filter((d) => d.id != d_old.id)
      .findIndex((d) => d.code == d_new.code); // should be -1

    if (idOld == -1) {
      console.log("editing discount error | no such old discount found");
      return false;
    }
    if (idNew != -1) {
      console.log("editing discount error | new code conflicts with existing");
      return false;
    }

    if (
      checkDifference(d_old, d_new) //check for any changes made (if unchanged then no need to update)
    ) {
      try {
        await discountApi.updateDiscount(d_old.id, d_new); //old id and new data
        fetchDiscounts();
      } catch (err) {
        if (err instanceof Error) {
          setDiscountsError({ is: true, message: err.message });
        } else {
          setDiscountsError({ is: true, message: "Discount update error" });
        }
      }
    }

    return true;
  };

  const handleDiscountDelete = async (d: DiscountDto) => {
    if (d.id == -1) {
      setNewDiscount(null);
      return;
    }

    const indexOfElement = discounts.findIndex((dc) => dc.id == d.id);
    if (indexOfElement == -1) {
      console.log("no element found for deletion");
      return;
    }

    try {
      await discountApi.deleteDiscount(d.id);
      await fetchDiscounts();
    } catch (err) {
      if (err instanceof Error) {
        setDiscountsError({ is: true, message: err.message });
      } else {
        setDiscountsError({ is: true, message: "Discount delete error" });
      }
    }
  };

  const handleAddBtnPress = () => {
    if (newDiscount !== null) {
      return;
    }

    const newStartDate = new Date();
    newStartDate.setDate(1);
    const newEndDate = new Date();
    newEndDate.setDate(10);

    setNewDiscount({
      id: -1,
      code: "",
      startDate: newStartDate.toISOString(),
      endDate: newEndDate.toISOString(),
      usesLeft: NaN,
      discountPercentage: NaN,
    });
  };

  const handleSortingBtnPress = async (sortingParameter: string) => {
    switch (
      sortingParameter //handling sorting crideria
    ) {
      case "code":
        setCodeSorting((prev: number) => (prev == 0 ? 1 : prev == 1 ? -1 : 0));
        setStartDateSorting(0);
        setEndDateSorting(0);
        setPercentSorting(0);
        setUsesLeftSorting(0);
        break;
      case "startDate":
        setStartDateSorting((prev: number) =>
          prev == 0 ? 1 : prev == 1 ? -1 : 0,
        );
        setCodeSorting(0);
        setEndDateSorting(0);
        setPercentSorting(0);
        setUsesLeftSorting(0);
        break;
      case "endDate":
        setEndDateSorting((prev: number) =>
          prev == 0 ? 1 : prev == 1 ? -1 : 0,
        );
        setCodeSorting(0);
        setStartDateSorting(0);
        setPercentSorting(0);
        setUsesLeftSorting(0);
        break;
      case "percent":
        setPercentSorting((prev: number) =>
          prev == 0 ? 1 : prev == 1 ? -1 : 0,
        );
        setCodeSorting(0);
        setStartDateSorting(0);
        setEndDateSorting(0);
        setUsesLeftSorting(0);
        break;
      case "usesLeft":
        setUsesLeftSorting((prev: number) =>
          prev == 0 ? 1 : prev == 1 ? -1 : 0,
        );
        setCodeSorting(0);
        setStartDateSorting(0);
        setEndDateSorting(0);
        setPercentSorting(0);
        break;
    }
  };

  const sortedDiscounts =
    codeSorting != 0
      ? [...discounts].sort((a, b) => {
          if (a.code > b.code) return codeSorting;
          else return -codeSorting;
        })
      : startDateSorting != 0
        ? [...discounts].sort((a, b) => {
            if (a.startDate > b.startDate) return startDateSorting;
            else return -startDateSorting;
          })
        : endDateSorting != 0
          ? [...discounts].sort((a, b) => {
              if (a.endDate > b.endDate) return endDateSorting;
              else return -endDateSorting;
            })
          : percentSorting != 0
            ? [...discounts].sort(
                (a, b) =>
                  (a.discountPercentage - b.discountPercentage) *
                  percentSorting,
              )
            : usesLeftSorting != 0
              ? [...discounts].sort((a, b) => {
                  if (a.usesLeft > b.usesLeft) return usesLeftSorting;
                  else return -usesLeftSorting;
                })
              : discounts;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.pageTitle}>Промокоди</h1>
        {discountsError.is ? (
          <></>
        ) : (
          <button className={styles.addBtn} onClick={handleAddBtnPress}>
            +
          </button>
        )}
      </header>

      {discountsError.is ? (
        <>
          <h3 className={styles.errorMsg}>{discountsError.message}</h3>
          <button className={styles.retryBtn} onClick={fetchDiscounts}>
            Перезавантажити список промокодів
          </button>
        </>
      ) : (
        <>
          <div className={styles.discountHeader}>
            <div className={styles.discountHeaderGrid}>
              <button
                className={styles.discountHeaderColumnTitle}
                onClick={() => handleSortingBtnPress("code")}
              >
                <p className={styles.discountHeaderText}>Код</p>
                <p className={styles.discountHeaderButton}>
                  {codeSorting == 0 ? "-" : codeSorting == 1 ? "▲" : "▼"}
                </p>
              </button>
              <button
                className={styles.discountHeaderColumnTitle}
                onClick={() => handleSortingBtnPress("startDate")}
              >
                <p className={styles.discountHeaderText}>Початок дії</p>
                <p className={styles.discountHeaderButton}>
                  {startDateSorting == 0
                    ? "-"
                    : startDateSorting == 1
                      ? "▲"
                      : "▼"}
                </p>
              </button>
              <button
                className={styles.discountHeaderColumnTitle}
                onClick={() => handleSortingBtnPress("endDate")}
              >
                <p className={styles.discountHeaderText}>Кінець дії</p>
                <p className={styles.discountHeaderButton}>
                  {endDateSorting == 0 ? "-" : endDateSorting == 1 ? "▲" : "▼"}
                </p>
              </button>
              <button
                className={styles.discountHeaderColumnTitle}
                onClick={() => handleSortingBtnPress("percent")}
              >
                <p className={styles.discountHeaderText}>% знижки</p>
                <p className={styles.discountHeaderButton}>
                  {percentSorting == 0 ? "-" : percentSorting == 1 ? "▲" : "▼"}
                </p>
              </button>
              <button
                className={styles.discountHeaderColumnTitle}
                onClick={() => handleSortingBtnPress("usesLeft")}
              >
                <p className={styles.discountHeaderText}>К-ть використань</p>
                <p className={styles.discountHeaderButton}>
                  {usesLeftSorting == 0
                    ? "-"
                    : usesLeftSorting == 1
                      ? "▲"
                      : "▼"}
                </p>
              </button>
            </div>
          </div>
          <div className={styles.discountList}>
            {newDiscount === null ? (
              <></>
            ) : (
              <AdminDiscountCard
                key={newDiscount.id}
                discount={newDiscount}
                handleDiscountEditConfirm={handleDiscountEditConfirm}
                handleDiscountDelete={handleDiscountDelete}
                isNew={true}
              />
            )}
            {sortedDiscounts?.map((d) => (
              <AdminDiscountCard
                key={d.id}
                discount={d}
                handleDiscountEditConfirm={handleDiscountEditConfirm}
                handleDiscountDelete={handleDiscountDelete}
                isNew={d.id == -1}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDiscountPage;
