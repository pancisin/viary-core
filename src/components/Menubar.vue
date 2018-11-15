<script>
import Vue from 'vue';
export default {
  name: 'menu-bar',
  data () {
    return {
      defaultSlot: []
    }
  },
  render (h) {
    return h('div', { 
      class: 'menu-bar d-flex jc-sb ai-c' 
    }, [
      h('span', {}, this.defaultSlot),
      this.$slots.primary
    ])
  },
  created () {
    Vue.prototype.$menubar = this;

  },
  methods: {
    setDefaultSlot (slot) {
      this.defaultSlot = slot;
    }
  }
}
</script>

<style lang="scss">
.menu-bar {
  height: 50px;
}
</style>
