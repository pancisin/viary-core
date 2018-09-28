<template>
  <div class="diary-controls">
    <div class="container pY-10 d-flex jc-sb">
      <button 
        class="btn" 
        :class="`btn-outline-${themeClass}`"
        @click="manipulateScope(-1)">
        <span class="lnr lnr-chevron-left"></span>
      </button>

      <button
        class="btn"
        :class="`btn-outline-${themeClass}`"
        @click="resetScope">
        <i class="fa fa-bullseye"></i>
      </button>

      <button 
        class="btn" 
        :class="`btn-outline-${themeClass}`"
        @click="manipulateScope(1)">
          <span class="lnr lnr-chevron-right"></span>
      </button>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { DateTime } from 'luxon';
import { colorLightness } from '@/utils';

export default {
  data () {
    return {
      lightTheme: false
    }
  },
  watch: {
    theme (newVal) {
      this.$el.style.background = newVal.color
      this.lightTheme = colorLightness(newVal.color) > 150;
    }
  },
  computed: {
    ...mapGetters('$_diary', ['scopedDay']),
    ...mapGetters('$_settings', ['theme']),
    themeClass () {
      return this.lightTheme ? 'dark' : 'light'
    } 
  },
  methods: {
    ...mapActions('$_diary', ['scopeDay', 'updateScopedDay']),
    manipulateScope(diff) {
      this.scopeDay({ day: this.scopedDay.plus({ weeks: diff }) })
    },
    resetScope() {
      this.scopeDay({ day: DateTime.local() })
    }
  }
}
</script>
