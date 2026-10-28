import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InstrumentoEvaluacionService } from '../../../core/services/instrumento-evaluacion.service';
import { CompetenciaService } from '../../../core/services/competencia.service';

// =========================================================================
// VALIDADOR PERSONALIZADO: Evitar solo espacios en blanco
// =========================================================================
export function sinEspaciosBlancos(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const esEspacio = (control.value || '').toString().trim().length === 0;
    return esEspacio ? { sinEspacios: true } : null;
  };
}

// =========================================================================
// VALIDADOR PERSONALIZADO: Fecha de evaluación no puede ser pasada
// =========================================================================
export function fechaNoPasada(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;
    
    const fechaIngresada = new Date(control.value);
    const fechaActual = new Date();
    fechaActual.setHours(0, 0, 0, 0); // Ignorar la hora para comparar solo días

    if (fechaIngresada < fechaActual) {
      return { fechaPasada: true };
    }
    return null;
  };
}

@Component({
  selector: 'app-instrumento-evaluacion-form',
  templateUrl: './instrumento-evaluacion-form.component.html',
  styleUrls: ['./instrumento-evaluacion-form.component.css']
})
export class InstrumentoEvaluacionFormComponent implements OnInit {
  instrumentoForm!: FormGroup;
  isEditMode = false;
  submitted = false;
  loading = false;
  idInstrumento?: number;

  competencias: any[] = [];
  mostrarAdvertenciaDirty = false;

  constructor(
    private fb: FormBuilder,
    private instrumentoService: InstrumentoEvaluacionService,
    private competenciaService: CompetenciaService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadDropdownData();

    // Suscripción para detectar cambios sin guardar
    this.instrumentoForm.valueChanges.subscribe(() => {
      this.mostrarAdvertenciaDirty = this.instrumentoForm.dirty && this.instrumentoForm.valid;
    });

    this.idInstrumento = Number(this.route.snapshot.paramMap.get('id'));
    if (this.idInstrumento) {
      this.isEditMode = true;
      this.loadInstrumento(this.idInstrumento);
    }
  }

  initForm(): void {
    this.instrumentoForm = this.fb.group({
      idCompetencia: ['', [Validators.required]],
      nombre: ['', [
        Validators.required, 
        Validators.minLength(5),
        Validators.maxLength(100),
        sinEspaciosBlancos()
      ]],
      tipo: ['', [
        Validators.required, 
        Validators.minLength(3),
        Validators.maxLength(50),
        sinEspaciosBlancos()
      ]],
      descripcion: ['', [
        Validators.maxLength(250)
      ]],
      pesoConceptual: [1.0, [
        Validators.required, 
        Validators.min(0.01), // Debe ser mayor a 0
        Validators.max(100)   // No puede superar 100%
      ]],
      fechaEvaluacion: ['', [fechaNoPasada()]], // Validación personalizada
      evidenciasArray: this.fb.array([
        this.fb.control('', [Validators.required, Validators.minLength(5), sinEspaciosBlancos()])
      ])
    });
  }

  get evidenciasArray(): FormArray {
    return this.instrumentoForm.get('evidenciasArray') as FormArray;
  }

  addEvidencia(): void {
    // Restricción: Máximo 5 evidencias
    if (this.evidenciasArray.length < 5) {
      this.evidenciasArray.push(this.fb.control('', [Validators.required, Validators.minLength(5), sinEspaciosBlancos()]));
    }
  }

  removeEvidencia(index: number): void {
    // Restricción: Mínimo 1 evidencia
    if (this.evidenciasArray.length > 1) {
      this.evidenciasArray.removeAt(index);
    }
  }

  loadDropdownData(): void {
    this.competenciaService.findByState('A').subscribe({
      next: (data) => this.competencias = data,
      error: (err) => console.error('Error al cargar competencias', err)
    });
  }

  loadInstrumento(id: number): void {
    this.loading = true;
    this.instrumentoService.findById(id).subscribe({
      next: (data: any) => {
        if (data) {
          this.instrumentoForm.patchValue({
            idCompetencia: data.idCompetencia,
            nombre: data.nombre,
            tipo: data.tipo,
            descripcion: data.descripcion,
            pesoConceptual: data.pesoConceptual,
            fechaEvaluacion: data.fechaEvaluacion
          });

          if (data.evidencias) {
            try {
              const parsedEvidencias: string[] = JSON.parse(data.evidencias);
              this.evidenciasArray.clear();
              parsedEvidencias.forEach(ev => {
                this.evidenciasArray.push(this.fb.control(ev, [Validators.required, Validators.minLength(5), sinEspaciosBlancos()]));
              });
            } catch (e) {
              console.error('Error al parsear evidencias', e);
            }
          }
          this.instrumentoForm.markAsPristine();
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar instrumento', err);
        this.loading = false;
      }
    });
  }

  get f() { return this.instrumentoForm.controls; }

  onSubmit(): void {
    this.submitted = true;
    
    // Restricción: Si es inválido, mostrar errores (incluyendo FormArray)
    if (this.instrumentoForm.invalid) {
      this.instrumentoForm.markAllAsTouched();
      this.evidenciasArray.controls.forEach(control => control.markAsTouched());
      return;
    }

    this.loading = true;
    const formValues = this.instrumentoForm.value;

    const instrumentoData = {
      idCompetencia: formValues.idCompetencia,
      nombre: formValues.nombre,
      tipo: formValues.tipo,
      descripcion: formValues.descripcion,
      pesoConceptual: formValues.pesoConceptual,
      fechaEvaluacion: formValues.fechaEvaluacion,
      evidencias: JSON.stringify(formValues.evidenciasArray)
    };

    if (this.isEditMode) {
      this.instrumentoService.update(this.idInstrumento!, instrumentoData).subscribe({
        next: () => this.router.navigate(['/instrumentos']),
        error: (err) => {
          alert('Error al actualizar: ' + (err.error?.message || err.message));
          this.loading = false;
        }
      });
    } else {
      const { idInstrumento, ...dataToSave } = instrumentoData as any;
      this.instrumentoService.save(dataToSave).subscribe({
        next: () => this.router.navigate(['/instrumentos']),
        error: (err) => {
          alert('Error al registrar: ' + (err.error?.message || err.message));
          this.loading = false;
        }
      });
    }
  }

  cancel(): void {
    // Restricción: Confirmar si hay cambios sin guardar
    if (this.instrumentoForm.dirty) {
      const confirmar = confirm('Tienes cambios sin guardar. ¿Seguro que deseas salir?');
      if (!confirmar) return;
    }
    this.router.navigate(['/instrumentos']);
  }
}