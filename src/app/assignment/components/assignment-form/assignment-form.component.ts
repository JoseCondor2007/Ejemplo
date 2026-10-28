import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AsignacionService } from '../../../core/services/Assignment.service'; 
import { DocenteService } from '../../../core/services/Teacher.service'; 

export function sinEspaciosBlancos(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const esEspacio = (control.value || '').toString().trim().length === 0;
    return esEspacio ? { sinEspacios: true } : null;
  };
}

@Component({
  selector: 'app-assignment-form',
  templateUrl: './assignment-form.component.html',
  styleUrls: ['./assignment-form.component.css']
})
export class AssignmentFormComponent implements OnInit {
  asignacionForm!: FormGroup;
  isEditMode = false;
  submitted = false;
  loading = false;
  idAssignment?: number;

  docentes: any[] = [];
  cursos: any[] = [];
  secciones: any[] = []; 

  mostrarAdvertenciaDirty = false;

  constructor(
    private fb: FormBuilder,
    private AsignacionService: AsignacionService, 
    private teacherService: DocenteService,       
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadDropdownData();

    this.idAssignment = Number(this.route.snapshot.paramMap.get('id'));
    if (this.idAssignment) {
      this.isEditMode = true;
      this.loadAsignacion(this.idAssignment);
    }
  }

  initForm(): void {
    const anioActual = new Date().getFullYear();

    this.asignacionForm = this.fb.group({
      teacherId: ['', [Validators.required]],
      courseId: ['', [Validators.required]],
      sectionId: ['', [Validators.required]],
      years: [anioActual, [
        Validators.required, 
        Validators.min(2020),
        Validators.max(anioActual)
      ]],
      assignmentDate: [new Date().toISOString().split('T')[0], [Validators.required]], 
      assignedHours: [null, [Validators.min(1)]], 
      observations: ['']
    });

    this.asignacionForm.valueChanges.subscribe(() => {
      this.mostrarAdvertenciaDirty = this.asignacionForm.dirty && this.asignacionForm.valid;
    });
  }

  loadDropdownData(): void {
    this.teacherService.findByState('A').subscribe({
      next: (data) => this.docentes = data,
      error: (err) => console.error('Error al cargar docentes', err)
    });

    // ✅ Cursos exactos de la Base de Datos (del script SQL)
    this.cursos = [
      { idCurso: 1, nombre: 'Matemática' },
      { idCurso: 2, nombre: 'Comunicación' },
      { idCurso: 3, nombre: 'Personal Social' },
      { idCurso: 4, nombre: 'Ciencia y Tecnología' },
      { idCurso: 5, nombre: 'Educación Física' },
      { idCurso: 6, nombre: 'Arte y Cultura' },
      { idCurso: 7, nombre: 'Inglés como Lengua Extranjera' },
      { idCurso: 8, nombre: 'Castellano como Segunda Lengua' },
      { idCurso: 9, nombre: 'Educación Religiosa' }
    ];

    // ✅ Secciones base (Si tienes 18 en BD, puedes agregarlas todas aquí si quieres)
    this.secciones = [
      { idSeccion: 1, nombre: 'A' },
      { idSeccion: 2, nombre: 'B' },
      { idSeccion: 3, nombre: 'C' },
      { idSeccion: 4, nombre: 'A' },
      { idSeccion: 5, nombre: 'B' },
      { idSeccion: 6, nombre: 'C' },
      { idSeccion: 7, nombre: 'A' },
      { idSeccion: 8, nombre: 'B' },
      { idSeccion: 9, nombre: 'C' },
      { idSeccion: 10, nombre: 'A' },
      { idSeccion: 11, nombre: 'B' },
      { idSeccion: 12, nombre: 'C' },
      { idSeccion: 13, nombre: 'A' },
      { idSeccion: 14, nombre: 'B' },
      { idSeccion: 15, nombre: 'C' },
      { idSeccion: 16, nombre: 'A' },
      { idSeccion: 17, nombre: 'B' },
      { idSeccion: 18, nombre: 'C' }
    ];
  }

  loadAsignacion(id: number): void {
    this.loading = true;
    this.AsignacionService.findById(id).subscribe({
      next: (data: any) => {
        if (data) {
          // ✅ CONVERSIÓN INVERSA: De DD-MMM-YYYY (Java) a YYYY-MM-DD (HTML)
          if (data.assignmentDate) {
            try {
              const fechaJava = data.assignmentDate; 
              const meses: any = { Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06', Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12' };
              
              if (fechaJava.includes('-') && isNaN(Number(fechaJava.split('-')[1]))) {
                const [dia, mesTexto, anio] = fechaJava.split('-');
                data.assignmentDate = `${anio}-${meses[mesTexto]}-${dia}`;
              }
            } catch (e) {
              console.error('Error convirtiendo fecha de backend', e);
            }
          }

          this.asignacionForm.patchValue(data);
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
    
    if (this.asignacionForm.invalid) {
      this.asignacionForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const formData = { ...this.asignacionForm.value };

    // ✅ CONVERSIÓN: De YYYY-MM-DD (HTML) a DD-MMM-YYYY (Java)
    if (formData.assignmentDate) {
      try {
        const [anio, mesNumero, dia] = formData.assignmentDate.split('-');
        const nombresMeses = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const mesTexto = nombresMeses[parseInt(mesNumero, 10) - 1];
        formData.assignmentDate = `${dia}-${mesTexto}-${anio}`; 
      } catch (e) {
        console.error('Error convirtiendo fecha para enviar', e);
      }
    }

    if (this.isEditMode) {
      this.AsignacionService.update(this.idAssignment!, formData).subscribe({
        next: () => this.router.navigate(['/asignaciones']),
        error: (err) => {
          alert('Error al actualizar: ' + (err.error?.message || err.message));
          this.loading = false;
        }
      });
    } else {
      this.AsignacionService.save(formData).subscribe({
        next: () => this.router.navigate(['/asignaciones']),
        error: (err) => {
          alert('Error al registrar: ' + (err.error?.message || err.message));
          this.loading = false;
        }
      });
    }
  }

  cancel(): void {
    if (this.asignacionForm.dirty) {
      const confirmar = confirm('Tienes cambios sin guardar. ¿Seguro que deseas salir?');
      if (!confirmar) return;
    }
    this.router.navigate(['/asignaciones']);
  }
}