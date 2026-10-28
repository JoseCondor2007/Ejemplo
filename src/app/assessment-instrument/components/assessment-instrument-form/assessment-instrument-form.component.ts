import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AssessmentInstrumentService } from '../../../core/services/AssessmentInstrument.service'; 
import { CompetenciaService } from '../../../core/services/Competency.service'; 
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
    fechaActual.setHours(0, 0, 0, 0);

    if (fechaIngresada < fechaActual) {
      return { fechaPasada: true };
    }
    return null;
  };
}

@Component({
  selector: 'app-assessment-instrument-form',
  templateUrl: './assessment-instrument-form.component.html',
  styleUrls: ['./assessment-instrument-form.component.css']
})
export class AssessmentInstrumentFormComponent implements OnInit {
  instrumentoForm!: FormGroup;
  isEditMode = false;
  submitted = false;
  loading = false;
  idInstrumento?: number;

  competencias: any[] = [];
  mostrarAdvertenciaDirty = false;

  constructor(
    private fb: FormBuilder,
    private instrumentoService: AssessmentInstrumentService,
    private competenciaService: CompetenciaService, // ✅ Corregido a inglés
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadDropdownData();

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
      competencyId: ['', [Validators.required]],
      assignmentId: [null],
      capacityId: [null],
      instrumentName: ['', [
        Validators.required, 
        Validators.minLength(5),
        Validators.maxLength(100),
        sinEspaciosBlancos()
      ]],
      type: ['', [
        Validators.required, 
        Validators.minLength(3),
        Validators.maxLength(50),
        sinEspaciosBlancos()
      ]],
      description: ['', [
        Validators.maxLength(250)
      ]],
      conceptualWeight: [1.0, [
        Validators.required, 
        Validators.min(0.01),
        Validators.max(100)
      ]],
      assessmentDate: ['', [fechaNoPasada()]],
      evidenciasArray: this.fb.array([
        this.fb.control('', [Validators.required, Validators.minLength(5), sinEspaciosBlancos()])
      ])
    });
  }

  get evidenciasArray(): FormArray {
    return this.instrumentoForm.get('evidenciasArray') as FormArray;
  }

  addEvidencia(): void {
    if (this.evidenciasArray.length < 5) {
      this.evidenciasArray.push(this.fb.control('', [Validators.required, Validators.minLength(5), sinEspaciosBlancos()]));
    }
  }

  removeEvidencia(index: number): void {
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
          // ✅ CONVERSIÓN INVERSA: De DD-MMM-YYYY (Java) a YYYY-MM-DD (HTML)
          if (data.assessmentDate) {
            try {
              const fechaJava = data.assessmentDate; 
              const meses: any = { Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06', Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12' };
              
              if (fechaJava.includes('-') && isNaN(Number(fechaJava.split('-')[1]))) {
                const [dia, mesTexto, anio] = fechaJava.split('-');
                data.assessmentDate = `${anio}-${meses[mesTexto]}-${dia}`;
              }
            } catch (e) {
              console.error('Error convirtiendo fecha de backend', e);
            }
          }

          this.instrumentoForm.patchValue({
            competencyId: data.competencyId,
            assignmentId: data.assignmentId,
            capacityId: data.capacityId,
            instrumentName: data.instrumentName,
            type: data.type,
            description: data.description,
            conceptualWeight: data.conceptualWeight,
            assessmentDate: data.assessmentDate
          });

          if (data.evidence) {
            try {
              const parsedEvidencias: string[] = JSON.parse(data.evidence);
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
    
    if (this.instrumentoForm.invalid) {
      this.instrumentoForm.markAllAsTouched();
      this.evidenciasArray.controls.forEach(control => control.markAsTouched());
      return;
    }

    this.loading = true;
    const formValues = this.instrumentoForm.value;

    let fechaFormateada = formValues.assessmentDate;

    // ✅ CONVERSIÓN: De YYYY-MM-DD (HTML) a DD-MMM-YYYY (Java)
    if (fechaFormateada) {
      try {
        const [anio, mesNumero, dia] = fechaFormateada.split('-');
        const nombresMeses = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const mesTexto = nombresMeses[parseInt(mesNumero, 10) - 1];
        fechaFormateada = `${dia}-${mesTexto}-${anio}`; 
      } catch (e) {
        console.error('Error convirtiendo fecha para enviar', e);
      }
    }

    const instrumentoData = {
      competencyId: formValues.competencyId,
      assignmentId: formValues.assignmentId || null,
      capacityId: formValues.capacityId || null,
      instrumentName: formValues.instrumentName,
      type: formValues.type,
      description: formValues.description,
      conceptualWeight: formValues.conceptualWeight,
      assessmentDate: fechaFormateada || null, // ✅ Se envía la fecha formateada
      evidence: JSON.stringify(formValues.evidenciasArray)
    };

    if (this.isEditMode) {
      this.instrumentoService.update(this.idInstrumento!, instrumentoData as any).subscribe({
        next: () => this.router.navigate(['/instrumentos']),
        error: (err) => {
          alert('Error al actualizar: ' + (err.error?.message || err.message));
          this.loading = false;
        }
      });
    } else {
      this.instrumentoService.save(instrumentoData as any).subscribe({
        next: () => this.router.navigate(['/instrumentos']),
        error: (err) => {
          alert('Error al registrar: ' + (err.error?.message || err.message));
          this.loading = false;
        }
      });
    }
  }

  cancel(): void {
    if (this.instrumentoForm.dirty) {
      const confirmar = confirm('Tienes cambios sin guardar. ¿Seguro que deseas salir?');
      if (!confirmar) return;
    }
    this.router.navigate(['/instrumentos']);
  }
}