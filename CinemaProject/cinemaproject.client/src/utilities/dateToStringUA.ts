/**
 * Перетворює об'єкт Date у string формату "число місяць" українською мовою.
 * Наприклад: 3 квітня, 12 грудня.
 */
const dateToDayMonthStrUA = (date: Date): string => {
  return new Intl.DateTimeFormat('uk-UA', {
    day: 'numeric',
    month: 'long',
  }).format(date);
};

export { dateToDayMonthStrUA };