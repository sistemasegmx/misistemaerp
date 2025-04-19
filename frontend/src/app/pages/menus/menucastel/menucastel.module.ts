import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from "@angular/router";
import { MenuCastelComponent } from './menucastel.component';

@NgModule({
  declarations: [MenuCastelComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: MenuCastelComponent, }]),
  ]
})
export class MenuCastelModule { }
