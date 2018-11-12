<template>
  <div>
    <div class="contacts-list">
      <contact 
        v-for="(contact, index) in contacts" 
        :key="index" 
        :contact="contact" />
    </div>

    <div class="text-center">
      <a @click="displayCreateContactModal = true">
        <i class="lnr lnr-plus-circle fsz-xl"></i>
      </a>
    </div>

    <modal :show.sync="displayCreateContactModal">
      <span slot="header">Create contact</span>
      <div slot="body">
        <create-contact-form />
      </div>
    </modal>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import Contact from './Contact';

import { Modal } from '@/components/elements';
import { CreateContactForm } from './forms';

export default {
  components: {
    Contact,
    Modal,
    CreateContactForm
  },
  data () {
    return {
      displayCreateContactModal: false
    }
  },
  computed: {
    ...mapGetters('$_contacts', [ 'contacts' ])
  },
  methods: {
    ...mapActions('$_settings', ['setDiaryMode'])
  }
}
</script>

<style lang="scss">
.contacts-list {
  // padding: 20px 0;
}
</style>
