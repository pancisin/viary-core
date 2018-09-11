<template>
  <div class="diary" v-loading="loadingDiary">
    <diary-info class="pY-10" />

    <!-- <diary-transition tag="div" class="diary-week pX-10 pB-10"> -->
      <div class="diary-week pB-10">
        <diary-day v-for="day in weekDays" :key="day.ts" :day="day" />
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

import { DiaryTransition } from '@/components/transitions'

export default {
  components: {
    DiaryDay,
    DiaryControls,
    DiaryInfo,
    DiaryTransition
  },
  computed: {
    ...mapGetters('$_diary', ['loadingDiary', 'scopedDay', 'weekDays'])
  }
}
</script>
