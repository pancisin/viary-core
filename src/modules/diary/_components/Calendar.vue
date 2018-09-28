<template>
  <div class="calendar">
    <div class="calendar-header">
      <a class="btn btn-link" @click="manipulateScope(-1)">
        <i class="lnr lnr-arrow-left"></i>
      </a>
      <span>
        {{ scopedDay.toFormat('MMMM yyyy') }}
      </span>
      <a class="btn btn-link" @click="manipulateScope(1)">
        <i class="lnr lnr-arrow-right"></i>
      </a>
    </div>

    <table class="calendar-table text-center">
      <thead>
        <tr>
          <th v-for="(weekday, index) in weekdays" :key="index">
            <span v-text="weekday"></span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(week, row) in monthWeeks" :key="row">
          <td v-for="(day, column) in week" 
            :key="column" 
            :class="{ 
              'current' : scopedDay.ts == day.ts, 
              'disabled' : day.month != scopedDay.month
            }">

            <a @click="scopeDay({ day })"> 
              {{ day.day }}
            </a>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { DateTime, Info } from 'luxon'
import { mapGetters, mapActions } from 'vuex'
export default {
  props: {
    events: {
      type: Array,
      default () {
        return [];
      }
    },
    editable: Boolean
  },
  data: function () {
    return {
      weeks: [],
      focusDate: {}
    };
  },
  computed: {
    ...mapGetters('$_diary', ['monthDays', 'scopedDay']),
    weekdays () {
      return Info.weekdays('short');
    },
    monthWeeks () {
      const firstWeekIdx = this.monthDays[0].weekNumber;
      return this.monthDays.reduce((acc, cur) => {
        var weekIdx = cur.weekNumber - firstWeekIdx;

        if (acc[weekIdx] == null) {
          acc[weekIdx] = []
        }

        acc[weekIdx].push(cur)
        return acc
      }, [])
    }
  },
  methods: {
    ...mapActions('$_diary', ['scopeDay']),
    manipulateScope(diff) {
      this.scopeDay({ day: this.scopedDay.plus({ months: diff }) })
    },
    selectDate (day) {
      this.$emit('selectDate', day.timestamp);
    } 
  }
};
</script>
