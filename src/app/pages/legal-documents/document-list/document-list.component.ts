import { Component, OnInit } from '@angular/core';
import { LegalDocumentsService } from '../../../@core/services';
import { LegalDocument } from '../../../@core/models';

@Component({
  selector: 'ngx-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.scss'],
})
export class DocumentListComponent implements OnInit {
  settings = {
    actions: {
      add: false,
      edit: false,
      delete: false,
    },
    columns: {
      id: {
        title: 'ID',
        type: 'number',
        width: '80px',
      },
      titleTr: {
        title: 'Başlık (TR)',
        type: 'string',
      },
      slug: {
        title: 'Slug',
        type: 'string',
      },
      type: {
        title: 'Tip',
        type: 'string',
      },
      isActive: {
        title: 'Durum',
        type: 'html',
        valuePrepareFunction: (value) => {
          return value 
            ? '<span class="badge badge-success">Aktif</span>' 
            : '<span class="badge badge-basic">Pasif</span>';
        },
      },
      updatedAt: {
        title: 'Güncelleme Tarihi',
        type: 'string',
        valuePrepareFunction: (value) => new Date(value).toLocaleDateString('tr-TR'),
      },
    },
  };

  source: LegalDocument[] = [];
  loading = true;

  constructor(private legalDocumentsService: LegalDocumentsService) {}

  ngOnInit(): void {
    this.loadDocuments();
  }

  loadDocuments(): void {
    this.loading = true;
    this.legalDocumentsService.getAll().subscribe({
      next: (documents) => {
        this.source = documents;
        this.loading = false;
      },
      error: (error) => {
        console.error('Yasal dokümanlar yüklenirken hata:', error);
        this.loading = false;
      },
    });
  }
}
