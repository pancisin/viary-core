import { DateTime } from 'luxon';
import { sortNotesByTime } from '../utils';

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
  weekDays: (state, getters) => count => {
    const scopedDay = getters.scopedDay;
    const week = getters.getDiaryWeek(scopedDay.weekNumber)

    let daysContent = []
    if (week != null) {
      daysContent = week.days
    }

    return Array.from({ length: count || 7 }, (v, i) => i).map(i => {
      const d = scopedDay.startOf('week').plus({ days: i })
      const c = daysContent.filter(dc => dc.date_number === d.ordinal)[0]
      const weatherData = getters.forecastData.filter(w => DateTime.fromMillis(w.dt * 1000).toSQLDate() === d.toSQLDate());

      Object.assign(d, { 
        weatherData,
        notes: []
      })

      if (c != null) {
        d.notes = [ ...c.notes ].sort(sortNotesByTime)
      }
      
      return d;
    })
  },
  monthDays: (state, getters) => {
    const scopedDay = getters.scopedDay;

    const start = scopedDay.startOf('month').startOf('week')
    const end = scopedDay.endOf('month').endOf('week')

    return Array.from({ length: Math.round(end.diff(start, 'days').days) }, (v, i) => i).map(i => start.plus({ days: i }))
  }
}