import { TestBed } from '@angular/core/testing';
import { GetTasksUseCase } from './get-tasks.usecase';
import { TASK_REPOSITORY } from '../../interfaces/task-repository.token';
import { Task } from '../../models/task.model';

const mockTask = (): Task => ({
  id: '1',
  title: 'Test task',
  completed: false,
  categoryId: null,
  createdAt: 0,
});

describe('GetTasksUseCase', () => {
  let useCase: GetTasksUseCase;
  let repo: jasmine.SpyObj<any>;

  beforeEach(() => {
    repo = jasmine.createSpyObj('ITaskRepository', ['getAll', 'save', 'update', 'delete']);
    repo.getAll.and.returnValue(Promise.resolve([]));

    TestBed.configureTestingModule({
      providers: [
        GetTasksUseCase,
        { provide: TASK_REPOSITORY, useValue: repo },
      ],
    });

    useCase = TestBed.inject(GetTasksUseCase);
  });

  it('should be created', () => {
    expect(useCase).toBeTruthy();
  });

  it('should return tasks from repository', async () => {
    repo.getAll.and.returnValue(Promise.resolve([mockTask()]));
    const result = await useCase.execute();
    expect(result).toEqual([mockTask()]);
  });

  it('should return empty array when no tasks', async () => {
    repo.getAll.and.returnValue(Promise.resolve([]));
    const result = await useCase.execute();
    expect(result).toEqual([]);
  });

  it('should delegate to repository getAll', async () => {
    await useCase.execute();
    expect(repo.getAll).toHaveBeenCalledTimes(1);
  });
});
