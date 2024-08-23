import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ConfigService } from './config.service';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class BaseService<
  T extends { _id: string | number;[key: string]: any }
> {
  private readonly apiUrl: string = environment.apiUrl;
  protected entity: string = '';
  list$: BehaviorSubject<T[]> = new BehaviorSubject<T[]>([]);

  constructor(
    protected http: HttpClient,
    protected config: ConfigService
  ) { }

  getAll(): Observable<T[]> {
    return this.http.get<T[]>(this.getEntityUrl()).pipe(
      tap(entities => this.list$.next(entities))
    );
  }

  getOne(_id: string | number): Observable<T> {
    return this.http.get<T>(this.getEntityUrl(_id));
  }

  create(entity: T): Observable<T> {
    const newEntity = { ...entity, _id: null };
    return this.http.post<T>(this.getEntityUrl(), newEntity).pipe(
      tap((createdEntity) => {
        const currentList = this.list$.value;
        this.list$.next([...currentList, createdEntity]);
      })
    );
  }

  update(entity: T): Observable<T> {
    return this.http.patch<T>(this.getEntityUrl(entity._id), entity).pipe(
      tap((updatedEntity) => {
        const updatedList = this.list$.value.map(item =>
          item._id === updatedEntity._id ? updatedEntity : item);
        this.list$.next(updatedList);
      })
    );
  }

  delete(entity: T): Observable<T> {
    return this.http.delete<T>(this.getEntityUrl(entity._id)).pipe(
      tap(() => {
        const list = this.list$.value.filter(item => item._id !== entity._id);
        this.list$.next(list);
      })
    );
  }

  protected getEntityUrl(_id?: string | number): string {
    return `${this.apiUrl}/${this.entity}${_id ? `/${_id}` : ''}`;
  }
}