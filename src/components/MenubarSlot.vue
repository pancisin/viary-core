<script>
export default {
  render (h) {
    this.$menubar.setDefaultSlot(this.$slots.default)
  },
  // beforeDestroy () {
    // this.$menubar.setDefaultSlot([]);
  // }
}
</script>
