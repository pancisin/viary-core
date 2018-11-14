<template>
  <div class="contact-detail">
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

export default {
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
