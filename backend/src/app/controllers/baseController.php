<?php

namespace src\app\controllers;

use src\app\classes\helpers;
use src\app\controllers\repositoryController;
use src\app\models\itemModel;
use src\app\models\saleModel;
use src\app\models\salesequencesModel;
use src\core\emailService;

class baseController
{
  public static function indexAction(): array
  {
    return helpers::formatResponse(200, 'Let\'s start build something Incredible!', []);
  }
  public static function noActionFound(): array
  {
    return helpers::formatResponse(404, 'No Action Found!', []);
  }

  protected static function getAllBase(object $model): array
  {
    return repositoryController::getAllData($model);
  }

  protected static function getAllPaginatedBase(object $model, array $request): array
  {
    $pageNumber = array_key_exists('pageNumber', $request) ? intval($request['pageNumber']) : 1;
    $pageSize = array_key_exists('pageSize', $request) ? intval($request['pageSize']) : 10;
    $fieldColumn = array_key_exists('fieldColumn', $request) ? strval($request['fieldColumn']) : '';
    $fieldValue = array_key_exists('fieldValue', $request) ? urldecode(trim(strval($request['fieldValue']))) : strval('');
    $ascending = array_key_exists('ascending', $request) ? strval($request['ascending']) : 'desc';

    if (count($request) > 0) {
      foreach ($request as $key => $value)
        if (!property_exists($model, $key))
          unset($request[$key]);
      $request = helpers::cleanArray($request);
    }


    return repositoryController::getAllPaginated($model, $pageNumber, $pageSize, $request, $ascending, $fieldColumn, $fieldValue);
  }

  protected static function getAllPaginatedCartBase(object $model, array $request): array
  {
    $pageNumber = array_key_exists('pageNumber', $request) ? intval($request['pageNumber']) : 1;
    $pageSize = array_key_exists('pageSize', $request) ? intval($request['pageSize']) : 10;
    $fieldColumn = array_key_exists('fieldColumn', $request) ? strval($request['fieldColumn']) : '';
    $fieldValue = array_key_exists('fieldValue', $request) ? urldecode(trim(strval($request['fieldValue']))) : strval('');
    $ascending = array_key_exists('ascending', $request) ? strval($request['ascending']) : 'DESC';

    if (count($request) > 0) {
      foreach ($request as $key => $value)
        if (!property_exists($model, $key))
          unset($request[$key]);
      $request = helpers::cleanArray($request);
    }


    return repositoryController::getAllPaginatedCart($model, $pageNumber, $pageSize, $request, $ascending, $fieldColumn, $fieldValue);
  }

  protected static function getAllPaginatedReportBase(object $model, array $request): array
  {
    $pageNumber = $request['pageNumber'] ?? 1;
    $pageSize = $request['pageSize'] ?? 10;
    $ascending = $request['ascending'] ?? 'DESC';

    $dateRange = [
      'startDate' => ($request['startDate'] ?? (new \DateTime('first day of this month'))->format('Y-m-d')) . ' 00:00:00',
      'endDate' => ($request['endDate'] ?? (new \DateTime('last day of this month'))->format('Y-m-d')) . ' 23:59:59',
    ];

    if (count($request) > 0) {
      foreach ($request as $key => $value)
        if (!property_exists($model, $key))
          unset($request[$key]);
      $request = helpers::cleanArray($request);
    }


    return repositoryController::getAllPaginatedReport($model, $pageNumber, $pageSize, $request, $dateRange, $ascending);
  }

  protected static function getAllHistoryReportSaleItemsBase(object $model, array $request): array
  {
    $pageNumber = $request['pageNumber'] ?? 1;
    $pageSize = $request['pageSize'] ?? 10;
    $ascending = $request['ascending'] ?? 'DESC';
    $fieldItemValue = array_key_exists('fieldItemValue', $request) ? urldecode(trim(strval($request['fieldItemValue']))) : strval('');

    $dateRange = [
      'startDate' => ($request['startDate'] ?? (new \DateTime('first day of this month'))->format('Y-m-d')) . ' 00:00:00',
      'endDate' => ($request['endDate'] ?? (new \DateTime('last day of this month'))->format('Y-m-d')) . ' 23:59:59',
    ];

    $filteredRequest = array_filter($request, function ($value, $key) {
      return property_exists(saleModel::class, $key) || property_exists(itemModel::class, $key);
    }, ARRAY_FILTER_USE_BOTH);


    $request = helpers::cleanArray($filteredRequest);

    return repositoryController::getAllHistoryReportSaleItems($model, $pageNumber, $pageSize, $request, $dateRange, $ascending, $fieldItemValue);
  }

  protected static function getAllTraceabilityReportSaleItemsBase(object $model, array $request): array
  {
    $pageNumber = $request['pageNumber'] ?? 1;
    $pageSize = $request['pageSize'] ?? 10;
    $searchMode = $request['searchMode'] ?? 'cliente';
    $fieldItemValue = array_key_exists('fieldItemValue', $request) ? urldecode(trim(strval($request['fieldItemValue']))) : strval('');

    $dateRange = [
      'startDate' => ($request['startDate'] ?? (new \DateTime('first day of this month'))->format('Y-m-d')) . ' 00:00:00',
      'endDate' => ($request['endDate'] ?? (new \DateTime('last day of this month'))->format('Y-m-d')) . ' 23:59:59',
    ];

    $filteredRequest = array_filter($request, function ($value, $key) {
      return property_exists(saleModel::class, $key) || property_exists(itemModel::class, $key);
    }, ARRAY_FILTER_USE_BOTH);


    $request = helpers::cleanArray($filteredRequest);

    return repositoryController::getAllTraceabilityReportSaleItems($model, $pageNumber, $pageSize, $request, $dateRange, $searchMode, $fieldItemValue);
  }

  protected static function getAllPaginatedReportSaleItemsBase(object $model, array $request): array
  {
    $pageNumber = $request['pageNumber'] ?? 1;
    $pageSize = $request['pageSize'] ?? 10;
    $ascending = $request['ascending'] ?? 'DESC';
    $fieldItemValue = array_key_exists('fieldItemValue', $request) ? urldecode(trim(strval($request['fieldItemValue']))) : strval('');

    $dateRange = [
      'startDate' => ($request['startDate'] ?? (new \DateTime('first day of this month'))->format('Y-m-d')) . ' 00:00:00',
      'endDate' => ($request['endDate'] ?? (new \DateTime('last day of this month'))->format('Y-m-d')) . ' 23:59:59',
    ];

    if (count($request) > 0) {
      foreach ($request as $key => $value)
        if (!property_exists(new saleModel, $key))
          unset($request[$key]);
      $request = helpers::cleanArray($request);
    }


    return repositoryController::getAllPaginatedReportSaleItems($model, $pageNumber, $pageSize, $request, $dateRange, $ascending, $fieldItemValue);
  }

  protected static function getAllPaginatedByLikeBase(object $model, array $request): array
  {
    $pageNumber = array_key_exists('pageNumber', $request) ? intval($request['pageNumber']) : 1;
    $pageSize = array_key_exists('pageSize', $request) ? intval($request['pageSize']) : 10;
    $fieldColumn = array_key_exists('fieldColumn', $request) ? strval($request['fieldColumn']) : '';
    $fieldValue = array_key_exists('fieldValue', $request) ? urldecode(trim(strval($request['fieldValue']))) : strval('');
    $ascending = array_key_exists('ascending', $request) ? strval($request['ascending']) : 'DESC';

    if (count($request) > 0) {
      foreach ($request as $key => $value)
        if (!property_exists($model, $key))
          unset($request[$key]);
      $request = helpers::cleanArray($request);
    }


    return repositoryController::getAllPaginatedByLike($model, $pageNumber, $pageSize, $request, $ascending, $fieldColumn, $fieldValue);
  }

  protected static function getAllPaginatedSaleItemsCompraBase(object $model, array $request): array
  {
    $pageNumber = array_key_exists('pageNumber', $request) ? intval($request['pageNumber']) : 1;
    $pageSize = array_key_exists('pageSize', $request) ? intval($request['pageSize']) : 10;
    $ascending = array_key_exists('ascending', $request) ? strval($request['ascending']) : 'DESC';
    $fieldValue = array_key_exists('fieldValue', $request) ? urldecode(trim(strval($request['fieldValue']))) : strval('');
    $fieldItemValue = array_key_exists('fieldItemValue', $request) ? urldecode(trim(strval($request['fieldItemValue']))) : strval('');
    $fieldEnteValue = array_key_exists('fieldEnteValue', $request) ? urldecode(trim(strval($request['fieldEnteValue']))) : strval('');
    $seller = array_key_exists('seller', $request) ? strval($request['seller']) : strval('');
    $status = array_key_exists('status', $request) ? urldecode(trim(strval($request['status']))) : '';

    $dateRange = [
      'startDate' => ($request['startDate'] ?? (new \DateTime('first day of this month'))->format('Y-m-d')) . ' 00:00:00',
      'endDate' => ($request['endDate'] ?? (new \DateTime('last day of this month'))->format('Y-m-d')) . ' 23:59:59',
    ];

    return repositoryController::getAllPaginatedBySaleItemsCompra($pageNumber, $pageSize, $ascending, $fieldValue, $fieldItemValue, $fieldEnteValue, $dateRange, $seller, $status);
  }

  protected static function getAllPaginatedSaleItemsReciboBase(object $model, array $request): array
  {
    $pageNumber = array_key_exists('pageNumber', $request) ? intval($request['pageNumber']) : 1;
    $pageSize = array_key_exists('pageSize', $request) ? intval($request['pageSize']) : 10;
    $ascending = array_key_exists('ascending', $request) ? strval($request['ascending']) : 'DESC';
    $fieldValue = array_key_exists('fieldValue', $request) ? urldecode(trim(strval($request['fieldValue']))) : strval('');
    $fieldItemValue = array_key_exists('fieldItemValue', $request) ? urldecode(trim(strval($request['fieldItemValue']))) : strval('');
    $fieldEnteValue = array_key_exists('fieldEnteValue', $request) ? urldecode(trim(strval($request['fieldEnteValue']))) : strval('');
    $seller = array_key_exists('seller', $request) ? strval($request['seller']) : strval('');
    $type = array_key_exists('type', $request) ? urldecode(trim(strval($request['type']))) : '';

    $dateRange = [
      'startDate' => ($request['startDate'] ?? (new \DateTime('first day of this month'))->format('Y-m-d')) . ' 00:00:00',
      'endDate' => ($request['endDate'] ?? (new \DateTime('last day of this month'))->format('Y-m-d')) . ' 23:59:59',
    ];

    return repositoryController::getAllPaginatedBySaleItemsRecibo($pageNumber, $pageSize, $ascending, $fieldValue, $fieldItemValue, $fieldEnteValue, $dateRange, $seller, $type);
  }

  protected static function getAllFilteredByRangeBase(object $model, array $request): array
  {
    $ascending = array_key_exists('ascending', $request) ? strval($request['ascending']) : 'DESC';

    $dateRange = [
      'startDate' => ($request['startDate'] ?? (new \DateTime('first day of this month'))->format('Y-m-d')) . ' 00:00:00',
      'endDate' => ($request['endDate'] ?? (new \DateTime('last day of this month'))->format('Y-m-d')) . ' 23:59:59',
    ];

    if (count($request) > 0) {
      foreach ($request as $key => $value)
        if (!property_exists($model, $key))
          unset($request[$key]);
      unset($request['id']);
      $request = helpers::cleanArray($request);
    }

    $return = count($request) > 0
      ? repositoryController::getAllFilteredByRange($model, $request, $dateRange, $ascending)
      : helpers::formatResponse(403, 'Property Not Found', []);

    return $return;
  }

  protected static function getCountFilteredBase(object $model, array $request): array
  {
    if (count($request) > 0) {
      foreach ($request as $key => $value)
        if (!property_exists($model, $key))
          unset($request[$key]);

      $request = helpers::cleanArray($request);
    }

    $return = count($request) > 0
      ? repositoryController::getCountDataFiltered($model->getTableName(), $request)
      : helpers::formatResponse(403, 'Property Not Found', []);

    return $return;
  }

  protected static function getAllFilteredBase(object $model, array $request): array
  {
    $limitqty = array_key_exists('limitqty', $request) ? intval($request['limitqty']) : 100000;
    $ascending = array_key_exists('ascending', $request) ? strval($request['ascending']) : 'DESC';

    if (count($request) > 0) {
      foreach ($request as $key => $value)
        if (!property_exists($model, $key))
          unset($request[$key]);
      $request = helpers::cleanArray($request);
    }


    $return = count($request) > 0
      ? repositoryController::getAllDataFiltered($model->getTableName(), $request, $limitqty, $ascending)
      : helpers::formatResponse(403, 'Property Not Found', []);

    return $return;
  }

  protected static function getAllDataByColumnBase(object $model, array $request): array
  {
    $field = helpers::getFirstKeyName($request);
    $value = urldecode(trim($request[$field]));

    $result = property_exists($model, $field)
      ? repositoryController::getAllDataByColumn($model->getTableName(), $field, $value)
      : helpers::formatResponse(403, 'Property Not Found', []);

    return $result;
  }

  protected static function getAllDataByLikeBase(object $model, array $request): array
  {
    $field = helpers::getFirstKeyName($request);
    $value = urldecode(trim($request[$field]));

    $result = property_exists($model, $field)
      ? repositoryController::getAllDataByLike($model->getTableName(), $field, $value)
      : helpers::formatResponse(403, 'Property Not Found', []);

    return $result;
  }

  protected static function getPreDataByLikeBase(object $model, array $request): array
  {
    $limitqty = intval($request['limitqty'] ?? 100);
    $ascending = strval($request['ascending'] ?? 'DESC');

    $filteredRequest = array_filter($request, function ($value, $key) use ($model) {
      return property_exists($model, $key);
    }, ARRAY_FILTER_USE_BOTH);

    array_walk($filteredRequest, function (&$value) {
      $value = urldecode(trim($value));
    });

    return !empty($filteredRequest)
      ? repositoryController::getPreDataByLike($model->getTableName(), $filteredRequest, $limitqty, $ascending)
      : helpers::formatResponse(403, 'Property Not Found', []);
  }

  protected static function getCountsByItemBase(object $model, array $request): array
  {
    $column = helpers::getFirstKeyName($request);
    $value = urldecode(trim($request[$column]));

    $result = property_exists($model, $column)
      ? repositoryController::getCountsByItem($model->getTableName(), $column, $value)
      : helpers::formatResponse(403, 'Property Not Found', []);

    return $result;
  }

  protected static function getRecentsByItemBase(object $model, array $request): array
  {
    $column = helpers::getFirstKeyName($request);
    $value = urldecode(trim($request[$column]));

    $result = property_exists($model, $column)
      ? repositoryController::getRecentsByItem($model->getTableName(), $column, $value)
      : helpers::formatResponse(403, 'Property Not Found', []);

    return $result;
  }


  protected static function getOneByIdBase(object $model, array $request): array
  {
    $return = array();
    if (isset($request['id']) && !empty($request['id'])) {

      $model->set('id', intval($request['id']));
      $return = repositoryController::getOneById($model);
    } else
      $return = helpers::formatResponse(403, 'Id Not Found', []);

    return $return;
  }

  protected static function getOneByColumnBase(object $model, array $request): array
  {
    $column = helpers::getFirstKeyName($request);
    $value = urldecode(trim($request[$column]));

    $result = property_exists($model, $column)
      ? repositoryController::getOneByColumn($model->getTableName(), $column, $value)
      : helpers::formatResponse(403, 'Property Not Found', []);

    return $result;
  }

  protected static function checkExistByIdBase(object $model, array $request): array
  {
    $return = array();
    if (isset($request['id']) && !empty($request['id'])) {
      $model->set('id', intval($request['id']));
      $return = repositoryController::checkExistById($model);
    } else
      $return = helpers::formatResponse(403, 'Id Not Found', []);

    return $return;
  }

  protected static function checkExistByColumnBase(object $model, array $request): array
  {
    $column = helpers::getFirstKeyName($request);
    $value = urldecode(trim($request[$column]));

    $result = property_exists($model, $column)
      ? repositoryController::checkExistByColumn($model->getTableName(), $column, $value)
      : helpers::formatResponse(403, 'Property Not Found', []);

    return $result;
  }

  protected static function storeBase(object $model, array $request): array
  {
    $return = [];

    unset($request['id']);
    $model->set('id', null);

    $model = helpers::populateModel($model, $request);
    $model->set('created_by', $request['_USER']['id']);
    $model->set('modified_by', $request['_USER']['id']);

    $posted = repositoryController::storeData($model);

    if ($posted['status'] === 200) {
      $model->set('id', $posted['data']['id']);
      $return = repositoryController::getOneById($model);
    } else {
      $return = $posted;
    }

    return $return;
  }

  protected static function storeBulkBase(object $model, array $request): array
  {
    $responses = array_map(function ($item) use ($model, $request) {
      if (!isset($item['saleid'], $item['itemid'], $item['qty'], $item['receivedQuantity'], $item['saletype'])) {
        return helpers::formatResponse(400, 'Insufficient item data', $item);
      }

      $fieldMap = [
        'bodega-usa' => 'delivered1',
        'proceso-importacion' => 'delivered2',
        'bodega-tijuana' => 'delivered3',
      ];

      $deliveredField = $fieldMap[$item['saletype']] ?? null;
      if (!$deliveredField) {
        return helpers::formatResponse(400, 'Invalid saleType', $item);
      }

      $currentDeliveredValue = floatval($item[$deliveredField] ?? 0);
      $newDeliveredValue = $currentDeliveredValue + floatval($item['receivedQuantity']);
      $item[$deliveredField] = floatval($item['receivedQuantity']);

      $response = self::storeBase(clone $model, array_merge($item, ['_USER' => $request['_USER']]));

      if ($response['status'] === 200) {
        $updatePayload = [
          'id' => $item['controlid'],
          $deliveredField => $newDeliveredValue,
          '_USER' => $request['_USER'],
        ];

        $updateResponse = self::modifyBase(clone $model, $updatePayload);

        $response['update_status'] = $updateResponse['status'];
        $response['update_message'] = $updateResponse['message'];
      }

      return $response;
    }, $request['bulk'] ?? []);

    return helpers::formatResponse(200, 'Bulk operation completed', $responses);
  }

  protected static function storeSequenceBase(object $model, array $request): array
  {
    $return = array();

    if (!isset($request['accountid']) || !isset($request['type']) || !isset($request['_USER']['id'])) {
      $return = helpers::formatResponse(401, 'Missing required fields', []);
    }

    if (isset($request['id']))
      unset($request['id']);

    $sequencepayload = [
      'accountid' => intval($request['accountid']),
      'type' => htmlspecialchars(trim($request['type']))
    ];

    $searchsequence = repositoryController::getAllDataFiltered('salesequences', $sequencepayload, 1, 'DESC');

    if ($searchsequence['status'] === 200) {

      $nextnumber = intval($searchsequence['data'][0]['nextnumber']);
      $request['folio'] = $nextnumber;

      $model = helpers::populateModel($model, $request);
      $model->set('created_by', $request['_USER']['id']);
      $model->set('modified_by', $request['_USER']['id']);

      $posted = repositoryController::storeData($model);
    }

    if ($posted['status'] === 200) {

      $modelsequence = helpers::populateModel(new salesequencesModel, $searchsequence['data'][0]);
      $modelsequence->set('nextnumber', $nextnumber + 1);
      $modelsequence->set('modified_by', $request['_USER']['id']);
      $updated = repositoryController::updateDataById($modelsequence);

      if ($updated['status'] === 200) {

        $model->set('id', $posted['data']['id']);
        $return = repositoryController::getOneById($model);

      } else {

        $deleted = repositoryController::hardDeleteById($model);

        $return = $deleted['status'] === 200
          ? helpers::formatResponse(500, 'Failed due to sequence update error', [])
          : helpers::formatResponse(500, 'Critical error: could not be deleted after sequence update failure', []);
      }
    } else
      $return = $posted;

    return $return;
  }


  protected static function updateBase(object $model, array $request): array
  {
    $return = array();
    $result = array();

    $result = self::getOneByIdBase($model, $request);

    if (isset($result['status']) && $result['status'] === 200) {

      $model = helpers::populateModel($model, $result['data']);
      $model = helpers::populateModel($model, $request);
      $model->set('modified_by', $request['_USER']['id']);

      $return = repositoryController::updateDataById($model);
    } else
      $return = helpers::formatResponse(403, 'Resource Not Exist', []);

    return $return;
  }

  protected static function modifyBase(object $model, array $request): array
  {
    $return = array();

    if (isset($request['id']) && !empty($request['id'])) {

      $result = array();
      $result = self::getOneByIdBase($model, $request);

      if (isset($result['status']) && $result['status'] === 200) {


        unset($request['id']);
        $model->set('modified_by', $request['_USER']['id']);

        if (count($request) > 0)
          foreach ($request as $key => $value)
            if (!property_exists($model, $key))
              unset($request[$key]);

        if (count($request) > 0) {
          $model = helpers::populateModel($model, $result['data']);
          $keyName = helpers::getFirstKeyName($request);
          $model = helpers::populateModel($model, [$keyName => $request[$keyName]]);
        }


        $return = repositoryController::updateDataById($model);
      } else
        $return = helpers::formatResponse(403, 'Resource Not Exist', []);
    } else
      $return = helpers::formatResponse(403, 'Key Not Found', []);


    return $return;
  }

  protected static function hardDeleteByIdBase(object $model, array $request): array
  {
    $return = array();
    $result = array();

    $result = self::getOneByIdBase($model, $request);

    if (isset($result['status']) && $result['status'] === 200) {
      $model->set('id', intval($result['data']['id']));
      $return = repositoryController::hardDeleteById($model);
    } else
      $return = helpers::formatResponse(403, 'Resource Not Exist', []);

    return $return;
  }

  protected static function hardDeleteAllBase(object $model, array $request): array
  {
    $return = array();

    $column = helpers::getFirstKeyName($request);
    $value = $request[$column];

    $return = property_exists($model, $column)
      ? repositoryController::hardDeleteAll($model->getTableName(), $column, $value)
      : helpers::formatResponse(403, 'Resource Not Exist', []);

    return $return;
  }

  protected static function hardDeleteByColumnMinorBase(object $model, array $request): array
  {
    $return = array();

    $column = helpers::getFirstKeyName($request);
    $value = $request[$column];

    $return = property_exists($model, $column)
      ? repositoryController::hardDeleteByColumnMinor($model->getTableName(), $column, $value)
      : helpers::formatResponse(403, 'Resource Not Exist', []);

    return $return;
  }

  public static function postUploadFile(array $data): array
  {
    $id = intval($data['_REQUEST']['id'] ?? 0);
    $module = strval($data['_REQUEST']['module'] ?? '');

    if (!helpers::validModule($module) || empty($data['_FILES']['file']))
      return helpers::formatResponse(404, 'File Not Found', []);

    $path = 'assets/uploads/' . date("Y-m") . '/' . $module;
    $imageFileType = pathinfo(basename($data['_FILES']['file']["name"]), PATHINFO_EXTENSION);
    $filename = "{$id}_" . time() . ".{$imageFileType}";
    $uploaded_file = "{$path}/{$filename}";

    if (!file_exists($path))
      mkdir($path, 0777, true);

    if (move_uploaded_file($data['_FILES']['file']['tmp_name'], $uploaded_file)) {
      $cname = "\\src\\app\\models\\{$module}Model";
      self::modifyBase(new $cname, ['id' => $id, 'image' => '/' . $uploaded_file]);
      return helpers::formatResponse(200, 'File Uploaded', $uploaded_file);
    }

    return helpers::formatResponse(401, 'File Not Uploaded', []);
  }


  public static function getConvertImageToBase64(array $request)
  {
    $path = ltrim($request['path'], '/');

    if (!file_exists($path))
      return helpers::formatResponse(404, 'File not found', null);

    $imageData = file_get_contents($path);
    $imageType = pathinfo($path, PATHINFO_EXTENSION);
    $base64 = sprintf('data:image/%s;base64,%s', $imageType, base64_encode($imageData));

    return helpers::formatResponse(200, 'Image converted to Base64', $base64);
  }

  public static function postSendEmailWithPDF(array $request): array
  {
    if (empty($_FILES['file']))
      return helpers::formatResponse(403, 'File not uploaded', []);

    if (empty($_FILES['file']['tmp_name']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK)
      return helpers::formatResponse(403, 'File upload error', []);

    if (mime_content_type($_FILES['file']['tmp_name']) !== 'application/pdf')
      return helpers::formatResponse(403, 'Invalid file type', []);

    $email = filter_var($request['_REQUEST']['email'], FILTER_SANITIZE_EMAIL);

    return emailService::sendEmailWithPDF($email, $_FILES['file'])
      ? helpers::formatResponse(200, 'Email Sent', [])
      : helpers::formatResponse(403, 'Email Not Sent', []);
  }
}