export default ({ eventBus }) => {
  return {
    props: {
      to: {
        type: [String, Number, Object],
        required: true
      }
    },
    render (h) {
      return h('a', {
        on: {
          click: this.navigate
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
