import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './pages/list/list.component';
import { AddComponent } from './pages/add/add.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from 'src/app/_metronic/shared/shared.module';
import { HeroeComponent } from './pages/heroe/heroe.component';
import { HomeComponent } from './pages/home/home.component';
import { EditComponent } from './pages/edit/edit.component';
import { ShoppingCartComponent } from './pages/shoppingcart/shoppingcart.component';
import { SearchItemsComponent } from './pages/searchitems/searchitems.component';
import { InfoComponent } from './pages/info/info.component';

@NgModule({
  declarations: [
    ListComponent,
    AddComponent,
    HomeComponent,
    HeroeComponent,
    EditComponent,
    ShoppingCartComponent,
    SearchItemsComponent,
    InfoComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    RouterModule.forChild([{
      path: '', component: HomeComponent,
      children: [
        { path: '', component: ListComponent },
        { path: 'add', component: AddComponent },
        { path: ':id/edit', component: EditComponent },
        { path: ':id', component: HeroeComponent },
        { path: '**', redirectTo: '' }
      ]
    }]),
  ],
  exports: [
    ShoppingCartComponent,
    SearchItemsComponent,
    InfoComponent
  ]
})
export class CastelRemisionModule { }