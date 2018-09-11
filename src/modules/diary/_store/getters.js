import { DateTime } from 'luxon';

export default {
  diaries: state => state.diaries,
  scopedDiary: state => state.scopedDiary,
  scopedDiaryDays: state => state.scopedDiaryDays,
  getDiaryWeek: state => weekNumber => {
    const idx = state.scopedDiaryWeeks.findIndex(w => w.weekNumber === weekNumber)

    if (idx != -1) {
      return state.scopedDiaryWeeks[idx]
    }

    return null
  },
  scopedDay: state => DateTime.fromSQL(state.scopedDay),
  loadingDiary: state => state.loadingDiaryInProgress || state.savingDiaryInProgress,
  savingDiary: state => state.savingDiary,
  forecastData: state => state.forecastData,
  weekDays: (state, getters) => {
    const scopedDay = getters.scopedDay;

    const week = getters.getDiaryWeek(scopedDay.weekNumber)

    let daysContent = []
    if (week != null) {
      daysContent = week.days
    }

    return Array.from({ length: 7 }, (v, i) => i).map(i => {
      const d = scopedDay.startOf('week').plus({ days: i })

      const dayNumber = d.diff(d.startOf('year'), 'days').toObject().days
      const c = daysContent.filter(d => d.date_number === dayNumber)[0]

      const weatherData = getters.forecastData.filter(w => DateTime.fromMillis(w.dt * 1000).toSQLDate() === d.toSQLDate());

      Object.assign(d, { content: '', weatherData })
      if (c != null) {
        d.content = c.content;
      }
      return d;
    })
  }
}