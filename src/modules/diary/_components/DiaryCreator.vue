<template>
  <div class="row p-10 d-flex ai-c" style="height: 100vh">
    <div class="col-md-8 col-lg-6 offset-md-2 offset-lg-3">
      <div class="text-right" v-if="dismissable">
        <a @click="setDiaryMode()">
          <i class="lnr lnr-cross fsz-xl"></i>
        </a>
      </div>

      <create-diary-form />
    </div>
  </div>
</template>

<script>
import { CreateDiaryForm } from './forms';
import { mapActions } from 'vuex';

export default {
  props: {
    dismissable: {
      type: Boolean,
      default () {
        return true;
      }
    }
  },
  components: {
    CreateDiaryForm
  },
  methods: {
    ...mapActions('$_settings', ['setDiaryMode'])
  }
}
</script>
