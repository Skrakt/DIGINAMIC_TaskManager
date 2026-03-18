import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TaskItem, TaskStatus } from '@/core/services/task';
import { DashboardTaskCardComponent } from '@/dashboard/components/dashboard-task-card';

@Component({
  selector: 'app-dashboard-task-board',
  standalone: true,
  imports: [DashboardTaskCardComponent],
  templateUrl: './dashboard-task-board.component.html',
  styleUrl: './dashboard-task-board.component.css',
})
export class DashboardTaskBoardComponent {
  @Input({ required: true }) taskBoardColumns: {
    status: TaskStatus;
    label: string;
  }[] = [];
  @Input({ required: true }) taskCardsByStatus: Record<TaskStatus, TaskItem[]> = {
    todo: [],
    in_progress: [],
    done: [],
  };
  @Input({ required: true }) taskIdsCurrentlyBeingDeleted = new Set<string>();
  @Output() deleteTaskRequested = new EventEmitter<string>();

  getTaskCountForStatus(taskStatus: TaskStatus) {
    return this.taskCardsByStatus[taskStatus].length;
  }

  trackTaskCardByIdentifier(_index: number, taskCard: TaskItem) {
    return taskCard._id;
  }

  onTaskDeletionRequested(taskId: string) {
    this.deleteTaskRequested.emit(taskId);
  }
}
