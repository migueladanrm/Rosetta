import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { CreateOperationComponent } from './create-operation/create-operation.component';
import { DialogWorkingComponent } from './dialog-working/dialog-working.component';
import { DialogOperationCreatedComponent } from './dialog-operation-created/dialog-operation-created.component';
import { HistoryComponent } from './history/history.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRippleModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { OperationDetailsComponent } from './operation-details/operation-details.component';
import { ViewOperationComponent } from './view-operation/view-operation.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CreateOperationComponent,
    ViewOperationComponent,
    HistoryComponent,
    OperationDetailsComponent,
    DialogWorkingComponent,
    DialogOperationCreatedComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatInputModule,
    MatCardModule,
    MatIconModule,
    MatRippleModule,
    MatDividerModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    FormsModule,
    MatGridListModule,
    MatTableModule,
  ],
  providers: [FormBuilder],
  bootstrap: [AppComponent],
})
export class AppModule {}
