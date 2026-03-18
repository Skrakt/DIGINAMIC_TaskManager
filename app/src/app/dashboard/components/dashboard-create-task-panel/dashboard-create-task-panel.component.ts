import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CategoryItem } from '@/core/services/category';
import { TaskItem, TaskStatus } from '@/core/services/task';

@Component({
  selector: 'app-dashboard-create-task-panel',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './dashboard-create-task-panel.component.html',
  styleUrl: './dashboard-create-task-panel.component.css',
})
export class DashboardCreateTaskPanelComponent {
  @Input({ required: true }) createTaskReactiveForm!: FormGroup;
  @Input({ required: true }) availableCategories: CategoryItem[] = [];
  @Input({ required: true }) taskStatusOptions: { label: string; value: TaskStatus }[] = [];
  @Input({ required: true }) taskPriorityOptions: {
    label: string;
    value: TaskItem['priority'];
  }[] = [];
  @Input({ required: true }) isCreateTaskInProgress = false;
  @Input({ required: true }) createTaskErrorMessage = '';

  @Output() createTaskFormSubmitted = new EventEmitter<void>();

  onCreateTaskFormSubmitted() {
    this.createTaskFormSubmitted.emit();
  }
}
