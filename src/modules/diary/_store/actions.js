import DiaryApi from '../_api/diary.api';
import WeatherApi from '../_api/weather.api';

import * as types from './mutation-types';

import { DateTime } from 'luxon';

// import router from '@/router'

export default function ({ baseUrl }) {
  const Api = DiaryApi(baseUrl);
  
  const initializeDiaries = ({ commit, dispatch }) => {
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
      dispatch('scopeDay', { day }).then(() => {
        resolve(diary);
      })
    })
  }

  const scopeDay = ({ commit, getters, dispatch }, { day, force }) => {
    // if (day.toSQLDate() === getters.scopedDay.toSQLDate() && !force || getters.scopedDiary.slug == null) {
    //   return
    // }
    
    // router.replace({
    //   name: 'diary',
    //   query: {
    //     date_scope: day.toSQLDate()
    //   }
    // })

    return new Promise(resolve => {
      dispatch('loadWeekData', day.weekNumber).then(() => {
  
        commit(types.SCOPE_DAY, { day: day.toSQL() });
        resolve();
      })

      dispatch('loadWeekWeatherData', day.weekNumber)
    })
  }

  const loadWeekData = ({ commit, getters }, weekNumber) => {
    const week = DateTime.fromObject({ weekNumber })
    // if (getters.getDiaryWeek(weekNumber) == null) {
      commit(types.SET_LOADING_DIARY, true);
      return new Promise(resolve => {
        Api.getDays(getters.scopedDiary.slug, {
          from: week.startOf('week').toFormat('MM/dd/yyyy'),
          to: week.endOf('week').toFormat('MM/dd/yyyy')
        }, days => {
          commit(types.SET_SCOPED_DIARY_DAYS, { days });
          commit(types.ADD_WEEK_TO_SCOPE, { weekNumber, days });
          commit(types.SET_LOADING_DIARY, false);
          resolve();
        })
      })
    // }
  }

  const loadWeekWeatherData = ({ commit, getters }, weekNumber) => {
    return new Promise(resolve => {
      WeatherApi.getForecastData('kosice,sk', weather => {
        commit(types.SET_FORECAST_DATA, weather.list)
      })
    })
  }

  const updateScopedDay = ({ commit, getters }, content) => {
    const scopedDay = getters.scopedDay;
    const dayNumber = scopedDay.diff(scopedDay.startOf('year'), 'days').toObject().days

    commit(types.SET_SAVING_DIARY, true);

    return new Promise(resolve => {
      DiaryApiApi.postDay(getters.scopedDiary.slug, {
        date_number: dayNumber,
        year: scopedDay.year,
        content
      }, result => {
        resolve()
        commit(types.UPDATE_DAY, { weekNumber: scopedDay.weekNumber, day: result })
        commit(types.SET_SAVING_DIARY, false);
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
    updateScopedDay,
    flushDiaries
  }
}