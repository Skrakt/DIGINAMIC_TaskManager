import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { finalize } from 'rxjs';
import { TaskItem, TaskService, TaskStatus } from '@/core/services/task';
import { CategoryItem, CategoryService } from '@/core/services/category';
import {
  DashboardCreateTaskPanelComponent,
  DashboardHeaderActionsComponent,
  DashboardTaskBoardComponent,
} from './components';
import { LoadingComponent } from '@shared/loading';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    DashboardHeaderActionsComponent,
    DashboardCreateTaskPanelComponent,
    DashboardTaskBoardComponent,
    LoadingComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit, OnDestroy {
  private static readonly AUTO_REFRESH_INTERVAL_IN_MILLISECONDS = 5000;
  private automaticRefreshTimerHandle: ReturnType<typeof setInterval> | null = null;
  private isTaskListRequestInProgress = false;
  private hasComponentBeenDestroyed = false;

  readonly taskBoardColumns: { status: TaskStatus; label: string }[] = [
    { status: 'todo', label: 'À faire' },
    { status: 'in_progress', label: 'En cours' },
    { status: 'done', label: 'Terminées' },
  ];

  isDashboardLoading = true;
  dashboardErrorMessage = '';
  isCreateTaskFormVisible = false;
  isCreateTaskInProgress = false;
  createTaskErrorMessage = '';
  taskIdsCurrentlyBeingDeleted = new Set<string>();
  availableCategories: CategoryItem[] = [];
  readonly taskStatusOptions: { label: string; value: TaskStatus }[] = [
    { label: 'À faire', value: 'todo' },
    { label: 'En cours', value: 'in_progress' },
    { label: 'Terminée', value: 'done' },
  ];
  readonly taskPriorityOptions: {
    label: string;
    value: TaskItem['priority'];
  }[] = [
    { label: 'Basse', value: 'low' },
    { label: 'Moyenne', value: 'medium' },
    { label: 'Haute', value: 'high' },
  ];
  taskCardsByStatus: Record<TaskStatus, TaskItem[]> = {
    todo: [],
    in_progress: [],
    done: [],
  };
  readonly createTaskReactiveForm;

  constructor(
    private readonly taskService: TaskService,
    private readonly categoryService: CategoryService,
    private readonly fb: FormBuilder,
    private readonly cdr: ChangeDetectorRef,
  ) {
    this.createTaskReactiveForm = this.fb.nonNullable.group({
      title: ['', [Validators.required, Validators.minLength(2)]],
      description: [''],
      status: this.fb.nonNullable.control<TaskStatus>('todo'),
      priority: this.fb.nonNullable.control<TaskItem['priority']>('medium'),
      categoryId: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    this.refreshTaskBoard();
    this.loadAvailableCategories();
    this.startAutomaticDashboardRefresh();
  }

  ngOnDestroy() {
    this.hasComponentBeenDestroyed = true;
    if (this.automaticRefreshTimerHandle) {
      clearInterval(this.automaticRefreshTimerHandle);
      this.automaticRefreshTimerHandle = null;
    }
  }

  refreshTaskBoard(shouldDisplayLoadingState = true) {
    if (this.isTaskListRequestInProgress) {
      return;
    }

    if (shouldDisplayLoadingState) {
      this.isDashboardLoading = true;
      this.dashboardErrorMessage = '';
    }
    this.isTaskListRequestInProgress = true;

    this.taskService
      .getTasks()
      .pipe(
        finalize(() => {
          this.isTaskListRequestInProgress = false;
          this.isDashboardLoading = false;
          this.triggerImmediateViewRefresh();
        }),
      )
      .subscribe({
        next: (tasks) => {
          this.taskCardsByStatus = this.groupTasksByStatus(tasks);
          this.triggerImmediateViewRefresh();
        },
        error: () => {
          this.dashboardErrorMessage = 'Impossible de charger les tâches pour le moment.';
          this.triggerImmediateViewRefresh();
        },
      });
  }

  toggleCreateTaskFormVisibility() {
    this.isCreateTaskFormVisible = !this.isCreateTaskFormVisible;
    this.createTaskErrorMessage = '';
  }

  submitCreateTaskForm() {
    if (this.createTaskReactiveForm.invalid || this.isCreateTaskInProgress) {
      this.createTaskReactiveForm.markAllAsTouched();
      return;
    }

    this.isCreateTaskInProgress = true;
    this.createTaskErrorMessage = '';

    const createTaskFormValues = this.createTaskReactiveForm.getRawValue();
    this.taskService
      .createTask({
        title: createTaskFormValues.title.trim(),
        description: createTaskFormValues.description.trim(),
        status: createTaskFormValues.status,
        priority: createTaskFormValues.priority,
        categoryId: createTaskFormValues.categoryId,
      })
      .pipe(finalize(() => (this.isCreateTaskInProgress = false)))
      .subscribe({
        next: () => {
          this.isCreateTaskFormVisible = false;
          this.createTaskReactiveForm.reset({
            title: '',
            description: '',
            status: 'todo',
            priority: 'medium',
            categoryId: this.availableCategories[0]?._id ?? '',
          });
          this.refreshTaskBoard();
          this.triggerImmediateViewRefresh();
        },
        error: () => {
          this.createTaskErrorMessage = 'Impossible de créer la tâche.';
          this.triggerImmediateViewRefresh();
        },
      });
  }

  deleteTaskCard(taskId: string) {
    if (this.taskIdsCurrentlyBeingDeleted.has(taskId)) {
      return;
    }

    this.taskIdsCurrentlyBeingDeleted.add(taskId);
    this.taskService
      .deleteTask(taskId)
      .pipe(finalize(() => this.taskIdsCurrentlyBeingDeleted.delete(taskId)))
      .subscribe({
        next: () => {
          this.refreshTaskBoard();
          this.triggerImmediateViewRefresh();
        },
        error: () => {
          this.dashboardErrorMessage = 'Impossible de supprimer la tâche.';
          this.triggerImmediateViewRefresh();
        },
      });
  }

  private groupTasksByStatus(taskCards: TaskItem[]): Record<TaskStatus, TaskItem[]> {
    const tasksGroupedByStatus: Record<TaskStatus, TaskItem[]> = {
      todo: [],
      in_progress: [],
      done: [],
    };

    for (const taskCard of taskCards) {
      if (taskCard.status in tasksGroupedByStatus) {
        tasksGroupedByStatus[taskCard.status].push(taskCard);
      }
    }

    return tasksGroupedByStatus;
  }

  private loadAvailableCategories() {
    this.categoryService.getCategories().subscribe({
      next: (availableCategories) => {
        this.availableCategories = availableCategories;
        if (!this.createTaskReactiveForm.controls.categoryId.value && availableCategories.length) {
          this.createTaskReactiveForm.patchValue({
            categoryId: availableCategories[0]._id,
          });
        }
        this.triggerImmediateViewRefresh();
      },
      error: () => {
        this.availableCategories = [];
        this.triggerImmediateViewRefresh();
      },
    });
  }

  private startAutomaticDashboardRefresh() {
    this.automaticRefreshTimerHandle = setInterval(() => {
      this.refreshTaskBoard(false);
    }, DashboardComponent.AUTO_REFRESH_INTERVAL_IN_MILLISECONDS);
  }

  private triggerImmediateViewRefresh() {
    if (this.hasComponentBeenDestroyed) {
      return;
    }
    this.cdr.detectChanges();
  }
}
