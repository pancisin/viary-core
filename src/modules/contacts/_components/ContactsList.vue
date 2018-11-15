<template>
  <div style="height: 100%">
    <menubar-slot>
      <a @click="displayCreateContactModal = true">
        <span class="lnr lnr-cross fsz-xl" style="transform: rotateZ(45deg)"></span>
      </a>
    </menubar-slot>

    <div class="contacts-list">
      <div  v-for="(contactsList, char) in contactGroups" :key="char" >
        <h3 class="mT-15">
          {{ char }}
        </h3>
        <contact v-for="(contact, idx) in contactsList" :key="idx" :contact="contact" />
      </div>
    </div>

    <!-- <div class="text-center mT-15">
      <a @click="displayCreateContactModal = true">
        <i class="lnr lnr-plus-circle fsz-xl"></i>
      </a>
    </div> -->

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

import MenubarSlot from '@/components/MenubarSlot';

export default {
  components: {
    Contact,
    Modal,
    CreateContactForm,
    MenubarSlot
  },
  data () {
    return {
      displayCreateContactModal: false
    }
  },
  computed: {
    ...mapGetters('$_contacts', [ 'contacts' ]),
    contactGroups () {
      return this.contacts.reduce((acc, cur) => {
        const sortChar = cur.name.lastName.charAt(0).toUpperCase()

        if (acc[sortChar] == null) {
          acc[sortChar] = []
        }

        acc[sortChar].push(cur)
        return acc;
      }, {})
    }
  }
}
</script>

<style lang="scss">
.contacts-list {
  height: calc(100vh - 100px);
  overflow-y: auto;
  padding-bottom: 10px;
}
</style>
