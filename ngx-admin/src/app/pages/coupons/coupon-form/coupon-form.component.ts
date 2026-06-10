
import { Component, Input, OnInit } from '@angular/core';
import { NbDialogRef, NbToastrService } from '@nebular/theme';
import { CouponsService, Coupon } from '../../../@core/services/coupons.service';
import { ProductsService } from '../../../@core/services/products.service';

@Component({
  selector: 'ngx-coupon-form',
  templateUrl: './coupon-form.component.html',
  styleUrls: ['./coupon-form.component.scss']
})
export class CouponFormComponent implements OnInit {
  @Input() isNew: boolean = true;
  @Input() couponData: Partial<Coupon> = {};

  products: any[] = [];
  loading = false;
  submitting = false;

  formData = {
    code: '',
    discountType: 'percentage',
    discountValue: 0,
    applicability: 'all',
    productId: null,
    maxUsagePerUser: 1,
    maxTotalUsage: null
  };

  constructor(
    protected ref: NbDialogRef<CouponFormComponent>,
    private couponsService: CouponsService,
    private productsService: ProductsService,
    private toastrService: NbToastrService
  ) {}

  ngOnInit() {
    this.loadProducts();
    if (!this.isNew && this.couponData) {
      this.formData = {
        code: this.couponData.code || '',
        discountType: this.couponData.discountType || 'percentage',
        discountValue: this.couponData.discountValue || 0,
        applicability: this.couponData.applicability || 'all',
        productId: this.couponData.productId || null,
        maxUsagePerUser: this.couponData.maxUsagePerUser || 1,
        maxTotalUsage: this.couponData.maxTotalUsage || null
      };
    }
  }

  loadProducts() {
    this.productsService.getProducts().subscribe(data => {
      this.products = data;
    });
  }

  generateRandomCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    this.formData.code = code;
  }

  cancel() {
    this.ref.close(false);
  }

  submit() {
    if (!this.formData.code) {
      this.toastrService.warning('Lütfen bir kupon kodu girin.', 'Uyarı');
      return;
    }
    if (this.formData.discountValue <= 0) {
      this.toastrService.warning('İndirim tutarı 0\'dan büyük olmalıdır.', 'Uyarı');
      return;
    }
    if (this.formData.applicability === 'product' && !this.formData.productId) {
      this.toastrService.warning('Lütfen bir ürün seçin.', 'Uyarı');
      return;
    }

    this.submitting = true;

    if (this.isNew) {
      this.couponsService.createCoupon(this.formData as any).subscribe({
        next: () => {
          this.toastrService.success('Kupon oluşturuldu.', 'Başarılı');
          this.ref.close(true);
        },
        error: (err) => {
          this.toastrService.danger(err.error?.error || 'Hata oluştu.', 'Hata');
          this.submitting = false;
        }
      });
    } else {
      this.couponsService.updateCoupon(this.couponData.id!, this.formData as any).subscribe({
        next: () => {
          this.toastrService.success('Kupon güncellendi.', 'Başarılı');
          this.ref.close(true);
        },
        error: (err) => {
          this.toastrService.danger(err.error?.error || 'Hata oluştu.', 'Hata');
          this.submitting = false;
        }
      });
    }
  }
}
