import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from "@angular/router";
import { MenusalesComponent } from './menusales.component';



@NgModule({
  declarations: [MenusalesComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: MenusalesComponent, }]),
  ]
})
export class MenusalesModule { }
