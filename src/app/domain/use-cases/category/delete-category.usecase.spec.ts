import { TestBed } from '@angular/core/testing';
import { DeleteCategoryUseCase } from './delete-category.usecase';
import { CATEGORY_REPOSITORY } from '../../interfaces/category-repository.token';

describe('DeleteCategoryUseCase', () => {
  let useCase: DeleteCategoryUseCase;
  let repo: jasmine.SpyObj<any>;

  beforeEach(() => {
    repo = jasmine.createSpyObj('ICategoryRepository', ['getAll', 'save', 'update', 'delete']);
    repo.delete.and.returnValue(Promise.resolve());

    TestBed.configureTestingModule({
      providers: [
        DeleteCategoryUseCase,
        { provide: CATEGORY_REPOSITORY, useValue: repo },
      ],
    });

    useCase = TestBed.inject(DeleteCategoryUseCase);
  });

  it('should be created', () => {
    expect(useCase).toBeTruthy();
  });

  it('should call repository delete with the given id', async () => {
    await useCase.execute('cat-1');
    expect(repo.delete).toHaveBeenCalledWith('cat-1');
  });

  it('should call repository delete exactly once', async () => {
    await useCase.execute('cat-1');
    expect(repo.delete).toHaveBeenCalledTimes(1);
  });
});
