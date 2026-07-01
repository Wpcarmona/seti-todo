import { TestBed } from '@angular/core/testing';
import { GetCategoriesUseCase } from './get-categories.usecase';
import { CATEGORY_REPOSITORY } from '../../interfaces/category-repository.token';
import { Category } from '../../models/category.model';

const mockCategory = (): Category => ({
  id: '1',
  name: 'Work',
  color: '#3880ff',
  createdAt: 0,
});

describe('GetCategoriesUseCase', () => {
  let useCase: GetCategoriesUseCase;
  let repo: jasmine.SpyObj<any>;

  beforeEach(() => {
    repo = jasmine.createSpyObj('ICategoryRepository', ['getAll', 'save', 'update', 'delete']);
    repo.getAll.and.returnValue(Promise.resolve([]));

    TestBed.configureTestingModule({
      providers: [
        GetCategoriesUseCase,
        { provide: CATEGORY_REPOSITORY, useValue: repo },
      ],
    });

    useCase = TestBed.inject(GetCategoriesUseCase);
  });

  it('should be created', () => {
    expect(useCase).toBeTruthy();
  });

  it('should return categories from repository', async () => {
    repo.getAll.and.returnValue(Promise.resolve([mockCategory()]));
    const result = await useCase.execute();
    expect(result).toEqual([mockCategory()]);
  });

  it('should return empty array when no categories', async () => {
    repo.getAll.and.returnValue(Promise.resolve([]));
    const result = await useCase.execute();
    expect(result).toEqual([]);
  });

  it('should delegate to repository getAll', async () => {
    await useCase.execute();
    expect(repo.getAll).toHaveBeenCalledTimes(1);
  });
});
