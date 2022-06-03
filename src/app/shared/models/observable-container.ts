import {BehaviorSubject, Observable, mergeMap} from 'rxjs';

export class ObservableContainer<T> {

  private _subject = new BehaviorSubject(true);
  private readonly _obs: Observable<T>;

  constructor(obs: Observable<T>) {
    this._obs = this._subject.pipe(
      mergeMap(() => obs)
    );
  }

  refresh(): void {
    this._subject.next(true);
  }

  get observable(): Observable<T> {
    return this._obs;
  }

}
