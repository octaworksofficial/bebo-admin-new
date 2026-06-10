const fs = require('fs');
const path = require('path');

const coreDir = path.join(__dirname, 'ngx-admin', 'src', 'app', '@core', 'services');
const pagesDir = path.join(__dirname, 'ngx-admin', 'src', 'app', 'pages');
const couponsDir = path.join(pagesDir, 'coupons');
const listDir = path.join(couponsDir, 'coupons-list');
const formDir = path.join(couponsDir, 'coupon-form');

// Create directories
[couponsDir, listDir, formDir].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// 1. Service
fs.writeFileSync(path.join(coreDir, 'coupons.service.ts'), `
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Coupon {
  id?: number;
  code: string;
  discountType: 'percentage' | 'flat';
  discountValue: number;
  applicability: 'all' | 'product';
  productId?: number;
  productName?: string;
  createdAt?: Date;
  isActive?: boolean;
  usageCount?: number;
}

@Injectable({
  providedIn: 'root'
})
export class CouponsService {
  private apiUrl = environment.apiUrl + '/api/coupons';

  constructor(private http: HttpClient) {}

  getCoupons(): Observable<Coupon[]> {
    return this.http.get<Coupon[]>(this.apiUrl);
  }

  createCoupon(coupon: Coupon): Observable<{success: boolean, data: Coupon}> {
    return this.http.post<{success: boolean, data: Coupon}>(this.apiUrl, coupon);
  }

  updateCoupon(id: number, coupon: Partial<Coupon>): Observable<{success: boolean, data: Coupon}> {
    return this.http.put<{success: boolean, data: Coupon}>(\`\${this.apiUrl}/\${id}\`, coupon);
  }

  deleteCoupon(id: number): Observable<{success: boolean, message: string}> {
    return this.http.delete<{success: boolean, message: string}>(\`\${this.apiUrl}/\${id}\`);
  }
}
`);

// 2. coupons.component.ts
fs.writeFileSync(path.join(couponsDir, 'coupons.component.ts'), `
import { Component } from '@angular/core';

@Component({
  selector: 'ngx-coupons',
  template: \`<router-outlet></router-outlet>\`,
})
export class CouponsComponent {}
`);

// 3. coupons-routing.module.ts
fs.writeFileSync(path.join(couponsDir, 'coupons-routing.module.ts'), `
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
`);

// 4. coupons.module.ts
fs.writeFileSync(path.join(couponsDir, 'coupons.module.ts'), `
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
`);

// 5. coupons-list component
fs.writeFileSync(path.join(listDir, 'coupons-list.component.ts'), `
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
`);

fs.writeFileSync(path.join(listDir, 'coupons-list.component.html'), `
<nb-card [nbSpinner]="loading">
  <nb-card-header class="d-flex justify-content-between align-items-center">
    <span>Kuponlar & İndirimler</span>
    <button nbButton status="primary" size="small" (click)="openAddCouponDialog()">
      <nb-icon icon="plus-outline"></nb-icon> Yeni Kupon
    </button>
  </nb-card-header>

  <nb-card-body>
    <div class="table-responsive">
      <table class="table table-striped">
        <thead>
          <tr>
            <th>Durum</th>
            <th>Kupon Kodu</th>
            <th>İndirim</th>
            <th>Uygulanabilirlik</th>
            <th>Kullanım</th>
            <th>Oluşturulma</th>
            <th>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let coupon of coupons">
            <td>
              <nb-toggle [checked]="coupon.isActive" (checkedChange)="toggleActive(coupon, $event)"></nb-toggle>
            </td>
            <td><strong>{{ coupon.code }}</strong></td>
            <td>
              {{ coupon.discountValue }}
              {{ coupon.discountType === 'percentage' ? '%' : '₺' }}
            </td>
            <td>
              <span *ngIf="coupon.applicability === 'all'" class="badge badge-success">Tüm Ürünler</span>
              <span *ngIf="coupon.applicability === 'product'" class="badge badge-info" [nbTooltip]="coupon.productName || ''">
                Ürüne Özel
              </span>
            </td>
            <td>{{ coupon.usageCount }} kez</td>
            <td>{{ coupon.createdAt | date:'shortDate' }}</td>
            <td>
              <button nbButton size="tiny" status="info" class="mr-2" (click)="openEditCouponDialog(coupon)">
                <nb-icon icon="edit-outline"></nb-icon>
              </button>
              <button nbButton size="tiny" status="danger" (click)="deleteCoupon(coupon.id)">
                <nb-icon icon="trash-outline"></nb-icon>
              </button>
            </td>
          </tr>
          <tr *ngIf="coupons.length === 0 && !loading">
            <td colspan="7" class="text-center text-muted">Henüz hiç kupon oluşturulmamış.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </nb-card-body>
</nb-card>
`);

fs.writeFileSync(path.join(listDir, 'coupons-list.component.scss'), `
.badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  &.badge-success { background: #00d68f; color: white; }
  &.badge-info { background: #0095ff; color: white; }
}
.mr-2 { margin-right: 0.5rem; }
`);

// 6. coupon-form component
fs.writeFileSync(path.join(formDir, 'coupon-form.component.ts'), `
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
    productId: null
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
        productId: this.couponData.productId || null
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
      this.toastrService.warning('İndirim tutarı 0\\'dan büyük olmalıdır.', 'Uyarı');
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
`);

fs.writeFileSync(path.join(formDir, 'coupon-form.component.html'), `
<nb-card style="width: 500px; max-width: 95vw;">
  <nb-card-header>{{ isNew ? 'Yeni Kupon Oluştur' : 'Kuponu Düzenle' }}</nb-card-header>
  
  <nb-card-body>
    <div class="form-group row">
      <label class="col-sm-3 col-form-label">Uygulanabilirlik</label>
      <div class="col-sm-9">
        <nb-select fullWidth [(ngModel)]="formData.applicability">
          <nb-option value="all">Tüm Ürünlerde Geçerli</nb-option>
          <nb-option value="product">Ürüne Özel</nb-option>
        </nb-select>
      </div>
    </div>

    <div class="form-group row" *ngIf="formData.applicability === 'product'">
      <label class="col-sm-3 col-form-label">Ürün Seçimi</label>
      <div class="col-sm-9">
        <nb-select fullWidth [(ngModel)]="formData.productId" placeholder="Ürün Seçin">
          <nb-option *ngFor="let p of products" [value]="p.id">{{ p.name }}</nb-option>
        </nb-select>
      </div>
    </div>

    <div class="form-group row">
      <label class="col-sm-3 col-form-label">İndirim Tipi</label>
      <div class="col-sm-9">
        <nb-select fullWidth [(ngModel)]="formData.discountType">
          <nb-option value="percentage">Yüzdelik İndirim (%)</nb-option>
          <nb-option value="flat">TL İndirimi (₺)</nb-option>
        </nb-select>
      </div>
    </div>

    <div class="form-group row">
      <label class="col-sm-3 col-form-label">İndirim Tutarı</label>
      <div class="col-sm-9">
        <input type="number" nbInput fullWidth [(ngModel)]="formData.discountValue" placeholder="0">
      </div>
    </div>

    <div class="form-group row">
      <label class="col-sm-3 col-form-label">Kupon Kodu</label>
      <div class="col-sm-9">
        <div class="d-flex">
          <input type="text" nbInput fullWidth [(ngModel)]="formData.code" placeholder="Örn: YAZ10" style="text-transform: uppercase;">
          <button nbButton status="info" outline class="ml-2" (click)="generateRandomCode()" style="white-space: nowrap;">
            Rastgele Oluştur
          </button>
        </div>
      </div>
    </div>
  </nb-card-body>

  <nb-card-footer class="d-flex justify-content-end">
    <button nbButton ghost (click)="cancel()" class="mr-2">İptal</button>
    <button nbButton status="primary" [nbSpinner]="submitting" (click)="submit()">Kaydet</button>
  </nb-card-footer>
</nb-card>
`);

fs.writeFileSync(path.join(formDir, 'coupon-form.component.scss'), `
.ml-2 { margin-left: 0.5rem; }
.mr-2 { margin-right: 0.5rem; }
`);

console.log('Files generated successfully.');
