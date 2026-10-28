import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DocenteService } from '../../../core/services/docente.service';

// =========================================================================
// VALIDADOR PERSONALIZADO: Evitar solo espacios en blanco
// =========================================================================
export function sinEspaciosBlancos(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const esEspacio = (control.value || '').trim().length === 0;
    return esEspacio ? { sinEspacios: true } : null;
  };
}

@Component({
  selector: 'app-docente-form',
  templateUrl: './docente-form.component.html',
  styleUrls: ['./docente-form.component.css']
})
export class DocenteFormComponent implements OnInit {
  docenteForm!: FormGroup;
  isEditMode = false;
  submitted = false;
  loading = false;
  idDocente?: number;
  
  // Variable para controlar el estado DIRTY
  mostrarAdvertenciaDirty = false;

  constructor(
    private fb: FormBuilder,
    private docenteService: DocenteService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    
    // Suscripción para advertir si hay cambios sin guardar
    this.docenteForm.valueChanges.subscribe(() => {
      this.mostrarAdvertenciaDirty = this.docenteForm.dirty && this.docenteForm.valid;
    });

    this.idDocente = Number(this.route.snapshot.paramMap.get('id'));
    if (this.idDocente) {
      this.isEditMode = true;
      this.loadDocente(this.idDocente);
    }
  }

  initForm(): void {
    this.docenteForm = this.fb.group({
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
        Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$'), // Solo letras
        sinEspaciosBlancos()
      ]],
      apellidos: ['', [
        Validators.required, 
        Validators.minLength(3),
        Validators.maxLength(50),
        Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$'), // Solo letras
        sinEspaciosBlancos()
      ]],
      especialidad: ['', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(60),
        sinEspaciosBlancos()
      ]],
      correo: ['', [
        Validators.required, // Ahora es obligatorio
        Validators.email,
        sinEspaciosBlancos()
      ]],
      telefono: ['', [
        Validators.required, // Ahora es obligatorio
        Validators.pattern(/^[0-9]{9}$/) // Exactamente 9 dígitos
      ]]
    });
  }

  loadDocente(id: number): void {
    this.loading = true;
    this.docenteService.findById(id).subscribe({
      next: (data) => {
        if (data) {
          this.docenteForm.patchValue(data);
          // Marcamos como pristine al cargar datos de edición
          this.docenteForm.markAsPristine();
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar docente', err);
        this.loading = false;
      }
    });
  }

  get f() { return this.docenteForm.controls; }

  onSubmit(): void {
    this.submitted = true;
    
    // Restricción: Forzar visualización de errores si el form es inválido
    if (this.docenteForm.invalid) {
      this.docenteForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const formData = this.docenteForm.value;

    if (this.isEditMode) {
      this.docenteService.update(this.idDocente!, formData).subscribe({
        next: () => this.router.navigate(['/docentes']),
        error: (err) => {
          alert('Error al actualizar: ' + (err.error?.message || err.message));
          this.loading = false;
        }
      });
    } else {
      const { idDocente, ...dataToSave } = formData;
      this.docenteService.save(dataToSave).subscribe({
        next: () => this.router.navigate(['/docentes']),
        error: (err) => {
          alert('Error al registrar: ' + (err.error?.message || err.message));
          this.loading = false;
        }
      });
    }
  }

  cancel(): void {
    // Restricción: Advertir si hay cambios sin guardar antes de salir
    if (this.docenteForm.dirty) {
      const confirmar = confirm('Tienes cambios sin guardar. ¿Seguro que deseas salir?');
      if (!confirmar) return;
    }
    this.router.navigate(['/docentes']);
  }
}