import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { RecordListComponent } from './app/record-list/record-list.component';
import { RecordFormComponent } from './app/record-form/record-form.component';

const routes = [
  { path: '', component: RecordListComponent },
  { path: 'edit/:id', component: RecordListComponent }
];

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient()
  ]
}).catch(err => console.error(err));