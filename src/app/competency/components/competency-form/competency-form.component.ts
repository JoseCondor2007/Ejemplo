import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CompetenciaService } from '../../../core/services/Competency.service';

export function sinEspaciosBlancos(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const esEspacio = (control.value || '').trim().length === 0;
    return esEspacio ? { sinEspacios: true } : null;
  };
}

@Component({
  selector: 'app-competency-form',
  templateUrl: './competency-form.component.html',
  styleUrls: ['./competency-form.component.css']
})
export class CompetencyFormComponent implements OnInit {
  competenciaForm!: FormGroup;
  isEditMode = false;
  submitted = false;
  loading = false;
  idCompetency?: number;

  cursos: any[] = [];
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

    this.competenciaForm.valueChanges.subscribe(() => {
      this.mostrarAdvertenciaDirty = this.competenciaForm.dirty && this.competenciaForm.valid;
    });

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.idCompetency = Number(idParam);
      this.isEditMode = true;
      this.loadCompetencia(this.idCompetency);
    }
  }

  initForm(): void {
    this.competenciaForm = this.fb.group({
      courseId: ['', [Validators.required]],
      code: ['', [
        Validators.required, 
        Validators.minLength(3), 
        Validators.maxLength(30), // Ajustado al nuevo varchar(30) de la BD
        Validators.pattern('^[A-Z0-9-]+$'),
        sinEspaciosBlancos()
      ]],
      name: ['', [
        Validators.required, 
        Validators.minLength(5), 
        Validators.maxLength(200), // Ajustado al nuevo varchar(200)
        sinEspaciosBlancos()
      ]],
      description: ['', [
        Validators.maxLength(500) // Ajustado al nuevo varchar(500)
      ]]
    });
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
          this.competenciaForm.patchValue(data); // Como los nombres coinciden (courseId, code, etc.) el patchValue directo funciona
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

  get f() { return this.competenciaForm.controls; }

  onSubmit(): void {
    this.submitted = true;
    
    if (this.competenciaForm.invalid) {
      this.competenciaForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const formData = this.competenciaForm.value;
    formData.code = formData.code.toUpperCase(); // Forzar mayúsculas

    if (this.isEditMode && this.idCompetency) {
      this.competenciaService.update(this.idCompetency, formData).subscribe({
        next: () => this.router.navigate(['/competencias']),
        error: (err) => {
          alert('Error al actualizar: ' + (err.error?.message || err.message));
          this.loading = false;
        }
      });
    } else {
      this.competenciaService.save(formData).subscribe({
        next: () => this.router.navigate(['/competencias']),
        error: (err) => {
          alert('Error al registrar: ' + (err.error?.message || err.message));
          this.loading = false;
        }
      });
    }
  }

  cancel(): void {
    if (this.competenciaForm.dirty) {
      const confirmar = confirm('Tienes cambios sin guardar. ¿Seguro que deseas salir?');
      if (!confirmar) return;
    }
    this.router.navigate(['/competencias']);
  }
}