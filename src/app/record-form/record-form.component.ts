import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { RecordModel } from '../../models/record.model';

@Component({
  selector: 'app-record-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './record-form.component.html',
  styleUrls: ['./record-form.component.scss']
})
export class RecordFormComponent {
  @Output() recordCreate = new EventEmitter<RecordModel>();
  public newRecord: RecordModel = { id: 0, title: '', text: '' };

  onSubmit(form: NgForm): void {
    if (form.valid) {
      this.recordCreate.emit({ ...this.newRecord });
      form.resetForm();
      this.newRecord = { id: 0, title: '', text: '' };
    }
  }
}