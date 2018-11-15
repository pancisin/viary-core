import { guid } from '@/utils';

import NavigatorView from './_components/navigatorView';
import NavigatorLink from './_components/navigatorLink.js';

import { normalizePath } from '@/utils';

const DiaryRouterPlugin = {
  install(Vue, options) {
    var routes = options.routes || [];
    const basePath = options.basePath || '';

    var location = '/';

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

    const getLocation = _ => {
      return location;
      // return normalizePath(window.location.pathname.replace(basePath, ''));
    }

    const eventBus = new Vue;
    const componentOptions = {
      eventBus,
      getRoutes,
      getLocation
    }

    Vue.component('navigator-view', NavigatorView(componentOptions))
    Vue.component('navigator-link', NavigatorLink(componentOptions))

    const findRoute = to => routes.map(r => {
      if (r.children && r.children.length > 0) {
        return r.children
      }

      return [ r ]
    }).reduce((acc, cur) => {
      cur.forEach(r => {
        acc.push(r)
      })

      return acc;
    }, []).find(r => r.path === normalizePath(to));
    
    const navigator = {
      currentRoute: findRoute(getLocation()),

      get currentPath () {
        return this.currentRoute.path;
      },

      get route () {
        return this.currentRoute;
      },

      injectRoutes: (inst, rts) => {
        const idx = routes.findIndex(r => r.component.name === inst.$options.name)

        if (idx !== -1) {
          const parent = routes[idx];
          const children = rts.map(r => {
            return {
              ...r,
              path: normalizePath(parent.path, r.path),
              relativePath: r.path,
              nested: true
            }
          })

          routes.splice(idx, 1, {
            ...parent,
            children
          })
        }
      },

      navigate: to => {
        switch (typeof to) {
          case "string":
            // window.history.pushState(null, null, '/' + normalizePath(basePath, to)); 
            eventBus.$emit('navigate', to)
            Vue.set(navigator, 'currentRoute', findRoute(to))
            location = to;
            break;
          case "number":
            if (to === -1) {
              window.history.back();
            }
            break;
          case "object":
            break;
        }
      } 
    }

    // window.addEventListener('popstate', () => {  
    //   navigator.navigate(getLocation())
    // });

    Vue.prototype.$navigator = navigator;
  }
};

export default DiaryRouterPlugin;
