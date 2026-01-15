import { Component, inject } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { MatProgressBarModule } from '@angular/material/progress-bar';

import { UsersFirestoreService } from '../../../core/services/users-firestore.service';
import { Customer } from '../customer.model';

export type CustomerDialogData =
  | { mode: 'add' }
  | { mode: 'edit'; id: string; user: any };

@Component({
  selector: 'app-add-customer-dialog',
  standalone: true,
  imports: [
    NgIf,
    FormsModule,

    MatDialogModule,
    MatButtonModule,

    MatFormFieldModule,
    MatInputModule,

    MatDatepickerModule,
    MatNativeDateModule,

    MatProgressBarModule,
  ],
  templateUrl: './add-customer-dialog.component.html',
  styleUrls: ['./add-customer-dialog.component.scss'],
})
export class AddCustomerDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<AddCustomerDialogComponent>);
  private readonly usersDb = inject(UsersFirestoreService);
  private readonly data = inject<CustomerDialogData>(MAT_DIALOG_DATA, { optional: true }) ?? { mode: 'add' };

  isSaving = false;

  // ✅ Prefill if edit
  customer = this.data.mode === 'edit' ? new Customer(this.data.user) : new Customer();

  get title(): string {
    return this.data.mode === 'edit' ? 'Edit customer' : 'Add customer';
  }

  close(): void {
    if (this.isSaving) return;
    this.dialogRef.close();
  }

  async save(form: NgForm): Promise<void> {
    if (form.invalid) {
      form.form.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    try {
      if (this.data.mode === 'edit') {
        await this.usersDb.updateUser(this.data.id, {
          firstName: this.customer.firstName,
          lastName: this.customer.lastName,
          email: this.customer.email,
          birthDate: this.customer.birthDate,
          street: this.customer.street,
          zipCode: this.customer.zipCode,
          city: this.customer.city,
        });
        this.dialogRef.close({ saved: true, id: this.data.id });
      } else {
        const ref = await this.usersDb.addUser(this.customer);
        this.dialogRef.close({ saved: true, id: ref.id });
      }
    } finally {
      this.isSaving = false;
    }
  }
}
