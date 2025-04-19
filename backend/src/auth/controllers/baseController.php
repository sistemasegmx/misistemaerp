<?php

namespace src\auth\controllers;

use src\auth\classes\helpers;
use src\auth\controllers\repositoryController;
use src\auth\models\logModel;

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

  protected static function getAllFilteredBase(object $model, array $request): array
  {
    if (count($request) > 0)
      foreach ($request as $key => $value)
        if (!property_exists($model, $key))
          unset($request[$key]);

    $return = count($request) > 0
      ? repositoryController::getAllDataFiltered($model->getTableName(), $request)
      : helpers::formatResponse(403, 'Property Not Found', []);

    return $return;
  }

  protected static function getAllDataByColumnBase(object $model, array $request): array
  {
    $column = helpers::getFirstKeyName($request);
    $value = $request[$column];

    $result = property_exists($model, $column)
      ? repositoryController::getAllDataByColumn($model->getTableName(), $column, $value)
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
    $value = $request[$column];

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
    $value = $request[$column];

    $result = property_exists($model, $column)
      ? repositoryController::checkExistByColumn($model->getTableName(), $column, $value)
      : helpers::formatResponse(403, 'Property Not Found', []);

    return $result;
  }

  protected static function storeBase(object $model, array $request): array
  {
    $return = array();

    if (isset($request['id']))
      unset($request['id']);

    $model = helpers::populateModel($model, $request);
    $model->set('created_by', $request['_USER']['id']);
    $model->set('modified_by', $request['_USER']['id']);
    $posted = repositoryController::storeData($model);

    if ($posted['status'] === 200) {
      $model->set('id', $posted['data']['id']);
      $return = repositoryController::getOneById($model);

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
      $model->set('modified_by', 1);

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

        if (count($request) > 0)
          foreach ($request as $key => $value)
            if (!property_exists($model, $key))
              unset($request[$key]);

        if (count($request) > 0) {
          $model = helpers::populateModel($model, $result['data']);
          $keyName = helpers::getFirstKeyName($request);
          $model = helpers::populateModel($model, [$keyName => $request[$keyName]]);
        }

        $model->set('modified_by', 1);

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

}
