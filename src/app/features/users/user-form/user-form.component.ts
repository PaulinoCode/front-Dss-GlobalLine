import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';

import { UserService } from '../../../services/user.service';
import { UserModel } from '../../../models/user.model';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss'
})
export class UserFormComponent implements OnInit {

  form!: FormGroup;
  isEdit = false;
  userId?: number;

  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  constructor() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [''], // Validación dinámica (ver abajo)
      role: ['MANAGER', Validators.required]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      // MODO EDICIÓN
      this.isEdit = true;
      this.userId = Number(id);
      this.userService.getById(this.userId).subscribe(u => {
        this.form.patchValue(u);
        // En edición, la contraseña es opcional. Quitamos validador.
        this.form.get('password')?.clearValidators();
        this.form.get('password')?.updateValueAndValidity();
      });
    } else {
      // MODO CREACIÓN: La contraseña es OBLIGATORIA
      this.form.get('password')?.setValidators([Validators.required, Validators.minLength(4)]);
      this.form.get('password')?.updateValueAndValidity();
    }
  }

  save() {
    if (this.form.invalid) return;

    const userData: UserModel = this.form.value;

    const request$ = this.isEdit
      ? this.userService.update(this.userId!, userData)
      : this.userService.create(userData);

    request$.subscribe({
      next: () => this.router.navigate(['/users']),
      error: (err) => alert('Error: ' + err.message)
    });
  }
}
