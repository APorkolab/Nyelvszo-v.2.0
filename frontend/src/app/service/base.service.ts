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
  T extends { id: string | number;[key: string]: any }
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

  getOne(id: string | number): Observable<T> {
    return this.http.get<T>(this.getEntityUrl(id));
  }

  create(entity: T): Observable<T> {
    const newEntity = { ...entity, id: null };
    return this.http.post<T>(this.getEntityUrl(), newEntity).pipe(
      tap((createdEntity) => {
        const currentList = this.list$.value;
        this.list$.next([...currentList, createdEntity]);
      })
    );
  }

  update(entity: T): Observable<T> {
    return this.http.patch<T>(this.getEntityUrl(entity.id), entity).pipe(
      tap((updatedEntity) => {
        const updatedList = this.list$.value.map(item =>
          item.id === updatedEntity.id ? updatedEntity : item);
        this.list$.next(updatedList);
      })
    );
  }

  delete(entity: T): Observable<T> {
    return this.http.delete<T>(this.getEntityUrl(entity.id)).pipe(
      tap(() => {
        const list = this.list$.value.filter(item => item.id !== entity.id);
        this.list$.next(list);
      })
    );
  }

  protected getEntityUrl(id?: string | number): string {
    return `${this.apiUrl}/${this.entity}${id ? `/${id}` : ''}`;
  }
}