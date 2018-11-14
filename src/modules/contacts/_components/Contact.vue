<template>
  <a class="contact" @click="selectContact">
    <div class="contact-name">
      {{ displayName }}
    </div>

    <small class="text-muted">
      tel.: {{ contact.meta.phone }}
    </small>  
  </a>
</template>

<script>
import { mapActions } from 'vuex';
import { formatDisplayName } from '../utils';

export default {
  props: {
    contact: {
      type: Object,
      required: true
    }   
  },
  computed: {
    displayName() {
      return formatDisplayName(this.contact.name)
    }
  },
  methods: {
    ...mapActions('$_contacts', ['scopeContact']),
    selectContact () {
      this.scopeContact(this.contact)
      this.$navigator.navigate('contacts/contact')
    }
  }
}
</script>

<style lang="scss">
.contact {
  display: block;

  &:first-child {
    margin-bottom: 10px;
  }

  & ~ .contact {
    padding-top: 10px;
    margin-top: 10px;
    // margin-bottom: 10px;
    border-top: 1px solid #eee;
  }

  &:last-child {
    margin-bottom: 0;
  }

  .contact-name {

  }
}
</style>
