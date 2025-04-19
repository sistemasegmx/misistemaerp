import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgxPaginationModule } from "ngx-pagination";
import { SharedModule } from "src/app/_metronic/shared/shared.module";

import { ItemfinderComponent } from "./pages/itemfinder/itemfinder.component";
import { ResumenComponent } from "./pages/resumen/resumen.component";
import { QuotsComponent } from "./pages/quots/quots.component";
import { PurchaseComponent } from "./pages/purchase/purchase.component";
import { RemissionComponent } from "./pages/remission/remission.component";
import { BodegausaComponent } from "./pages/bodegausa/bodegausa.component";
import { ImportacionComponent } from "./pages/importacion/importacion.component";
import { BodegatijuanaComponent } from "./pages/bodegatijuana/bodegatijuana.component";
import { RouterModule } from "@angular/router";
import { ReporthistoryComponent } from "./pages/reporthistory/reporthistory.component";

@NgModule({
  declarations: [
    ItemfinderComponent,
    ResumenComponent,
    QuotsComponent,
    PurchaseComponent,
    RemissionComponent,
    BodegausaComponent,
    ImportacionComponent,
    BodegatijuanaComponent,
    ReporthistoryComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    NgxPaginationModule,
    RouterModule.forChild([{ path: '', component: ItemfinderComponent }]),
  ],
  exports: [ItemfinderComponent]
})
export class TrazabilidadModule { }
