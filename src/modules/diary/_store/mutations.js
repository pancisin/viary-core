import * as types from './mutation-types';
import initialState from './state';

import { DateTime } from 'luxon'

export default {
  [types.SET_DIARIES] (state, { diaries }) {
    state.diaries = diaries;
  },

  [types.ADD_DIARY] (state, { diary }) {
    state.diaries.push(diary);
  },

  [types.SCOPE_DIARY] (state, { diary }) {
    state.scopedDiary = diary;
  },

  [types.SET_SCOPED_DIARY_DAYS] (state, { days }) {
    state.scopedDiaryDays = days;
  },

  [types.ADD_WEEK_TO_SCOPE] (state, { weekNumber, days }) {
    const idx = state.scopedDiaryWeeks.findIndex(w => w.weekNumber === weekNumber)

    if (idx != -1) {
      state.scopedDiaryWeeks.splice(idx, 1, {
        weekNumber,
        days: [ ...days]
      })
    } else {
      state.scopedDiaryWeeks.push({
        weekNumber,
        days: [ ...days]
      })
    }
  },

  [types.UPDATE_DAY] (state, { weekNumber, day }) {
    const weekIdx = state.scopedDiaryWeeks.findIndex(w => w.weekNumber === weekNumber)
    const week = state.scopedDiaryWeeks[weekIdx]

    state.scopedDiaryWeeks = state.scopedDiaryWeeks.map(w => {
      if (w.weekNumber === weekNumber) {
        const dayIdx = w.days.findIndex(d => d.date_number === day.date_number)
        w.days.splice(dayIdx, 1, day)
      }

      return w
    })
  },

  [types.SCOPE_DAY] (state, { day }) {
    state.scopedDay = day;
  },

  [types.SET_LOADING_DIARY] (state, inProgress) {
    state.loadingDiaryInProgress = inProgress;
  },

  [types.SET_SAVING_DIARY] (state, inProgress) {
    state.savingDiaryInProgress = inProgress;
  },

  [types.FLUSH_DIARY_MODULE_STATE] (state) {
    state.diaries = [],
    state.scopedDiary = {},
    state.scopedDiaryDays = [],
    state.scopedDiaryWeeks = [],
    state.scopedDay = DateTime.local().toSQL(),
    state.loadingDiaryInProgress = false,
    state.savingDiaryInProgress = false
  },

  [types.SET_FORECAST_DATA] (state, forecast) {
    state.forecastData = forecast;
  }
}