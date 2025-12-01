import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbCardModule, NbButtonModule } from '@nebular/theme';
import { Ng2SmartTableModule } from 'ng2-smart-table';

import { LegalDocumentsRoutingModule } from './legal-documents-routing.module';
import { LegalDocumentsComponent } from './legal-documents.component';
import { DocumentListComponent } from './document-list/document-list.component';

@NgModule({
  declarations: [
    LegalDocumentsComponent,
    DocumentListComponent,
  ],
  imports: [
    CommonModule,
    LegalDocumentsRoutingModule,
    NbCardModule,
    NbButtonModule,
    Ng2SmartTableModule,
  ],
})
export class LegalDocumentsModule { }
