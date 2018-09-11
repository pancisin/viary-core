<template>
  <div :class="className">
    <button
      type="button"
      class="close"
      @click="triggerClose">
      <i class="fa fa-times"/>
    </button>
    <!-- <strong v-if="notification.code">{{ $t(`${notification.code}.title`, { subject: notification.subject }) }}</strong> -->
    <p>
      {{ notification.message }}
      <!-- {{ $t(notification.code, { object: notification.target, subject: notification.subject }) }} -->
    </p>

    <div
      v-if="notification.type === ToastType.PROMPT"
      class="toast-buttons m-t-20 text-center">
      <a
        class="btn btn-primary"
        @click="selectOption(notification.agree)">Yes</a>
      <a
        class="btn btn-default"
        @click="selectOption(notification.disagree)">No</a>
    </div>
  </div>
</template>

<script>
import * as ToastType from '../toast.type';

export default {
  props: {
    notification: {
      type: Object,
      default () {
        return {};
      }
    }
  },
  computed: {
    ToastType () {
      return ToastType;
    },
    className () {
      const typeClass = this.notification.type === ToastType.PROMPT ? 'primary' : this.notification.type.toLowerCase();
      return `alert alert-${typeClass}`;
    }
  },
  methods: {
    triggerClose () {
      this.$emit('close-notification', this.notification);
    },
    selectOption (callback) {
      if (callback != null) {
        callback();
      }

      this.triggerClose();
    }
  }
};
</script>
