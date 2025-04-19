import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './pages/list/list.component';
import { AddComponent } from './pages/add/add.component';
import { HeroeComponent } from './components/heroe/heroe.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { HomeComponent } from './pages/home/home.component';
import { SharedModule } from 'src/app/_metronic/shared/shared.module';
import { RecentComponent } from './components/recent/recent.component';
import { HeroerecentComponent } from './pages/heroerecent/heroerecent.component';
import { HeroeeditComponent } from './pages/heroeedit/heroeedit.component';
import { EditComponent } from './components/edit/edit.component';

@NgModule({
  declarations: [
    ListComponent,
    AddComponent,
    HeroeComponent,
    HomeComponent,
    RecentComponent,
    EditComponent,
    HeroerecentComponent,
    HeroeeditComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    NgxPaginationModule,
    RouterModule.forChild([{
      path: '', component: HomeComponent,
      children: [
        { path: '', component: ListComponent },
        { path: 'add', component: AddComponent },
        { path: ':id', component: HeroerecentComponent },
        { path: ':id/edit', component: HeroeeditComponent },
        { path: '**', redirectTo: '' }
      ]
    }]),
  ]
})
export class UserModule { }
