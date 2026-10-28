import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
// IMPORTAMOS LO NECESARIO PARA FORMULARIOS REACTIVOS
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors, AsyncValidatorFn } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, delay } from 'rxjs/operators';

@Component({
  selector: 'app-loading-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], // Añadimos ReactiveFormsModule
  templateUrl: './loading-page.component.html',
  styleUrls: ['./loading-page.component.css']
})
export class LoadingPageComponent implements OnInit {
  
  year = new Date().getFullYear();

  // Propiedades para el formulario de contacto
  contactoForm!: FormGroup;
  enviado = false;
  mensajeExito = '';

  menuItems = [
    { label: 'Inicio', id: 'inicio' },
    { label: 'Nosotros', id: 'nosotros' },
    { label: 'Desafío', id: 'desafio' },
    { label: 'Servicios', id: 'servicios' },
    { label: 'Beneficios', id: 'beneficios' },
    { label: 'Características', id: 'caracteristicas' },
    { label: 'Contacto', id: 'contacto' }
  ];

  servicios = [
    { icono: '📊', titulo: 'Dashboard de Supervisión', descripcion: 'Panel de control en tiempo real para directivos y especialistas, con métricas clave del rendimiento estudiantil.' },
    { icono: '📝', titulo: 'Matriz Transaccional', descripcion: 'Herramienta especializada para docentes que facilita el registro de notas por competencias alineado al CNEB.' },
    { icono: '🔔', titulo: 'Alertas Tempranas', descripcion: 'Sistema de notificaciones automáticas para padres de familia ante riesgos de bajo rendimiento académico.' },
    { icono: '📈', titulo: 'Reportes Académicos', descripcion: 'Generación de informes descargables y consolidados para la toma de decisiones pedagógicas en la institución.' }
  ];

  beneficios = [
    { icono: '⏱️', titulo: 'Optimización del tiempo docente', descripcion: 'Automatiza el registro de evaluaciones y reduce la carga administrativa.' },
    { icono: '📊', titulo: 'Reportes confiables', descripcion: 'Dashboard de supervisión para directivos con datos en tiempo real.' },
    { icono: '🔔', titulo: 'Alertas tempranas', descripcion: 'Notificaciones automáticas a padres ante riesgo de bajo rendimiento.' },
    { icono: '🤝', titulo: 'Comunicación directa', descripcion: 'Canales digitales que conectan hogar y escuela para prevenir la deserción.' },
    { icono: '📚', titulo: 'Evaluación por competencias', descripcion: 'Escala CNEB: AD, A, B, C con seguimiento por periodos.' },
    { icono: '🔒', titulo: 'Información centralizada', descripcion: 'Todos los datos académicos en una sola plataforma segura.' }
  ];

  caracteristicas = [
    { titulo: 'Registro de evaluaciones por periodos', descripcion: 'Sistema automatizado alineado al calendario académico.' },
    { titulo: 'Matriz transaccional de notas', descripcion: 'Herramienta especializada para docentes por competencias CNEB.' },
    { titulo: 'Dashboard de supervisión', descripcion: 'Panel principal para directivos y especialistas.' },
    { titulo: 'Alertas tempranas', descripcion: 'Notificaciones automáticas ante riesgo de bajo rendimiento.' },
    { titulo: 'Acceso multiportal', descripcion: 'Interfaces diferenciadas para docentes, padres y estudiantes.' },
    { titulo: 'Reportes descargables', descripcion: 'Información consolidada para la toma de decisiones pedagógicas.' }
  ];

  constructor(private router: Router, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.initFormulario();
  }

  // ===== INICIALIZACIÓN DEL FORMULARIO Y VALIDACIONES =====
  initFormulario(): void {
    this.contactoForm = this.fb.group({
      nombre: ['', [
        Validators.required, 
        Validators.minLength(3), 
        Validators.maxLength(50),
        Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$') // Solo letras
      ]],
      correo: ['', 
        [Validators.required, Validators.email],
        [this.correoInstitucionalValidator()] // Validación asíncrona
      ],
      mensaje: ['', [
        Validators.required, 
        Validators.minLength(10), 
        Validators.maxLength(200)
      ]]
    });
  }

  // Validador Asíncrono: Simula verificar si el correo ya existe en la BD
  correoInstitucionalValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) return of(null);
      
      return of(control.value).pipe(
        delay(800), // Simulamos latencia de red
        map((correo: string) => {
          // Ejemplo: Si el correo termina en "@hotmail.com", simulamos que ya está registrado
          return correo.toLowerCase().endsWith('@hotmail.com') ? { correoRegistrado: true } : null;
        })
      );
    };
  }

  // ===== GETTERS PARA EL HTML =====
  get nombre() { return this.contactoForm.get('nombre')!; }
  get correo() { return this.contactoForm.get('correo')!; }
  get mensaje() { return this.contactoForm.get('mensaje')!; }

  // ===== ENVÍO DEL FORMULARIO =====
  enviarMensaje(): void {
    this.enviado = true;

    // Restricción: Si hay errores o está en proceso de validación asíncrona, no avanza
    if (this.contactoForm.invalid || this.contactoForm.pending) {
      this.contactoForm.markAllAsTouched(); // Fuerza mostrar todos los errores
      return;
    }

    // Simulamos el guardado exitoso
    this.mensajeExito = '✅ Mensaje enviado correctamente. Nos pondremos en contacto pronto.';
    this.contactoForm.reset();
    this.enviado = false;

    // Ocultar mensaje después de 4 segundos
    setTimeout(() => this.mensajeExito = '', 4000);
  }

  scrollToSection(id: string, event: Event) {
    event.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  irAlLogin() {
    this.router.navigate(['/login']);
  }
}