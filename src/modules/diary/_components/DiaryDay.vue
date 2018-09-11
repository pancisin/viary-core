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

      <textarea 
        rows="3" 
        class="diary-day-content flex-grow-1 text-secondary" 
        v-model="day.content" 
        @input="dayUpdate">
      </textarea>
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
    },
    weather () {
      const opts = ['cloud', 'sun', 'drop']
      return opts[Math.floor(Math.random() * opts.length)];
    }
  },
  methods: {
    ...mapActions('$_diary', ['scopeDay', 'updateScopedDay']),

    dayUpdate: debounce(function(e) {
      this.updateScopedDay(e.target.value)
    }, 1000),

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
