import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/_metronic/shared/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { ReportquotsComponent } from './reportquots.component';


@NgModule({
  declarations: [ReportquotsComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    NgxPaginationModule,
    RouterModule.forChild([{ path: '', component: ReportquotsComponent }]),
  ]
})
export class ReportquotsModule { }