import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { GetTasksUseCase } from '../../../../domain/use-cases/task/get-tasks.usecase';
import { CreateTaskUseCase } from '../../../../domain/use-cases/task/create-task.usecase';
import { UpdateTaskUseCase } from '../../../../domain/use-cases/task/update-task.usecase';
import { DeleteTaskUseCase } from '../../../../domain/use-cases/task/delete-task.usecase';
import { GetCategoriesUseCase } from '../../../../domain/use-cases/category/get-categories.usecase';
import { RemoteConfig } from '../../../../infrastructure/services/remote-config';
import { Task } from '../../../../domain/models/task.model';
import { TaskListPage } from './task-list.page';

const mockTask = (): Task => ({
  id: '1',
  title: 'Test task',
  completed: false,
  categoryId: null,
  createdAt: 0,
});

describe('TaskListPage', () => {
  let component: TaskListPage;
  let mockGetTasks: jasmine.SpyObj<GetTasksUseCase>;
  let mockCreateTask: jasmine.SpyObj<CreateTaskUseCase>;
  let mockUpdateTask: jasmine.SpyObj<UpdateTaskUseCase>;
  let mockDeleteTask: jasmine.SpyObj<DeleteTaskUseCase>;
  let mockGetCategories: jasmine.SpyObj<GetCategoriesUseCase>;

  beforeEach(async () => {
    mockGetTasks = jasmine.createSpyObj('GetTasksUseCase', { execute: Promise.resolve([]) });
    mockCreateTask = jasmine.createSpyObj('CreateTaskUseCase', { execute: Promise.resolve(mockTask()) });
    mockUpdateTask = jasmine.createSpyObj('UpdateTaskUseCase', { execute: Promise.resolve() });
    mockDeleteTask = jasmine.createSpyObj('DeleteTaskUseCase', { execute: Promise.resolve() });
    mockGetCategories = jasmine.createSpyObj('GetCategoriesUseCase', { execute: Promise.resolve([]) });

    await TestBed.configureTestingModule({
      imports: [TaskListPage],
      providers: [
        provideRouter([]),
        { provide: GetTasksUseCase, useValue: mockGetTasks },
        { provide: CreateTaskUseCase, useValue: mockCreateTask },
        { provide: UpdateTaskUseCase, useValue: mockUpdateTask },
        { provide: DeleteTaskUseCase, useValue: mockDeleteTask },
        { provide: GetCategoriesUseCase, useValue: mockGetCategories },
        { provide: RemoteConfig, useValue: { showCategories$: of(true), initialize: () => Promise.resolve() } },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(TaskListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getTasks on init', async () => {
    expect(mockGetTasks.execute).toHaveBeenCalled();
  });

  it('onDeleteTask should remove task from list', async () => {
    component['tasks$'].next([mockTask()]);
    await component.onDeleteTask('1');
    expect(component['tasks$'].getValue().length).toBe(0);
  });

  it('onToggleTask should update task in list', async () => {
    const task = mockTask();
    component['tasks$'].next([task]);
    const toggled = { ...task, completed: true };
    await component.onToggleTask(toggled);
    expect(component['tasks$'].getValue()[0].completed).toBeTrue();
  });

  it('selectCategory should update selectedCategoryId$', () => {
    component.selectCategory('cat-1');
    expect(component.selectedCategoryId$.getValue()).toBe('cat-1');
  });

  it('selectCategory null should show all tasks', () => {
    component.selectCategory(null);
    expect(component.selectedCategoryId$.getValue()).toBeNull();
  });
});
