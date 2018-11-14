<template>
  <div class="contacts">
    <!-- <contacts-list /> -->

    <navigator-view />
  </div>
</template>

<script>
import ContactsList from './_components/ContactsList';
import ContactDetail from './_components/ContactDetail';
import store from './_store';

import { mapActions, mapGetters } from 'vuex';

const MODULE_NAMESPACE = '$_contacts';
export default {
  name: 'contacts-module',
  props: {
    baseUrl: {
      type: String,
      default () {
        return ''
      }
    }
  },
  components: {
    ContactsList,
    ContactDetail
  },
  computed: {
    ...mapGetters('$_diary', ['scopedDiary']),
    ...mapGetters('$_contacts', ['scopedContact'])
  },
  created () {
    this.$store.registerModule(MODULE_NAMESPACE, store({ baseUrl: this.baseUrl }));

    this.$watch('scopedDiary', newVal => {
      const diaryId = newVal.slug;

      if (diaryId) {
        this.$store.dispatch(`${MODULE_NAMESPACE}/initializeContactsList`, diaryId).then(_ => {
  
        })
      }
    }, {
      immediate: true
    })

    this.$navigator.injectRoutes(this, [
      {
        path: '/contact',
        name: 'contact-detail',
        component: ContactDetail
      },
      {
        path: '/',
        name: 'contacts-list',
        component: ContactsList
      }
    ])
  },
  beforeDestroy () {
    this.$store.unregisterModule(MODULE_NAMESPACE);
  },
}
</script>

<style lang="scss">
.contacts {
  height: calc(100vh - 50px);
  overflow: hidden;
}
</style>