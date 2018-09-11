<template>
  <form @submit.prevent="submit">
    <div class="form-group">
      <label class="text-normal text-dark">Email</label>
      <input
        v-model.trim="user.email"
        type="email"
        class="form-control"
        placeholder="john@doe.com">
    </div>
    <div class="form-group">
      <label class="text-normal text-dark">First name</label>
      <input
        v-model.trim="user.first_name"
        type="text"
        class="form-control"
        placeholder="John">
    </div>
    <div class="form-group">
      <label class="text-normal text-dark">Last name</label>
      <input
        v-model.trim="user.last_name"
        type="text"
        class="form-control"
        placeholder="Doe">
    </div>
    <div class="form-group">
      <label class="text-normal text-dark">Password</label>
      <input
        v-model.trim="user.password"
        type="password"
        class="form-control"
        placeholder="Password">
    </div>

    <router-link :to="{ name: 'signin' }">
      Already have account ?
    </router-link>

    <div class="form-group text-right">
      <button class="btn btn-primary">Sign up</button>
    </div>
  </form>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  data () {
    return {
      user: {
        email: '',
        first_name: '',
        last_name: '',
        password: ''
      }
    };
  },
  methods: {
    ...mapActions('$_auth', ['register']),
    submit () {
      this.register(this.user).then(() => {
        this.$router.replace({ name: 'home' });
      })
    }
  }
};
</script>
