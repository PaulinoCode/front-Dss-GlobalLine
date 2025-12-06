import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Auth } from '../../../services/auth';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
loginForm: FormGroup;
  mensaje: string = '';

  private fb = inject(FormBuilder);
  private authService = inject(Auth);
  private router = inject(Router);

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ingresar() {
    if (this.loginForm.valid) {
      this.mensaje = 'Conectando...';
      const { email, password } = this.loginForm.value;

      this.authService.login(email, password).subscribe({
        next: () => {
          this.mensaje = '¡LOGIN EXITOSO! Token guardado.';
          console.log('Acceso concedido');
          // --- AQUÍ ESTÁ EL CAMBIO ---
          // Te lleva a la ruta '/clients' que definimos en app.routes.ts
          this.router.navigate(['/clients']);
        },
        error: (err) => {
          console.error(err);
          this.mensaje = 'ERROR: Credenciales incorrectas';
        }
      });
    }
  }
}
