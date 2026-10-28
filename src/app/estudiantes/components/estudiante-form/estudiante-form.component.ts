import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EstudianteService } from '../../../core/services/estudiante.service';

// =========================================================================
// VALIDADOR PERSONALIZADO: Evitar solo espacios en blanco
// =========================================================================
export function sinEspaciosBlancos(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const esEspacio = (control.value || '').trim().length === 0;
    return esEspacio ? { sinEspacios: true } : null;
  };
}

// =========================================================================
// VALIDADOR PERSONALIZADO: Fecha de nacimiento no puede ser futura
// =========================================================================
export function fechaNoFutura(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;
    
    const fechaIngresada = new Date(control.value);
    const fechaActual = new Date();
    
    // Si la fecha ingresada es mayor a hoy, es inválida
    if (fechaIngresada > fechaActual) {
      return { fechaFutura: true };
    }
    return null;
  };
}

@Component({
  selector: 'app-estudiante-form',
  templateUrl: './estudiante-form.component.html',
  styleUrls: ['./estudiante-form.component.css']
})
export class EstudianteFormComponent implements OnInit {
  estudianteForm!: FormGroup;
  isEditMode = false;
  submitted = false;
  loading = false;
  idEstudiante?: number;

  // Variable para el estado DIRTY
  mostrarAdvertenciaDirty = false;

  constructor(
    private fb: FormBuilder,
    private estudianteService: EstudianteService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    
    // Suscripción para advertir cambios sin guardar
    this.estudianteForm.valueChanges.subscribe(() => {
      this.mostrarAdvertenciaDirty = this.estudianteForm.dirty && this.estudianteForm.valid;
    });

    this.idEstudiante = Number(this.route.snapshot.paramMap.get('id'));
    if (this.idEstudiante) {
      this.isEditMode = true;
      this.loadEstudiante(this.idEstudiante);
    }
  }

  initForm(): void {
    this.estudianteForm = this.fb.group({
      tipoDocumento: ['DNI', [Validators.required]],
      numeroDocumento: ['', [
        Validators.required, 
        Validators.pattern(/^[0-9]{8,12}$/),
        sinEspaciosBlancos()
      ]],
      nombres: ['', [
        Validators.required, 
        Validators.minLength(3),
        Validators.maxLength(50),
        Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$'),
        sinEspaciosBlancos()
      ]],
      apellidos: ['', [
        Validators.required, 
        Validators.minLength(3),
        Validators.maxLength(50),
        Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$'),
        sinEspaciosBlancos()
      ]],
      fechaNacimiento: ['', [
        Validators.required,
        fechaNoFutura() // Validador personalizado
      ]],
      sexo: ['M', [Validators.required]],
      idApoderado: ['', [Validators.required]],
      idUbicacion: [null],
      // Campos que estaban en el HTML pero faltaban en el TS
      telefono: ['', [
        Validators.required,
        Validators.pattern(/^[0-9]{9}$/) // 9 dígitos exactos
      ]],
      direccion: ['', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(150),
        sinEspaciosBlancos()
      ]]
    });
  }

  loadEstudiante(id: number): void {
    this.loading = true;
    this.estudianteService.findById(id).subscribe({
      next: (data) => {
        if (data) {
          this.estudianteForm.patchValue(data);
          this.estudianteForm.markAsPristine();
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar estudiante', err);
        this.loading = false;
      }
    });
  }

  get f() { return this.estudianteForm.controls; }

  onSubmit(): void {
    this.submitted = true;
    
    // Restricción: Mostrar todos los errores si el form es inválido
    if (this.estudianteForm.invalid) {
      this.estudianteForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const formData = this.estudianteForm.value;

    if (this.isEditMode) {
      this.estudianteService.update(this.idEstudiante!, formData).subscribe({
        next: () => this.router.navigate(['/estudiantes']),
        error: (err) => {
          alert('Error al actualizar: ' + (err.error?.message || err.message));
          this.loading = false;
        }
      });
    } else {
      const { idEstudiante, ...dataToSave } = formData;
      this.estudianteService.save(dataToSave).subscribe({
        next: () => this.router.navigate(['/estudiantes']),
        error: (err) => {
          alert('Error al registrar: ' + (err.error?.message || err.message));
          this.loading = false;
        }
      });
    }
  }

  cancel(): void {
    // Restricción: Confirmar salida si hay cambios sin guardar
    if (this.estudianteForm.dirty) {
      const confirmar = confirm('Tienes cambios sin guardar. ¿Seguro que deseas salir?');
      if (!confirmar) return;
    }
    this.router.navigate(['/estudiantes']);
  }
}