import { normalizePath } from '@/utils';

export default ({ eventBus, getRoutes, getLocation }) => {
  return {
    props: {
      animated: {
        type: Boolean,
        default () {
          return false;
        }
      }
    },  
    data () {
      return {
        currentRoute: {}
      }
    },
    render (h) {
      const cmp = h(this.currentRoute.component, {
        props: {
          ...this.currentRoute.props
        }
      })

      
      return this.animated ? h('transition', { props: { 
        name: 'fade',
        mode: 'out-in' 
      }}, [ cmp ]) : cmp;
    },
    created () {
      eventBus.$on('navigate', this.navigateHandler)
      this.currentRoute = this.getRoute(getLocation())
    },
    methods: {
      getRoute (path) {
        return getRoutes(this).find(r => r.path === normalizePath(path));
      },
      navigateHandler (to) {
        const route = this.getRoute(to)
        if (route) {
          this.currentRoute = route
        }
      }
    },
    beforeDestroy () {
      eventBus.$off('navigate', this.navigateHandler)
    }
  }
}