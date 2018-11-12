<template>
  <contacts-list />
</template>

<script>
import ContactsList from './_components/ContactsList';
import store from './_store';

import { mapActions, mapGetters } from 'vuex';

const MODULE_NAMESPACE = '$_contacts';
export default {
  props: {
    baseUrl: {
      type: String,
      default () {
        return ''
      }
    }
  },
  components: {
    ContactsList
  },
  computed: {
    ...mapGetters('$_diary', ['scopedDiary'])
  },
  created () {
    this.$store.registerModule(MODULE_NAMESPACE, store({ baseUrl: this.baseUrl }));

    this.$watch('scopedDiary', newVal => {
      const diaryId = newVal.slug;
      this.$store.dispatch(`${MODULE_NAMESPACE}/initializeContactsList`, diaryId).then(_ => {

      })
    }, {
      immediate: true
    })
  },
  beforeDestroy () {
    this.$store.unregisterModule(MODULE_NAMESPACE);
  },
}
</script>
