<template>
  <div class="diary-controls">
    <div class="container pY-10 d-flex jc-sb">
      <button 
        class="btn btn-outline-light" 
        @click="manipulateScope(-1)">
        <span class="lnr lnr-chevron-left"></span>
      </button>

      <button
        class="btn btn-outline-light"
        @click="resetScope">
        <i class="fa fa-bullseye"></i>
      </button>

      <button 
        class="btn btn-outline-light" 
        @click="manipulateScope(1)">
          <span class="lnr lnr-chevron-right"></span>
      </button>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { DateTime } from 'luxon';

export default {
  mounted() {
    // this.resetScope();
  },
  computed: {
    ...mapGetters('$_diary', ['scopedDay']),
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
