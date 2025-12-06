import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs'; // <--- Importamos Observable

import { ClientM } from '../../../models/clientM';
import { ClientService } from '../../../services/client';

@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './client-list.html',
  styleUrl: './client-list.scss',
})
export class ClientListComponent implements OnInit {

  // En lugar de una lista fija, tenemos un "Flujo Observable" ($)
  clients$!: Observable<ClientM[]>;

  private clientService = inject(ClientService);

  ngOnInit(): void {
    // Simplemente conectamos el tubo, no nos suscribimos aquí
    this.clients$ = this.clientService.getClients();
  }

  delete(id: number) {
    if(confirm('¿Estás seguro de eliminar este cliente?')) {
      // Aquí sí nos suscribimos porque es una acción puntual
      this.clientService.deleteClient(id).subscribe(() => {
        // Recargamos el flujo
        this.clients$ = this.clientService.getClients();
      });
    }
  }
}
