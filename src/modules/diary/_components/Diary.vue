<template>
  <div class="diary" v-loading="loadingDiary">
    <menubar-slot>
      <span v-if="synchronizationInProgress">
        <span class="lnr lnr-sync fsz-xl lnr-spin"></span>
      </span>
      <span v-else>
        {{ scopedDay.toFormat('W | MMMM yyyy') }}
      </span>
    </menubar-slot>

    <diary-week :days="weekDays(7)" />
    <diary-controls />
  </div>
</template>

<script>
import DiaryControls from './DiaryControls';
import DiaryWeek from './DiaryWeek';

import { mapGetters } from 'vuex';
import { Loading } from '@/directives';

import MenubarSlot from '@/components/MenubarSlot';

export default {
  components: {
    DiaryControls,
    DiaryWeek,
    MenubarSlot
  },
  directives: {
    Loading
  },
  computed: {
    ...mapGetters('$_diary', ['loadingDiary', 'weekDays', 'synchronizationInProgress', 'scopedDay'])

  }
}
</script>
