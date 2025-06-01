import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { RecordModel } from '../models/record.model';

// Интерфейс для создания записи
interface CreateRecordModel {
  title: string;
  text: string;
  image?: string;
  url?: string;
  active?: number;
  sort_order?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly apiUrl: string = environment.apiUrl;

  constructor(private readonly http: HttpClient) {
    console.log('API URL:', this.apiUrl);
  }

  public getRecords(): Observable<RecordModel[]> {
    const url = `${this.apiUrl}/api/posts`;
    return this.http.get<RecordModel[]>(url).pipe(
      catchError(this.handleError)
    );
  }

  public createRecord(record: CreateRecordModel): Observable<RecordModel> {
    const url = `${this.apiUrl}/api/posts`;
    return this.http.post<RecordModel>(url, record).pipe(
      catchError(this.handleError)
    );
  }

  public updateRecord(id: number, record: RecordModel): Observable<void> {
    const url = `${this.apiUrl}/api/posts/${id}`;
    return this.http.put<void>(url, record).pipe(
      catchError(this.handleError)
    );
  }

  public deleteRecord(id: number): Observable<void> {
    const url = `${this.apiUrl}/api/posts/${id}`;
    return this.http.delete<void>(url).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    const url = error.url ?? 'unknown URL';
    const status = error.status ?? 'unknown status';
    const statusText = error.statusText ?? 'unknown status text';
    console.error('Error details:', { url, status, statusText, message: error.message, error: error.error });
    return throwError(() => new Error(`Http failure response for ${url}: ${status} ${statusText}`));
  }
}