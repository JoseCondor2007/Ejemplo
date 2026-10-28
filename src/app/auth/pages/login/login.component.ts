import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  errorMessage = '';
  showPassword = false;

  // 🔥 CREDENCIALES DE PRUEBA (Colegio República de Chile) 🔥
  private usuariosPrueba = [
    { role: 'admin', email: 'jose.admin@republicadechile.edu.pe', password: 'Admin123!' },
    { role: 'admin', email: 'massiel.admin@republicadechile.edu.pe', password: 'Massiel456!' },
    { role: 'admin', email: 'oscar.admin@republicadechile.edu.pe', password: 'Oscar789!' }
  ];

  // Getters para acceder fácilmente a los controles en el HTML
  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    // Formulario precargado con el primer usuario para pruebas rápidas
    this.loginForm = this.fb.group({
      role: ['admin', Validators.required], 
      email: ['jose.admin@republicadechile.edu.pe', [Validators.required, Validators.email]],
      password: ['Admin123!', [Validators.required, Validators.minLength(6)]],
      rememberMe: [true]
    });
  }

  ngOnInit(): void {}

  // Método para mostrar/ocultar la contraseña
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  // Método para enviar el formulario
  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const formValues = this.loginForm.value;

    // 1. Verificar si las credenciales coinciden con los usuarios de prueba
    const usuarioValido = this.usuariosPrueba.find(u => 
      u.email.toLowerCase() === formValues.email.toLowerCase() && 
      u.password === formValues.password
    );

    // 2. Lógica de autenticación (Simulada o real)
    if (usuarioValido) {
      // Simular que el backend respondió exitosamente
      setTimeout(() => {
        this.loading = false;
        // Guardar datos del usuario en el servicio (si tienes un método setUser, úsalo)
        this.authService.setUser({ 
          nombres: usuarioValido.email.split('@')[0].split('.')[0].charAt(0).toUpperCase() + usuarioValido.email.split('@')[0].split('.')[0].slice(1),
          email: usuarioValido.email,
          rol: usuarioValido.role
        });
        
        // Redirige a verificación
        this.router.navigate(['/verificacion']);
      }, 1500); // Simular latencia de red
      
    } else {
      // Si no existe en la lista de prueba, intentar con el servicio real
      this.authService.login(formValues).subscribe(
        (response) => {
          this.loading = false;
          this.router.navigate(['/verificacion']);
        },
        (error) => {
          this.loading = false;
          this.errorMessage = 'Credenciales incorrectas. Use: jose.admin@republicadechile.edu.pe / Admin123!';
        }
      );
    }
  }
}