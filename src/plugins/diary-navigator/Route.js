import { normalizePath } from '@/utils';

export default class Route {

  constructor (route, options) {
    const parent = options && options.parent || {};

    this.name = route.name;
    this.path = normalizePath(parent.path, route.path);
    this.component = route.component;
    this.props = route.props || [];

    this.children = route.children && route.children.map(c => new Route(c)) || [];
  }

  equals = path => this.path === normalizePath(path);
  toArray = _ => this.children && this.children.length > 0 ? this.children : [ this ];
  addChild = (...routes) => {
    this.children = this.children.concat(routes);
  }
}