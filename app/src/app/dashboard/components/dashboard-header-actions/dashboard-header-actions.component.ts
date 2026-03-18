import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-dashboard-header-actions',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './dashboard-header-actions.component.html',
  styleUrl: './dashboard-header-actions.component.css',
})
export class DashboardHeaderActionsComponent {
  @Input({ required: true }) isCreateTaskFormVisible = false;
  @Output() createTaskFormVisibilityToggled = new EventEmitter<void>();

  onCreateTaskButtonClicked() {
    this.createTaskFormVisibilityToggled.emit();
  }
}
