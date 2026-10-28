import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit, OnDestroy {
  
  private timeoutId1: any;
  private timeoutId2: any;

  constructor(private router: Router) {}

  ngOnInit(): void {
    const textoEstado = document.querySelector('.inicio-texto-estado');
    
    // A los 3s cambia el texto
    this.timeoutId1 = setTimeout(() => {
      if (textoEstado) {
        textoEstado.textContent = 'ACCESO CONCEDIDO';
      }
      
      // A los 4s (1s después) redirige a la Landing
      this.timeoutId2 = setTimeout(() => {
        this.router.navigate(['/loading']);
      }, 1000);

    }, 3000);
  }

  ngOnDestroy(): void {
    if (this.timeoutId1) clearTimeout(this.timeoutId1);
    if (this.timeoutId2) clearTimeout(this.timeoutId2);
  }
}