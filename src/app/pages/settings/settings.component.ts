import { Component } from '@angular/core';

@Component({
  selector: 'ngx-settings',
  template: `
    <nb-card>
      <nb-card-header>
        <nb-tabset>
          <nb-tab tabTitle="Kredi Ayarları" tabIcon="credit-card-outline" [routerLink]="['credit']" routerLinkActive [active]="isActive('credit')">
          </nb-tab>
          <nb-tab tabTitle="Site Ayarları" tabIcon="globe-outline" [routerLink]="['site']" routerLinkActive [active]="isActive('site')">
          </nb-tab>
        </nb-tabset>
      </nb-card-header>
    </nb-card>
    <router-outlet></router-outlet>
  `,
  styles: [`
    :host ::ng-deep nb-card-header {
      padding: 0 1rem;
    }
    :host ::ng-deep nb-tabset .tabset {
      margin-bottom: 0;
    }
    :host ::ng-deep .tab {
      cursor: pointer;
    }
  `]
})
export class SettingsComponent {
  isActive(route: string): boolean {
    return window.location.href.includes(`/settings/${route}`);
  }
}
