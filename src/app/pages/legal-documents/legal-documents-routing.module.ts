import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LegalDocumentsComponent } from './legal-documents.component';
import { DocumentListComponent } from './document-list/document-list.component';

const routes: Routes = [{
  path: '',
  component: LegalDocumentsComponent,
  children: [
    {
      path: '',
      component: DocumentListComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LegalDocumentsRoutingModule { }
