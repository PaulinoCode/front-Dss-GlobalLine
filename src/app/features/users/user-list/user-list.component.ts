import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable, BehaviorSubject, switchMap } from 'rxjs';

import { UserModel } from '../../../models/user.model';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent {
  private userService = inject(UserService);
  private refresh$ = new BehaviorSubject<void>(undefined);

  users$: Observable<UserModel[]> = this.refresh$.pipe(
    switchMap(() => this.userService.getAll())
  );

  delete(id: number) {
    if (confirm('¿Estás seguro de eliminar este usuario?')) {
      this.userService.delete(id).subscribe({
        next: () => this.refresh$.next(),
        error: (err) => alert('Error: ' + err.message)
      });
    }
  }
}
