import { DateTime } from 'luxon';

const sortNotesByTime = (a, b) => {
  if (b.time == null) return -1;
  if (a.time == null) return 1;

  const timeFormat = 'HH:mm'
  const diff = DateTime.fromSQL(a.time, timeFormat) - DateTime.fromSQL(b.time, timeFormat) 

  if (diff === 0) {
    return 0
  }
  return diff > 0 ? 1 : -1
};

export { sortNotesByTime };
