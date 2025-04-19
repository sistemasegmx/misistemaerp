import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from "@angular/router";
import { MenureportsComponent } from './menureports.component';



@NgModule({
  declarations: [MenureportsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: MenureportsComponent, }]),
  ]
})
export class MenureportsModule { }
