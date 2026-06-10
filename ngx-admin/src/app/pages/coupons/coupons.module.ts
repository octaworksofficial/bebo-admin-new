
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { 
  NbCardModule, NbIconModule, NbInputModule, NbButtonModule, 
  NbSelectModule, NbToggleModule, NbDialogModule, NbSpinnerModule,
  NbTooltipModule
} from '@nebular/theme';

import { ThemeModule } from '../../@theme/theme.module';
import { CouponsRoutingModule } from './coupons-routing.module';
import { CouponsComponent } from './coupons.component';
import { CouponsListComponent } from './coupons-list/coupons-list.component';
import { CouponFormComponent } from './coupon-form/coupon-form.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ThemeModule,
    NbCardModule,
    NbIconModule,
    NbInputModule,
    NbButtonModule,
    NbSelectModule,
    NbToggleModule,
    NbSpinnerModule,
    NbTooltipModule,
    NbDialogModule.forChild(),
    CouponsRoutingModule,
  ],
  declarations: [
    CouponsComponent,
    CouponsListComponent,
    CouponFormComponent,
  ],
})
export class CouponsModule { }
