import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from 'src/app/_metronic/shared/shared.module';
import { HeroeComponent } from './pages/heroe/heroe.component';
import { HomeComponent } from './pages/home/home.component';
import { InfoComponent } from './pages/info/info.component';
import { ListComponent } from './pages/list/list.component';

@NgModule({
  declarations: [
    ListComponent,
    HomeComponent,
    HeroeComponent,
    InfoComponent
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
        { path: ':id', component: HeroeComponent },
        { path: '**', redirectTo: '' }
      ]
    }]),
  ],
  exports: [
    InfoComponent
  ]
})
export class ProcesoImportacionModule { }