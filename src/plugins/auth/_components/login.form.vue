<template>
  <form @submit.prevent="submit" v-loading="loading">
    <div class="form-group">
      <label class="text-normal text-dark">Email</label>
      <input
        v-model.trim="credentials.username"
        type="email"
        class="form-control"
        :class="{ 'is-invalid' : hasError }"
        placeholder="john@doe.com">
    </div>
    <div class="form-group">
      <label class="text-normal text-dark">Password</label>
      <input
        v-model.trim="credentials.password"
        type="password"
        class="form-control"
        :class="{ 'is-invalid' : hasError }"
        placeholder="Password">
      <div class="invalid-feedback">
        User credentials are invalid. Check your email and password, please.
      </div>
    </div>

    <a @click="onsignup">Haven't got accout yet ?</a>

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
import { Loading } from '@/directives';

export default {
  props: {
    success: {
      type: Function,
      default () {
        return () => {}
      }
    },
    onsignup: {
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
      remember: true,
      hasError: false
    };
  },
  directives: {
    Loading
  },
  methods: {
    ...mapActions('$_auth', ['login', 'loading']),
    submit () {
      this.login({
        credentials: this.credentials,
        remember: this.remember
      }).then(() => {
        this.success()
      }).catch(err => {
        if (err.error === 'invalid_grant') {
          this.credentials.password = '';
          this.hasError = true;
        }
      });
    }
  }
};
</script>
