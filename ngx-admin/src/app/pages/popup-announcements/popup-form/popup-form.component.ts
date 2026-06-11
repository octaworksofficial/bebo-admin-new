import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PopupService } from '../../../@core/services/popup.service';
import { ImageUploadService } from '../../../@core/services/image-upload.service';
import { ImageCroppedEvent } from 'ngx-image-cropper';

@Component({
  selector: 'ngx-popup-form',
  templateUrl: './popup-form.component.html',
  styleUrls: ['./popup-form.component.scss'],
})
export class PopupFormComponent implements OnInit {
  form: FormGroup;
  id: number | null = null;
  loading = false;
  uploading = false;
  previewUrl: string | ArrayBuffer | null = null;
  
  imageChangedEvent: any = '';
  croppedImage: any = '';
  showCropper = false;

  constructor(
    private fb: FormBuilder,
    private popupService: PopupService,
    private imageUploadService: ImageUploadService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      image_url: ['', Validators.required],
      is_active: [false]
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.id = +idParam;
        this.loadPopup(this.id);
      }
    });
  }

  loadPopup(id: number) {
    this.loading = true;
    this.popupService.getPopups().subscribe({
      next: (popups) => {
        const popup = popups.find(p => p.id === id);
        if (popup) {
          this.form.patchValue({
            title: popup.title,
            image_url: popup.image_url,
            is_active: popup.is_active
          });
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading popup', err);
        this.loading = false;
      }
    });
  }

  onFileSelected(event: any) {
    this.imageChangedEvent = event;
    this.showCropper = true;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.objectUrl || event.base64;
  }

  imageLoaded() {
    // show cropper
  }

  cropperReady() {
    // cropper ready
  }

  loadImageFailed() {
    alert('Görsel yüklenemedi.');
  }

  cancelCrop() {
    this.showCropper = false;
    this.imageChangedEvent = '';
    this.croppedImage = '';
  }

  async uploadCroppedImage() {
    if (!this.croppedImage) return;
    
    this.uploading = true;
    this.showCropper = false;

    try {
      // Convert objectUrl or base64 to Blob, then to File
      const response = await fetch(this.croppedImage);
      const blob = await response.blob();
      const file = new File([blob], 'popup-image.png', { type: 'image/png' });

      // Local preview
      const reader = new FileReader();
      reader.onload = e => this.previewUrl = reader.result;
      reader.readAsDataURL(file);

      this.imageUploadService.uploadImage(file).subscribe({
        next: (res: any) => {
          this.form.patchValue({ image_url: res.image_url });
          this.uploading = false;
        },
        error: (err) => {
          console.error('Upload error', err);
          this.uploading = false;
          alert('Görsel yüklenirken hata oluştu.');
        }
      });
    } catch (e) {
      console.error('Blob conversion error', e);
      this.uploading = false;
      alert('Görsel işlenirken hata oluştu.');
    }
  }

  submit() {
    if (this.form.invalid) {
      if (!this.form.get('title')?.value) {
        alert('Lütfen bir başlık girin.');
      } else if (!this.form.get('image_url')?.value) {
        alert('Lütfen bir görsel seçin ve yüklenmesini bekleyin.');
      } else {
        alert('Lütfen tüm zorunlu alanları doldurun.');
      }
      return;
    }

    this.loading = true;
    const popupData = this.form.value;

    if (this.id) {
      this.popupService.updatePopup(this.id, popupData).subscribe({
        next: () => {
          this.router.navigate(['/pages/popup-announcements/list']);
        },
        error: (err) => {
          console.error('Error updating', err);
          alert('Güncellenirken bir hata oluştu: ' + (err.error?.error || err.message));
          this.loading = false;
        }
      });
    } else {
      this.popupService.createPopup(popupData).subscribe({
        next: () => {
          this.router.navigate(['/pages/popup-announcements/list']);
        },
        error: (err) => {
          console.error('Error creating', err);
          alert('Eklenirken bir hata oluştu: ' + (err.error?.error || err.message));
          this.loading = false;
        }
      });
    }
  }

  cancel() {
    this.router.navigate(['/pages/popup-announcements/list']);
  }
}
