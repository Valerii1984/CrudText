import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RecordFormComponent } from '../record-form/record-form.component';
import { ApiService } from '../api.service';
import { RecordModel, RecordWithId } from '../../models/record.model';
import { Subscription } from 'rxjs';
import { INITIAL_RECORD } from '../initial-record.constant';
import { RecordService } from '../record.service';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-record-list',
  imports: [CommonModule, FormsModule, RecordFormComponent],
  templateUrl: './record-list.component.html',
  styleUrls: ['./record-list.component.scss']
})
export class RecordListComponent {
  public records: RecordWithId[] = [];
  public editingId: number | null = null;
  public selectedRecord: RecordModel = INITIAL_RECORD;
  public isEditing: boolean = false;

  private apiService: ApiService;
  private recordService: RecordService;
  private subscriptions: Subscription = new Subscription();

  @ViewChild('recordModal') modalElement!: ElementRef;

  constructor(apiService: ApiService, recordService: RecordService) {
    this.apiService = apiService;
    this.recordService = recordService;
  }

  ngOnInit(): void {
    this.loadRecords();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  loadRecords(): void {
    const sub = this.apiService.getRecords().subscribe({
      next: (records) => {
        this.records = records.filter((record): record is RecordWithId => !!record.id);
      },
      error: (error) => {
        console.error('Error loading records:', error);
      }
    });
    this.subscriptions.add(sub);
  }

  createRecord(newRecord: RecordModel): void {
    const sub = this.recordService.createRecord(newRecord, this.records).subscribe({
      next: (response) => {
        this.records.push(response);
        this.closeModal();
      },
      error: (error) => {
        console.error('Error creating record:', error);
      }
    });
    this.subscriptions.add(sub);
  }

  openCreateModal(): void {
    this.isEditing = false;
    this.selectedRecord = { ...INITIAL_RECORD };
    this.openModal();
  }

  openEditModal(id: number): void {
    this.isEditing = true;
    this.editingId = id;
    this.selectedRecord = { ...this.records.find(r => r.id === id)! };
    this.openModal();
  }

  private openModal(): void {
    const modal = new bootstrap.Modal(this.modalElement.nativeElement);
    modal.show();
  }

  private closeModal(): void {
    const modal = bootstrap.Modal.getInstance(this.modalElement.nativeElement);
    if (modal) {
      modal.hide();
    }
  }

  saveRecord(record: RecordModel): void {
    if (!this.editingId) return;

    const currentId = this.editingId;
    const sub = this.recordService.saveRecord(currentId, record).subscribe({
      next: () => {
        const index = this.records.findIndex(r => r.id === currentId);
        if (index !== -1) {
          this.records[index] = { ...record, id: currentId } as RecordWithId;
        }
        this.editingId = null;
        this.closeModal();
      },
      error: (error) => {
        console.error('Error updating record:', error);
      }
    });
    this.subscriptions.add(sub);
  }

  cancelEditing(): void {
    this.editingId = null;
  }

  deleteRecord(id: number): void {
    if (!id) return;

    const sub = this.recordService.deleteRecord(id).subscribe({
      next: () => {
        this.records = this.records.filter(r => r.id !== id);
      },
      error: (error) => {
        console.error('Error deleting record:', error);
      }
    });
    this.subscriptions.add(sub);
  }

  trackById(index: number, record: RecordWithId): number {
    return record.id;
  }
}