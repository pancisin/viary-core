<script>
export default {
  props: {
    routerLinkTo: {
      type: Object | String,
      required: false,
      default () {
        return null;
      }
    }
  },
  render (h) {
    return h('li', {

    }, [
      h('a', {
        class: 'd-b td-n pY-15 pX-20 bgcH-grey-100 c-grey-700',
        on: {
          click: e => {
            if (this.routerLinkTo != null) {
              this.$router.push(this.routerLinkTo);
            } else {
              this.$emit('click', e);
            }
          }
        }
      }, this.$slots.default)
    ]);
  }
};
</script>
