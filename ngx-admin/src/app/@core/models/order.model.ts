export interface OrderItem {
  id: number;
  orderId: number;
  generationId: string;
  productId: number;
  productSizeId: number;
  productFrameId: number;
  orientation?: 'landscape' | 'portrait';
  unitPrice: number;
  quantity: number;
  imageTransform?: string;
  previewImageUrl?: string;
  finalProductImageUrl?: string;
  customImageUrl?: string;

  productName?: string;
  productNameEn?: string;
  productSlug?: string;
  productImageUrl?: string;
  productDesi?: number;

  sizeName?: string;
  sizeDimensions?: string;
  sizePrice?: number;

  frameName?: string;
  framePrice?: number;
  frameColorCode?: string;

  generatedImageUrl?: string;
  productionImageUrl?: string;
  imagePrompt?: string;
  creditsUsed?: number;
}

export interface Order {
  id: number;
  userId: string;
  merchantOid: string;
  paymentAmount: number;
  totalAmount?: number;
  currency: string;
  paymentStatus: 'pending' | 'success' | 'failed' | 'refunded';
  paymentType?: string;
  orderType: 'product' | 'credit';
  creditAmount?: number;
  failedReasonCode?: string;
  failedReasonMsg?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  customerCity?: string;
  customerDistrict?: string;
  isCorporateInvoice: boolean;
  companyName?: string;
  taxNumber?: string;
  taxOffice?: string;
  companyAddress?: string;
  shippingStatus: 'pending' | 'preparing' | 'shipped' | 'delivered' | 'cancelled';
  trackingNumber?: string;
  geliverOfferId?: string;
  geliverShipmentId?: string;
  geliverTransactionNumber?: string;
  geliverShippingCode?: string;
  notes?: string;
  paidAt?: Date;
  updatedAt: Date;
  createdAt: Date;

  // New field for Order List
  itemsCount?: number;
  productName?: string; // aggregated product names
  couponCode?: string;
  discountType?: string;
  discountValue?: number;

  // New field for Order Detail
  items?: OrderItem[];
}
