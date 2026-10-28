import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8085/v1/api/auth';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient) {}

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: any) => {
        if (response.token) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user || {}));
          this.isAuthenticatedSubject.next(true);
        }
      }),
      catchError((error) => {
        console.error('Error en login:', error);
        return throwError(() => error);
      })
    );
  }

  // 🔥 NUEVO MÉTODO AGREGADO: Para guardar sesión manualmente (en caso de pruebas)
  setUser(user: any): void {
    localStorage.setItem('user', JSON.stringify(user));
    // Si no hay token real, simulamos uno para que el AuthGuard funcione en pruebas locales
    if (!localStorage.getItem('token')) {
      localStorage.setItem('token', 'token-de-prueba-local');
      this.isAuthenticatedSubject.next(true);
    }
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('savedEmail');
    this.isAuthenticatedSubject.next(false);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  isAuthenticated(): boolean {
    return this.hasToken();
  }
}