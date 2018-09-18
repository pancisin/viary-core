<template>
  <div>
    <slot v-if="authenticated" />
    <login-form v-else />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  computed: {
    ...mapGetters('$_auth', ['authenticated'])
  }
};
</script>

<style>
</style>
