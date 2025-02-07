<template>
  <div class="row">
    <div 
      class="col-lg-3 d-none d-lg-flex jc-sb ai-fs pB-10 flex-column calendar-column c-white h-100vh"
      ref="calendarColumn">

      <transition name="fade" mode="out-in">
        <calendar v-if="diaryMode" />
        <div v-else></div>
      </transition>

      <!-- <img src="./_assets/img/viary_logo_1000_rounded.png" style="width:100%"> -->

      <a 
        class="position-relative c-white fw-300" 
        :href="theme.unsplashUrl"
        target="_blank">
        Photo by {{ theme.author }} at unsplash.com
      </a>
    </div>
    <div class="col-lg-9">
      <menu-bar class="pY-10" />

      <transition name="fade" mode="out-in">
        <contacts-module v-if="contactsMode" :baseUrl="baseUrl" />
        <diary v-else-if="!creatorMode" :theme-color="theme.color" />
        <diary-creator :dismissable="hasAnyDiary" v-else />
      </transition>
    </div>
  </div>
</template>

<script>
import Diary from './_components/Diary';
import DiaryCreator from './_components/DiaryCreator';
import Calendar from './_components/Calendar';
import MenuBar from './_components/MenuBar';

import store from './_store';
import SettingsModule from './_store/modules/Settings.module';

const MODULE_NAMESPACE = '$_diary';

import UnsplashApi from './_api/unsplash.api'
import { mapGetters, mapActions } from 'vuex'

import ErrorInterceptor from './_api/error.interceptor';

import Vue from 'vue';

import Prefs from './prefKeys';

import ContactsModule from '../contacts';

export default {
  name: 'DiaryContainer',
  props: {
    baseUrl: {
      type: String,
      default () {
        return ''
      }
    },
    offlineMode: {
      type: Boolean,
      default () {
        return false
      }
    }
  },
  components: {
    MenuBar,
    Diary,
    Calendar,
    DiaryCreator,
    ContactsModule
  },
  computed: {
    ...mapGetters('$_settings', ['theme', 'creatorMode', 'getPreference', 'contactsMode', 'diaryMode']),
    ...mapGetters('$_diary', ['hasAnyDiary', 'scopedDiary'])
  },
  watch: {
    offlineMode (newVal) {
      if (!newVal) {
        Promise.all([
          this.synchronizeDiaries(), 
          this.synchronizeNotes()
        ]).then(_ => {
          console.log('synchronization done')
        })
      }

      this.switchOfflineMode(newVal);
    }
  },
  created () {
    this.$store.registerModule(MODULE_NAMESPACE, store({ baseUrl: this.baseUrl }));
    this.$store.registerModule('$_settings', SettingsModule({ baseUrl: this.baseUrl }));
    Vue.http.interceptors.push(ErrorInterceptor(this.$store));
    this.$store.dispatch('$_settings/initializeApplication').then(() => {
      this.$watch('theme', newVal => {
        const el = this.$refs.calendarColumn;
        el.style.background = `url(${newVal.imageUrl})`
      }, {
        immediate: true
      })
    })

    this.$store.dispatch(`${MODULE_NAMESPACE}/initializeDiaries`).then(() => {
      var subscription = null;

      this.$watch('scopedDiary', diary => {
        if (subscription) {
          this.$wunsubscribe(subscription)
        }

        subscription = this.$wsubscribe(`/topic/${diary.slug}`, noteWs => {
          this.$store.dispatch(`${MODULE_NAMESPACE}/handleDiaryNoteChannel`, noteWs)
        })
      })

      this.$store.dispatch(`${MODULE_NAMESPACE}/scopeDiary`, {
        slug: this.getPreference(Prefs.SCOPED_DIARY)
      }).then(diary => {

      }).catch(err => {
        this.setCreatorMode()
      })
    });

    // UnsplashApi().getImage('sgpLdF0aSno', image => {
    // UnsplashApi().getImageOfDay(image => {
    //   const el = this.$refs.calendarColumn;
    //   el.style.background = `url(${image.urls.regular})`
    // })
  },
  beforeDestroy () {
    this.$store.unregisterModule(MODULE_NAMESPACE);
    this.$store.unregisterModule('$_settings');
  },
  methods: {
    ...mapActions('$_settings', ['setCreatorMode', 'switchOfflineMode']),
    ...mapActions('$_diary', ['synchronizeDiaries', 'synchronizeNotes'])
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