import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskFormComponent } from './task-form.component';

describe('TaskFormComponent', () => {
  let component: TaskFormComponent;
  let fixture: ComponentFixture<TaskFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('submit should not emit when title is empty', () => {
    const emitted: any[] = [];
    component.taskCreated.subscribe(e => emitted.push(e));

    component.title = '';
    component.submit();

    expect(emitted.length).toBe(0);
  });

  it('submit should not emit when title is only spaces', () => {
    const emitted: any[] = [];
    component.taskCreated.subscribe(e => emitted.push(e));

    component.title = '   ';
    component.submit();

    expect(emitted.length).toBe(0);
  });

  it('submit should emit trimmed title', () => {
    const emitted: any[] = [];
    component.taskCreated.subscribe(e => emitted.push(e));

    component.title = '  Buy milk  ';
    component.submit();

    expect(emitted[0].title).toBe('Buy milk');
  });

  it('submit should emit selected categoryId', () => {
    const emitted: any[] = [];
    component.taskCreated.subscribe(e => emitted.push(e));

    component.title = 'Task';
    component.selectedCategoryId = 'cat-1';
    component.submit();

    expect(emitted[0].categoryId).toBe('cat-1');
  });

  it('submit should reset form after emission', () => {
    component.title = 'Task';
    component.selectedCategoryId = 'cat-1';
    component.submit();

    expect(component.title).toBe('');
    expect(component.selectedCategoryId).toBeNull();
  });
});
