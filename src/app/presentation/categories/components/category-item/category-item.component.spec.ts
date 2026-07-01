import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CategoryItemComponent } from './category-item.component';
import { Category } from '../../../../domain/models/category.model';

const mockCategory = (): Category => ({
  id: '1',
  name: 'Work',
  color: '#3880ff',
  createdAt: 0,
});

describe('CategoryItemComponent', () => {
  let component: CategoryItemComponent;
  let fixture: ComponentFixture<CategoryItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryItemComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('category', mockCategory());
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should receive the category input', () => {
    expect(component.category()).toEqual(mockCategory());
  });

  it('deleted output should exist', () => {
    expect(component.deleted).toBeDefined();
  });

  it('edited output should exist', () => {
    expect(component.edited).toBeDefined();
  });
});
