<template>
  <div
    is="transition-group"
    class="toast-container"
    name="fade">

    <toast
      v-for="(toast, index) in toasts"
      :notification="toast"
      :key="index"
      @close-notification="removeToast" />
  </div>
</template>

<script>
import Toast from './_components/Toast';
import { mapGetters, mapActions } from 'vuex';

import store from './_store';
import * as ToastType from './toast.type';

const MODULE_NAMESPACE = '$_notifier';

import Vue from 'vue';

export default {
  name: 'NotificationContainer',
  components: {
    Toast
  },
  computed: {
    ...mapGetters(MODULE_NAMESPACE, ['toasts'])
  },
  created () {
    this.$store.registerModule(MODULE_NAMESPACE, store);

    const generateToast = (message, type) => {
      const notification = { message, type };
      this.$store.dispatch('$_notifier/addToast', notification);
    };

    Vue.prototype.$success = message => generateToast(message, ToastType.SUCCESS);
    Vue.prototype.$error = message => generateToast(message, ToastType.DANGER);
    Vue.prototype.$info = message => generateToast(message, ToastType.INFO);
    Vue.prototype.$warn = message => generateToast(message, ToastType.WARNING);

    Vue.prototype.$prompt = (message, agree, disagree) => {
      const notification = {
        message,
        type: ToastType.PROMPT,
        agree,
        disagree
      };

      this.$store.dispatch('$_notifier/addToast', notification);
    };

  },
  beforeDestroy () {
    this.$store.unregisterModule(MODULE_NAMESPACE);
  },
  methods: {
    ...mapActions(MODULE_NAMESPACE, [
      'removeToast'
    ])
  }
};
</script>

<style>
.toast-container {
  position: fixed;
  right: 10px;
  bottom: 10px;
  width: 350px;
  z-index: 9999;
}

@media only screen and (max-width: 320px) {
  .toast-container {
    max-width: 100%;
    right: 0;
    bottom: 0;
    width: 100%;
  }
}
</style>
