import { Injectable } from '@angular/core';
import { fromEvent, merge, Observable, of } from 'rxjs';
import { distinctUntilChanged, map, shareReplay } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ConnectivityService {
  readonly isOnline$: Observable<boolean> = merge(
    of(navigator.onLine),
    fromEvent(window, 'online').pipe(map(() => true)),
    fromEvent(window, 'offline').pipe(map(() => false)),
  ).pipe(
    distinctUntilChanged(),
    shareReplay(1),
  );

  isOnline(): boolean {
    return navigator.onLine;
  }
}
