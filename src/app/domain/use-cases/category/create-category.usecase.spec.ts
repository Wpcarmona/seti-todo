import { TestBed } from '@angular/core/testing';
import { CreateCategoryUseCase } from './create-category.usecase';
import { CATEGORY_REPOSITORY } from '../../interfaces/category-repository.token';

describe('CreateCategoryUseCase', () => {
  let useCase: CreateCategoryUseCase;
  let repo: jasmine.SpyObj<any>;

  beforeEach(() => {
    repo = jasmine.createSpyObj('ICategoryRepository', ['getAll', 'save', 'update', 'delete']);
    repo.save.and.returnValue(Promise.resolve());

    TestBed.configureTestingModule({
      providers: [
        CreateCategoryUseCase,
        { provide: CATEGORY_REPOSITORY, useValue: repo },
      ],
    });

    useCase = TestBed.inject(CreateCategoryUseCase);
  });

  it('should be created', () => {
    expect(useCase).toBeTruthy();
  });

  it('should create a category with the given name', async () => {
    const cat = await useCase.execute('Work', '#3880ff');
    expect(cat.name).toBe('Work');
  });

  it('should create a category with the given color', async () => {
    const cat = await useCase.execute('Work', '#eb445a');
    expect(cat.color).toBe('#eb445a');
  });

  it('should generate a unique id', async () => {
    const c1 = await useCase.execute('A', '#fff');
    const c2 = await useCase.execute('B', '#000');
    expect(c1.id).not.toBe(c2.id);
  });

  it('should call repository save', async () => {
    await useCase.execute('Work', '#3880ff');
    expect(repo.save).toHaveBeenCalledTimes(1);
  });

  it('should save the created category to repository', async () => {
    const cat = await useCase.execute('Work', '#3880ff');
    expect(repo.save).toHaveBeenCalledWith(cat);
  });
});
