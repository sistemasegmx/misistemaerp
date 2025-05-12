<?php

use src\app\controllers\baseController;

$router->post('/uploadFile', baseController::class . '::postUploadFile');
$router->post('/sendEmailWithPDF', baseController::class . '::postSendEmailWithPDF');
$router->get('/convertImageToBase64', baseController::class . '::getConvertImageToBase64');

use src\app\controllers\accountController;

$router->get('/account', accountController::class . '::getAll');
$router->get('/account/filtered', accountController::class . '::getAllFiltered');
$router->get('/account/listByColumn', accountController::class . '::getAllDataByColumn');
$router->get('/account/getone', accountController::class . '::getOneById');
$router->get('/account/preByLike', accountController::class . '::getPreDataByLike');
$router->post('/account', accountController::class . '::store');
$router->put('/account', accountController::class . '::update');
$router->patch('/account', accountController::class . '::modify');
$router->delete('/account', accountController::class . '::hardDelete');

use src\app\controllers\categoryController;

$router->get('/category', categoryController::class . '::getAll');
$router->get('/category/filtered', categoryController::class . '::getAllFiltered');
$router->get('/category/listByColumn', categoryController::class . '::getAllDataByColumn');
$router->get('/category/getone', categoryController::class . '::getOneById');
$router->get('/category/preByLike', categoryController::class . '::getPreDataByLike');
$router->post('/category', categoryController::class . '::store');
$router->put('/category', categoryController::class . '::update');
$router->patch('/category', categoryController::class . '::modify');
$router->delete('/category', categoryController::class . '::hardDelete');


use src\app\controllers\currencyController;

$router->get('/currency', currencyController::class . '::getAll');
$router->get('/currency/filtered', currencyController::class . '::getAllFiltered');
$router->get('/currency/listByColumn', currencyController::class . '::getAllDataByColumn');
$router->get('/currency/getone', currencyController::class . '::getOneById');
$router->get('/currency/preByLike', currencyController::class . '::getPreDataByLike');
$router->post('/currency', currencyController::class . '::store');
$router->put('/currency', currencyController::class . '::update');
$router->patch('/currency', currencyController::class . '::modify');
$router->delete('/currency', currencyController::class . '::hardDelete');

use src\app\controllers\departmentController;

$router->get('/department', departmentController::class . '::getAll');
$router->get('/department/filtered', departmentController::class . '::getAllFiltered');
$router->get('/department/listByColumn', departmentController::class . '::getAllDataByColumn');
$router->get('/department/getone', departmentController::class . '::getOneById');
$router->get('/department/preByLike', departmentController::class . '::getPreDataByLike');
$router->post('/department', departmentController::class . '::store');
$router->put('/department', departmentController::class . '::update');
$router->patch('/department', departmentController::class . '::modify');
$router->delete('/department', departmentController::class . '::hardDelete');

use src\app\controllers\enteController;

$router->get('/ente', enteController::class . '::getAll');
$router->get('/ente/paginated', enteController::class . '::getAllPaginated');
$router->get('/ente/filtered', enteController::class . '::getAllFiltered');
$router->get('/ente/listByColumn', enteController::class . '::getAllDataByColumn');
$router->get('/ente/getone', enteController::class . '::getOneById');
$router->get('/ente/preByLike', enteController::class . '::getPreDataByLike');
$router->post('/ente', enteController::class . '::store');
$router->put('/ente', enteController::class . '::update');
$router->patch('/ente', enteController::class . '::modify');
$router->delete('/ente', enteController::class . '::hardDelete');

use src\app\controllers\clienteController;

$router->get('/cliente', clienteController::class . '::getAll');
$router->get('/cliente/paginated', clienteController::class . '::getAllPaginated');
$router->get('/cliente/filtered', clienteController::class . '::getAllFiltered');
$router->get('/cliente/listByColumn', clienteController::class . '::getAllDataByColumn');
$router->get('/cliente/getone', clienteController::class . '::getOneById');
$router->get('/cliente/preByLike', clienteController::class . '::getPreDataByLike');
$router->post('/cliente', clienteController::class . '::store');
$router->put('/cliente', clienteController::class . '::update');
$router->patch('/cliente', clienteController::class . '::modify');
$router->delete('/cliente', clienteController::class . '::hardDelete');

use src\app\controllers\entecontactsController;

$router->get('/entecontacts', entecontactsController::class . '::getAll');
$router->get('/entecontacts/filtered', entecontactsController::class . '::getAllFiltered');
$router->get('/entecontacts/listByColumn', entecontactsController::class . '::getAllDataByColumn');
$router->get('/entecontacts/getone', entecontactsController::class . '::getOneById');
$router->get('/entecontacts/preByLike', entecontactsController::class . '::getPreDataByLike');
$router->post('/entecontacts', entecontactsController::class . '::store');
$router->put('/entecontacts', entecontactsController::class . '::update');
$router->patch('/entecontacts', entecontactsController::class . '::modify');
$router->delete('/entecontacts', entecontactsController::class . '::hardDelete');

use src\app\controllers\pricelevelController;

$router->get('/pricelevel', pricelevelController::class . '::getAll');
$router->get('/pricelevel/filtered', pricelevelController::class . '::getAllFiltered');
$router->get('/pricelevel/listByColumn', pricelevelController::class . '::getAllDataByColumn');
$router->get('/pricelevel/getone', pricelevelController::class . '::getOneById');
$router->get('/pricelevel/preByLike', pricelevelController::class . '::getPreDataByLike');
$router->post('/pricelevel', pricelevelController::class . '::store');
$router->put('/pricelevel', pricelevelController::class . '::update');
$router->patch('/pricelevel', pricelevelController::class . '::modify');
$router->delete('/pricelevel', pricelevelController::class . '::hardDelete');

use src\app\controllers\itemController;

$router->get('/item', itemController::class . '::getAll');
$router->get('/item/paginated', itemController::class . '::getAllPaginated');
$router->get('/item/filtered', itemController::class . '::getAllFiltered');
$router->get('/item/oneByColumn', itemController::class . '::getOneByColumn');
$router->get('/item/listByColumn', itemController::class . '::getAllDataByColumn');
$router->get('/item/listByLike', itemController::class . '::getAllDataByLike');
$router->get('/item/getone', itemController::class . '::getOneById');
$router->get('/item/preByLike', itemController::class . '::getPreDataByLike');
$router->post('/item', itemController::class . '::store');
$router->put('/item', itemController::class . '::update');
$router->patch('/item', itemController::class . '::modify');
$router->delete('/item', itemController::class . '::hardDelete');

use src\app\controllers\jobController;

$router->get('/job', jobController::class . '::getAll');
$router->get('/job/filtered', jobController::class . '::getAllFiltered');
$router->get('/job/listByColumn', jobController::class . '::getAllDataByColumn');
$router->get('/job/getone', jobController::class . '::getOneById');
$router->get('/job/preByLike', jobController::class . '::getPreDataByLike');
$router->post('/job', jobController::class . '::store');
$router->put('/job', jobController::class . '::update');
$router->patch('/job', jobController::class . '::modify');
$router->delete('/job', jobController::class . '::hardDelete');

use src\app\controllers\paymentController;

$router->get('/payment', paymentController::class . '::getAll');
$router->get('/payment/filtered', paymentController::class . '::getAllFiltered');
$router->get('/payment/listByColumn', paymentController::class . '::getAllDataByColumn');
$router->get('/payment/getone', paymentController::class . '::getOneById');
$router->get('/payment/preByLike', paymentController::class . '::getPreDataByLike');
$router->post('/payment', paymentController::class . '::store');
$router->put('/payment', paymentController::class . '::update');
$router->patch('/payment', paymentController::class . '::modify');
$router->delete('/payment', paymentController::class . '::hardDelete');

use src\app\controllers\saleController;

$router->get('/sale', saleController::class . '::getAll');
$router->get('/sale/paginated', saleController::class . '::getAllPaginated');
$router->get('/sale/paginatedReport', saleController::class . '::getAllPaginatedReport');
$router->get('/sale/paginatedByLike', saleController::class . '::getAllPaginatedByLike');
$router->get('/sale/filtered', saleController::class . '::getAllFiltered');
$router->get('/sale/filteredByRange', saleController::class . '::getAllFilteredByRange');
$router->get('/sale/listByColumn', saleController::class . '::getAllDataByColumn');
$router->get('/sale/getone', saleController::class . '::getOneById');
$router->get('/sale/preByLike', saleController::class . '::getPreDataByLike');
$router->post('/sale', saleController::class . '::storeSequence');
$router->put('/sale', saleController::class . '::update');
$router->patch('/sale', saleController::class . '::modify');
$router->delete('/sale', saleController::class . '::hardDelete');

use src\app\controllers\saleitemsController;

$router->get('/saleitems', saleitemsController::class . '::getAll');
$router->get('/saleitems/paginated', saleitemsController::class . '::getAllPaginated');
$router->get('/saleitems/paginatedByCompra', saleitemsController::class . '::getAllPaginatedByCompra');
$router->get('/saleitems/paginatedByRecibo', saleitemsController::class . '::getAllPaginatedByRecibo');
$router->get('/saleitems/historyReport', saleitemsController::class . '::getAllHistoryReport');
$router->get('/saleitems/traceabilityReport', saleitemsController::class . '::getAllTraceabilityReport');
$router->get('/saleitems/paginatedReport', saleitemsController::class . '::getAllPaginatedReport');
$router->get('/saleitems/filtered', saleitemsController::class . '::getAllFiltered');
$router->get('/saleitems/listByColumn', saleitemsController::class . '::getAllDataByColumn');
$router->get('/saleitems/getone', saleitemsController::class . '::getOneById');
$router->get('/saleitems/preByLike', saleitemsController::class . '::getPreDataByLike');
$router->get('/saleitems/countsByItem', saleitemsController::class . '::getCountsByItem');
$router->get('/saleitems/recentsByItem', saleitemsController::class . '::getRecentsByItem');
$router->post('/saleitems', saleitemsController::class . '::store');
$router->post('/saleitemsbulk', saleitemsController::class . '::storeBulk');
$router->put('/saleitems', saleitemsController::class . '::update');
$router->patch('/saleitems', saleitemsController::class . '::modify');
$router->delete('/saleitems', saleitemsController::class . '::hardDelete');

use src\app\controllers\salehistoryController;

$router->get('/salehistory', salehistoryController::class . '::getAll');
$router->get('/salehistory/filtered', salehistoryController::class . '::getAllFiltered');
$router->get('/salehistory/listByColumn', salehistoryController::class . '::getAllDataByColumn');
$router->get('/salehistory/getone', salehistoryController::class . '::getOneById');
$router->get('/salehistory/preByLike', salehistoryController::class . '::getPreDataByLike');
$router->post('/salehistory', salehistoryController::class . '::store');
$router->put('/salehistory', salehistoryController::class . '::update');
$router->patch('/salehistory', salehistoryController::class . '::modify');
$router->delete('/salehistory', salehistoryController::class . '::hardDelete');

use src\app\controllers\salesequencesController;

$router->get('/salesequences', salesequencesController::class . '::getAll');
$router->get('/salesequences/filtered', salesequencesController::class . '::getAllFiltered');
$router->get('/salesequences/listByColumn', salesequencesController::class . '::getAllDataByColumn');
$router->get('/salesequences/getone', salesequencesController::class . '::getOneById');
$router->get('/salesequences/preByLike', salesequencesController::class . '::getPreDataByLike');
$router->post('/salesequences', salesequencesController::class . '::store');
$router->put('/salesequences', salesequencesController::class . '::update');
$router->patch('/salesequences', salesequencesController::class . '::modify');
$router->delete('/salesequences', salesequencesController::class . '::hardDelete');

use src\app\controllers\staffController;

$router->get('/staff', staffController::class . '::getAll');
$router->get('/staff/paginated', staffController::class . '::getAllPaginated');
$router->get('/staff/filtered', staffController::class . '::getAllFiltered');
$router->get('/staff/listByColumn', staffController::class . '::getAllDataByColumn');
$router->get('/staff/getone', staffController::class . '::getOneById');
$router->get('/staff/preByLike', staffController::class . '::getPreDataByLike');
$router->post('/staff', staffController::class . '::store');
$router->put('/staff', staffController::class . '::update');
$router->patch('/staff', staffController::class . '::modify');
$router->delete('/staff', staffController::class . '::hardDelete');

use src\app\controllers\taxController;

$router->get('/tax', taxController::class . '::getAll');
$router->get('/tax/filtered', taxController::class . '::getAllFiltered');
$router->get('/tax/listByColumn', taxController::class . '::getAllDataByColumn');
$router->get('/tax/getone', taxController::class . '::getOneById');
$router->get('/tax/preByLike', taxController::class . '::getPreDataByLike');
$router->post('/tax', taxController::class . '::store');
$router->put('/tax', taxController::class . '::update');
$router->patch('/tax', taxController::class . '::modify');
$router->delete('/tax', taxController::class . '::hardDelete');

use src\app\controllers\userController;

$router->get('/user', userController::class . '::getAll');
$router->get('/user/filtered', userController::class . '::getAllFiltered');
$router->get('/user/listByColumn', userController::class . '::getAllDataByColumn');
$router->get('/user/getone', userController::class . '::getOneById');
$router->get('/user/preByLike', userController::class . '::getPreDataByLike');
$router->post('/user', userController::class . '::store');
$router->put('/user', userController::class . '::update');
$router->patch('/user', userController::class . '::modify');
$router->delete('/user', userController::class . '::hardDelete');
$router->get('/user/bytoken', userController::class . '::userByToken');

use src\app\controllers\providerController;

$router->get('/provider', providerController::class . '::getAll');
$router->get('/provider/paginated', providerController::class . '::getAllPaginated');
$router->get('/provider/filtered', providerController::class . '::getAllFiltered');
$router->get('/provider/listByColumn', providerController::class . '::getAllDataByColumn');
$router->get('/provider/getone', providerController::class . '::getOneById');
$router->get('/provider/preByLike', providerController::class . '::getPreDataByLike');
$router->post('/provider', providerController::class . '::store');
$router->put('/provider', providerController::class . '::update');
$router->patch('/provider', providerController::class . '::modify');
$router->delete('/provider', providerController::class . '::hardDelete');


use src\app\controllers\prospectController;

$router->get('/prospect', prospectController::class . '::getAll');
$router->get('/prospect/paginated', prospectController::class . '::getAllPaginated');
$router->get('/prospect/filtered', prospectController::class . '::getAllFiltered');
$router->get('/prospect/listByColumn', prospectController::class . '::getAllDataByColumn');
$router->get('/prospect/getone', prospectController::class . '::getOneById');
$router->get('/prospect/preByLike', prospectController::class . '::getPreDataByLike');
$router->post('/prospect', prospectController::class . '::store');
$router->put('/prospect', prospectController::class . '::update');
$router->patch('/prospect', prospectController::class . '::modify');
$router->delete('/prospect', prospectController::class . '::hardDelete');

use src\app\controllers\customerController;

$router->get('/customer', customerController::class . '::getAll');
$router->get('/customer/paginated', customerController::class . '::getAllPaginated');
$router->get('/customer/filtered', customerController::class . '::getAllFiltered');
$router->get('/customer/listByColumn', customerController::class . '::getAllDataByColumn');
$router->get('/customer/getone', customerController::class . '::getOneById');
$router->get('/customer/preByLike', customerController::class . '::getPreDataByLike');
$router->post('/customer', customerController::class . '::store');
$router->put('/customer', customerController::class . '::update');
$router->patch('/customer', customerController::class . '::modify');
$router->delete('/customer', customerController::class . '::hardDelete');

use src\app\controllers\contactController;

$router->get('/contact', contactController::class . '::getAll');
$router->get('/contact/paginated', contactController::class . '::getAllPaginated');
$router->get('/contact/filtered', contactController::class . '::getAllFiltered');
$router->get('/contact/listByColumn', contactController::class . '::getAllDataByColumn');
$router->get('/contact/getone', contactController::class . '::getOneById');
$router->get('/contact/preByLike', contactController::class . '::getPreDataByLike');
$router->post('/contact', contactController::class . '::store');
$router->put('/contact', contactController::class . '::update');
$router->patch('/contact', contactController::class . '::modify');
$router->delete('/contact', contactController::class . '::hardDelete');

use src\app\controllers\supplierController;

$router->get('/supplier', supplierController::class . '::getAll');
$router->get('/supplier/paginated', supplierController::class . '::getAllPaginated');
$router->get('/supplier/filtered', supplierController::class . '::getAllFiltered');
$router->get('/supplier/listByColumn', supplierController::class . '::getAllDataByColumn');
$router->get('/supplier/getone', supplierController::class . '::getOneById');
$router->get('/supplier/preByLike', supplierController::class . '::getPreDataByLike');
$router->post('/supplier', supplierController::class . '::store');
$router->put('/supplier', supplierController::class . '::update');
$router->patch('/supplier', supplierController::class . '::modify');
$router->delete('/supplier', supplierController::class . '::hardDelete');

use src\app\controllers\employeeController;

$router->get('/employee', employeeController::class . '::getAll');
$router->get('/employee/paginated', employeeController::class . '::getAllPaginated');
$router->get('/employee/filtered', employeeController::class . '::getAllFiltered');
$router->get('/employee/listByColumn', employeeController::class . '::getAllDataByColumn');
$router->get('/employee/getone', employeeController::class . '::getOneById');
$router->get('/employee/preByLike', employeeController::class . '::getPreDataByLike');
$router->post('/employee', employeeController::class . '::store');
$router->put('/employee', employeeController::class . '::update');
$router->patch('/employee', employeeController::class . '::modify');
$router->delete('/employee', employeeController::class . '::hardDelete');

use src\app\controllers\salespersonController;

$router->get('/salesperson', salespersonController::class . '::getAll');
$router->get('/salesperson/paginated', salespersonController::class . '::getAllPaginated');
$router->get('/salesperson/filtered', salespersonController::class . '::getAllFiltered');
$router->get('/salesperson/listByColumn', salespersonController::class . '::getAllDataByColumn');
$router->get('/salesperson/getone', salespersonController::class . '::getOneById');
$router->get('/salesperson/preByLike', salespersonController::class . '::getPreDataByLike');
$router->post('/salesperson', salespersonController::class . '::store');
$router->put('/salesperson', salespersonController::class . '::update');
$router->patch('/salesperson', salespersonController::class . '::modify');
$router->delete('/salesperson', salespersonController::class . '::hardDelete');

use src\app\controllers\distributorController;

$router->get('/distributor', distributorController::class . '::getAll');
$router->get('/distributor/paginated', distributorController::class . '::getAllPaginated');
$router->get('/distributor/filtered', distributorController::class . '::getAllFiltered');
$router->get('/distributor/listByColumn', distributorController::class . '::getAllDataByColumn');
$router->get('/distributor/getone', distributorController::class . '::getOneById');
$router->get('/distributor/preByLike', distributorController::class . '::getPreDataByLike');
$router->post('/distributor', distributorController::class . '::store');
$router->put('/distributor', distributorController::class . '::update');
$router->patch('/distributor', distributorController::class . '::modify');
$router->delete('/distributor', distributorController::class . '::hardDelete');

use src\app\controllers\carrierController;

$router->get('/carrier', carrierController::class . '::getAll');
$router->get('/carrier/paginated', carrierController::class . '::getAllPaginated');
$router->get('/carrier/filtered', carrierController::class . '::getAllFiltered');
$router->get('/carrier/listByColumn', carrierController::class . '::getAllDataByColumn');
$router->get('/carrier/getone', carrierController::class . '::getOneById');
$router->get('/carrier/preByLike', carrierController::class . '::getPreDataByLike');
$router->post('/carrier', carrierController::class . '::store');
$router->put('/carrier', carrierController::class . '::update');
$router->patch('/carrier', carrierController::class . '::modify');
$router->delete('/carrier', carrierController::class . '::hardDelete');

use src\app\controllers\partnerController;

$router->get('/partner', partnerController::class . '::getAll');
$router->get('/partner/paginated', partnerController::class . '::getAllPaginated');
$router->get('/partner/filtered', partnerController::class . '::getAllFiltered');
$router->get('/partner/listByColumn', partnerController::class . '::getAllDataByColumn');
$router->get('/partner/getone', partnerController::class . '::getOneById');
$router->get('/partner/preByLike', partnerController::class . '::getPreDataByLike');
$router->post('/partner', partnerController::class . '::store');
$router->put('/partner', partnerController::class . '::update');
$router->patch('/partner', partnerController::class . '::modify');
$router->delete('/partner', partnerController::class . '::hardDelete');

use src\app\controllers\affiliateController;

$router->get('/affiliate', affiliateController::class . '::getAll');
$router->get('/affiliate/paginated', affiliateController::class . '::getAllPaginated');
$router->get('/affiliate/filtered', affiliateController::class . '::getAllFiltered');
$router->get('/affiliate/listByColumn', affiliateController::class . '::getAllDataByColumn');
$router->get('/affiliate/getone', affiliateController::class . '::getOneById');
$router->get('/affiliate/preByLike', affiliateController::class . '::getPreDataByLike');
$router->post('/affiliate', affiliateController::class . '::store');
$router->put('/affiliate', affiliateController::class . '::update');
$router->patch('/affiliate', affiliateController::class . '::modify');
$router->delete('/affiliate', affiliateController::class . '::hardDelete');

use src\app\controllers\manufacturerController;

$router->get('/manufacturer', manufacturerController::class . '::getAll');
$router->get('/manufacturer/paginated', manufacturerController::class . '::getAllPaginated');
$router->get('/manufacturer/filtered', manufacturerController::class . '::getAllFiltered');
$router->get('/manufacturer/listByColumn', manufacturerController::class . '::getAllDataByColumn');
$router->get('/manufacturer/getone', manufacturerController::class . '::getOneById');
$router->get('/manufacturer/preByLike', manufacturerController::class . '::getPreDataByLike');
$router->post('/manufacturer', manufacturerController::class . '::store');
$router->put('/manufacturer', manufacturerController::class . '::update');
$router->patch('/manufacturer', manufacturerController::class . '::modify');
$router->delete('/manufacturer', manufacturerController::class . '::hardDelete');

use src\app\controllers\advisorController;

$router->get('/advisor', advisorController::class . '::getAll');
$router->get('/advisor/paginated', advisorController::class . '::getAllPaginated');
$router->get('/advisor/filtered', advisorController::class . '::getAllFiltered');
$router->get('/advisor/listByColumn', advisorController::class . '::getAllDataByColumn');
$router->get('/advisor/getone', advisorController::class . '::getOneById');
$router->get('/advisor/preByLike', advisorController::class . '::getPreDataByLike');
$router->post('/advisor', advisorController::class . '::store');
$router->put('/advisor', advisorController::class . '::update');
$router->patch('/advisor', advisorController::class . '::modify');
$router->delete('/advisor', advisorController::class . '::hardDelete');

use src\app\controllers\institutionController;

$router->get('/institution', institutionController::class . '::getAll');
$router->get('/institution/paginated', institutionController::class . '::getAllPaginated');
$router->get('/institution/filtered', institutionController::class . '::getAllFiltered');
$router->get('/institution/listByColumn', institutionController::class . '::getAllDataByColumn');
$router->get('/institution/getone', institutionController::class . '::getOneById');
$router->get('/institution/preByLike', institutionController::class . '::getPreDataByLike');
$router->post('/institution', institutionController::class . '::store');
$router->put('/institution', institutionController::class . '::update');
$router->patch('/institution', institutionController::class . '::modify');
$router->delete('/institution', institutionController::class . '::hardDelete');