import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NbToastrService } from '@nebular/theme';
import { SettingsService, SiteSettings } from '../../@core/services/settings.service';

interface SettingField {
  key: string;
  label: string;
  type: 'text' | 'email' | 'phone' | 'url' | 'textarea';
  placeholder?: string;
  icon?: string;
  description?: string;
}

@Component({
  selector: 'ngx-site-settings',
  templateUrl: './site-settings.component.html',
  styleUrls: ['./site-settings.component.scss'],
})
export class SiteSettingsComponent implements OnInit {
  loading = true;
  saving = false;
  
  settingsForm: FormGroup;
  
  // İletişim Bilgileri
  contactFields: SettingField[] = [
    { key: 'contact_email', label: 'İletişim E-posta', type: 'email', placeholder: 'info@birebiro.com', icon: 'email-outline', description: 'Genel iletişim e-posta adresi' },
    { key: 'contact_phone', label: 'Telefon', type: 'phone', placeholder: '+90 555 123 45 67', icon: 'phone-outline', description: 'İletişim telefon numarası' },
    { key: 'contact_address', label: 'Adres', type: 'textarea', placeholder: 'Şirket adresi...', icon: 'pin-outline', description: 'Şirket adresi' },
  ];

  // Sosyal Medya
  socialFields: SettingField[] = [
    { key: 'social_instagram', label: 'Instagram', type: 'url', placeholder: 'https://instagram.com/birebiro', icon: 'camera-outline' },
    { key: 'social_twitter', label: 'Twitter/X', type: 'url', placeholder: 'https://twitter.com/birebiro', icon: 'twitter-outline' },
    { key: 'social_facebook', label: 'Facebook', type: 'url', placeholder: 'https://facebook.com/birebiro', icon: 'facebook-outline' },
  ];

  constructor(
    private fb: FormBuilder,
    private settingsService: SettingsService,
    private toastrService: NbToastrService,
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.loadSettings();
  }

  initForm(): void {
    this.settingsForm = this.fb.group({
      // Contact
      contact_email: [''],
      contact_phone: [''],
      contact_address: [''],
      // Social
      social_instagram: [''],
      social_twitter: [''],
      social_facebook: [''],
    });
  }

  loadSettings(): void {
    this.loading = true;
    this.settingsService.getSiteSettings().subscribe({
      next: (settings: SiteSettings) => {
        // Gelen ayarları forma doldur
        Object.keys(settings).forEach(key => {
          if (this.settingsForm.get(key)) {
            this.settingsForm.patchValue({ [key]: settings[key] || '' });
          }
        });
        this.loading = false;
      },
      error: (error) => {
        console.error('Settings load error:', error);
        this.toastrService.danger('Ayarlar yüklenirken hata oluştu', 'Hata');
        this.loading = false;
      },
    });
  }

  saveSettings(): void {
    this.saving = true;
    const settings: SiteSettings = this.settingsForm.value;

    this.settingsService.updateSiteSettings(settings).subscribe({
      next: () => {
        this.toastrService.success('Ayarlar kaydedildi', 'Başarılı');
        this.saving = false;
      },
      error: (error) => {
        console.error('Save error:', error);
        this.toastrService.danger('Kayıt sırasında hata oluştu', 'Hata');
        this.saving = false;
      },
    });
  }
}
