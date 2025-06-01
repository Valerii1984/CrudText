import { Component, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { RecordModel } from '../../models/record.model';

@Component({
  selector: 'app-record-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './record-form.component.html',
  styleUrls: ['./record-form.component.scss']
})
export class RecordFormComponent {
  @Input() record: RecordModel = { id: 0, title: '', text: '', image: '', url: '', active: 0, sort_order: 0 };
  @Input() isEditing: boolean = false;
  @Output() recordCreate = new EventEmitter<RecordModel>();
  @Output() recordUpdate = new EventEmitter<RecordModel>();
  public newRecord: RecordModel = { id: 0, title: '', text: '', image: '', url: '', active: 0, sort_order: 0 };

  @ViewChild('createForm') createForm!: NgForm;

  get titleInvalidClass(): string {
    return this.isInvalidField('title') ? 'is-invalid' : '';
  }

  get descriptionInvalidClass(): string {
    return this.isInvalidField('description') ? 'is-invalid' : '';
  }

  private isInvalidField(key: string): boolean {
    const controls = this.createForm?.controls;
    if (!controls) return false;

    const control = controls[key];
    return control?.invalid && (control?.dirty || control?.touched);
  }

  onSubmit(): void {
    if (this.createForm.valid) {
      if (this.isEditing) {
        this.recordUpdate.emit({ ...this.record });
      } else {
        this.recordCreate.emit({ ...this.newRecord });
      }
      this.createForm.resetForm();
      this.newRecord = { id: 0, title: '', text: '', image: '', url: '', active: 0, sort_order: 0 };
    }
  }
}