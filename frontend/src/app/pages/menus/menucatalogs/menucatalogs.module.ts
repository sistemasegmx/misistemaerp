import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from "@angular/router";
import { MenucatalogsComponent } from './menucatalogs.component';



@NgModule({
  declarations: [MenucatalogsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: MenucatalogsComponent, }]),
  ]
})
export class MenucatalogsModule { }
