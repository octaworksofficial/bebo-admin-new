import { Component, OnInit } from '@angular/core';
import { SettingsService, AboutContent, SiteSettings, LegalDocument } from '../../@core/services/settings.service';

@Component({
  selector: 'ngx-site-settings',
  templateUrl: './site-settings.component.html',
  styleUrls: ['./site-settings.component.scss'],
})
export class SiteSettingsComponent implements OnInit {
  // About Content - Her dil için ayrı satır
  aboutContents: { [key: string]: AboutContent } = {};
  
  // Site Settings - İletişim ve sosyal medya
  siteSettings: SiteSettings = {};
  
  // Legal Documents
  legalDocuments: LegalDocument[] = [];
  selectedDocument: LegalDocument | null = null;
  editingDocument: LegalDocument | null = null;
  
  loading = true;
  saving = false;
  saved = false;
  error: string = null;

  // Dil seçimi
  activeLanguage: 'tr' | 'en' | 'fr' = 'tr';
  
  // Ana sekme
  activeMainTab: 'about' | 'contact' | 'legal' = 'about';
  
  // About alt sekmesi
  activeSection: 1 | 2 | 3 | 'mission' = 1;

  languages = [
    { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
  ];

  // Yaygın yasal döküman türleri
  documentTypes = [
    { slug: 'privacy-policy', label: 'Gizlilik Politikası' },
    { slug: 'terms-of-service', label: 'Kullanım Koşulları' },
    { slug: 'kvkk', label: 'KVKK Aydınlatma Metni' },
    { slug: 'cookie-policy', label: 'Çerez Politikası' },
    { slug: 'refund-policy', label: 'İade Politikası' },
  ];

  constructor(private settingsService: SettingsService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.error = null;
    
    // About content yükle
    this.settingsService.getAllAboutContent().subscribe({
      next: (contents) => {
        contents.forEach(content => {
          this.aboutContents[content.language] = content;
        });
        
        // Site settings yükle
        this.settingsService.getSiteSettings().subscribe({
          next: (settings) => {
            this.siteSettings = settings;
            
            // Legal documents yükle
            this.loadLegalDocuments();
          },
          error: (err) => {
            console.error('Site settings load error:', err);
            this.loading = false;
          }
        });
      },
      error: (err) => {
        console.error('About content load error:', err);
        this.error = 'İçerik yüklenirken hata oluştu.';
        this.loading = false;
      }
    });
  }

  loadLegalDocuments(): void {
    this.settingsService.getAllLegalDocuments(this.activeLanguage).subscribe({
      next: (documents) => {
        this.legalDocuments = documents;
        this.loading = false;
        
        // Önceden seçili döküman varsa güncelle
        if (this.selectedDocument) {
          const updated = documents.find(d => d.id === this.selectedDocument.id);
          if (updated) {
            this.selectedDocument = updated;
          }
        }
      },
      error: (err) => {
        console.error('Legal documents load error:', err);
        this.loading = false;
      }
    });
  }

  get currentContent(): AboutContent {
    return this.aboutContents[this.activeLanguage] || this.getEmptyContent(this.activeLanguage);
  }

  getEmptyContent(language: string): AboutContent {
    return {
      language,
      title1: '', body1: '',
      title2: '', body2: '',
      title3: '', body3: '',
      mission: '', vision: '',
    };
  }

  saveAboutContent(): void {
    this.saving = true;
    this.saved = false;
    this.error = null;

    const contents = Object.values(this.aboutContents);
    
    this.settingsService.updateAllAboutContent(contents).subscribe({
      next: () => {
        this.saving = false;
        this.saved = true;
        setTimeout(() => this.saved = false, 3000);
      },
      error: (err) => {
        console.error('About content save error:', err);
        this.error = 'İçerik kaydedilirken hata oluştu.';
        this.saving = false;
      }
    });
  }

  saveSiteSettings(): void {
    this.saving = true;
    this.saved = false;
    this.error = null;

    this.settingsService.updateSiteSettings(this.siteSettings).subscribe({
      next: () => {
        this.saving = false;
        this.saved = true;
        setTimeout(() => this.saved = false, 3000);
      },
      error: (err) => {
        console.error('Site settings save error:', err);
        this.error = 'Ayarlar kaydedilirken hata oluştu.';
        this.saving = false;
      }
    });
  }

  setLanguage(lang: 'tr' | 'en' | 'fr'): void {
    this.activeLanguage = lang;
    // Legal sekmesindeyse dökümanları yeniden yükle
    if (this.activeMainTab === 'legal') {
      this.loadLegalDocuments();
    }
  }

  setMainTab(tab: 'about' | 'contact' | 'legal'): void {
    this.activeMainTab = tab;
    if (tab === 'legal') {
      this.loadLegalDocuments();
    }
  }

  setSection(section: 1 | 2 | 3 | 'mission'): void {
    this.activeSection = section;
  }

  updateContent(field: string, value: string): void {
    if (!this.aboutContents[this.activeLanguage]) {
      this.aboutContents[this.activeLanguage] = this.getEmptyContent(this.activeLanguage);
    }
    (this.aboutContents[this.activeLanguage] as any)[field] = value;
  }

  // ==================== Legal Documents Methods ====================
  
  getDocumentTypeLabel(slug: string): string {
    const type = this.documentTypes.find(t => t.slug === slug);
    return type ? type.label : slug;
  }

  selectDocument(doc: LegalDocument): void {
    this.selectedDocument = doc;
    this.editingDocument = { ...doc }; // Kopyasını al
  }

  cancelEdit(): void {
    this.selectedDocument = null;
    this.editingDocument = null;
  }

  saveLegalDocument(): void {
    if (!this.editingDocument || !this.editingDocument.id) return;
    
    this.saving = true;
    this.saved = false;
    this.error = null;

    this.settingsService.updateLegalDocument(this.editingDocument.id, {
      title: this.editingDocument.title,
      content: this.editingDocument.content,
      isActive: this.editingDocument.isActive,
      sortOrder: this.editingDocument.sortOrder,
    }).subscribe({
      next: (updated) => {
        this.saving = false;
        this.saved = true;
        this.selectedDocument = updated;
        this.editingDocument = { ...updated };
        this.loadLegalDocuments();
        setTimeout(() => this.saved = false, 3000);
      },
      error: (err) => {
        console.error('Legal document save error:', err);
        this.error = 'Döküman kaydedilirken hata oluştu.';
        this.saving = false;
      }
    });
  }

  toggleDocumentStatus(doc: LegalDocument): void {
    this.settingsService.updateLegalDocument(doc.id, {
      isActive: !doc.isActive,
    }).subscribe({
      next: () => {
        doc.isActive = !doc.isActive;
      },
      error: (err) => {
        console.error('Status toggle error:', err);
      }
    });
  }

  createNewDocument(): void {
    this.editingDocument = {
      slug: '',
      title: '',
      content: '',
      language: this.activeLanguage,
      isActive: true,
      sortOrder: this.legalDocuments.length,
    };
    this.selectedDocument = null;
  }

  saveNewDocument(): void {
    if (!this.editingDocument || !this.editingDocument.slug || !this.editingDocument.title) {
      this.error = 'Lütfen tüm zorunlu alanları doldurun.';
      return;
    }
    
    this.saving = true;
    this.saved = false;
    this.error = null;

    this.settingsService.createLegalDocument(this.editingDocument).subscribe({
      next: (created) => {
        this.saving = false;
        this.saved = true;
        this.selectedDocument = created;
        this.editingDocument = { ...created };
        this.loadLegalDocuments();
        setTimeout(() => this.saved = false, 3000);
      },
      error: (err) => {
        console.error('Legal document create error:', err);
        this.error = 'Döküman oluşturulurken hata oluştu.';
        this.saving = false;
      }
    });
  }

  deleteDocument(doc: LegalDocument): void {
    if (!confirm(`"${doc.title}" dökümanını silmek istediğinize emin misiniz?`)) {
      return;
    }

    this.settingsService.deleteLegalDocument(doc.id).subscribe({
      next: () => {
        if (this.selectedDocument?.id === doc.id) {
          this.selectedDocument = null;
          this.editingDocument = null;
        }
        this.loadLegalDocuments();
      },
      error: (err) => {
        console.error('Delete error:', err);
        this.error = 'Döküman silinirken hata oluştu.';
      }
    });
  }
}
