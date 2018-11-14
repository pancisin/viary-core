export default ({ eventBus }) => {
  return {
    props: {
      to: {
        type: String,
        required: true
      }
    },
    render (h) {
      return h('a', {
        on: {
          click: this.navigate
        },
        attrs: {
          // href: this.to
        }
      }, this.$slots.default)
    },
    methods: {  
      navigate(evt) {
        evt.preventDefault();  
        this.$navigator.navigate(this.to)
      }
    }
  }
}
