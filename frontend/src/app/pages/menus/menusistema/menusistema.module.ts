import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from "@angular/router";
import { MenusistemaComponent } from './menusistema.component';



@NgModule({
  declarations: [MenusistemaComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: MenusistemaComponent, }]),
  ]
})
export class MenusistemaModule { }
