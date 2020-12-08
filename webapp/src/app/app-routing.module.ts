import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateOperationComponent } from './create-operation/create-operation.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'create-operation', component: CreateOperationComponent },
  { path: '**', redirectTo: '/' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
