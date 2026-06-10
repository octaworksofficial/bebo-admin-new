
import { Component, OnInit } from '@angular/core';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { CouponsService, Coupon } from '../../../@core/services/coupons.service';
import { CouponFormComponent } from '../coupon-form/coupon-form.component';

@Component({
  selector: 'ngx-coupons-list',
  templateUrl: './coupons-list.component.html',
  styleUrls: ['./coupons-list.component.scss']
})
export class CouponsListComponent implements OnInit {
  coupons: Coupon[] = [];
  loading = false;

  constructor(
    private couponsService: CouponsService,
    private dialogService: NbDialogService,
    private toastrService: NbToastrService
  ) {}

  ngOnInit() {
    this.loadCoupons();
  }

  loadCoupons() {
    this.loading = true;
    this.couponsService.getCoupons().subscribe({
      next: (data) => {
        this.coupons = data;
        this.loading = false;
      },
      error: () => {
        this.toastrService.danger('Kuponlar yüklenirken bir hata oluştu.', 'Hata');
        this.loading = false;
      }
    });
  }

  openAddCouponDialog() {
    this.dialogService.open(CouponFormComponent, {
      context: {
        isNew: true
      }
    }).onClose.subscribe(result => {
      if (result) this.loadCoupons();
    });
  }

  openEditCouponDialog(coupon: Coupon) {
    this.dialogService.open(CouponFormComponent, {
      context: {
        isNew: false,
        couponData: { ...coupon }
      }
    }).onClose.subscribe(result => {
      if (result) this.loadCoupons();
    });
  }

  deleteCoupon(id: number) {
    if(confirm('Bu kuponu silmek istediğinize emin misiniz?')) {
      this.couponsService.deleteCoupon(id).subscribe({
        next: () => {
          this.toastrService.success('Kupon başarıyla silindi.', 'Başarılı');
          this.loadCoupons();
        },
        error: () => this.toastrService.danger('Kupon silinirken hata oluştu.', 'Hata')
      });
    }
  }

  toggleActive(coupon: Coupon, event: any) {
    this.couponsService.updateCoupon(coupon.id!, { isActive: event }).subscribe({
      next: () => {
        coupon.isActive = event;
        this.toastrService.success('Kupon durumu güncellendi.', 'Başarılı');
      },
      error: () => {
        this.toastrService.danger('Durum güncellenemedi.', 'Hata');
        this.loadCoupons(); // revert
      }
    });
  }
}
