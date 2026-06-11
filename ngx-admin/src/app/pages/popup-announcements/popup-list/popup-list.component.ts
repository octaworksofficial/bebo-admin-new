import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PopupService, PopupAnnouncement } from '../../../@core/services/popup.service';

@Component({
  selector: 'ngx-popup-list',
  templateUrl: './popup-list.component.html',
  styleUrls: ['./popup-list.component.scss'],
})
export class PopupListComponent implements OnInit {
  popups: PopupAnnouncement[] = [];
  loading = false;

  constructor(
    private popupService: PopupService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadPopups();
  }

  loadPopups() {
    this.loading = true;
    this.popupService.getPopups().subscribe({
      next: (data) => {
        this.popups = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading popups', err);
        this.loading = false;
      }
    });
  }

  editPopup(id: number) {
    this.router.navigate(['/pages/popup-announcements/edit', id]);
  }

  deletePopup(id: number) {
    if (confirm('Bu duyuruyu silmek istediğinize emin misiniz?')) {
      this.popupService.deletePopup(id).subscribe({
        next: () => {
          this.loadPopups();
        },
        error: (err) => {
          console.error('Error deleting popup', err);
        }
      });
    }
  }

  toggleActive(popup: PopupAnnouncement) {
    const updatedPopup = { ...popup, is_active: !popup.is_active };
    this.popupService.updatePopup(popup.id!, updatedPopup).subscribe({
      next: () => {
        this.loadPopups(); // Reload to get updated active status across all
      },
      error: (err) => {
        console.error('Error updating popup status', err);
      }
    });
  }
}
