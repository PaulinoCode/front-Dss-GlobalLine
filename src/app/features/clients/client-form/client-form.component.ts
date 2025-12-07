import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';

// Importamos tus modelos y servicios
import { ClientModel } from '../../../models/client.model';
import { ClientService } from '../../../services/client.service';

@Component({
  selector: 'app-client-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './client-form.component.html',
  styleUrl: './client-form.component.scss',
})
export class ClientFormComponent implements OnInit{

  clientForm!: FormGroup;
  isEditMode = false;
  clientId?: number;

  private fb = inject(FormBuilder);
  private clientService = inject(ClientService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  constructor() {
    this.initForm();
  }

  ngOnInit(): void {
    // Verificamos si estamos editando (¿hay ID en la URL?)
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.clientId = Number(id);
      this.loadClientData(this.clientId);
    }
  }

  initForm() {
    this.clientForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required]
    });
  }

  loadClientData(id: number) {
    this.clientService.getClientById(id).subscribe({
      next: (client) => {
        // Llenamos el formulario con los datos que vinieron de la BD
        this.clientForm.patchValue(client);
      },
      error: (err) => console.error('Error cargando cliente', err)
    });
  }

  save() {
    if (this.clientForm.invalid) return;

    const clientData: ClientModel = this.clientForm.value;

    if (this.isEditMode && this.clientId) {
      // ACTUALIZAR
      this.clientService.updateClient(this.clientId, clientData).subscribe(() => {
        this.router.navigate(['/clients']);
      });
    } else {
      // CREAR
      this.clientService.createClient(clientData).subscribe(() => {
        this.router.navigate(['/clients']);
      });
    }
  }
}
