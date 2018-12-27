import { guid } from '@/utils';

import NavigatorView from './_components/navigatorView';
import NavigatorLink from './_components/navigatorLink.js';

// import { normalizePath } from '@/utils';

import Vue from 'vue';
import Route from './Route';

export default class Navigator {

  constructor (options) {
    this.routes = (options.routes || []).map(r => new Route(r))

    this.basePath = options.basePath || '';
    this.location = '/';
    this.eventBus = new Vue();

    this.currentRoute = this.findRoute(this.location);
    this.root = options.root;
  }
 
  findRoute = to => this.routes
    .map(r => r.toArray())
    .reduce((acc, cur) => {
      cur.forEach(r => {
        acc.push(r)
      })

      return acc;
    }, [])
    .find(r => r.equals(to));

  getRoutes = inst => {
    const idx = this.routes.findIndex(r => r.component.name === inst.$parent.$options.name);
    return idx === -1 ? this.routes : this.routes[idx].children;
  }

  getLocation = _ => {
    return this.location;
    // return normalizePath(window.location.pathname.replace(this.basePath, ''));
  }

  get currentPath () {
    return this.currentRoute.path;
  }

  get route () {
    return this.currentRoute;
  }

  injectRoutes = (inst, rts) => {
    const idx = this.routes.findIndex(r => r.component.name === inst.$options.name)

    if (idx !== -1) {
      const parent = this.routes[idx];
      const children = rts.map(r => new Route(r, { parent }))
      parent.addChild(...children);
    }
  }

  navigate = to => {
    // window.history.pushState(null, null, '/' + normalizePath(basePath, to)); 
    Vue.set(this, 'currentRoute', this.findRoute(to))
    this.eventBus.$emit('navigate', to)
    this.location = to;
  } 

  install(Vue) {
    const componentOptions ={
      eventBus: this.eventBus,
      getRoutes: this.getRoutes,
      getLocation: this.getLocation
    }

    Vue.component('navigator-view', NavigatorView(componentOptions))
    Vue.component('navigator-link', NavigatorLink(componentOptions))

    // window.addEventListener('popstate', () => {  
    //   navigator.navigate(getLocation())
    // });

    const _self = this;
    Vue.util.defineReactive(Vue.prototype, '$navigator', _self)
  }
};

