import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable, BehaviorSubject, switchMap } from 'rxjs';

import { ClientModel } from '../../../models/client.model';
import { ClientService } from '../../../services/client.service';

@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './client-list.component.html',
  styleUrl: './client-list.component.scss',
})
export class ClientListComponent implements OnInit {
  private clientService = inject(ClientService);
  private refreshClients$ = new BehaviorSubject<void>(undefined);

  clients$: Observable<ClientModel[]> = this.refreshClients$.pipe(
    switchMap(() => this.clientService.getClients())
  );

  ngOnInit(): void {}

  delete(id: number) {
    if (confirm('¿Estás seguro de eliminar este cliente?')) {
      this.clientService.deleteClient(id).subscribe({
        next: () => this.refreshClients$.next(),
        error: (err) => {
          console.error('Error al eliminar el cliente:', err);
          alert('No se pudo eliminar el cliente.');
        }
      });
    }
  }
}
