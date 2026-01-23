const Months_UA:{[k: number]: string} = {
    0: "Січня",
    1: "Лютого",
    2: "Березня",
    3: "Квітня",
    4: "Травня",
    5: "Червня",
    6: "Липня",
    7: "Серпня",
    8: "Вересня",
    9: "Жовтня",
    10: "Листопада",
    11: "Грудня",
}

const dateToDayMonthStrUA = (date: Date) => {
    const dateStr:string = date.getDate().toString()+" "+Months_UA[date.getMonth()];
    return dateStr;
}

export {dateToDayMonthStrUA};