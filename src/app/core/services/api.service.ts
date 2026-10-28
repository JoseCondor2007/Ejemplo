import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  protected get baseUrl(): string {
    const meta = document.querySelector('meta[name="api-url"]');
    const url = meta?.getAttribute('content');
    if (!url || url === '__API_URL__') {
      // Fallback solo para desarrollo local (ng serve)
      return 'http://localhost:8085/v1/api';
    }
    return url;
  }

  constructor(protected http: HttpClient) {}

  protected get<T>(endpoint: string, params?: any): Observable<T> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        httpParams = httpParams.set(key, params[key]);
      });
    }
    return this.http.get<T>(`${this.baseUrl}/${endpoint}`, { params: httpParams });
  }

  protected post<T>(endpoint: string, data: any): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}/${endpoint}`, data);
  }

  protected put<T>(endpoint: string, data: any): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}/${endpoint}`, data);
  }

  protected patch<T>(endpoint: string, data?: any): Observable<T> {
    return this.http.patch<T>(`${this.baseUrl}/${endpoint}`, data || {});
  }

  protected delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}/${endpoint}`);
  }
}