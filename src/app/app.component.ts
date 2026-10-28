import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'portal-academico';
  showLayout = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const url = event.urlAfterRedirects;
        
        // Ocultamos el layout (sidebar/header) en rutas públicas
        const esRutaSinLayout = url.includes('/login') || 
                                url.includes('/loading') || 
                                url.includes('/inicio');
        
        this.showLayout = this.authService.isAuthenticated() && !esRutaSinLayout;
      }
    });
  }
}