import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { NgxPaginationModule } from "ngx-pagination";
import { SharedModule } from "src/app/_metronic/shared/shared.module";
import { AccessComponent } from "./pages/access/access.component";
import { ProfileComponent } from "./pages/profile/profile.component";
import { PurchaseComponent } from "./pages/purchase/purchase.component";
import { QuotsComponent } from "./pages/quots/quots.component";
import { RemissionComponent } from "./pages/remission/remission.component";


@NgModule({
  declarations: [
    ProfileComponent,
    QuotsComponent,
    PurchaseComponent,
    RemissionComponent,
    AccessComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    NgxPaginationModule,
    RouterModule.forChild([{
      path: '', component: ProfileComponent,
      children: [
        { path: '', component: QuotsComponent },
        { path: 'cotizaciones', component: QuotsComponent },
        { path: 'compras', component: PurchaseComponent },
        { path: 'remisiones', component: RemissionComponent },
        { path: 'accesos', component: AccessComponent },
        { path: '**', redirectTo: '' }
      ]
    }]),
  ]
})
export class ProfileModule { }
