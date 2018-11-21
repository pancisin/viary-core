import { normalizePath } from '@/utils';

export default class Route {

  constructor (route) {
    this.name = route.name;
    this.path = normalizePath(route.path);
    this.component = route.component;

    this.children = route.children.map(c => new Route(c)) || [];
  }
}