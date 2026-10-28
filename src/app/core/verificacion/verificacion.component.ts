import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-verificacion',
  templateUrl: './verificacion.component.html',
  styleUrls: ['./verificacion.component.css']
})
export class VerificacionComponent implements OnInit, OnDestroy {
  private intervalId: any;
  private timeoutId: any;

  constructor(private router: Router) {}

  ngOnInit(): void {
    const messages = [
      "Sincronizando registros de evaluación y padrones con la UGEL 08 Cañete...",
      "Validando consistencia de datos de estudiantes...",
      "Asegurando conexión segura con el repositorio central...",
      "Actualizando historiales académicos..."
    ];
    
    const textElement = document.getElementById('loading-text');
    let currentIndex = 0;

    this.intervalId = setInterval(() => {
      currentIndex = (currentIndex + 1) % messages.length;
      if (textElement) {
        textElement.style.opacity = '0';
        setTimeout(() => {
          textElement.innerText = messages[currentIndex];
          textElement.style.opacity = '1';
        }, 500);
      }
    }, 4000);

    // Redirige al dashboard después de 5 segundos
    this.timeoutId = setTimeout(() => {
      this.router.navigate(['/dashboard']);
    }, 5000);
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }
}