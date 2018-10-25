import DiaryApi from '../_api/diary.api';
import DiaryPouchApi from '../_db/diary.api';
import NoteApi from '../_api/note.api';
import NotePouchApi from '../_db/note.api';
import ChangePouchApi from '../_db/change.api';
import WeatherApi from '../_api/weather.api';
import WeatherPouchApi from '../_db/weather.api';
import * as types from './mutation-types';

import { DateTime } from 'luxon';

export default (options) => {
  const baseUrl = options.baseUrl || '';
  const useLocalDatabase = options.useLocalDatabase; // try this as function
  const disableWeatherData = options.disableWeatherData; // not implemented
  // const offlineMode = options.offlineMode; // not implemented

  const pouch = {
    ...DiaryPouchApi(),
    ...NotePouchApi()
  }

  const api = offlineMode => {
    return offlineMode ? pouch : {
      ...DiaryApi(baseUrl),
      ...NoteApi(baseUrl),
    }
  }

  const WeatherApiInstance = WeatherApi();

  const initializeDiaries = ({ commit, dispatch, rootGetters }) => {
    commit(types.SET_LOADING_DIARY, true);
    const offlineMode = rootGetters['$_settings/offlineMode'];

    return api(offlineMode).getDiaries().then(diaries => {
      commit(types.SET_DIARIES, { diaries })
      commit(types.SET_LOADING_DIARY, false);  
    
      if (!offlineMode) {
        dispatch('synchronizeDiaries');
        dispatch('synchronizeNotes');
      }
      
      return Promise.resolve(diaries)
    })
  }

  /**
   * Diaries synchronization vuex <-> pouchDb
   * @param {*} param0 
   */
  const synchronizeDiaries = ({ getters, commit }) => {
    const diaries = getters.diaries;
    const promises = [];
    
    pouch.getDiaries().then(dbDiaries => {

      // Store remote only diaries locally.
      diaries
        .filter(d => !dbDiaries.map(dbd => dbd._id).includes(d.slug))
        .forEach(d => {
          pouch.postDiary({
            ...d,
            _id: d.slug
          })
        })

      // Post local only diaries to remote.
      dbDiaries
        .filter(dbd => !diaries.map(d => d.slug).includes(dbd._id))
        .forEach(dbd => {
          api().postDiary(dbd, diary => {
            pouch.deleteDiary(dbd._id)
            pouch.putDiary({
              ...diary,
              _id: diary.slug
            })
            commit(types.ADD_DIARY, { diary })
          })
        })

      // Synchronize those that are on both sources.
      dbDiaries
        .filter(dbd => diaries.map(d => d.slug).includes(dbd._id))
        .forEach(dbd => {

        })
    })
  }

  const createDiary = ({ commit, dispatch, rootGetters }, diary) => {
    commit(types.SET_LOADING_DIARY, true);

    if (diary.name == null || diary.name === '') {
      return Promise.reject('Diary is not properly named !')
    }

    return api(rootGetters['$_settings/offlineMode']).postDiary(diary).then(result => {
      commit(types.ADD_DIARY, { diary: { ...result} })
      dispatch('scopeDiary', { slug: result.slug })
      commit(types.SET_LOADING_DIARY, false);

      return Promise.resolve(result)
    })
  }

  const updateDiary = ({ commit, rootGetters }, diary) => {
    commit(types.SET_LOADING_DIARY, true);
    
    return api(rootGetters['$_settings/offlineMode']).putDiary(diary.slug, diary).then(result => {
      commit(types.UPDATE_DIARY, { diary: result })
      commit(types.SET_LOADING_DIARY, false);

      return Promise.resolve(result)
    })
  }

  const handleDiaryNoteChannel = ({ commit }, noteWs) => {
    const date = DateTime.fromObject({ ordinal: noteWs.date_number, year: noteWs.year })
    const dateData = {
      weekNumber: date.weekNumber,
      ordinal: date.ordinal,
      year: date.year
    }

    const operationMapping = {
      CREATE: types.ADD_NOTE,
      UPDATE: types.UPDATE_NOTE,
      DELETE: types.DELETE_NOTE
    }

    const mutationType = operationMapping[noteWs.operation]

    if (mutationType == null) {
      throw new Error(`${noteWs.operation} operation is not implemented therefore it cannot be handled properly.`)
    }

    commit(mutationType, { 
      ...dateData, 
      note: noteWs,
      noteId: noteWs.id
    })
  }

  const scopeDiary = ({ commit, getters, dispatch }, { slug, scopeDate }) => {
    if (getters.diaries.length === 0) {
      Promise.reject('There are any diaries in user context.')
    }

    var diary = getters.diaries[0] || {}

    const idx = getters.diaries.findIndex(d => d.slug === slug)
    if (idx != -1) {
      diary = getters.diaries[idx]
    }

    commit(types.SCOPE_DIARY, { diary });

    const day = scopeDate != null ? DateTime.fromSQL(scopeDate) : DateTime.local();
    dispatch('scopeDay', { day, force: true }).then(() => {
      Promise.resolve(diary)
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
        const promises = [
          dispatch('loadWeekData', { weekNumber: day.weekNumber, year: day.year }),
          dispatch('loadWeekWeatherData', day.weekNumber)
        ]

        Promise.all(promises).then(() => {
          resolveCallback(day.toSQL())
        })
      } else {
        resolveCallback(day.toSQL())
      }
    })
  }

  const loadWeekData = ({ commit, getters, rootGetters, dispatch }, { weekNumber, year }) => {
    const week = DateTime.fromObject({ weekNumber })
    // if (getters.getDiaryWeek(weekNumber) == null) {
      
    const diarySlug = getters.scopedDiary.slug;
    const offlineMode = rootGetters['$_settings/offlineMode'];

    return api(offlineMode).getDays(diarySlug, {
      from: week.startOf('week').toFormat('MM/dd/yyyy'),
      to: week.endOf('week').toFormat('MM/dd/yyyy')
    }).then(days => {
      // commit(types.SET_SCOPED_DIARY_DAYS, { days });
      
      if (!offlineMode) {
        days.flatMap(d => {
          return d.notes.map(n => {
            return {
              ...n,
              date_number: d.date_number,
              year: d.year,
              diary_id: diarySlug
            }
          }) 
        }).forEach(note => {
          pouch.syncUpdateNote(note.id, note)
        })
      }

      return Promise.resolve(days)
    }).catch(_ => {
      // return dispatch('loadWeekData', { weekNumber, year })
      return []
    }).then(days => {
      commit(types.ADD_WEEK_TO_SCOPE, { weekNumber, year, days });
    })
    // }
  }

  const loadWeekWeatherData = ({ commit, getters, dispatch, rootGetters }) => {
    const cityName = 'kosice,sk';
    const offlineMode = rootGetters['$_settings/offlineMode']

    return WeatherPouchApi().getForecastData(cityName, getters.scopedDay.toSQLDate()).then(data => {
      const result = data.reduce((acc, cur) => {
        acc[cur._id] = cur;
        return acc;
      }, {})

      return result
    }).catch(_ => {
      if (offlineMode) {
        return Promise.reject();
      }

      return dispatch('synchronizeWeather').then(data => {
        WeatherPouchApi().storeWeatherData(data)
        return Promise.resolve(data)
      })
    }).then(result => {
      commit(types.SET_FORECAST_DATA, result)
      resolve(result)
    }).catch(_ => {
      // console.warn('Weather data are not loaded to database and server is not reachable.')
    })
  }

  const synchronizeWeather = ({ commit, getters }) => {
    return WeatherApiInstance.getForecastData('kosice,sk').then(weather => {
      const days = weather.list.reduce((acc, cur) => {
        const sqlDate = DateTime.fromMillis(cur.dt * 1000).toSQLDate();
        if (acc[sqlDate] == null) {
          acc[sqlDate] = [ cur ]
        } else {
          acc[sqlDate].push(cur)
        }
        
        return acc;
      }, {})
      
      const result = {};
      for (let d in days) {
        const idx = Math.floor(days[d].length / 2)
        result[d] = days[d][idx]
      }
      
      return Promise.resolve(result)
    })
  }

  const updateDayNote = ({ commit, getters, rootGetters }, { note, weekNumber, ordinal, year }) => {
    commit(types.SET_LOADING_DIARY, true);
    return api(rootGetters['$_settings/offlineMode']).updateNote(note.id, {
      ...note,
      date_number: ordinal,
      year
    }).then(result => {
      commit(types.UPDATE_NOTE, { weekNumber: weekNumber, ordinal, year, note: result })
      commit(types.SET_LOADING_DIARY, false);
      pouch.syncUpdateNote(result.id, { ...result, date_number: ordinal, year })

      return Promise.resolve(result)
    })
  }

  const addDayNote = ({ commit, getters, dispatch, rootGetters }, { note, weekNumber, ordinal, year }) => {
    const scopedDay = getters.scopedDay;

    commit(types.SET_LOADING_DIARY, true);

    return api(rootGetters['$_settings/offlineMode']).postNote(getters.scopedDiary.slug, {
      ...note,
      ordinal,
      year: scopedDay.year,
    }).then(result => {
      pouch.syncUpdateNote(result.id, { ...result, date_number: ordinal, year })
      commit(types.ADD_NOTE, { note: result, ordinal, weekNumber, year })
      return result
    }).catch(_ => {
      return null;
    }).then(result => {
      commit(types.SET_LOADING_DIARY, false);
      return Promise.resolve(result)
    })
  }

  const deleteDayNote = ({ commit, getters, rootGetters }, { noteId, weekNumber, year, ordinal }) => {
    commit(types.SET_LOADING_DIARY, true);
    return api(rootGetters['$_settings/offlineMode']).deleteNote(noteId).then(result => {
      commit(types.DELETE_NOTE, { weekNumber, ordinal, year, noteId })
    }).catch(_ => {
      return null      
    }).then(result => {
      commit(types.SET_LOADING_DIARY, false);
      return Promise.resolve(result)
    })
  }

  const synchronizeNotes = ({ commit, dispatch }) => {
    ChangePouchApi().getChanges(changes => {
      const operationMapping = {
        CREATE: 'addDayNote',
        UPDATE: 'updateDayNote',
        DELETE: 'deleteDayNote'
      }

      changes.forEach(change => {
        const note = change.payload;
        const date = DateTime.fromObject({ ordinal: note.date_number, year: note.year })

        dispatch(operationMapping[change.operation], {
          noteId: note.id,
          note: note,
          ordinal: note.date_number,
          weekNumber: date.weekNumber,
          year: note.year
        }).then(result => {
          ChangePouchApi().deleteChange(change._id)
        })
      })
    })
  }

  const flushDiaries = ({ commit }) => {
    commit(types.FLUSH_DIARY_MODULE_STATE);
  }

  return {
    initializeDiaries,
    synchronizeDiaries,
    createDiary,
    updateDiary,
    scopeDiary,
    handleDiaryNoteChannel,
    scopeDay,
    loadWeekData,
    loadWeekWeatherData,
    addDayNote,
    flushDiaries,
    updateDayNote,
    synchronizeNotes,
    deleteDayNote,
    synchronizeWeather
  }
}