import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatriculaService } from '../../../core/services/Enrollment.service'; 
import { EstudianteService } from '../../../core/services/Student.service'; 

// =========================================================================
// VALIDADOR PERSONALIZADO: Evitar fechas de matrícula futuras
// =========================================================================
export function fechaNoFutura(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;
    
    const fechaIngresada = new Date(control.value);
    const fechaActual = new Date();
    fechaActual.setHours(23, 59, 59, 999); 

    if (fechaIngresada > fechaActual) {
      return { fechaFutura: true };
    }
    return null;
  };
}

@Component({
  selector: 'app-enrollment-form', // ✅ Selector en inglés
  templateUrl: './enrollment-form.component.html',
  styleUrls: ['./enrollment-form.component.css']
})
export class EnrollmentFormComponent implements OnInit { // ✅ Clase en inglés
  enrollmentForm!: FormGroup;
  isEditMode = false;
  submitted = false;
  loading = false;
  idEnrollment?: number; // ✅ Variable en inglés

  estudiantes: any[] = [];
  secciones: any[] = [];
  
  mostrarAdvertenciaDirty = false;

  constructor(
    private fb: FormBuilder,
    private MatriculaService: MatriculaService, // ✅ Servicio en inglés
    private studentService: EstudianteService,       // ✅ Servicio en inglés
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadDropdownData();

    this.enrollmentForm.valueChanges.subscribe(() => {
      this.mostrarAdvertenciaDirty = this.enrollmentForm.dirty && this.enrollmentForm.valid;
    });

    this.idEnrollment = Number(this.route.snapshot.paramMap.get('id'));
    if (this.idEnrollment) {
      this.isEditMode = true;
      this.loadEnrollment(this.idEnrollment);
    }
  }

  initForm(): void {
    this.enrollmentForm = this.fb.group({
      studentId: ['', [Validators.required]],       // ✅ Inglés
      sectionId: ['', [Validators.required]],       // ✅ Inglés
      guardianId: [null],                           // ✅ Inglés (Nuevo campo opcional)
      academicPeriod: ['', [                        // ✅ Inglés
        Validators.required, 
        Validators.pattern(/^[0-9]{4}-(I|II)$/) 
      ]],
      enrollmentDate: ['', [                        // ✅ Inglés
        Validators.required,
        fechaNoFutura() 
      ]]
    });
  }

  loadDropdownData(): void {
    this.studentService.findByState('A').subscribe({
      next: (data) => this.estudiantes = data,
      error: (err) => console.error('Error al cargar estudiantes', err)
    });

    this.secciones = [
      { idSeccion: 1, nombre: '1° A - Secundaria' },
      { idSeccion: 2, nombre: '2° B - Secundaria' },
      { idSeccion: 3, nombre: '3° A - Secundaria' }
    ];
  }

  loadEnrollment(id: number): void {
    this.loading = true;
    this.MatriculaService.findById(id).subscribe({
      next: (data) => {
        if (data) {
          this.enrollmentForm.patchValue(data);
          this.enrollmentForm.markAsPristine(); 
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar matrícula', err);
        this.loading = false;
      }
    });
  }

  get f() { return this.enrollmentForm.controls; }

  onSubmit(): void {
    this.submitted = true;
    
    if (this.enrollmentForm.invalid) {
      this.enrollmentForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const formData = this.enrollmentForm.value;

    if (this.isEditMode) {
      this.MatriculaService.update(this.idEnrollment!, formData).subscribe({
        next: () => this.router.navigate(['/matriculas']),
        error: (err) => {
          alert('Error al actualizar: ' + (err.error?.message || err.message));
          this.loading = false;
        }
      });
    } else {
      this.MatriculaService.save(formData).subscribe({
        next: () => this.router.navigate(['/matriculas']),
        error: (err) => {
          alert('Error al registrar: ' + (err.error?.message || err.message));
          this.loading = false;
        }
      });
    }
  }

  cancel(): void {
    if (this.enrollmentForm.dirty) {
      const confirmar = confirm('Tienes cambios sin guardar. ¿Seguro que deseas salir?');
      if (!confirmar) return;
    }
    this.router.navigate(['/matriculas']);
  }
}