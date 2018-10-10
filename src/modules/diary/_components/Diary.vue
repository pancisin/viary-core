<template>
  <div class="diary" v-loading="loadingDiary">
    <diary-info class="pY-10" />

    <!-- <diary-transition tag="div" class="diary-week"> -->
      <div class="diary-week">
        <diary-day v-for="day in weekDays(7)" :key="day.ts" :day="day" />
      </div>
    <!-- </diary-transition> -->

    <diary-controls />
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
