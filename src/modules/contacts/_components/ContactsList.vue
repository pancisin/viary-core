<template>
  <div>
    <div class="contacts-info d-flex jc-sb ai-c">
      <a @click="setDiaryMode()">
        <i class="lnr lnr-cross fsz-xl"></i>
      </a>

      <a @click="displayCreateContactModal = true">
        <i class="lnr lnr-plus-circle fsz-xl"></i>
      </a>
    </div>

    <div class="contacts-list">
      <contact 
        v-for="(contact, index) in contacts" 
        :key="index" 
        :contact="contact" />
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
.contacts-info {
  height: 50px;
}

.contacts-list {
  padding: 20px 0;
}
</style>
