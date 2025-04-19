import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './pages/home/home.component';
import { ListComponent } from './pages/list/list.component';
import { AddComponent } from './pages/add/add.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from 'src/app/_metronic/shared/shared.module';
import { HeroeComponent } from './pages/heroe/heroe.component';
import { ContactComponent } from './pages/contact/contact.component';

@NgModule({
  declarations: [
    ListComponent,
    AddComponent,
    HomeComponent,
    HeroeComponent,
    ContactComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    RouterModule.forChild([{
      path: '', component: HomeComponent,
      children: [
        { path: '', component: ListComponent },
        { path: 'add', component: AddComponent },
        { path: ':id/edit', component: AddComponent },
        { path: ':id/contacts', component: ContactComponent },
        { path: ':id', component: HeroeComponent },
        { path: '**', redirectTo: '' }
      ]
    }]),
  ]
})
export class ClientModule { }