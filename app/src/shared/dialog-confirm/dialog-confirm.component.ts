import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

export interface DialogConfirmData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

@Component({
  selector: 'app-dialog-confirm',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './dialog-confirm.component.html',
  styleUrl: './dialog-confirm.component.css',
})
export class DialogConfirmComponent {
  constructor(@Inject(MAT_DIALOG_DATA) readonly data: DialogConfirmData) {}
}
