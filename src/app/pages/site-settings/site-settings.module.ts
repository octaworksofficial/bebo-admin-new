import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  NbCardModule,
  NbButtonModule,
  NbInputModule,
  NbIconModule,
  NbSpinnerModule,
} from '@nebular/theme';

import { SiteSettingsRoutingModule } from './site-settings-routing.module';
import { SiteSettingsComponent } from './site-settings.component';

@NgModule({
  declarations: [SiteSettingsComponent],
  imports: [
    CommonModule,
    FormsModule,
    SiteSettingsRoutingModule,
    NbCardModule,
    NbButtonModule,
    NbInputModule,
    NbIconModule,
    NbSpinnerModule,
  ],
})
export class SiteSettingsModule {}
