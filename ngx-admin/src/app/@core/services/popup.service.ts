import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface PopupAnnouncement {
  id?: number;
  title: string;
  image_url: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PopupService {
  private apiUrl = `${environment.apiUrl}/popups`;

  constructor(private http: HttpClient) { }

  getPopups(): Observable<PopupAnnouncement[]> {
    return this.http.get<PopupAnnouncement[]>(this.apiUrl);
  }

  createPopup(popup: PopupAnnouncement): Observable<PopupAnnouncement> {
    return this.http.post<PopupAnnouncement>(this.apiUrl, popup);
  }

  updatePopup(id: number, popup: PopupAnnouncement): Observable<PopupAnnouncement> {
    return this.http.put<PopupAnnouncement>(`${this.apiUrl}/${id}`, popup);
  }

  deletePopup(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
