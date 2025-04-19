import { Routes } from '@angular/router';
import { AuthGuard } from '../modules/auth/services/auth.guard';

const Routing: Routes = [

  // Sección: Principal
  { path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule) },
  { path: 'mi-perfil', loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule) },
  { path: 'rastreo-de-ordenes', loadChildren: () => import('./tracking/tracking.module').then(m => m.TrackingModule) },
  { path: 'trazabilidad-de-partes', loadChildren: () => import('./trazabilidad/trazabilidad.module').then(m => m.TrazabilidadModule) },

  // Sección: Catálogos
  { path: 'administracion-de-catalogos', loadChildren: () => import('./menus/menucatalogs/menucatalogs.module').then(m => m.MenucatalogsModule) },
  { path: 'administracion-de-clientes', loadChildren: () => import('./catalogs/client/client.module').then(m => m.ClientModule) },
  { path: 'administracion-de-proveedores', loadChildren: () => import('./catalogs/supplier/supplier.module').then(m => m.SupplierModule) },
  { path: 'administracion-de-empleados', loadChildren: () => import('./catalogs/employee/employee.module').then(m => m.EmployeeModule) },
  { path: 'administracion-de-partes', loadChildren: () => import('./catalogs/item/item.module').then(m => m.ItemModule) },

  // Sección: Movimientos
  { path: 'administracion-de-movimientos', loadChildren: () => import('./menus/menusales/menusales.module').then(m => m.MenusalesModule) },
  { path: 'movimiento-de-cotizacion', loadChildren: () => import('./sales/quotes/quotes.module').then(m => m.QuotesModule) },
  { path: 'movimiento-de-compra', loadChildren: () => import('./sales/purchases/purchases.module').then(m => m.PurchasesModule) },
  { path: 'movimiento-de-remision', loadChildren: () => import('./sales/remision/remision.module').then(m => m.RemisionModule) },

  // Sección: Recibos
  { path: 'administracion-de-recibos', loadChildren: () => import('./menus/menurecibos/menurecibos.module').then(m => m.MenurecibosModule) },
  { path: 'movimiento-de-partes', loadChildren: () => import('./recibos/partes/partes.module').then(m => m.PartesModule) },
  { path: 'recibos-bodega-usa', loadChildren: () => import('./recibos/bodegausa/bodegausa.module').then(m => m.BodegaUSAModule) },
  { path: 'recibos-proceso-importacion', loadChildren: () => import('./recibos/procesoimportacion/procesoimportacion.module').then(m => m.ProcesoImportacionModule) },
  { path: 'recibos-bodega-tijuana', loadChildren: () => import('./recibos/bodegatijuana/bodegatijuana.module').then(m => m.BodegaTjuanaModule) },
  { path: 'reporte-partes-recibos', loadChildren: () => import('./recibos/reportitems/reportitems.module').then(m => m.ReportsItemsModule) },

  // Sección: Reportes de Órdenes
  { path: 'administracion-de-reportes', loadChildren: () => import('./menus/menureports/menureports.module').then(m => m.MenureportsModule) },
  { path: 'reporte-de-cotizaciones', loadChildren: () => import('./reports/reportquots/reportquots.module').then(m => m.ReportquotsModule) },
  { path: 'reporte-de-compras', loadChildren: () => import('./reports/reportpurchases/reportpurchases.module').then(m => m.ReportsModule) },
  { path: 'reporte-de-remisiones', loadChildren: () => import('./reports/reportremission/reportremissions.module').then(m => m.ReportremissionsModule) },

  // Sección: Reportes de Partes
  { path: 'reporte-de-partes-cotizadas', loadChildren: () => import('./reports/reportpartsquoted/reportpartsquoted.module').then(m => m.ReportpartsquotedModule) },
  { path: 'reporte-de-partes-remitidas', loadChildren: () => import('./reports/reportpartsremission/reportpartsremision.module').then(m => m.ReportpartsremisionModule) },
  { path: 'reporte-de-partes-compradas', loadChildren: () => import('./reports/reportpartsordered/reportpartsordered.module').then(m => m.ReportpartsorderedModule) },

  // Sección: Reportes de Trazabilidad
  { path: 'reporte-historico-partes', loadChildren: () => import('./reports/reportpartshistory/reportpartshistory.module').then(m => m.ReportpartshistoryModule) },
  { path: 'reporte-historial-movimientos', loadChildren: () => import('./reports/reportpartshistory/reportpartshistory.module').then(m => m.ReportpartshistoryModule) },

  // Sección: Castel
  {
    path: 'administracion-de-castel',
    loadChildren: () => import('./menus/menucastel/menucastel.module').then(m => m.MenuCastelModule),
    canActivate: [AuthGuard],
    data: { requiresCastelAccess: true }
  },
  {
    path: 'castel-cotizacion',
    loadChildren: () => import('./sales/castelquotes/castelquotes.module').then(m => m.CastelQuotesModule),
    canActivate: [AuthGuard],
    data: { requiresCastelAccess: true }
  },
  {
    path: 'castel-remision',
    loadChildren: () => import('./sales/castelremision/castelremision.module').then(m => m.CastelRemisionModule),
    canActivate: [AuthGuard],
    data: { requiresCastelAccess: true }
  },

  // Sección: Configuración (Solo Admins)
  {
    path: 'configuracion-de-sistema',
    loadChildren: () => import('./menus/menusistema/menusistema.module').then(m => m.MenusistemaModule),
    canActivate: [AuthGuard],
    data: { roles: ['admin'] }
  },
  {
    path: 'configuracion-de-categorias',
    loadChildren: () => import('./zconfigs/category/category.module').then(m => m.CategoryModule),
    canActivate: [AuthGuard],
    data: { roles: ['admin'] }
  },
  {
    path: 'configuracion-de-monedas',
    loadChildren: () => import('./zconfigs/currency/currency.module').then(m => m.CurrencyModule),
    canActivate: [AuthGuard],
    data: { roles: ['admin'] }
  },
  {
    path: 'configuracion-de-impuestos',
    loadChildren: () => import('./zconfigs/tax/tax.module').then(m => m.TaxModule),
    canActivate: [AuthGuard],
    data: { roles: ['admin'] }
  },
  {
    path: 'configuracion-de-precios',
    loadChildren: () => import('./zconfigs/pricelevel/pricelevel.module').then(m => m.PricelevelModule),
    canActivate: [AuthGuard],
    data: { roles: ['admin'] }
  },
  {
    path: 'configuracion-de-usuarios',
    loadChildren: () => import('./zconfigs/user/user.module').then(m => m.UserModule),
    canActivate: [AuthGuard],
    data: { roles: ['admin'] }
  },
  {
    path: 'configuracion-de-miempresa',
    loadChildren: () => import('./zconfigs/account/account.module').then(m => m.AccountModule),
    canActivate: [AuthGuard],
    data: { roles: ['admin'] }
  },

  // Redirecciones y Error 404
  { path: '', redirectTo: '/rastreo-de-ordenes', pathMatch: 'full' },
  { path: '**', redirectTo: 'error/404' }
];

export { Routing };
