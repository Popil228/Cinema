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

const dateToDayMonthStrUA = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    const dateStr:string = d.getDate().toString()+" "+Months_UA[d.getMonth()];
    return dateStr;
}

export {dateToDayMonthStrUA};