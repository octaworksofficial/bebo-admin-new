
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CouponsComponent } from './coupons.component';
import { CouponsListComponent } from './coupons-list/coupons-list.component';

const routes: Routes = [{
  path: '',
  component: CouponsComponent,
  children: [
    {
      path: '',
      component: CouponsListComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CouponsRoutingModule { }
