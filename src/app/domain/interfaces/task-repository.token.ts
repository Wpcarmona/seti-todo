import { InjectionToken } from '@angular/core';
import { ITaskRepository } from './task-repository.interface';

export const TASK_REPOSITORY = new InjectionToken<ITaskRepository>('ITaskRepository');