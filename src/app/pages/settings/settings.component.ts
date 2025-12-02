import { Component } from '@angular/core';

@Component({
  selector: 'ngx-settings',
  template: `
    <nb-card>
      <nb-card-header>
        <h5 class="mb-0">Kredi Ayarları</h5>
      </nb-card-header>
    </nb-card>
    <router-outlet></router-outlet>
  `,
  styles: [`
    :host ::ng-deep nb-card-header {
      padding: 1rem;
    }
    :host ::ng-deep nb-card-header h5 {
      margin: 0;
    }
  `]
})
export class SettingsComponent {}
