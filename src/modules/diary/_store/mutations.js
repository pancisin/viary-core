import * as types from './mutation-types';

import { DateTime } from 'luxon'

export default {
  [types.SET_DIARIES] (state, { diaries }) {
    state.diaries = diaries;
  },

  [types.ADD_DIARY] (state, { diary }) {
    state.diaries = [ ...state.diaries, diary ]
  },

  [types.UPDATE_DIARY] (state, { diary }) {
    state.scopedDiary = diary;
    const diaryIdx = state.diaries.findIndex(d => d.slug === diary.slug);

    const diaries = [ ...state.diaries ]
    diaries.splice(diaryIdx, 1, diary)    
    state.diaries = diaries
  },

  [types.SCOPE_DIARY] (state, { diary }) {
    state.scopedDiary = diary;
  },

  [types.SET_SCOPED_DIARY_DAYS] (state, { days }) {
    state.scopedDiaryDays = days;
  },

  [types.ADD_WEEK_TO_SCOPE] (state, { weekNumber, year, days }) {
    state.scopedDiaryWeeks = {
      ...state.scopedDiaryWeeks,
      [ year ]: {
        ...state.scopedDiaryWeeks[year],
        [ weekNumber ]: [ ...days ]
      }
    }
  },

  // not used
  [types.UPDATE_DAY] (state, { weekNumber, year, day }) {
    state.scopedDiaryWeeks = {
      ...state.scopedDiaryWeeks,
      [ year ]: {
        ...state.scopedDiaryWeeks[year],
        [ weekNumber ]: state.scopedDiaryWeeks[year][weekNumber].map(d => {
          return d.date_number === day.date_number ? day : d
        })
      }
    }
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
  },

  [types.ADD_NOTE] (state, { weekNumber, ordinal, year, note, force }) {
    state.scopedDiaryWeeks = {
      ...state.scopedDiaryWeeks,
      [ year ]: {
        ...state.scopedDiaryWeeks[year],
        [ weekNumber ]: state.scopedDiaryWeeks[year][weekNumber]
        .concat((() => { 
          const days = state.scopedDiaryWeeks[year][weekNumber];
          if (days.indexOf(d => d.date_number === ordinal) === -1) {
            return [{
              date_number: ordinal,
              year,
              notes: [ note ]
            }]
          }
          return []
        })())
        .map(d => {
          if (d.date_number === ordinal) {

            if (d.notes.findIndex(n => n.id === note.id) === -1) {
              return {
                ...d,
                notes: [ ...d.notes, note ]
              }
            } else if (force) {
              // to implement
            }
          }
          
          return d
        })
      }
    }
  },

  [types.UPDATE_NOTE] (state, { weekNumber, ordinal, year, note }) {
    state.scopedDiaryWeeks = {
      ...state.scopedDiaryWeeks,
      [ year ]: {
        ...state.scopedDiaryWeeks[year],
        [weekNumber]: state.scopedDiaryWeeks[year][weekNumber].map(d => {
          if (d.date_number === ordinal) {
            return {
              ...d,
              notes: d.notes.map(n => {
                if (n.id === note.id) {
                  return note;
                }

                return n;
              })
            }
          }

          return d;
        })
      }
    }
  },

  [types.DELETE_NOTE] (state, { weekNumber, ordinal, year, noteId }) {
    state.scopedDiaryWeeks = {
      ...state.scopedDiaryWeeks,
      [ year ]: {
        ...state.scopedDiaryWeeks[year],
        [weekNumber]: state.scopedDiaryWeeks[year][weekNumber].map(d => {
          if (d.date_number === ordinal) {
            return {
              ...d,
              notes: d.notes.filter(n => n.id !== noteId)
            }
          }

          return d
        })
      }
    }
  }
}