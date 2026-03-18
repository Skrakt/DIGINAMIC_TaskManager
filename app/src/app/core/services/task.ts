import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '@env/environment';

export type TaskStatus = 'todo' | 'in_progress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface TaskCategory {
  _id: string;
  name: string;
}

export interface TaskItem {
  _id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  categoryId: string;
  category: TaskCategory | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTaskDto {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  categoryId: string;
}

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  constructor(private readonly httpClient: HttpClient) {}

  getTasks(taskStatusFilter?: TaskStatus) {
    const queryParameters = taskStatusFilter
      ? new HttpParams().set('status', taskStatusFilter)
      : undefined;
    return this.httpClient.get<TaskItem[]>(`${environment.apiUrl}/tasks`, {
      params: queryParameters,
    });
  }

  createTask(createTaskPayload: CreateTaskDto) {
    return this.httpClient.post<TaskItem>(`${environment.apiUrl}/tasks`, createTaskPayload);
  }

  deleteTask(taskId: string) {
    return this.httpClient.delete<{ deleted: boolean }>(`${environment.apiUrl}/tasks/${taskId}`);
  }
}
