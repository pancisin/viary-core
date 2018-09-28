<template>
  <div class="row">
    <div 
      class="col-lg-3 d-none d-lg-flex jc-sb ai-fs pB-10 flex-column calendar-column c-white"
      ref="calendarColumn"
      data-content="test">

      <calendar />

      <a class="position-relative c-white fw-300" :href="theme.unsplashUrl">Photo by {{ theme.author }} at unsplash.com</a>
    </div>
    <div class="col-lg-9">
      <diary :theme-color="theme.color" />
    </div>
  </div>
</template>

<script>
import Diary from './_components/Diary';
import store from './_store';
import SettingsModule from './_store/modules/Settings.module';

const MODULE_NAMESPACE = '$_diary';
import Calendar from './_components/Calendar'

import UnsplashApi from './_api/unsplash.api'
import { mapGetters } from 'vuex'

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
    Diary,
    Calendar
  },
  computed: {
    ...mapGetters('$_settings', ['theme'])
  },
  created () {
    this.$store.registerModule(MODULE_NAMESPACE, store({ baseUrl: this.baseUrl }));
    this.$store.dispatch(`${MODULE_NAMESPACE}/initializeDiaries`).then(() => {
      this.$store.dispatch(`${MODULE_NAMESPACE}/scopeDiary`, {}).then(() => {

      }).catch(() => {
        this.$router.push({ name: 'diary.create', props: { intro: true } })
      })
    });

    this.$store.registerModule('$_settings', SettingsModule({ baseUrl: this.baseUrl }));
    this.$store.dispatch('$_settings/initializeApplication').then(() => {
      const el = this.$refs.calendarColumn;
      el.style.background = `url(${this.theme.imageUrl})`
    })

    // UnsplashApi().getImage('sgpLdF0aSno', image => {
    // UnsplashApi().getImageOfDay(image => {
    //   this.themeColor = image.color;
    //   const el = this.$refs.calendarColumn;
    //   el.style.background = `url(${image.urls.regular})`
    // })
  },
  beforeDestroy () {
    this.$store.unregisterModule(MODULE_NAMESPACE);
  }
};
</script>

<style lang="scss">
@import './_assets/scss/index.scss';

.calendar-column {
  &:before {
    content: '';
    position: absolute;
    z-index: 0;
    top: 0;
    bottom: 0;
    right: 0;
    left: -100%;
    background: inherit;
    background-position: center;
    background-size: cover;
  }
}
</style>