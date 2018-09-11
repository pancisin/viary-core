import { DateTime } from 'luxon';

export default {
  diaries: [],
  scopedDiary: {},
  scopedDiaryDays: [],
  scopedDiaryWeeks: [],
  scopedDay: DateTime.local().toSQL(),
  loadingDiaryInProgress: false,
  savingDiaryInProgress: false,
  forecastData: []
}