<template>
  <div>
    <slot v-if="authenticated" />
    
    <div v-else class="p-10 d-flex ai-c" style="height: 100vh">
      <div class="col-md-8 col-lg-6 offset-md-2 offset-lg-3 bg-light bd p-10 bdrs-5">
        <login-form :onsignup="switchSignIn" v-if="signin" />
        <register-form :onsignin="switchSignIn" v-else />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  data () {
    return {
      signin: true
    }
  },
  computed: {
    ...mapGetters('$_auth', ['authenticated', 'loadingUser'])
  },
  methods: {
    switchSignIn() {
      this.signin = !this.signin
    }
  }
};
</script>
