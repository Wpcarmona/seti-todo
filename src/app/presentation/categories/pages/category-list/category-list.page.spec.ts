import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { GetCategoriesUseCase } from '../../../../domain/use-cases/category/get-categories.usecase';
import { CreateCategoryUseCase } from '../../../../domain/use-cases/category/create-category.usecase';
import { UpdateCategoryUseCase } from '../../../../domain/use-cases/category/update-category.usecase';
import { DeleteCategoryUseCase } from '../../../../domain/use-cases/category/delete-category.usecase';
import { Category } from '../../../../domain/models/category.model';
import { CategoryListPage } from './category-list.page';

const mockCategory = (): Category => ({
  id: '1',
  name: 'Work',
  color: '#3880ff',
  createdAt: 0,
});

describe('CategoryListPage', () => {
  let component: CategoryListPage;
  let mockGetCategories: jasmine.SpyObj<GetCategoriesUseCase>;
  let mockCreateCategory: jasmine.SpyObj<CreateCategoryUseCase>;
  let mockUpdateCategory: jasmine.SpyObj<UpdateCategoryUseCase>;
  let mockDeleteCategory: jasmine.SpyObj<DeleteCategoryUseCase>;

  beforeEach(async () => {
    mockGetCategories = jasmine.createSpyObj('GetCategoriesUseCase', { execute: Promise.resolve([]) });
    mockCreateCategory = jasmine.createSpyObj('CreateCategoryUseCase', { execute: Promise.resolve(mockCategory()) });
    mockUpdateCategory = jasmine.createSpyObj('UpdateCategoryUseCase', { execute: Promise.resolve() });
    mockDeleteCategory = jasmine.createSpyObj('DeleteCategoryUseCase', { execute: Promise.resolve() });

    await TestBed.configureTestingModule({
      imports: [CategoryListPage],
      providers: [
        provideRouter([]),
        { provide: GetCategoriesUseCase, useValue: mockGetCategories },
        { provide: CreateCategoryUseCase, useValue: mockCreateCategory },
        { provide: UpdateCategoryUseCase, useValue: mockUpdateCategory },
        { provide: DeleteCategoryUseCase, useValue: mockDeleteCategory },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(CategoryListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getCategories on init', () => {
    expect(mockGetCategories.execute).toHaveBeenCalled();
  });

  it('onDeleteCategory should remove category from list', async () => {
    component.categories$.next([mockCategory()]);
    await component.onDeleteCategory('1');
    expect(component.categories$.getValue().length).toBe(0);
  });

  it('openCreate should open modal', () => {
    component.openCreate();
    expect(component.isModalOpen$.getValue()).toBeTrue();
  });

  it('closeModal should close modal and clear editingCategory', () => {
    component.isModalOpen$.next(true);
    component.editingCategory$.next(mockCategory());
    component.closeModal();
    expect(component.isModalOpen$.getValue()).toBeFalse();
    expect(component.editingCategory$.getValue()).toBeNull();
  });

  it('openEdit should set editingCategory and open modal', () => {
    const cat = mockCategory();
    component.openEdit(cat);
    expect(component.editingCategory$.getValue()).toEqual(cat);
    expect(component.isModalOpen$.getValue()).toBeTrue();
  });
});
