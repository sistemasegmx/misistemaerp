import {NgModule} from '@angular/core';
import {KeeniconComponent} from './keenicon/keenicon.component';
import {CommonModule} from "@angular/common";
import { EnterAsTabDirective } from 'src/app/directives/enter-as-tab.directive';

@NgModule({
  declarations: [
    KeeniconComponent,
    EnterAsTabDirective
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    KeeniconComponent,
    EnterAsTabDirective
  ]
})
export class SharedModule {
}
