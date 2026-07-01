import { TestBed } from '@angular/core/testing';
import { UpdateCategoryUseCase } from './update-category.usecase';
import { CATEGORY_REPOSITORY } from '../../interfaces/category-repository.token';
import { Category } from '../../models/category.model';

const mockCategory = (): Category => ({
  id: '1',
  name: 'Work',
  color: '#3880ff',
  createdAt: 0,
});

describe('UpdateCategoryUseCase', () => {
  let useCase: UpdateCategoryUseCase;
  let repo: jasmine.SpyObj<any>;

  beforeEach(() => {
    repo = jasmine.createSpyObj('ICategoryRepository', ['getAll', 'save', 'update', 'delete']);
    repo.update.and.returnValue(Promise.resolve());

    TestBed.configureTestingModule({
      providers: [
        UpdateCategoryUseCase,
        { provide: CATEGORY_REPOSITORY, useValue: repo },
      ],
    });

    useCase = TestBed.inject(UpdateCategoryUseCase);
  });

  it('should be created', () => {
    expect(useCase).toBeTruthy();
  });

  it('should call repository update with the category', async () => {
    const cat = mockCategory();
    await useCase.execute(cat);
    expect(repo.update).toHaveBeenCalledWith(cat);
  });

  it('should call repository update exactly once', async () => {
    await useCase.execute(mockCategory());
    expect(repo.update).toHaveBeenCalledTimes(1);
  });
});
