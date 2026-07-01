import { TestBed } from '@angular/core/testing';
import { CategoryRepository } from './category-repository';
import { StorageService } from '../services/storage';
import { Category } from '../../domain/models/category.model';

const mockCategory = (id = '1'): Category => ({
  id,
  name: 'Work',
  color: '#3880ff',
  createdAt: 0,
});

describe('CategoryRepository', () => {
  let repo: CategoryRepository;
  let storage: jasmine.SpyObj<StorageService>;

  beforeEach(() => {
    storage = jasmine.createSpyObj('StorageService', ['get', 'set', 'remove']);
    storage.get.and.returnValue(Promise.resolve(null));
    storage.set.and.returnValue(Promise.resolve());

    TestBed.configureTestingModule({
      providers: [
        CategoryRepository,
        { provide: StorageService, useValue: storage },
      ],
    });

    repo = TestBed.inject(CategoryRepository);
  });

  it('should be created', () => {
    expect(repo).toBeTruthy();
  });

  it('getAll should return empty array when storage is empty', async () => {
    storage.get.and.returnValue(Promise.resolve(null));
    const result = await repo.getAll();
    expect(result).toEqual([]);
  });

  it('getAll should return stored categories', async () => {
    const cats = [mockCategory()];
    storage.get.and.returnValue(Promise.resolve(cats));
    const result = await repo.getAll();
    expect(result).toEqual(cats);
  });

  it('save should append category to existing list', async () => {
    const existing = [mockCategory('1')];
    const newCat = mockCategory('2');
    storage.get.and.returnValue(Promise.resolve(existing));

    await repo.save(newCat);

    expect(storage.set).toHaveBeenCalledWith('categories', [...existing, newCat]);
  });

  it('update should replace category with matching id', async () => {
    const original = mockCategory('1');
    const updated = { ...original, name: 'Personal' };
    storage.get.and.returnValue(Promise.resolve([original]));

    await repo.update(updated);

    expect(storage.set).toHaveBeenCalledWith('categories', [updated]);
  });

  it('update should not affect other categories', async () => {
    const c1 = mockCategory('1');
    const c2 = mockCategory('2');
    const updatedC1 = { ...c1, name: 'Personal' };
    storage.get.and.returnValue(Promise.resolve([c1, c2]));

    await repo.update(updatedC1);

    expect(storage.set).toHaveBeenCalledWith('categories', [updatedC1, c2]);
  });

  it('delete should remove category with matching id', async () => {
    const c1 = mockCategory('1');
    const c2 = mockCategory('2');
    storage.get.and.returnValue(Promise.resolve([c1, c2]));

    await repo.delete('1');

    expect(storage.set).toHaveBeenCalledWith('categories', [c2]);
  });
});
