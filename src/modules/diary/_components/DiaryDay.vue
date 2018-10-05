<template>
   <div 
      class="diary-day d-flex flex-column"
      :class="{ 'diary-day-current' : isCurrent, 'diary-day-focused' : scopedDay.ts === day.ts }"
      @click="focusDayContent(day, $event)">

      <div class="diary-day-header">
        <span class="va-m">
          <span class="diary-day-header-date">
            {{ day.day }}
          </span>
          {{ day.weekdayLong }}
        </span>

        <span class="wi fsz-md float-right mT-5" :class="dayWeather(day)"></span>
      </div>

      <diary-day-note 
        v-for="(note, idx) in day.notes" 
        :key="idx" 
        :note="note" 
        :ts="day.toMillis()"
        :upcoming="upcomingNote.id === note.id" />

      <form class="form" @submit.prevent="submitDayNote">
        <input class="diary-day-content flex-grow-1 text-secondary" >
      </form>
    </div>
</template>

<script>
import debounce from 'debounce';
import { DateTime } from 'luxon';
import { mapGetters, mapActions } from 'vuex';
import { WeatherIconsMap } from '@/maps';
import DiaryDayNote from './DiaryDayNote';
import { sortNotesByTime } from '../utils';

export default {
  components: {
    DiaryDayNote
  },
  props: {
    day: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  computed: {
    ...mapGetters('$_diary', ['scopedDay']),
    isCurrent () {
      return this.day.startOf('day').toMillis() === DateTime.local().startOf('day').toMillis()
    },
    upcomingNote () {
      if (this.isCurrent) {
        return this.day.notes
          .filter(n => {
            if (n.time != null) {
              return DateTime.fromSQL(n.time) > DateTime.local()
            }
          })
          .sort(sortNotesByTime)[0]
      }

      return {
        id: null
      }
    }
  },
  methods: {
    ...mapActions('$_diary', ['scopeDay', 'updateScopedDay', 'addDayNote']),

    dayUpdate: debounce(function(e) {
      this.updateScopedDay(e.target.value)
    }, 1000),

    submitDayNote (e) {
      this.addDayNote({ 
        note: e.target[0].value, 
        weekNumber: this.day.weekNumber, 
        ordinal: this.day.ordinal,
        year: this.day.year }
      ).then(() => {
        e.target[0].value = ''
      })
    },

    focusDayContent (day, e) {
      this.scopeDay({ day });
      const el = e.target;
      if (!el.classList.contains('diary-day-content')) {
        const textAreas = e.target.getElementsByClassName('diary-day-content')
        if (textAreas.length > 0) {
          textAreas[0].focus();
        }
      }
    },

    dayWeather (day) {
      const idx = Math.floor(day.weatherData.length / 2)

      let data = day.weatherData[idx];
      let iconIdx = '';

      if (data != null) {
        const w = data.weather[0] || {}

        if (w.icon != null) {
          iconIdx = w.icon.toUpperCase()
        }
      }

      return WeatherIconsMap[iconIdx]
    }
  }
}
</script>
