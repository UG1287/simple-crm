import { Component, inject } from '@angular/core';
import { AsyncPipe, NgIf, DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { switchMap, map } from 'rxjs';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';

import { UsersFirestoreService } from '../../../core/services/users-firestore.service';
import { AddCustomerDialogComponent } from '../add-customer-dialog/add-customer-dialog.component';
import { ConfirmDialogComponent } from '../../../shared/ui/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-customer-detail',
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatMenuModule,
    DatePipe,
  ],
  templateUrl: './customer-detail.component.html',
  styleUrls: ['./customer-detail.component.scss'],
})
export class CustomerDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly usersDb = inject(UsersFirestoreService);
  private readonly dialog = inject(MatDialog);

  readonly id$ = this.route.paramMap.pipe(map((p) => p.get('id') ?? ''));

  // ✅ BONUS: safe (null if missing)
  readonly user$ = this.id$.pipe(
    switchMap((id) => this.usersDb.getUserByIdSafe$(id))
  );

  edit(user: any): void {
    if (!user?.id) return;

    const userCopy =
      typeof structuredClone === 'function'
        ? structuredClone(user)
        : JSON.parse(JSON.stringify(user));

    this.dialog.open(AddCustomerDialogComponent, {
      width: '560px',
      disableClose: true,
      autoFocus: true,
      restoreFocus: true,
      data: { mode: 'edit', id: user.id, user: userCopy },
    });
  }

  initials(user: any): string {
    const f = (user?.firstName ?? '').trim();
    const l = (user?.lastName ?? '').trim();
    const a = f ? f[0] : '';
    const b = l ? l[0] : '';
    return (a + b).toUpperCase() || 'U';
  }

  delete(user: any): void {
    if (!user?.id) return;

    const ref = this.dialog.open(ConfirmDialogComponent, {
      width: '420px',
      disableClose: true,
      data: {
        title: 'Delete customer?',
        message: `This will permanently delete ${user.firstName ?? ''} ${
          user.lastName ?? ''
        }.`,
        confirmText: 'Delete',
        cancelText: 'Cancel',
      },
    });

    ref.afterClosed().subscribe(async (confirmed: boolean) => {
      if (!confirmed) return;
      await this.usersDb.deleteUser(user.id);
      await this.router.navigate(['/customers']);
    });
  }
}
