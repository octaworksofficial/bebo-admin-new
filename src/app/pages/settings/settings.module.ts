import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { 
  NbCardModule, 
  NbButtonModule, 
  NbInputModule, 
  NbToggleModule, 
  NbIconModule,
  NbSpinnerModule,
  NbTabsetModule,
} from '@nebular/theme';

import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './settings.component';
import { CreditSettingsComponent } from './credit-settings/credit-settings.component';
import { SiteSettingsComponent } from './site-settings/site-settings.component';

@NgModule({
  declarations: [
    SettingsComponent,
    CreditSettingsComponent,
    SiteSettingsComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    SettingsRoutingModule,
    NbCardModule,
    NbButtonModule,
    NbInputModule,
    NbToggleModule,
    NbIconModule,
    NbSpinnerModule,
    NbTabsetModule,
  ],
})
export class SettingsModule { }
