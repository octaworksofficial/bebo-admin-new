import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  NbCardModule,
  NbButtonModule,
  NbInputModule,
  NbIconModule,
  NbToggleModule,
  NbSpinnerModule,
} from '@nebular/theme';
import { ImageCropperModule } from 'ngx-image-cropper';

import { ThemeModule } from '../../@theme/theme.module';
import { PopupAnnouncementsRoutingModule } from './popup-announcements-routing.module';
import { PopupAnnouncementsComponent } from './popup-announcements.component';
import { PopupListComponent } from './popup-list/popup-list.component';
import { PopupFormComponent } from './popup-form/popup-form.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NbCardModule,
    NbButtonModule,
    NbInputModule,
    NbIconModule,
    NbToggleModule,
    NbSpinnerModule,
    ImageCropperModule,
    ThemeModule,
    PopupAnnouncementsRoutingModule,
  ],
  declarations: [
    PopupAnnouncementsComponent,
    PopupListComponent,
    PopupFormComponent,
  ],
})
export class PopupAnnouncementsModule { }
