import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RecordFormComponent } from '../record-form/record-form.component';
import { ApiService } from '../api.service';
import { RecordModel, RecordWithId } from '../../models/record.model';

declare let bootstrap: any;

@Component({
  selector: 'app-record-list',
  imports: [CommonModule, FormsModule, RecordFormComponent],
  templateUrl: './record-list.component.html',
})
export class RecordListComponent {
  public records: RecordWithId[] = [];
  public editingId: number | null = null;
  public selectedRecord: RecordModel = { id: 0, title: '', text: '', image: '', url: '', active: 0, sort_order: 0 };
  public isEditing: boolean = false;

  private apiService: ApiService;

  constructor(apiService: ApiService) {
    this.apiService = apiService;
  }

  loadRecords(): void {
    this.apiService.getRecords().subscribe({
      next: (records) => {
        this.records = records.filter((record): record is RecordWithId => 
          record.id !== undefined && typeof record.id === 'number'
        );
        console.log('Records loaded:', this.records);
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
        if (response.id !== undefined && typeof response.id === 'number') {
          this.records.push(response as RecordWithId);
        }
  
        const modalElement = document.getElementById('recordModal');
        if (modalElement && typeof bootstrap !== 'undefined' && bootstrap.Modal) {
          const modal = bootstrap.Modal.getInstance(modalElement);
          modal.hide();
        }
      },
      error: (error) => {
        console.error('Ошибка при запросе:', error);
      }
    });
  }

  openCreateModal(): void {
    this.isEditing = false;
    this.selectedRecord = { id: 0, title: '', text: '', image: '', url: '', active: 0, sort_order: 0 };
    this.openModal();
  }

  openEditModal(id: number): void {
    this.isEditing = true;
    this.editingId = id;
    this.selectedRecord = { ...this.records.find(r => r.id === id)! };
    this.openModal();
  }

  private openModal(): void {
    const modalElement = document.getElementById('recordModal');
    if (modalElement && typeof bootstrap !== 'undefined' && bootstrap.Modal) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    } else {
      console.error('Bootstrap Modal is not available. Ensure Bootstrap JS is loaded.');
    }
  }

  saveRecord(record: RecordModel): void {
    if (typeof this.editingId === 'number') {
      const currentId = this.editingId;
      this.apiService.updateRecord(currentId, record).subscribe({
        next: () => {
          console.log('Record updated');
          const index = this.records.findIndex(r => r.id === currentId);
          if (index !== -1) {
            this.records[index] = { ...record, id: currentId } as RecordWithId;
          }
          this.editingId = null;
          
          const modalElement = document.getElementById('recordModal');
          if (modalElement && typeof bootstrap !== 'undefined' && bootstrap.Modal) {
            const modal = bootstrap.Modal.getInstance(modalElement);
            modal.hide();
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

  trackById(index: number, record: RecordWithId): number {
    return record.id;
  }
}