import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { DropdownMenusModule, WidgetsModule } from '../../_metronic/partials';
import { DateAgoPipe } from './date-ago.pipe';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { CustomMixedWidget2Component } from './components/custom-mixed-widget-2/custom-mixed-widget-2';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ListComponent } from './components/list/list.component';
import { DashboardList1Component } from './components/dashboard-list-1/dashboard-list-1.component';
import { OneItemWidgetComponent } from "./components/one-item-widget/one-item-widget.component";

@NgModule({
  declarations: [
    DashboardComponent,
    ListComponent,
    OneItemWidgetComponent,
    DateAgoPipe,
    CustomMixedWidget2Component,
    DashboardList1Component,
  ],
  imports: [
    CommonModule,
    WidgetsModule,
    NgApexchartsModule,
    DropdownMenusModule,
    InlineSVGModule,
    RouterModule.forChild([
      {
        path: '',
        component: DashboardComponent,
      },
    ]),
    WidgetsModule,
  ],
})
export class DashboardModule { }
