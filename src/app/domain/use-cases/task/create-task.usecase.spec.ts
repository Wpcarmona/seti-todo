import { TestBed } from '@angular/core/testing';
import { CreateTaskUseCase } from './create-task.usecase';
import { TASK_REPOSITORY } from '../../interfaces/task-repository.token';

describe('CreateTaskUseCase', () => {
  let useCase: CreateTaskUseCase;
  let repo: jasmine.SpyObj<any>;

  beforeEach(() => {
    repo = jasmine.createSpyObj('ITaskRepository', ['getAll', 'save', 'update', 'delete']);
    repo.save.and.returnValue(Promise.resolve());

    TestBed.configureTestingModule({
      providers: [
        CreateTaskUseCase,
        { provide: TASK_REPOSITORY, useValue: repo },
      ],
    });

    useCase = TestBed.inject(CreateTaskUseCase);
  });

  it('should be created', () => {
    expect(useCase).toBeTruthy();
  });

  it('should create a task with the given title', async () => {
    const task = await useCase.execute('Buy milk', null);
    expect(task.title).toBe('Buy milk');
  });

  it('should create a task with completed false', async () => {
    const task = await useCase.execute('Buy milk', null);
    expect(task.completed).toBeFalse();
  });

  it('should assign the given categoryId', async () => {
    const task = await useCase.execute('Task', 'cat-1');
    expect(task.categoryId).toBe('cat-1');
  });

  it('should generate a unique id', async () => {
    const t1 = await useCase.execute('A', null);
    const t2 = await useCase.execute('B', null);
    expect(t1.id).not.toBe(t2.id);
  });

  it('should call repository save', async () => {
    await useCase.execute('Task', null);
    expect(repo.save).toHaveBeenCalledTimes(1);
  });

  it('should save the created task to repository', async () => {
    const task = await useCase.execute('Task', null);
    expect(repo.save).toHaveBeenCalledWith(task);
  });
});
