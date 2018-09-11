<script>
export default {
  props: {
    tag: {
      type: String,
      default () {
        return 'div';
      }
    }
  },
  data () {
    return {
      show: false
    };
  },
  render (h) {
    return h(this.tag || 'div', {
      class: 'dropdown',
      directives: [
        {
          name: 'click-outside',
          value: () => {
            this.show = false;
          }
        }
      ]
    }, [
      h('a', {
        class: 'dropdown-toggle no-after peers fxw-nw ai-c lh-1',
        on: {
          click: () => {
            this.show = !this.show;
          }
        }
      }, this.$slots.link),
      h('transition', {
        props: {
          name: 'fade'
        }},
      [
        h('ul', {
          class: 'dropdown-menu fsz-sm',
          directives: [
            {
              name: 'show',
              value: this.show
            }
          ]
        },
        this.$slots.default)
      ])
    ]);
  }
};
</script>

<style>
ul.dropdown-menu {
  display: block;
  z-index: 500;
}
</style>
