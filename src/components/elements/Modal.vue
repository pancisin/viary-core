<template>
  <transition name="fade">
    <div
      v-show="show"
      class="modal"
      role="dialog">
      <div
        v-click-outside="outside"
        :class="{ 'modal-lg' : large }"
        class="modal-dialog">
        <div class="modal-content bdrs-0">
          <div class="modal-header">
            <h5 class="modal-title">
              <slot name="header">Header</slot>
            </h5>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              @click="close">
              <span class="lnr lnr-cross"></span>
            </button>
          </div>
          <div class="modal-body">
            <slot name="body"/>
          </div>
          <!-- <div class="modal-footer">
            <slot name="footer"/>
          </div> -->
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    question: {
      type: Boolean,
      default () {
        return false;
      }
    },
    large: {
      type: Boolean,
      default: false
    },
    small: {
      type: Boolean,
      default () {
        return false;
      }
    },
    accept: {
      type: Function,
      default () {
        return () => {};
      }
    }
  },
  watch: {
    show (newVal) {
      document.body.classList.toggle('noscroll', newVal);
    },
    $route: function () {
      this.close();
    }
  },
  methods: {
    close () {
      this.$emit('update:show', false);
    },
    outside () {
      if (this.show) {
        this.close();
      }
    }
  }
};
</script>

<style lang="scss">
.modal {
  display: block;
  background: rgba(0, 0, 0, 0.4);
  overflow-y: auto !important;
}
</style>
