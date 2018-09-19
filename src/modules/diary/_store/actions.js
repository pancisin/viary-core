import DiaryApi from '../_api/diary.api';
import NoteApi from '../_api/note.api';
import WeatherApi from '../_api/weather.api';
import * as types from './mutation-types';

import { DateTime } from 'luxon';

// import router from '@/router'

export default ({ baseUrl }) => {
  const Api = {
    ...DiaryApi(baseUrl),
    ...NoteApi(baseUrl)
  } 

  const WeatherApiInstance = WeatherApi();

  const initializeDiaries = ({ commit }) => {
    commit(types.SET_LOADING_DIARY, true);
    return new Promise(resolve => {
      Api.getDiaries(diaries => {
        commit(types.SET_DIARIES, { diaries })
        commit(types.SET_LOADING_DIARY, false);  
        resolve(diaries)
      })
    })
  }

  const createDiary = ({ commit, dispatch }, diary) => {
    commit(types.SET_LOADING_DIARY, true);
    return new Promise((resolve, reject) => {

      if (diary.name == null || diary.name === '') {
        reject(new Error('Diary is not properly named !'));
        return;
      }

      Api.postDiary(diary, result => {
        commit(types.ADD_DIARY, { diary: { ...result} })
        dispatch('scopeDiary', { slug: result.slug })
        commit(types.SET_LOADING_DIARY, false);
        resolve(result)
      })
    })
  }

  const scopeDiary = ({ commit, getters, dispatch }, { slug, scopeDate }) => {
    return new Promise((resolve, reject) => {

      if (getters.diaries.length === 0) {
        reject(new Error('There are any diaries in user context.'));
        return;
      }

      var diary = getters.diaries[0] || {}

      const idx = getters.diaries.findIndex(d => d.slug === slug)
      if (idx != -1) {
        diary = getters.diaries[idx]
      }

      commit(types.SCOPE_DIARY, { diary });

      const day = scopeDate != null ? DateTime.fromSQL(scopeDate) : DateTime.local();
      dispatch('scopeDay', { day, force: true }).then(() => {
        resolve(diary);
      })
    })
  }

  /**
   * Scope day and load all data required for week construction.
   * @param {Object} param0 - vuex object
   * @param {Object} param1 - an object
   * @param {DateTime} param1.day - scoped day datetime object
   * @param {Boolean} param2.force - false 
   */
  const scopeDay = ({ commit, getters, dispatch }, { day, force }) => {
    return new Promise(resolve => {
      const weekUpdate = (day.weekNumber !== getters.scopedDay.weekNumber) || force;
      commit(types.SET_LOADING_DIARY, true);

      const resolveCallback = (sqlDate) => {
        commit(types.SCOPE_DAY, { day: sqlDate });
        commit(types.SET_LOADING_DIARY, false);
        resolve();
      }

      if (weekUpdate) {
        Promise.all([
          dispatch('loadWeekData', day.weekNumber),
          dispatch('loadWeekWeatherData', day.weekNumber)
        ]).then(() => {
          resolveCallback(day.toSQL())
        })
      } else {
        resolveCallback(day.toSQL())
      }
    })
  }

  const loadWeekData = ({ commit, getters }, weekNumber) => {
    const week = DateTime.fromObject({ weekNumber })
    // if (getters.getDiaryWeek(weekNumber) == null) {
      
      return new Promise(resolve => {
        Api.getDays(getters.scopedDiary.slug, {
          from: week.startOf('week').toFormat('MM/dd/yyyy'),
          to: week.endOf('week').toFormat('MM/dd/yyyy')
        }, days => {
          // commit(types.SET_SCOPED_DIARY_DAYS, { days });
          commit(types.ADD_WEEK_TO_SCOPE, { weekNumber, days: days });
          resolve();
        })
      })
    // }
  }

  // weekNumber param
  const loadWeekWeatherData = ({ commit }) => {
    return new Promise(resolve => {
      WeatherApiInstance.getForecastData('kosice,sk', weather => {
        commit(types.SET_FORECAST_DATA, weather.list)
        resolve(weather)
      }, () => {

      })
    })
  }

  const updateDayNote = ({ commit, getters }, { note, weekNumber, ordinal }) => {
    return new Promise(resolve => {
      commit(types.SET_LOADING_DIARY, true);
      Api.updateNote(note.id, note, result => {
        commit(types.UPDATE_NOTE, { weekNumber: weekNumber, ordinal, note: result })
        commit(types.SET_LOADING_DIARY, false);
        resolve(result)
      })
    })
  }

  const addDayNote = ({ commit, getters }, { note, weekNumber, ordinal }) => {
    const scopedDay = getters.scopedDay;

    return new Promise(resolve => {
      commit(types.SET_LOADING_DIARY, true);
      Api.postNote(getters.scopedDiary.slug, {
        content: note,
        ordinal: ordinal,
        year: scopedDay.year,
      }, result => {
        commit(types.ADD_NOTE, { note: result, ordinal, weekNumber })
        commit(types.SET_LOADING_DIARY, false);
        resolve()
      })
    })
  }

  const deleteDayNote = ({ commit, getters }, { noteId, weekNumber, ordinal }) => {
    return new Promise(resolve => {
      commit(types.SET_LOADING_DIARY, true);
      Api.deleteNote(noteId, result => {
        commit(types.DELETE_NOTE, { weekNumber, ordinal, noteId })
        commit(types.SET_LOADING_DIARY, false);
        resolve(result)
      }, err => {
        console.error(err)
      })
    })
  }

  const flushDiaries = ({ commit }) => {
    commit(types.FLUSH_DIARY_MODULE_STATE);
  }

  return {
    initializeDiaries,
    createDiary,
    scopeDiary,
    scopeDay,
    loadWeekData,
    loadWeekWeatherData,
    addDayNote,
    flushDiaries,
    updateDayNote,
    deleteDayNote
  }
}