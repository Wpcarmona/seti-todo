import { TestBed } from '@angular/core/testing';
import { UpdateTaskUseCase } from './update-task.usecase';
import { TASK_REPOSITORY } from '../../interfaces/task-repository.token';
import { Task } from '../../models/task.model';

const mockTask = (): Task => ({
  id: '1',
  title: 'Test task',
  completed: false,
  categoryId: null,
  createdAt: 0,
});

describe('UpdateTaskUseCase', () => {
  let useCase: UpdateTaskUseCase;
  let repo: jasmine.SpyObj<any>;

  beforeEach(() => {
    repo = jasmine.createSpyObj('ITaskRepository', ['getAll', 'save', 'update', 'delete']);
    repo.update.and.returnValue(Promise.resolve());

    TestBed.configureTestingModule({
      providers: [
        UpdateTaskUseCase,
        { provide: TASK_REPOSITORY, useValue: repo },
      ],
    });

    useCase = TestBed.inject(UpdateTaskUseCase);
  });

  it('should be created', () => {
    expect(useCase).toBeTruthy();
  });

  it('should call repository update with the task', async () => {
    const task = mockTask();
    await useCase.execute(task);
    expect(repo.update).toHaveBeenCalledWith(task);
  });

  it('should call repository update exactly once', async () => {
    await useCase.execute(mockTask());
    expect(repo.update).toHaveBeenCalledTimes(1);
  });
});
