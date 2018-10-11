<template>
  <div class="diary" v-loading="loadingDiary">
    <diary-info class="pY-10" />
    <diary-week :days="weekDays(7)" />
    <diary-controls />
  </div>
</template>

<script>
import DiaryControls from './DiaryControls';
import DiaryInfo from './DiaryInfo';
import DiaryWeek from './DiaryWeek';

import { mapGetters, mapActions } from 'vuex';

import { DiaryTransition } from '@/components/transitions';
import { Loading } from '@/directives';

require("easeplus-velocity/release/1.2/velocity.easeplus.min");

export default {
  components: {
    DiaryControls,
    DiaryInfo,
    DiaryTransition,
    DiaryWeek
  },
  directives: {
    Loading
  },
  computed: {
    ...mapGetters('$_diary', ['loadingDiary', 'weekDays', 'scopedDay'])
  }
}
</script>
