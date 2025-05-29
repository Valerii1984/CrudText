import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RecordFormComponent } from '../record-form/record-form.component';
import { ApiService } from '../api.service';
import { RecordModel } from '../../models/record.model';

@Component({
  selector: 'app-record-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RecordFormComponent],
  templateUrl: './record-list.component.html',
})
export class RecordListComponent {
  records: RecordModel[] = [];
  editingId: number | null = null;

  constructor(private apiService: ApiService) {}

  loadRecords(): void {
    this.apiService.getRecords().subscribe({
      next: (records) => {
        this.records = records;
        console.log('Records loaded:', records);
      },
      error: (error) => {
        console.error('Error loading records:', error);
      }
    });
  }

  createRecord(newRecord: RecordModel): void {
    const postData = {
      title: newRecord.title,
      text: newRecord.text,
      image: 'http://yourtestapi.loc/img/default.jpg',
      url: 'default-url',
      active: 1,
      sort_order: this.records.length + 1
    };
    console.log('Отправляем данные:', postData);

    this.apiService.createRecord(postData).subscribe({
      next: (response) => {
        console.log('Ответ сервера:', response);
        this.records.push(response); 
      },
      error: (error) => {
        console.error('Ошибка при запросе:', error);
      }
    });
  }

  startEditing(id: number): void {
    this.editingId = id;
  }

  saveRecord(record: RecordModel): void {
    if (this.editingId !== null) {
      this.apiService.updateRecord(this.editingId, record).subscribe({
        next: () => {
          console.log('Record updated');
          this.editingId = null;
          const index = this.records.findIndex(r => r.id === this.editingId);
          if (index !== -1) {
            this.records[index] = record;
          }
        },
        error: (error) => {
          console.error('Error updating record:', error);
        }
      });
    }
  }

  cancelEditing(): void {
    this.editingId = null;
  }

  deleteRecord(id: number): void {
    if (id) {
      this.apiService.deleteRecord(id).subscribe({
        next: () => {
          console.log('Record deleted');
          this.records = this.records.filter(r => r.id !== id);
        },
        error: (error) => {
          console.error('Error deleting record:', error);
        }
      });
    }
  }

  trackById(index: number, record: RecordModel): number {
    return record.id || index;
  }
}