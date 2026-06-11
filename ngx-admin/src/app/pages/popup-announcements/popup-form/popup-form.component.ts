import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PopupService } from '../../../@core/services/popup.service';
import { ImageUploadService } from '../../../@core/services/image-upload.service';

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
    const file: File = event.target.files[0];
    if (file) {
      // Local preview
      const reader = new FileReader();
      reader.onload = e => this.previewUrl = reader.result;
      reader.readAsDataURL(file);

      this.uploading = true;
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
