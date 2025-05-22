import dayjs from 'dayjs';

export const compareByNumber =
  ({ identity, sort }) =>
  (a, b) => {
    const aValue = identity ? a[identity] : a;
    const bValue = identity ? b[identity] : b;
    if (aValue > bValue) return sort && sort === 'desc' ? -1 : 1;
    if (aValue < bValue) return sort && sort === 'desc' ? 1 : -1;
    return 0;
  };

export const compareByDate =
  ({ identity, sort }) =>
  (a, b) => {
    const aDate = identity ? dayjs(a[identity]) : dayjs(a);
    const bDate = identity ? dayjs(b[identity]) : dayjs(b);
    if (aDate.isAfter(bDate)) return sort && sort === 'desc' ? -1 : 1;
    if (aDate.isBefore(bDate)) return sort && sort === 'desc' ? 1 : -1;
    return 0;
  };
