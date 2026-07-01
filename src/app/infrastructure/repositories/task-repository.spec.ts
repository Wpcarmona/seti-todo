import { TestBed } from '@angular/core/testing';
import { TaskRepository } from './task-repository';
import { StorageService } from '../services/storage';
import { Task } from '../../domain/models/task.model';

const mockTask = (id = '1'): Task => ({
  id,
  title: 'Test task',
  completed: false,
  categoryId: null,
  createdAt: 0,
});

describe('TaskRepository', () => {
  let repo: TaskRepository;
  let storage: jasmine.SpyObj<StorageService>;

  beforeEach(() => {
    storage = jasmine.createSpyObj('StorageService', ['get', 'set', 'remove']);
    storage.get.and.returnValue(Promise.resolve(null));
    storage.set.and.returnValue(Promise.resolve());

    TestBed.configureTestingModule({
      providers: [
        TaskRepository,
        { provide: StorageService, useValue: storage },
      ],
    });

    repo = TestBed.inject(TaskRepository);
  });

  it('should be created', () => {
    expect(repo).toBeTruthy();
  });

  it('getAll should return empty array when storage is empty', async () => {
    storage.get.and.returnValue(Promise.resolve(null));
    const result = await repo.getAll();
    expect(result).toEqual([]);
  });

  it('getAll should return stored tasks', async () => {
    const tasks = [mockTask()];
    storage.get.and.returnValue(Promise.resolve(tasks));
    const result = await repo.getAll();
    expect(result).toEqual(tasks);
  });

  it('save should append task to existing list', async () => {
    const existing = [mockTask('1')];
    const newTask = mockTask('2');
    storage.get.and.returnValue(Promise.resolve(existing));

    await repo.save(newTask);

    expect(storage.set).toHaveBeenCalledWith('tasks', [...existing, newTask]);
  });

  it('update should replace task with matching id', async () => {
    const original = mockTask('1');
    const updated = { ...original, completed: true };
    storage.get.and.returnValue(Promise.resolve([original]));

    await repo.update(updated);

    expect(storage.set).toHaveBeenCalledWith('tasks', [updated]);
  });

  it('update should not affect other tasks', async () => {
    const t1 = mockTask('1');
    const t2 = mockTask('2');
    const updatedT1 = { ...t1, completed: true };
    storage.get.and.returnValue(Promise.resolve([t1, t2]));

    await repo.update(updatedT1);

    expect(storage.set).toHaveBeenCalledWith('tasks', [updatedT1, t2]);
  });

  it('delete should remove task with matching id', async () => {
    const t1 = mockTask('1');
    const t2 = mockTask('2');
    storage.get.and.returnValue(Promise.resolve([t1, t2]));

    await repo.delete('1');

    expect(storage.set).toHaveBeenCalledWith('tasks', [t2]);
  });
});
