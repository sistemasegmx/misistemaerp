import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from "@angular/router";
import { MenurecibosComponent } from './menurecibos.component';



@NgModule({
  declarations: [MenurecibosComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: MenurecibosComponent, }]),
  ]
})
export class MenurecibosModule { }
