import { AfterViewInit, Component, DestroyRef, ViewChild, inject } from '@angular/core';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';

import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { MatChipsModule } from '@angular/material/chips';

import { UsersFirestoreService } from '../../core/services/users-firestore.service';
import { AddCustomerDialogComponent } from './add-customer-dialog/add-customer-dialog.component';

type Status = 'lead' | 'customer' | 'vip';

type UserRow = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  city: string;
  status: Status;
};

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [
    NgIf,

    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatCardModule,

    MatTableModule,
    MatSortModule,
    MatPaginatorModule,

    MatFormFieldModule,
    MatInputModule,

    MatChipsModule,
  ],
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss'],
})
export class CustomersComponent implements AfterViewInit {
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);
  private readonly usersDb = inject(UsersFirestoreService);
  private readonly destroyRef = inject(DestroyRef);

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  readonly displayedColumns: Array<keyof UserRow | 'actions'> = ['name', 'email', 'city', 'status', 'actions'] as any;
  readonly dataSource = new MatTableDataSource<UserRow>([]);

  constructor() {
    // Live users -> table
    this.usersDb
      .getUsers$()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((rows: any[]) => {
        const mapped: UserRow[] = rows.map((u: any) => ({
          id: u.id,
          firstName: u.firstName ?? '',
          lastName: u.lastName ?? '',
          email: u.email ?? '',
          city: u.city ?? '',
          status: (u.status as Status) ?? 'lead',
        }));

        this.dataSource.data = mapped;
      });

    // Filter across multiple fields
    this.dataSource.filterPredicate = (data, filter) => {
      const f = filter.trim().toLowerCase();
      const hay = `${data.firstName} ${data.lastName} ${data.email} ${data.city} ${data.status}`.toLowerCase();
      return hay.includes(f);
    };

    // Sort: name column by lastName only
    this.dataSource.sortingDataAccessor = (item: UserRow, property: string) => {
      switch (property) {
        case 'name':
          return (item.lastName ?? '').toLowerCase();
        case 'email':
          return (item.email ?? '').toLowerCase();
        case 'city':
          return (item.city ?? '').toLowerCase();
        case 'status':
          return (item.status ?? '').toLowerCase();
        default:
          return '';
      }
    };
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(value: string): void {
    this.dataSource.filter = value.trim().toLowerCase();
    this.paginator?.firstPage();
  }

  openAddCustomerDialog(event?: MouseEvent): void {
    (event?.currentTarget as HTMLElement | null)?.blur();

    this.dialog.open(AddCustomerDialogComponent, {
      width: '560px',
      disableClose: true,
      autoFocus: true,
      restoreFocus: true,
      data: { mode: 'add' },
    });
  }

  openUser(row: UserRow): void {
    if (!row?.id) return;
    this.router.navigate(['/customers', row.id]);
  }

  statusLabel(s: Status): string {
    if (s === 'vip') return 'VIP';
    if (s === 'customer') return 'Customer';
    return 'Lead';
  }
}
