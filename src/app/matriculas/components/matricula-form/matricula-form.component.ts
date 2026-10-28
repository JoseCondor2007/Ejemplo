import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatriculaService } from '../../../core/services/matricula.service';
import { EstudianteService } from '../../../core/services/estudiante.service';

// =========================================================================
// VALIDADOR PERSONALIZADO: Evitar fechas de matrícula futuras
// =========================================================================
export function fechaNoFutura(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;
    
    const fechaIngresada = new Date(control.value);
    const fechaActual = new Date();
    // Ajustamos la hora a 00:00:00 para comparar solo la fecha
    fechaActual.setHours(23, 59, 59, 999); 

    if (fechaIngresada > fechaActual) {
      return { fechaFutura: true };
    }
    return null;
  };
}

@Component({
  selector: 'app-matricula-form',
  templateUrl: './matricula-form.component.html',
  styleUrls: ['./matricula-form.component.css']
})
export class MatriculaFormComponent implements OnInit {
  matriculaForm!: FormGroup;
  isEditMode = false;
  submitted = false;
  loading = false;
  idMatricula?: number;

  estudiantes: any[] = [];
  secciones: any[] = [];
  
  // Variable para controlar el estado DIRTY
  mostrarAdvertenciaDirty = false;

  constructor(
    private fb: FormBuilder,
    private matriculaService: MatriculaService,
    private estudianteService: EstudianteService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadDropdownData();

    // Suscripción para advertir cambios sin guardar
    this.matriculaForm.valueChanges.subscribe(() => {
      this.mostrarAdvertenciaDirty = this.matriculaForm.dirty && this.matriculaForm.valid;
    });

    this.idMatricula = Number(this.route.snapshot.paramMap.get('id'));
    if (this.idMatricula) {
      this.isEditMode = true;
      this.loadMatricula(this.idMatricula);
    }
  }

  initForm(): void {
    this.matriculaForm = this.fb.group({
      idEstudiante: ['', [Validators.required]],
      idSeccion: ['', [Validators.required]],
      periodoAcademico: ['', [
        Validators.required, 
        Validators.pattern(/^[0-9]{4}-(I|II)$/) // Formato exacto: 2026-I o 2026-II
      ]],
      fechaMatricula: ['', [
        Validators.required,
        fechaNoFutura() // No se puede matricular en el futuro
      ]]
    });
  }

  loadDropdownData(): void {
    this.estudianteService.findByState('A').subscribe({
      next: (data) => this.estudiantes = data,
      error: (err) => console.error('Error al cargar estudiantes', err)
    });

    this.secciones = [
      { idSeccion: 1, nombre: '1° A - Secundaria' },
      { idSeccion: 2, nombre: '2° B - Secundaria' },
      { idSeccion: 3, nombre: '3° A - Secundaria' }
    ];
  }

  loadMatricula(id: number): void {
    this.loading = true;
    this.matriculaService.findById(id).subscribe({
      next: (data) => {
        if (data) {
          this.matriculaForm.patchValue(data);
          this.matriculaForm.markAsPristine(); // Resetea el estado dirty al editar
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar matrícula', err);
        this.loading = false;
      }
    });
  }

  get f() { return this.matriculaForm.controls; }

  onSubmit(): void {
    this.submitted = true;
    
    // Restricción: Mostrar todos los errores si el form es inválido
    if (this.matriculaForm.invalid) {
      this.matriculaForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const formData = this.matriculaForm.value;

    if (this.isEditMode) {
      this.matriculaService.update(this.idMatricula!, formData).subscribe({
        next: () => this.router.navigate(['/matriculas']),
        error: (err) => {
          alert('Error al actualizar: ' + (err.error?.message || err.message));
          this.loading = false;
        }
      });
    } else {
      const { idMatricula, ...dataToSave } = formData;
      this.matriculaService.save(dataToSave).subscribe({
        next: () => this.router.navigate(['/matriculas']),
        error: (err) => {
          alert('Error al registrar: ' + (err.error?.message || err.message));
          this.loading = false;
        }
      });
    }
  }

  cancel(): void {
    // Restricción: Advertir si hay cambios sin guardar antes de salir
    if (this.matriculaForm.dirty) {
      const confirmar = confirm('Tienes cambios sin guardar. ¿Seguro que deseas salir?');
      if (!confirmar) return;
    }
    this.router.navigate(['/matriculas']);
  }
}