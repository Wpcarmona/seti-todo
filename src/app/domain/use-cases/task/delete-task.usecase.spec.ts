import { TestBed } from '@angular/core/testing';
import { DeleteTaskUseCase } from './delete-task.usecase';
import { TASK_REPOSITORY } from '../../interfaces/task-repository.token';

describe('DeleteTaskUseCase', () => {
  let useCase: DeleteTaskUseCase;
  let repo: jasmine.SpyObj<any>;

  beforeEach(() => {
    repo = jasmine.createSpyObj('ITaskRepository', ['getAll', 'save', 'update', 'delete']);
    repo.delete.and.returnValue(Promise.resolve());

    TestBed.configureTestingModule({
      providers: [
        DeleteTaskUseCase,
        { provide: TASK_REPOSITORY, useValue: repo },
      ],
    });

    useCase = TestBed.inject(DeleteTaskUseCase);
  });

  it('should be created', () => {
    expect(useCase).toBeTruthy();
  });

  it('should call repository delete with the given id', async () => {
    await useCase.execute('task-1');
    expect(repo.delete).toHaveBeenCalledWith('task-1');
  });

  it('should call repository delete exactly once', async () => {
    await useCase.execute('task-1');
    expect(repo.delete).toHaveBeenCalledTimes(1);
  });
});
