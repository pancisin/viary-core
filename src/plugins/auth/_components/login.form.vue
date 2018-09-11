<template>
  <form @submit.prevent="submit">
    <div class="form-group">
      <label class="text-normal text-dark">Email</label>
      <input
        v-model.trim="credentials.username"
        type="email"
        class="form-control"
        placeholder="john@doe.com">
    </div>
    <div class="form-group">
      <label class="text-normal text-dark">Password</label>
      <input
        v-model.trim="credentials.password"
        type="password"
        class="form-control"
        placeholder="Password">
    </div>

    <router-link :to="{ name: 'signup' }">
      Haven't got account yet ?
    </router-link>

    <div class="form-group">
      <div class="peers ai-c jc-sb fxw-nw">
        <div class="peer">
          <div class="checkbox checkbox-circle checkbox-info peers ai-c">
            <input
              id="inputCall1"
              v-model="remember"
              type="checkbox"
              name="inputCheckboxesCall"
              class="peer">
            <label
              for="inputCall1"
              class="js-sb ai-c">
              <span class="peer peer-greed">Remember Me</span>
            </label>
          </div>
        </div>
        <div class="peer">
          <button class="btn btn-outline-primary">Login</button>
        </div>
      </div>
    </div>
  </form>
</template>

<script>
import { mapActions } from 'vuex';
export default {
  props: {
    success: {
      type: Function,
      default () {
        return () => {}
      }
    }
  },
  data () {
    return {
      credentials: {
        username: '',
        password: ''
      },
      remember: true
    };
  },
  methods: {
    ...mapActions('$_auth', ['login']),
    submit () {
      const ret = this.login({
        credentials: this.credentials,
        remember: this.remember
      }).then(() => {
        this.success()
        // this.$router.replace({ name: 'home' });
      });
    }
  }
};
</script>
