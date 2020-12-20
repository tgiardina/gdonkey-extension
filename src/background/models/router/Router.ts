import { inject, injectable } from "inversify";
import minimatch from "minimatch";
import TYPES from "../../types";

export interface Route<T> {
  urls: string[];
  init: () => T;
}

interface Tab<T> {
  urls: string[];
  instance: T;
}

const isMatch = (url: string, urls: string[]): boolean => {
  for (const urlRegex of urls) {
    if (minimatch(url, urlRegex)) return true;
  }
  return false;
};

@injectable()
export default class Router<T> {
  private tabs: Tab<T>[];

  constructor(@inject(TYPES.Casinos) private routes: Route<T>[]) {
    this.tabs = [];
  }

  public connect(tabId: number, url: string): T {
    if (!this.tabs[tabId] || !isMatch(url, this.tabs[tabId].urls)) {
      this.initTab(tabId, url);
    } 
    return this.tabs[tabId]?.instance;    
  }

  public disconnect(tabId: number): void {
    delete this.tabs[tabId];
  }

  private initTab(tabId: number, url: string): void {
    let matchingRoute;
    for (const route of this.routes) {
      if (isMatch(url, route.urls)) {
        matchingRoute = route;
        break;
      }
    }
    if (matchingRoute)
      this.tabs[tabId] = {
        urls: matchingRoute.urls,
        instance: matchingRoute.init(),
      };
  }
}
