import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateOperationComponent } from './create-operation/create-operation.component';
import { HistoryComponent } from './history/history.component';
import { HomeComponent } from './home/home.component';
import { OperationDetailsComponent } from './operation-details/operation-details.component';
import { ViewOperationComponent } from './view-operation/view-operation.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'create-operation', component: CreateOperationComponent },
  { path: 'view-operation', component: ViewOperationComponent },
  { path: 'view-operation/:operationId', component: OperationDetailsComponent },
  { path: 'history', component: HistoryComponent },
  { path: '**', redirectTo: '/' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
