import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EstudianteService } from '../../../core/services/Student.service';

export function sinEspaciosBlancos(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const esEspacio = (control.value || '').toString().trim().length === 0;
    return esEspacio ? { sinEspacios: true } : null;
  };
}

export function fechaNoFutura(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;
    const fechaIngresada = new Date(control.value);
    const fechaActual = new Date();
    fechaActual.setHours(23, 59, 59, 999); // Ajuste para comparar solo días
    if (fechaIngresada > fechaActual) return { fechaFutura: true };
    return null;
  };
}

@Component({
  selector: 'app-student-form',
  templateUrl: './student-form.component.html',
  styleUrls: ['./student-form.component.css']
})
export class StudentFormComponent implements OnInit {
  studentForm!: FormGroup;
  isEditMode = false;
  submitted = false;
  loading = false;
  idStudent?: number;

  mostrarAdvertenciaDirty = false;

  constructor(
    private fb: FormBuilder,
    private studentService: EstudianteService, // ✅ Servicio en inglés
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    
    this.studentForm.valueChanges.subscribe(() => {
      this.mostrarAdvertenciaDirty = this.studentForm.dirty && this.studentForm.valid;
    });

    this.idStudent = Number(this.route.snapshot.paramMap.get('id'));
    if (this.idStudent) {
      this.isEditMode = true;
      this.loadStudent(this.idStudent);
    }
  }

  initForm(): void {
    this.studentForm = this.fb.group({
      documentType: ['DNI', [Validators.required]],
      documentNumber: ['', [
        Validators.required, 
        Validators.pattern(/^[0-9]{8,12}$/),
        sinEspaciosBlancos()
      ]],
      firstNames: ['', [
        Validators.required, 
        Validators.minLength(3),
        Validators.maxLength(50),
        Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$'),
        sinEspaciosBlancos()
      ]],
      lastNames: ['', [
        Validators.required, 
        Validators.minLength(3),
        Validators.maxLength(50),
        Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$'),
        sinEspaciosBlancos()
      ]],
      birthDate: ['', [
        Validators.required,
        fechaNoFutura()
      ]],
      sex: ['M', [Validators.required]],
      guardianId: ['', [Validators.required]],
      ubigeoId: [null]
      // ✅ Se eliminaron 'telefono' y 'direccion' porque no existen en la tabla Student
    });
  }

  loadStudent(id: number): void {
    this.loading = true;
    this.studentService.findById(id).subscribe({
      next: (data: any) => {
        if (data) {
          // ✅ CONVERSIÓN INVERSA: De DD-MMM-YYYY (Java) a YYYY-MM-DD (HTML)
          if (data.birthDate) {
            try {
              const fechaJava = data.birthDate; 
              const meses: any = { Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06', Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12' };
              
              if (fechaJava.includes('-') && isNaN(Number(fechaJava.split('-')[1]))) {
                const [dia, mesTexto, anio] = fechaJava.split('-');
                data.birthDate = `${anio}-${meses[mesTexto]}-${dia}`;
              }
            } catch (e) {
              console.error('Error convirtiendo fecha de backend', e);
            }
          }

          this.studentForm.patchValue(data);
          this.studentForm.markAsPristine();
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar estudiante', err);
        this.loading = false;
      }
    });
  }

  get f() { return this.studentForm.controls; }

  onSubmit(): void {
    this.submitted = true;
    
    if (this.studentForm.invalid) {
      this.studentForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const formData = { ...this.studentForm.value };

    // ✅ CONVERSIÓN: De YYYY-MM-DD (HTML) a DD-MMM-YYYY (Java)
    if (formData.birthDate) {
      try {
        const [anio, mesNumero, dia] = formData.birthDate.split('-');
        const nombresMeses = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const mesTexto = nombresMeses[parseInt(mesNumero, 10) - 1];
        formData.birthDate = `${dia}-${mesTexto}-${anio}`; 
      } catch (e) {
        console.error('Error convirtiendo fecha para enviar', e);
      }
    }

    if (this.isEditMode) {
      this.studentService.update(this.idStudent!, formData).subscribe({
        next: () => this.router.navigate(['/estudiantes']),
        error: (err) => {
          alert('Error al actualizar: ' + (err.error?.message || err.message));
          this.loading = false;
        }
      });
    } else {
      this.studentService.save(formData).subscribe({
        next: () => this.router.navigate(['/estudiantes']),
        error: (err) => {
          alert('Error al registrar: ' + (err.error?.message || err.message));
          this.loading = false;
        }
      });
    }
  }

  cancel(): void {
    if (this.studentForm.dirty) {
      const confirmar = confirm('Tienes cambios sin guardar. ¿Seguro que deseas salir?');
      if (!confirmar) return;
    }
    this.router.navigate(['/estudiantes']);
  }
}