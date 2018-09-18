<template>
   <div 
      class="diary-day d-flex flex-column"
      :class="{ 'diary-day-current' : day.startOf('day').toMillis() === DateTime.local().startOf('day').toMillis(), 'diary-day-focused' : scopedDay.ts === day.ts }"
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

      <div v-for="(note, idx) in day.notes" :key="idx">
        - {{ note.content }}
      </div>

      <form class="form" @submit.prevent="submitDayNote">
        <input 
          class="diary-day-content flex-grow-1 text-secondary" >
          <!-- v-model="day.content"  -->
          <!-- @input="dayUpdate"> -->
        <button type="submit" class="btn btn-link">
          send
          <!-- <i class="lnr lnr-"></i> -->
        </button>
      </form>
    </div>
</template>

<script>
import debounce from 'debounce';
import { DateTime } from 'luxon';
import { mapGetters, mapActions } from 'vuex';
import { WeatherIconsMap } from '@/maps';

export default {
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
    DateTime() {
      return DateTime;
    }
  },
  methods: {
    ...mapActions('$_diary', ['scopeDay', 'updateScopedDay', 'addDayNote']),

    dayUpdate: debounce(function(e) {
      this.updateScopedDay(e.target.value)
    }, 1000),

    submitDayNote (e) {
      // this.day.notes.push({
      //   content: e.target[0].value
      // })
      // console.log(this.day.notes)
      // e.target[0].value = ''

      this.addDayNote(e.target[0].value).then(() => {
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
