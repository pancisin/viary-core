<template>
  <div class="diary" v-loading="loadingDiary">
    <diary-info class="pY-10" />

    <!-- <diary-transition tag="div" class="diary-week pX-10 pB-10"> -->
      <div class="diary-week">
        <diary-day v-for="day in weekDays" :key="day.ts" :day="day" />
      </div>
    <!-- </diary-transition> -->

    <diary-controls :theme-color="themeColor" />
  </div>
</template>

<script>
import DiaryDay from './DiaryDay';
import DiaryControls from './DiaryControls';
import DiaryInfo from './DiaryInfo';

import { mapGetters } from 'vuex';

import { DiaryTransition } from '@/components/transitions';
import { Loading, ClickOutside } from '@/directives';

export default {
  props: {
    themeColor: {
      type: String,
      default() {
        return '#fff'
      }
    }
  },
  components: {
    DiaryDay,
    DiaryControls,
    DiaryInfo,
    DiaryTransition
  },
  directives: {
    Loading,
    ClickOutside
  },
  computed: {
    ...mapGetters('$_diary', ['loadingDiary', 'scopedDay', 'weekDays'])
  }
}
</script>
