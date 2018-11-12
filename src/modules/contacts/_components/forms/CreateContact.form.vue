<template>
  <form @submit.prevent="postContact" class="form">
    <div class="form-group">
      <label>First name</label>
      <input class="form-control" v-model="contact.name.firstName">
    </div>

    <div class="form-group">
      <label>Last name</label>
      <input class="form-control" v-model="contact.name.lastName">
    </div>

    <div class="form-group">
      <label>Phone number</label>
      <input class="form-control" v-model="contact.meta.phone">
    </div>

    <button class="btn btn-default" type="submit">create</button>
  </form>
</template>

<script>
import { mapActions } from 'vuex';
export default {
  data () {
    return {
      contact: {
        name: { },
        meta: { }
      }
    }
  },
  methods: {
    ...mapActions('$_contacts', [ 'createContact' ]),
    postContact () {
      this.createContact(this.contact);
    }
  }
}
</script>

<style>

</style>
