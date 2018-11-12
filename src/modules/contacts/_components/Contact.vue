<template>
  <div class="contact">
    <div class="contact-name">
      {{ displayName }}
    </div>

    <small class="text-muted">
      tel.: {{ contact.meta.phone }}
    </small>  
  </div>
</template>

<script>
export default {
  props: {
    contact: {
      type: Object,
      required: true
    }   
  },
  computed: {
    displayName() {
      const name = this.contact.name;
      return `${name.prefix || ''} ${name.firstName} ${name.lastName} ${name.suffix || ''}`
    }
  }
}
</script>

<style lang="scss">
.contact {

  &:first-child {
    margin-bottom: 10px;
  }

  & ~ .contact {
    padding-top: 10px;
    margin-bottom: 10px;
    border-top: 1px solid #eee;
  }

  &:last-child {
    margin-bottom: 0;
  }

  .contact-name {

  }
}
</style>
