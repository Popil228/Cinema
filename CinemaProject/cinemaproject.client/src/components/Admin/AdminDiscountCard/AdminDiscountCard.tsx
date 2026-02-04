import type React from "react";
import styles from "./AdminDiscountCard.module.scss";
import type { DiscountDto } from "../../../api/discountApi";
import { useState, type ChangeEvent } from "react";

interface AdminDiscountCardInterface {
  isNew: boolean;
  discount: DiscountDto;
  handleDiscountEditConfirm: (
    d_old: DiscountDto,
    d_new: DiscountDto,
  ) => Promise<boolean>;
  handleDiscountDelete: (d: DiscountDto) => void;
}
const AdminDiscountCard: React.FC<AdminDiscountCardInterface> = ({
  isNew,
  discount,
  handleDiscountEditConfirm,
  handleDiscountDelete,
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(isNew);
  const [isEditingError, setIsEditingError] = useState<boolean>(false);
  const [codeInput, setCodeInput] = useState<string>(discount.code);
  const [startDateInput, setStartDateInput] = useState<string>(
    discount.startDate.split("T")[0],
  );
  const [endDateInput, setEndDateInput] = useState<string>(
    discount.endDate.split("T")[0],
  );
  const [usesLeftInput, setUsesLeftInput] = useState<number>(discount.usesLeft);
  const [discountPercentInput, setDiscountPercentageInput] = useState<number>(
    discount.discountPercentage,
  );

  const startDate_date = new Date(discount.startDate);
  const endDate_date = new Date(discount.endDate);

  const displayStartDate =
    startDate_date.getDate() +
    "." +
    startDate_date.getMonth() +
    "." +
    startDate_date.getFullYear();
  const displayEndDate =
    endDate_date.getDate() +
    "." +
    endDate_date.getMonth() +
    "." +
    endDate_date.getFullYear();

  const handleCodeInput = (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    if (input.length > 50) {
      return;
    }
    setCodeInput(e.target.value);
  };

  const handleUsesLeftInput = (e: ChangeEvent<HTMLInputElement>) => {
    const input = Number.parseInt(e.target.value);
    if (input < 0) {
      //possible implementation of unlimited code via -1 usesLeft
      return;
    }
    setUsesLeftInput(input);
  };

  const handleDiscountPercentageInput = (e: ChangeEvent<HTMLInputElement>) => {
    const input = Number.parseInt(e.target.value);
    if (input <= 0) {
      return;
    }
    if (input >= 100) {
      setDiscountPercentageInput(100);
      return;
    }
    setDiscountPercentageInput(input);
  };

  const handeStartDateInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    if (input >= endDateInput) {
      return;
    }
    setStartDateInput(input);
  };

  const handeEndDateInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    if (input <= startDateInput) {
      return;
    }
    setEndDateInput(input);
  };

  const onEditFieldSelect = () => {
    if (isEditingError) {
      setIsEditingError(false);
    }
  };

  const handleEditBtnPress = () => {
    setIsEditing(true);
  };

  const handleCancelEditBtnPress = () => {
    if (isNew) {
      handleDiscountDelete(discount);
      return;
    }

    setIsEditing(false);
    setCodeInput(discount.code);
    setStartDateInput(discount.startDate.split("T")[0]);
    setEndDateInput(discount.endDate.split("T")[0]);
    setUsesLeftInput(discount.usesLeft);
    setDiscountPercentageInput(discount.discountPercentage);
  };

  const handleConfirmEditBtnPress = async () => {
    if (
      codeInput == "" ||
      startDateInput == "" ||
      endDateInput == "" ||
      isNaN(usesLeftInput) ||
      isNaN(discountPercentInput)
    ) {
      setIsEditingError(true);
      return;
    }

    const d_new: DiscountDto = {
      code: codeInput,
      startDate: startDateInput + "T00:00:00Z",
      endDate: endDateInput + "T00:00:00Z",
      usesLeft: usesLeftInput,
      discountPercentage: discountPercentInput,
    };

    if (await handleDiscountEditConfirm(discount, d_new)) {
      setIsEditingError(false);
      setIsEditing(false);
    } else {
      setIsEditingError(true);
      console.error("discount change confirmation error");
    }
  };

  const handleDeleteBtnPress = () => {
    handleDiscountDelete(discount);
  };

  return (
    <div className={`${styles.card} ${isEditingError ? styles.error : ""}`}>
      <div className={styles.discountInfoContainer}>
        {isEditing ? (
          <div className={styles.discountInfoGrid}>
            <input
              type="text"
              value={codeInput}
              onChange={handleCodeInput}
              onSelect={onEditFieldSelect}
            ></input>
            <input
              className={styles.dateEdit}
              type="date"
              value={startDateInput}
              onChange={handeStartDateInput}
              onSelect={onEditFieldSelect}
            ></input>
            <input
              className={styles.dateEdit}
              type="date"
              value={endDateInput}
              onChange={handeEndDateInput}
              onSelect={onEditFieldSelect}
            ></input>
            <div className={styles.editPercentageContainer}>
              <input
                className={styles.discountPercentageInput}
                type="number"
                value={discountPercentInput}
                onChange={handleDiscountPercentageInput}
                onSelect={onEditFieldSelect}
              ></input>
              <p className={styles.numericDisplay}>%</p>
            </div>
            <input
              type="number"
              value={usesLeftInput}
              onChange={handleUsesLeftInput}
              onSelect={onEditFieldSelect}
            ></input>
          </div>
        ) : (
          <div className={styles.discountInfoGrid}>
            <p className={styles.codeDisplay}>{discount.code}</p>
            <p className={styles.dateDisplay}>{displayStartDate}</p>
            <p className={styles.dateDisplay}>{displayEndDate}</p>
            <p className={styles.numericDisplay}>
              {discount.discountPercentage}%
            </p>
            <p className={styles.numericDisplay}>{discount.usesLeft}</p>
          </div>
        )}
      </div>

      <div className={styles.buttonsContainer}>
        {!isEditing ? (
          <>
            <button className={styles.editBtn} onClick={handleEditBtnPress}>
              ✎
            </button>
            <button className={styles.deleteBtn} onClick={handleDeleteBtnPress}>
              🗑
            </button>
          </>
        ) : (
          <>
            <button
              className={styles.confirmBtn}
              onClick={handleConfirmEditBtnPress}
            >
              ✓
            </button>
            <button
              className={styles.deleteBtn}
              onClick={handleCancelEditBtnPress}
            >
              X
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDiscountCard;
