import styles from "./AdminDiscountPage.module.scss";
import {
  createDiscount,
  getDiscounts,
  type DiscountDto,
} from "../../../api/discountApi";
import AdminDiscountCard from "../../../components/Admin/AdminDiscountCard/AdminDiscountCard";
import { useEffect, useState } from "react";

const AdminDiscountPage: React.FC = () => {
  const [discounts, setDiscounts] = useState<DiscountDto[]>([]);

  const fetchDiscounts = async () => {
    const fetchedDiscounts = await getDiscounts();
    setDiscounts(fetchedDiscounts);
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchDiscounts();
    };

    fetchData();
  }, []);

  const handleDiscountEditConfirm = async (
    d_old: DiscountDto,
    d_new: DiscountDto,
  ) => {
    const idOld = discounts.findIndex((d) => d.code == d_old.code); // should not be -1
    const idNew = discounts
      .filter((d) => d.code != d_old.code)
      .findIndex((d) => d.code == d_new.code); // should be -1

    if (idOld == -1) {
      console.log("editing discount error | no such old discount found");
      return false;
    }
    if (idNew != -1) {
      console.log("editing discount error | new code conflicts with existing");
      return false;
    }

    //important api putpost or whatever call
    if (d_old.code == "") // identifier for newly created
    {
      await createDiscount(d_new);
      fetchDiscounts();
    }

    console.log("editing success");
    return true;
  };

  const handleDiscountDelete = (d: DiscountDto) => {
    const indexOfElement = discounts.findIndex((dc) => dc.code == d.code);
    if (indexOfElement == -1) {
      console.log("editing error");
      return;
    }

    //important api delete call
    setDiscounts(discounts.filter((dc) => dc.code != d.code));
  };

  const handleAddBtnPress = () => {
    if (discounts.findIndex((d) => d.code == "") != -1) {
      return;
    }

    const newStartDate = new Date();
    newStartDate.setDate(1);
    const newEndDate = new Date();
    newEndDate.setDate(10);

    const newDiscount: DiscountDto = {
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
        <button className={styles.addBtn} onClick={handleAddBtnPress}>
          +
        </button>
      </header>

      <div className={styles.discountList}>
        {discounts?.map((d) => (
          <AdminDiscountCard
            key={d.code}
            discount={d}
            handleDiscountEditConfirm={handleDiscountEditConfirm}
            handleDiscountDelete={handleDiscountDelete}
            isNew={d.code == ""}
          />
        ))}
      </div>
    </div>
  );
};

export default AdminDiscountPage;
