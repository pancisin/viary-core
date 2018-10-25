<template>
  <form @submit.prevent="submit" v-loading="loading">
    <div class="form-group">
      <label class="text-normal text-dark">Email</label>
      <input
        v-model.trim="user.email"
        type="email"
        class="form-control"
        :class="{ 'is-invalid' : hasError }"
        placeholder="john@doe.com">
    </div>
    <div class="form-group">
      <label class="text-normal text-dark">First name</label>
      <input
        v-model.trim="user.first_name"
        type="text"
        class="form-control"
        :class="{ 'is-invalid' : hasError }"
        placeholder="John">
    </div>
    <div class="form-group">
      <label class="text-normal text-dark">Last name</label>
      <input
        v-model.trim="user.last_name"
        type="text"
        class="form-control"
        :class="{ 'is-invalid' : hasError }"
        placeholder="Doe">
    </div>
    <div class="form-group">
      <label class="text-normal text-dark">Password</label>
      <input
        v-model.trim="user.password"
        type="password"
        class="form-control"
        :class="{ 'is-invalid' : hasError }"
        placeholder="Password">
    </div>

    <a @click="onsignin">
      Already have account ?
    </a>

    <div class="form-group text-right">
      <button class="btn btn-primary">Sign up</button>
    </div>
  </form>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { Loading } from '@/directives';

export default {
  props: {
    success: {
      type: Function,
      default () {
        return () => {}
      }
    },
    onsignin: {
      type: Function,
      default () {
        return () => {}
      }
    }
  },
  directives: {
    Loading
  },
  data () {
    return {
      user: {
        email: '',
        first_name: '',
        last_name: '',
        password: ''
      },
      hasError: false
    };
  },
  computed: {
    ...mapGetters('$_auth', ['loading'])
  },
  methods: {
    ...mapActions('$_auth', ['register']),
    submit () {
      this.register(this.user).then(() => {
        this.success();
      }).catch(_ => {
        this.hasError = true;
      })
    }
  }
};
</script>
