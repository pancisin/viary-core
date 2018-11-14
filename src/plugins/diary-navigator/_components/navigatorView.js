import { normalizePath } from '@/utils';

export default ({ eventBus, getRoutes }) => {
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
      this.currentRoute = this.getRoute(normalizePath(window.location.pathname))
    },
    methods: {
      getRoute (path) {
        const routes = getRoutes(this)
        const idx = routes.findIndex(r => r.path === normalizePath(path))
        return routes[idx]
      },
      navigateHandler (to) {
        const path = normalizePath(to)
        const route = this.getRoute(path)
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