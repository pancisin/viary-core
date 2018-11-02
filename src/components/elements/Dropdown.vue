<script>
import { ClickOutside } from '@/directives';
import velocity from 'velocity-animate';
export default {
  props: {
    tag: {
      type: String,
      default () {
        return 'div';
      }
    }
  },
  directives: {
    ClickOutside
  },
  data () {
    return {
      show: false,
      dropdownMenuStyle: {}
    };
  },
  watch: {
    show(newVal) {
      if (newVal) {
        this.$nextTick(_ => {
          const width = 350;
          const el = this.$refs.dropdownMenu

          if (el == null) return 

          const boundary = el.getBoundingClientRect()

          this.dropdownMenuStyle = {
            width: boundary.right - (width + 15) < 0 ? `${boundary.width + boundary.x - 15}px` : 'auto',
            'min-width': boundary.right - (width + 15) < 0 ? 'auto' : `${width}px`
          }
        })
      }
    }
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
        on: {
          beforeEnter: el => {
            el.style.opacity = 0;
          },
          enter: (el, done) => {
            velocity(el, {
              opacity: 1
            }, {
              easing: [500, 20],
              duration: 150,
              complete: done
            })
          },
          leave: (el, done) => {
            velocity(el, {
              opacity: 0
            }, {
              easing: [500, 20],
              duration: 150,
              complete: done
            })
          }
        }
      },
      [
        h('ul', {
          class: 'dropdown-menu fsz-sm',
          directives: [
            {
              name: 'show',
              value: this.show
            }
          ],
          style: this.dropdownMenuStyle,
          ref: 'dropdownMenu'
        },
        this.$slots.default)
      ])
    ]);
  }
};
</script>
