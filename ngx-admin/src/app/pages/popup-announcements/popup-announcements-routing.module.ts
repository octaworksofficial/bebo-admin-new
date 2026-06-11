import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PopupAnnouncementsComponent } from './popup-announcements.component';
import { PopupListComponent } from './popup-list/popup-list.component';
import { PopupFormComponent } from './popup-form/popup-form.component';

const routes: Routes = [{
  path: '',
  component: PopupAnnouncementsComponent,
  children: [
    {
      path: 'list',
      component: PopupListComponent,
    },
    {
      path: 'create',
      component: PopupFormComponent,
    },
    {
      path: 'edit/:id',
      component: PopupFormComponent,
    },
    {
      path: '',
      redirectTo: 'list',
      pathMatch: 'full',
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PopupAnnouncementsRoutingModule {
}
