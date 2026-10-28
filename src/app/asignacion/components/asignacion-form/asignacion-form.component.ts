import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AsignacionService } from '../../../core/services/asignacion.service';
import { DocenteService } from '../../../core/services/docente.service';

// =========================================================================
// VALIDADOR PERSONALIZADO (Evitar solo espacios en campos de texto)
// =========================================================================
export function sinEspaciosBlancos(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const esEspacio = (control.value || '').toString().trim().length === 0;
    return esEspacio ? { sinEspacios: true } : null;
  };
}

@Component({
  selector: 'app-asignacion-form',
  templateUrl: './asignacion-form.component.html',
  styleUrls: ['./asignacion-form.component.css']
})
export class AsignacionFormComponent implements OnInit, OnDestroy {
  asignacionForm!: FormGroup;
  isEditMode = false;
  submitted = false;
  loading = false;
  idAsignacion?: number;

  docentes: any[] = [];
  cursos: any[] = [];
  secciones: any[] = []; 

  // Variable para controlar el estado DIRTY y mostrar advertencia
  mostrarAdvertenciaDirty = false;

  constructor(
    private fb: FormBuilder,
    private asignacionService: AsignacionService,
    private docenteService: DocenteService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadDropdownData();

    this.idAsignacion = Number(this.route.snapshot.paramMap.get('id'));
    if (this.idAsignacion) {
      this.isEditMode = true;
      this.loadAsignacion(this.idAsignacion);
    }
  }

  ngOnDestroy(): void {
    // Aquí podrías agregar lógica de limpieza si fuera necesaria
  }

  initForm(): void {
    const anioActual = new Date().getFullYear();

    this.asignacionForm = this.fb.group({
      idDocente: ['', [Validators.required]],
      idCurso: ['', [Validators.required]],
      idSeccion: ['', [Validators.required]],
      // Validaciones para el año: Obligatorio, mínimo 2020, máximo el año actual
      anio: [anioActual, [
        Validators.required, 
        Validators.min(2020),
        Validators.max(anioActual)
      ]]
    });

    // Suscripción para advertir si hay cambios sin guardar (Estado DIRTY)
    this.asignacionForm.valueChanges.subscribe(() => {
      this.mostrarAdvertenciaDirty = this.asignacionForm.dirty && this.asignacionForm.valid;
    });
  }

  loadDropdownData(): void {
    this.docenteService.findByState('A').subscribe({
      next: (data) => this.docentes = data,
      error: (err) => console.error('Error al cargar docentes', err)
    });

    this.cursos = [
      { idCurso: 1, nombre: 'Matemáticas' },
      { idCurso: 2, nombre: 'Comunicación' },
      { idCurso: 3, nombre: 'Desarrollo Web' }
    ];

    this.secciones = [
      { idSeccion: 1, nombre: 'Sección A' },
      { idSeccion: 2, nombre: 'Sección B' },
      { idSeccion: 3, nombre: 'Sección C' }
    ];
  }

  loadAsignacion(id: number): void {
    this.loading = true;
    this.asignacionService.findById(id).subscribe({
      next: (data) => {
        if (data) {
          this.asignacionForm.patchValue(data);
          // Al cargar los datos en modo edición, marcamos el form como pristine
          this.asignacionForm.markAsPristine();
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar asignación', err);
        this.loading = false;
      }
    });
  }

  get f() { return this.asignacionForm.controls; }

  onSubmit(): void {
    this.submitted = true;
    
    // Restricción: Forzar visualización de errores si el form es inválido
    if (this.asignacionForm.invalid) {
      this.asignacionForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const formData = this.asignacionForm.value;

    if (this.isEditMode) {
      this.asignacionService.update(this.idAsignacion!, formData).subscribe({
        next: () => this.router.navigate(['/asignaciones']),
        error: (err) => {
          alert('Error al actualizar: ' + (err.error?.message || err.message));
          this.loading = false;
        }
      });
    } else {
      const { idAsignacion, ...dataToSave } = formData;
      this.asignacionService.save(dataToSave).subscribe({
        next: () => this.router.navigate(['/asignaciones']),
        error: (err) => {
          alert('Error al registrar: ' + (err.error?.message || err.message));
          this.loading = false;
        }
      });
    }
  }

  cancel(): void {
    // Si hay cambios sin guardar, pedimos confirmación
    if (this.asignacionForm.dirty) {
      const confirmar = confirm('Tienes cambios sin guardar. ¿Seguro que deseas salir?');
      if (!confirmar) return;
    }
    this.router.navigate(['/asignaciones']);
  }
}