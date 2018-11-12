<template>
  <div class="diary" v-loading="loadingDiary">
    <diary-week :days="weekDays(7)" />
    <diary-controls />
  </div>
</template>

<script>
import DiaryControls from './DiaryControls';
import DiaryWeek from './DiaryWeek';

import { mapGetters } from 'vuex';
import { Loading } from '@/directives';

export default {
  components: {
    DiaryControls,
    DiaryWeek
  },
  directives: {
    Loading
  },
  computed: {
    ...mapGetters('$_diary', ['loadingDiary', 'weekDays'])
  }
}
</script>
