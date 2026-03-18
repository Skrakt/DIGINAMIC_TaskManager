import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { DashboardComponent } from '@/dashboard';
import { TaskService } from '@/core/services/task';
import { CategoryService } from '@/core/services/category';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let taskService: {
    getTasks: ReturnType<typeof vi.fn>;
    createTask: ReturnType<typeof vi.fn>;
    deleteTask: ReturnType<typeof vi.fn>;
  };
  let categoryService: { getCategories: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    taskService = { getTasks: vi.fn(), createTask: vi.fn(), deleteTask: vi.fn() };
    taskService.getTasks.mockReturnValue(
      of([
        {
          _id: '1',
          title: 'Tâche à faire',
          description: 'description',
          status: 'todo',
          priority: 'medium',
          categoryId: 'cat-1',
          category: { _id: 'cat-1', name: 'Travail' },
        },
        {
          _id: '2',
          title: 'Tâche en cours',
          description: '',
          status: 'in_progress',
          priority: 'high',
          categoryId: 'cat-2',
          category: { _id: 'cat-2', name: 'Personnel' },
        },
      ]),
    );
    taskService.createTask.mockReturnValue(of({}));
    taskService.deleteTask.mockReturnValue(of({ deleted: true }));
    categoryService = { getCategories: vi.fn() };
    categoryService.getCategories.mockReturnValue(of([{ _id: 'cat-1', name: 'Travail' }]));

    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        { provide: TaskService, useValue: taskService as unknown as TaskService },
        {
          provide: CategoryService,
          useValue: categoryService as unknown as CategoryService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('doit être créé', () => {
    expect(component).toBeTruthy();
  });

  it("doit charger les tâches et les regrouper par statut à l'initialisation", () => {
    expect(taskService.getTasks).toHaveBeenCalled();
    expect(categoryService.getCategories).toHaveBeenCalled();
    expect(component.taskCardsByStatus.todo).toHaveLength(1);
    expect(component.taskCardsByStatus.in_progress).toHaveLength(1);
    expect(component.taskCardsByStatus.done).toHaveLength(0);
    expect(component.isDashboardLoading).toBe(false);
  });

  it('doit gérer une erreur de chargement', async () => {
    taskService.getTasks.mockReturnValue(throwError(() => new Error('boom')));
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.dashboardErrorMessage).toContain('Impossible de charger les tâches');
    expect(component.isDashboardLoading).toBe(false);
  });

  it('doit créer une tâche depuis le formulaire et rafraîchir le tableau', () => {
    component.isCreateTaskFormVisible = true;
    component.createTaskReactiveForm.setValue({
      title: 'Nouvelle tâche',
      description: 'description',
      status: 'todo',
      priority: 'medium',
      categoryId: 'cat-1',
    });

    component.submitCreateTaskForm();

    expect(taskService.createTask).toHaveBeenCalledWith({
      title: 'Nouvelle tâche',
      description: 'description',
      status: 'todo',
      priority: 'medium',
      categoryId: 'cat-1',
    });
    expect(taskService.getTasks).toHaveBeenCalledTimes(2);
  });

  it('doit supprimer une tâche et rafraîchir le tableau', () => {
    component.deleteTaskCard('1');

    expect(taskService.deleteTask).toHaveBeenCalledWith('1');
    expect(taskService.getTasks).toHaveBeenCalledTimes(2);
  });
});
