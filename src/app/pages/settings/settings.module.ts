import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  NbCardModule, 
  NbButtonModule, 
  NbInputModule, 
  NbToggleModule, 
  NbIconModule,
  NbSpinnerModule,
} from '@nebular/theme';

import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './settings.component';
import { CreditSettingsComponent } from './credit-settings/credit-settings.component';

@NgModule({
  declarations: [
    SettingsComponent,
    CreditSettingsComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    SettingsRoutingModule,
    NbCardModule,
    NbButtonModule,
    NbInputModule,
    NbToggleModule,
    NbIconModule,
    NbSpinnerModule,
  ],
})
export class SettingsModule { }
