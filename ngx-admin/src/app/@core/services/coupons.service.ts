
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
  private apiUrl = environment.apiUrl + '/coupons';

  constructor(private http: HttpClient) {}

  getCoupons(): Observable<Coupon[]> {
    return this.http.get<Coupon[]>(this.apiUrl);
  }

  createCoupon(coupon: Coupon): Observable<{success: boolean, data: Coupon}> {
    return this.http.post<{success: boolean, data: Coupon}>(this.apiUrl, coupon);
  }

  updateCoupon(id: number, coupon: Partial<Coupon>): Observable<{success: boolean, data: Coupon}> {
    return this.http.put<{success: boolean, data: Coupon}>(`${this.apiUrl}/${id}`, coupon);
  }

  deleteCoupon(id: number): Observable<{success: boolean, message: string}> {
    return this.http.delete<{success: boolean, message: string}>(`${this.apiUrl}/${id}`);
  }
}
