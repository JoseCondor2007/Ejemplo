import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CompetenciaService } from '../../../core/services/competencia.service';

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
  selector: 'app-competencia-form',
  templateUrl: './competencia-form.component.html',
  styleUrls: ['./competencia-form.component.css']
})
export class CompetenciaFormComponent implements OnInit {
  competenciaForm!: FormGroup;
  isEditMode = false;
  submitted = false;
  loading = false;
  idCompetencia?: number;

  cursos: any[] = [];
  
  // Variable para mostrar el estado DIRTY
  mostrarAdvertenciaDirty = false;

  constructor(
    private fb: FormBuilder,
    private competenciaService: CompetenciaService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadDropdownData();

    // Suscripción para detectar cambios sin guardar (DIRTY)
    this.competenciaForm.valueChanges.subscribe(() => {
      this.mostrarAdvertenciaDirty = this.competenciaForm.dirty && this.competenciaForm.valid;
    });

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.idCompetencia = Number(idParam);
      this.isEditMode = true;
      this.loadCompetencia(this.idCompetencia);
    }
  }

  initForm(): void {
    this.competenciaForm = this.fb.group({
      idCurso: ['', [Validators.required]],
      codigo: ['', [
        Validators.required, 
        Validators.minLength(3), 
        Validators.maxLength(10),
        Validators.pattern('^[A-Z0-9-]+$'), // Solo mayúsculas, números y guiones
        sinEspaciosBlancos()
      ]],
      nombre: ['', [
        Validators.required, 
        Validators.minLength(5), 
        Validators.maxLength(100),
        sinEspaciosBlancos()
      ]],
      descripcion: ['', [
        Validators.maxLength(250)
      ]],
      capacidadesArray: this.fb.array([
        this.fb.control('', [Validators.required, Validators.minLength(5), sinEspaciosBlancos()])
      ])
    });
  }

  // Getter para el FormArray de capacidades
  get capacidadesArray(): FormArray {
    return this.competenciaForm.get('capacidadesArray') as FormArray;
  }

  addCapacidad(): void {
    // Restricción: Máximo 5 capacidades por competencia
    if (this.capacidadesArray.length < 5) {
      this.capacidadesArray.push(this.fb.control('', [Validators.required, Validators.minLength(5), sinEspaciosBlancos()]));
    }
  }

  removeCapacidad(index: number): void {
    // Restricción: Debe haber al menos 1 capacidad
    if (this.capacidadesArray.length > 1) {
      this.capacidadesArray.removeAt(index);
    }
  }

  loadDropdownData(): void {
    this.cursos = [
      { idCurso: 1, nombre: 'Matemáticas' },
      { idCurso: 2, nombre: 'Comunicación' },
      { idCurso: 3, nombre: 'Desarrollo Web' }
    ];
  }

  loadCompetencia(id: number): void {
    this.loading = true;
    this.competenciaService.findById(id).subscribe({
      next: (data) => {
        if (data) {
          this.competenciaForm.patchValue({
            idCurso: data.idCurso,
            codigo: data.codigo,
            nombre: data.nombre,
            descripcion: data.descripcion
          });

          if (data.capacidades) {
            try {
              const parsedCapacidades: string[] = JSON.parse(data.capacidades);
              this.capacidadesArray.clear();
              parsedCapacidades.forEach(cap => {
                this.capacidadesArray.push(this.fb.control(cap, [Validators.required, Validators.minLength(5), sinEspaciosBlancos()]));
              });
            } catch (e) {
              console.error('Error al parsear capacidades', e);
            }
          }
          // Marcamos como pristine al cargar datos de edición
          this.competenciaForm.markAsPristine();
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar competencia', err);
        this.loading = false;
      }
    });
  }

  get f() {
    return this.competenciaForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    
    // Restricción: Marcar todos los controles como tocados (incluyendo el FormArray) si hay error
    if (this.competenciaForm.invalid) {
      this.competenciaForm.markAllAsTouched();
      this.capacidadesArray.controls.forEach(control => control.markAsTouched());
      return;
    }

    this.loading = true;
    const formValues = this.competenciaForm.value;

    // Convertir el arreglo de capacidades a un JSON string para la base de datos
    const competenciaData = {
      idCurso: formValues.idCurso,
      codigo: formValues.codigo.toUpperCase(), // Guardamos en mayúsculas
      nombre: formValues.nombre,
      descripcion: formValues.descripcion,
      capacidades: JSON.stringify(formValues.capacidadesArray)
    };

    if (this.isEditMode && this.idCompetencia) {
      this.competenciaService.update(this.idCompetencia, competenciaData).subscribe({
        next: () => this.router.navigate(['/competencias']),
        error: (err) => {
          alert('Error al actualizar: ' + (err.error?.message || err.message));
          this.loading = false;
        }
      });
    } else {
      this.competenciaService.save(competenciaData).subscribe({
        next: () => this.router.navigate(['/competencias']),
        error: (err) => {
          alert('Error al registrar: ' + (err.error?.message || err.message));
          this.loading = false;
        }
      });
    }
  }

  cancel(): void {
    // Restricción: Advertir si hay cambios sin guardar antes de salir
    if (this.competenciaForm.dirty) {
      const confirmar = confirm('Tienes cambios sin guardar. ¿Seguro que deseas salir?');
      if (!confirmar) return;
    }
    this.router.navigate(['/competencias']);
  }
}