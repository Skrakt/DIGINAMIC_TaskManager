import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TaskItem } from '@/core/services/task';

@Component({
  selector: 'app-dashboard-task-card',
  standalone: true,
  imports: [MatButtonModule, MatCardModule, MatChipsModule, MatIconModule],
  templateUrl: './dashboard-task-card.component.html',
  styleUrl: './dashboard-task-card.component.css',
})
export class DashboardTaskCardComponent {
  @Input({ required: true }) taskCard!: TaskItem;
  @Input({ required: true }) isDeleteActionInProgress = false;
  @Output() deleteTaskRequested = new EventEmitter<string>();

  requestTaskDeletion() {
    this.deleteTaskRequested.emit(this.taskCard._id);
  }

  getPriorityDisplayLabel(taskPriority: TaskItem['priority']) {
    if (taskPriority === 'high') return 'Priorité haute';
    if (taskPriority === 'low') return 'Priorité basse';
    return 'Priorité moyenne';
  }
}
