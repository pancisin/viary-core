<template>
  <div class="contact-detail">
    <menubar-slot>
      <navigator-link to="contacts">
        <span class="lnr lnr-arrow-left fsz-xl"></span>
      </navigator-link>
    </menubar-slot>

    <h3>{{ displayName }}</h3>

    <ul class="list-unstyled">
      <li v-for="(value, metaKey) in contact.meta" :key="metaKey">
        {{ metaKey }} : {{ value   }}
      </li>
    </ul>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { formatDisplayName } from '../utils';

import MenubarSlot from '@/components/MenubarSlot';

export default {
  components: {
    MenubarSlot
  },
  computed: {
    ...mapGetters('$_contacts', {
      'contact': 'scopedContact'
    }),
    displayName () {
      return formatDisplayName(this.contact.name)
    }
  }
}
</script>
