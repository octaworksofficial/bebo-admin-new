import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NbToastrService } from '@nebular/theme';
import { SettingsService, SiteSetting } from '../../../@core/services/settings.service';

interface SettingField {
  key: string;
  label: string;
  valueType: 'text' | 'email' | 'phone' | 'url' | 'textarea';
  category: 'contact' | 'social' | 'general';
  placeholder?: string;
  icon?: string;
}

@Component({
  selector: 'ngx-site-settings',
  templateUrl: './site-settings.component.html',
  styleUrls: ['./site-settings.component.scss'],
})
export class SiteSettingsComponent implements OnInit {
  loading = true;
  saving = false;
  
  contactForm: FormGroup;
  socialForm: FormGroup;
  
  // Predefined fields
  contactFields: SettingField[] = [
    { key: 'contact_email', label: 'E-posta Adresi', valueType: 'email', category: 'contact', placeholder: 'info@birebiro.com', icon: 'email-outline' },
    { key: 'contact_phone', label: 'Telefon Numarası', valueType: 'phone', category: 'contact', placeholder: '+90 555 123 4567', icon: 'phone-outline' },
    { key: 'contact_address', label: 'Adres', valueType: 'textarea', category: 'contact', placeholder: 'Şirket adresi...', icon: 'pin-outline' },
    { key: 'contact_whatsapp', label: 'WhatsApp', valueType: 'phone', category: 'contact', placeholder: '+90 555 123 4567', icon: 'message-circle-outline' },
  ];

  socialFields: SettingField[] = [
    { key: 'social_instagram', label: 'Instagram', valueType: 'url', category: 'social', placeholder: 'https://instagram.com/birebiro', icon: 'camera-outline' },
    { key: 'social_facebook', label: 'Facebook', valueType: 'url', category: 'social', placeholder: 'https://facebook.com/birebiro', icon: 'facebook-outline' },
    { key: 'social_twitter', label: 'Twitter / X', valueType: 'url', category: 'social', placeholder: 'https://twitter.com/birebiro', icon: 'twitter-outline' },
    { key: 'social_tiktok', label: 'TikTok', valueType: 'url', category: 'social', placeholder: 'https://tiktok.com/@birebiro', icon: 'video-outline' },
    { key: 'social_youtube', label: 'YouTube', valueType: 'url', category: 'social', placeholder: 'https://youtube.com/@birebiro', icon: 'play-circle-outline' },
    { key: 'social_linkedin', label: 'LinkedIn', valueType: 'url', category: 'social', placeholder: 'https://linkedin.com/company/birebiro', icon: 'linkedin-outline' },
    { key: 'social_pinterest', label: 'Pinterest', valueType: 'url', category: 'social', placeholder: 'https://pinterest.com/birebiro', icon: 'grid-outline' },
  ];

  constructor(
    private fb: FormBuilder,
    private settingsService: SettingsService,
    private toastrService: NbToastrService,
  ) {
    this.initForms();
  }

  ngOnInit(): void {
    this.loadSettings();
  }

  initForms(): void {
    // Contact form
    const contactControls: { [key: string]: string } = {};
    this.contactFields.forEach(field => {
      contactControls[field.key] = '';
    });
    this.contactForm = this.fb.group(contactControls);

    // Social form
    const socialControls: { [key: string]: string } = {};
    this.socialFields.forEach(field => {
      socialControls[field.key] = '';
    });
    this.socialForm = this.fb.group(socialControls);
  }

  loadSettings(): void {
    this.loading = true;
    this.settingsService.getAllSiteSettings().subscribe({
      next: (settings) => {
        settings.forEach(setting => {
          if (this.contactForm.get(setting.key)) {
            this.contactForm.patchValue({ [setting.key]: setting.value || '' });
          }
          if (this.socialForm.get(setting.key)) {
            this.socialForm.patchValue({ [setting.key]: setting.value || '' });
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

  saveContactSettings(): void {
    this.saving = true;
    const settings: SiteSetting[] = this.contactFields.map(field => ({
      key: field.key,
      value: this.contactForm.get(field.key)?.value || '',
      valueType: field.valueType,
      category: field.category,
      label: field.label,
      isPublic: true,
    }));

    this.settingsService.bulkUpdateSiteSettings(settings).subscribe({
      next: () => {
        this.toastrService.success('İletişim ayarları kaydedildi', 'Başarılı');
        this.saving = false;
      },
      error: (error) => {
        console.error('Save error:', error);
        this.toastrService.danger('Kayıt sırasında hata oluştu', 'Hata');
        this.saving = false;
      },
    });
  }

  saveSocialSettings(): void {
    this.saving = true;
    const settings: SiteSetting[] = this.socialFields.map(field => ({
      key: field.key,
      value: this.socialForm.get(field.key)?.value || '',
      valueType: field.valueType,
      category: field.category,
      label: field.label,
      isPublic: true,
    }));

    this.settingsService.bulkUpdateSiteSettings(settings).subscribe({
      next: () => {
        this.toastrService.success('Sosyal medya ayarları kaydedildi', 'Başarılı');
        this.saving = false;
      },
      error: (error) => {
        console.error('Save error:', error);
        this.toastrService.danger('Kayıt sırasında hata oluştu', 'Hata');
        this.saving = false;
      },
    });
  }

  saveAllSettings(): void {
    this.saving = true;
    const allSettings: SiteSetting[] = [
      ...this.contactFields.map(field => ({
        key: field.key,
        value: this.contactForm.get(field.key)?.value || '',
        valueType: field.valueType,
        category: field.category,
        label: field.label,
        isPublic: true,
      })),
      ...this.socialFields.map(field => ({
        key: field.key,
        value: this.socialForm.get(field.key)?.value || '',
        valueType: field.valueType,
        category: field.category,
        label: field.label,
        isPublic: true,
      })),
    ];

    this.settingsService.bulkUpdateSiteSettings(allSettings).subscribe({
      next: () => {
        this.toastrService.success('Tüm ayarlar kaydedildi', 'Başarılı');
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
