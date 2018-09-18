<template>
  <div class="diary-day-note">
    - {{ note.content }}
  </div>
</template>

<script>
export default {
  props: {
    note: {
      type: Object,
      required: true
    }
  }
}
</script>

<style>

</style>
