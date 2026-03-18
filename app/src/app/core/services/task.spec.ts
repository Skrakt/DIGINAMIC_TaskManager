import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { environment } from '@env/environment';
import { TaskService } from '@/core/services/task';

describe('TaskService', () => {
  let service: TaskService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TaskService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(TaskService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('doit être créé', () => {
    expect(service).toBeTruthy();
  });

  it('doit récupérer les tâches', () => {
    const response = [
      {
        _id: '1',
        title: 'Tâche 1',
        description: '',
        status: 'todo',
        priority: 'medium',
        categoryId: 'cat-1',
        category: { _id: 'cat-1', name: 'Travail' },
      },
    ];

    service.getTasks().subscribe((value) => {
      expect(value).toEqual(response);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/tasks`);
    expect(req.request.method).toBe('GET');
    req.flush(response);
  });

  it('doit créer une tâche', () => {
    const payload = {
      title: 'Tâche 1',
      description: 'description',
      status: 'todo' as const,
      priority: 'medium' as const,
      categoryId: 'cat-1',
    };

    service.createTask(payload).subscribe((value) => {
      expect(value.title).toBe('Tâche 1');
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/tasks`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush({
      _id: '1',
      ...payload,
      category: { _id: 'cat-1', name: 'Travail' },
    });
  });

  it('doit supprimer une tâche', () => {
    service.deleteTask('task-1').subscribe((value) => {
      expect(value).toEqual({ deleted: true });
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/tasks/task-1`);
    expect(req.request.method).toBe('DELETE');
    req.flush({ deleted: true });
  });
});
