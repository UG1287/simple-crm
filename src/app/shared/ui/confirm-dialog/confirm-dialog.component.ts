import { Component, inject } from '@angular/core';
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

export type ConfirmDialogData = {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
};

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>{{ data.title }}</h2>

    <div mat-dialog-content>
      <p>{{ data.message }}</p>
    </div>

    <div mat-dialog-actions align="end">
      <button mat-button (click)="close(false)">
        {{ data.cancelText ?? 'Cancel' }}
      </button>

      <button mat-flat-button color="warn" (click)="close(true)">
        {{ data.confirmText ?? 'Delete' }}
      </button>
    </div>
  `,
})
export class ConfirmDialogComponent {
  private readonly ref = inject(MatDialogRef<ConfirmDialogComponent>);
  readonly data = inject<ConfirmDialogData>(MAT_DIALOG_DATA);

  close(value: boolean): void {
    this.ref.close(value);
  }
}
