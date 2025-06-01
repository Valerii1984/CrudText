import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { RecordModel, RecordWithId } from '../models/record.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RecordService {
  constructor(private apiService: ApiService) {}

  createRecord(newRecord: RecordModel, records: RecordWithId[]): Observable<RecordWithId> {
    const postData = {
      title: newRecord.title,
      text: newRecord.text,
      image: 'http://yourtestapi.loc/img/default.jpg',
      url: 'default-url',
      active: 1,
      sort_order: records.length + 1
    };
    return this.apiService.createRecord(postData).pipe(
      map(response => {
        if (!response.id) {
          throw new Error('Invalid response: id is missing');
        }
        return response as RecordWithId;
      })
    );
  }

  saveRecord(id: number, record: RecordModel): Observable<void> {
    return this.apiService.updateRecord(id, record);
  }

  deleteRecord(id: number): Observable<void> {
    return this.apiService.deleteRecord(id);
  }
}