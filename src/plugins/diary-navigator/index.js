import { guid } from '@/utils';

import NavigatorView from './_components/navigatorView';
import NavigatorLink from './_components/navigatorLink.js';

import Vue from 'vue';

import { normalizePath } from '@/utils';

const DiaryRouterPlugin = {
  install(Vue, options) {
    var routes = options.routes || [];

    routes = routes.map(r => {
      return {
        ...r,
        children: [],
        path: normalizePath(r.path)
      }
    })

    const getRoutes = inst => {
      const idx = routes.findIndex(r => r.component.name === inst.$parent.$options.name);
      return idx === -1 ? routes : routes[idx].children;
    }

    const eventBus = new Vue();
    Vue.component('navigator-view', NavigatorView({ routes, eventBus, getRoutes }))
    Vue.component('navigator-link', NavigatorLink({ eventBus }))

    const findRoute = to => {
      const flatRoutes = routes.map(r => {
        if (r.children && r.children.length > 0) {
          return r.children
        }

        return [ r ]
      }).reduce((acc, cur) => {
        cur.forEach(r => {
          acc.push(r)
        })
        return acc;
      }, [])

      return flatRoutes.find(r => r.path === normalizePath(to));
    }
    
    const pathName = normalizePath(window.location.pathname);
    const navigator = {
      currentRoute: findRoute(pathName),

      get currentPath () {
        return this.currentRoute.path;
      },

      get backOption () {
        return this.currentRoute.nested;
      },

      get route () {
        return this.currentRoute;
      },

      injectRoutes: (inst, rts) => {
        const idx = routes.findIndex(r => r.component.name === inst.$options.name)

        if (idx !== -1) {
          rts.map(r => {
            return {
              ...r,
              path: normalizePath(routes[idx].path, r.path),
              relativePath: r.path,
              nested: true
            }
          }).forEach(r => {
            const index = routes[idx].children.findIndex(c => c.path === r.path);

            if (index === -1) {
              routes[idx].children.push(r)
            }
          })
        }
      },

      navigate: to => {
        window.history.pushState(null, null, to); 
        // navigator.currentRoute = findRoute(to);
        Vue.set(navigator, 'currentRoute', findRoute(to))
        eventBus.$emit('navigate', to)
      } 
    }

    window.addEventListener('popstate', () => {  
      navigator.navigate(window.location.pathname)
    });

    Vue.prototype.$navigator = navigator;
  }
};

export default DiaryRouterPlugin;
