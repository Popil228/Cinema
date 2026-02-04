import styles from "./AdminDiscountPage.module.scss";
import { type DiscountDto } from "../../../api/discountApi";
import * as discountApi from "../../../api/discountApi";
import AdminDiscountCard from "../../../components/Admin/AdminDiscountCard/AdminDiscountCard";
import { useEffect, useState } from "react";

const AdminDiscountPage: React.FC = () => {
  const [discounts, setDiscounts] = useState<DiscountDto[]>([]);
  const [discountsError, setDiscountsError] = useState<{
    is: boolean;
    message: string;
  }>({ is: false, message: "Помилка відсутня" });

  const fetchDiscounts = async () => {
    try {
      const fetchedDiscounts = await discountApi.getDiscounts();
      setDiscounts(fetchedDiscounts);
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

    if (d_old.id == -1) // identifier for newly created
    {
      try {
        await discountApi.createDiscount(d_new);
        fetchDiscounts();
      } catch (err) {
        if (err instanceof Error) {
          setDiscountsError({ is: true, message: err.message });
        } else {
          setDiscountsError({ is: true, message: "Discounta create error" });
        }
      }
    } else {
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
    }

    console.log("editing success");
    return true;
  };

  const handleDiscountDelete = async (d: DiscountDto) => {
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
    if (discounts.findIndex((d) => d.id == -1) != -1) {
      //id -1 for newly created
      return;
    }

    const newStartDate = new Date();
    newStartDate.setDate(1);
    const newEndDate = new Date();
    newEndDate.setDate(10);

    const newDiscount: DiscountDto = {
      id: -1,
      code: "",
      startDate: newStartDate.toISOString(),
      endDate: newEndDate.toISOString(),
      usesLeft: NaN,
      discountPercentage: NaN,
    };

    setDiscounts((prev) => [newDiscount, ...prev]);
  };

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
        <div className={styles.discountList}>
          {discounts?.map((d) => (
            <AdminDiscountCard
              key={d.code}
              discount={d}
              handleDiscountEditConfirm={handleDiscountEditConfirm}
              handleDiscountDelete={handleDiscountDelete}
              isNew={d.id == -1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDiscountPage;
