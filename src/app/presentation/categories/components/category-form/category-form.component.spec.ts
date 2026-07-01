import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CategoryFormComponent } from './category-form.component';
import { Category } from '../../../../domain/models/category.model';

const mockCategory = (): Category => ({
  id: '1',
  name: 'Work',
  color: '#eb445a',
  createdAt: 0,
});

describe('CategoryFormComponent', () => {
  let component: CategoryFormComponent;
  let fixture: ComponentFixture<CategoryFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default color on init', () => {
    expect(component.color).toBe('#3880ff');
  });

  it('should pre-fill fields when editingCategory is set', () => {
    component.editingCategory = mockCategory();
    component.ngOnInit();

    expect(component.name).toBe('Work');
    expect(component.color).toBe('#eb445a');
  });

  it('submit should not emit when name is empty', () => {
    const emitted: any[] = [];
    component.formSubmitted.subscribe(e => emitted.push(e));

    component.name = '';
    component.submit();

    expect(emitted.length).toBe(0);
  });

  it('submit should not emit when name is only spaces', () => {
    const emitted: any[] = [];
    component.formSubmitted.subscribe(e => emitted.push(e));

    component.name = '   ';
    component.submit();

    expect(emitted.length).toBe(0);
  });

  it('submit should emit trimmed name and selected color', () => {
    const emitted: any[] = [];
    component.formSubmitted.subscribe(e => emitted.push(e));

    component.name = '  Personal  ';
    component.color = '#2dd36f';
    component.submit();

    expect(emitted[0]).toEqual({ name: 'Personal', color: '#2dd36f' });
  });

  it('submit should reset form after emission', () => {
    component.name = 'Work';
    component.submit();

    expect(component.name).toBe('');
    expect(component.color).toBe('#3880ff');
  });
});
