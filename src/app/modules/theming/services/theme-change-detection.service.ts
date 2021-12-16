import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Observable} from 'rxjs';

/**
 * Service to allow for components/services to listen for theme changes
 */
@Injectable({
  providedIn: 'root'
})
export class ThemeChangeDetectionService {

  /**
   * Subject that fires when the theme is changed
   * @private
   */
  private readonly _themeChanged = new BehaviorSubject<void>(null as any);

  /**
   * Dependency injection site
   */
  constructor() { }

  /**
   * Trigger a theme change event
   */
  changeTheme(): void {
    this._themeChanged.next();
  }

  /**
   * Listen for theme change events
   */
  listen(): Observable<void> {
    return this._themeChanged.asObservable();
  }
}
