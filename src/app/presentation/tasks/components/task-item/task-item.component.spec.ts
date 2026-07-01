import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskItemComponent } from './task-item.component';
import { Task } from '../../../../domain/models/task.model';

const mockTask = (): Task => ({
  id: '1',
  title: 'Test task',
  completed: false,
  categoryId: null,
  createdAt: 0,
});

describe('TaskItemComponent', () => {
  let component: TaskItemComponent;
  let fixture: ComponentFixture<TaskItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskItemComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('task', mockTask());
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('toggle should emit task with inverted completed', () => {
    const emitted: Task[] = [];
    component.toggled.subscribe(t => emitted.push(t));

    component.toggle();

    expect(emitted.length).toBe(1);
    expect(emitted[0].completed).toBeTrue();
  });

  it('toggle should preserve other task fields', () => {
    const emitted: Task[] = [];
    component.toggled.subscribe(t => emitted.push(t));

    component.toggle();

    expect(emitted[0].id).toBe('1');
    expect(emitted[0].title).toBe('Test task');
  });

  it('delete should emit task id', () => {
    const emitted: string[] = [];
    component.deleted.subscribe(id => emitted.push(id));

    component.delete();

    expect(emitted).toEqual(['1']);
  });
});
