import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/_metronic/shared/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { ReportpartsremisionComponent } from './reportpartsremision.component';

@NgModule({
  declarations: [ReportpartsremisionComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    NgxPaginationModule,
    RouterModule.forChild([{ path: '', component: ReportpartsremisionComponent }]),
  ]
})
export class ReportpartsremisionModule { }
