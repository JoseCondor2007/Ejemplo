import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DocenteService } from '../../../core/services/Teacher.service'; 

// =========================================================================
// VALIDADOR PERSONALIZADO: Evitar solo espacios en blanco
// =========================================================================
export function sinEspaciosBlancos(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const esEspacio = (control.value || '').toString().trim().length === 0;
    return esEspacio ? { sinEspacios: true } : null;
  };
}

@Component({
  selector: 'app-teacher-form',
  templateUrl: './teacher-form.component.html',
  styleUrls: ['./teacher-form.component.css']
})
export class TeacherFormComponent implements OnInit {
  teacherForm!: FormGroup;
  isEditMode = false;
  submitted = false;
  loading = false;
  idTeacher?: number;
  
  mostrarAdvertenciaDirty = false;

  constructor(
    private fb: FormBuilder,
    private teacherService: DocenteService, 
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    
    this.teacherForm.valueChanges.subscribe(() => {
      this.mostrarAdvertenciaDirty = this.teacherForm.dirty && this.teacherForm.valid;
    });

    this.idTeacher = Number(this.route.snapshot.paramMap.get('id'));
    if (this.idTeacher) {
      this.isEditMode = true;
      this.loadTeacher(this.idTeacher);
    }
  }

  initForm(): void {
    this.teacherForm = this.fb.group({
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
      birthDate: ['', [Validators.required]], // ✅ Nuevo campo
      specialty: ['', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(60),
        sinEspaciosBlancos()
      ]],
      email: ['', [
        Validators.required,
        Validators.email,
        sinEspaciosBlancos()
      ]],
      phone: ['', [
        Validators.required,
        Validators.pattern(/^[0-9]{9}$/)
      ]]
    });
  }

  loadTeacher(id: number): void {
    this.loading = true;
    this.teacherService.findById(id).subscribe({
      next: (data: any) => {
        if (data) {
          // ✅ CONVERSIÓN INVERSA: De DD-MMM-YYYY (Java) a YYYY-MM-DD (HTML)
          if (data.birthDate) {
            try {
              const fechaJava = data.birthDate; // Ej: "16-May-1988"
              const meses: any = { Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06', Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12' };
              
              // Si viene en el formato de Java, lo convertimos
              if (fechaJava.includes('-') && isNaN(Number(fechaJava.split('-')[1]))) {
                const [dia, mesTexto, anio] = fechaJava.split('-');
                const mesNumero = meses[mesTexto];
                data.birthDate = `${anio}-${mesNumero}-${dia}`;
              }
            } catch (e) {
              console.error('Error convirtiendo fecha de backend', e);
            }
          }

          this.teacherForm.patchValue(data);
          this.teacherForm.markAsPristine();
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar docente', err);
        this.loading = false;
      }
    });
  }

  get f() { return this.teacherForm.controls; }

  onSubmit(): void {
    this.submitted = true;
    
    if (this.teacherForm.invalid) {
      this.teacherForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    // Copiamos los datos para no alterar el formulario original
    const formData = { ...this.teacherForm.value };

    // ✅ CONVERSIÓN: De YYYY-MM-DD (HTML) a DD-MMM-YYYY (Java)
    if (formData.birthDate) {
      try {
        const [anio, mesNumero, dia] = formData.birthDate.split('-');
        const nombresMeses = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const mesTexto = nombresMeses[parseInt(mesNumero, 10) - 1];
        formData.birthDate = `${dia}-${mesTexto}-${anio}`; // Ej: 16-May-1988
      } catch (e) {
        console.error('Error convirtiendo fecha para enviar', e);
      }
    }

    if (this.isEditMode) {
      this.teacherService.update(this.idTeacher!, formData).subscribe({
        next: () => this.router.navigate(['/docentes']),
        error: (err) => {
          alert('Error al actualizar: ' + (err.error?.message || err.message));
          this.loading = false;
        }
      });
    } else {
      this.teacherService.save(formData).subscribe({
        next: () => this.router.navigate(['/docentes']),
        error: (err) => {
          alert('Error al registrar: ' + (err.error?.message || err.message));
          this.loading = false;
        }
      });
    }
  }

  cancel(): void {
    if (this.teacherForm.dirty) {
      const confirmar = confirm('Tienes cambios sin guardar. ¿Seguro que deseas salir?');
      if (!confirmar) return;
    }
    this.router.navigate(['/docentes']);
  }
}