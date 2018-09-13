<template>
  <div>
    <diary />
  </div>
</template>

<script>
import Diary from './_components/Diary';
import store from './_store';

const MODULE_NAMESPACE = '$_diary';

export default {
  name: 'DiaryContainer',
  props: {
    baseUrl: {
      type: String,
      default () {
        return ''
      }
    }
  },
  components: {
    Diary
  },
  created () {
    this.$store.registerModule(MODULE_NAMESPACE, store({ baseUrl: this.baseUrl }));
    this.$store.dispatch(`${MODULE_NAMESPACE}/initializeDiaries`).then(() => {
      this.$store.dispatch(`${MODULE_NAMESPACE}/scopeDiary`, {}).then(() => {

      }).catch(e => {
        console.warn(e)
        this.$router.push({ name: 'diary.create', props: { intro: true } })
      })
    });
  },
  beforeDestroy () {
    this.$store.unregisterModule(MODULE_NAMESPACE);
  }
};
</script>

<style lang="scss">
@import './_assets/scss/index.scss';
</style>