<?php

namespace src\app\controllers;

use \src\app\models\pricelevelModel;

class pricelevelController extends baseController
{
    public static function getAll(): array { return self::getAllBase(new pricelevelModel()); }
    public static function getAllFiltered(array $request): array { return self::getAllFilteredBase(new pricelevelModel(), $request); }
    public static function getOneById(array $request): array { return self::getOneByIdBase(new pricelevelModel(), $request); }
    public static function getAllDataByColumn(array $request): array { return self::getAllDataByColumnBase(new pricelevelModel(), $request); }
    public static function getPreDataByLike(array $request): array { return self::getPreDataByLikeBase(new pricelevelModel(), $request); }
    public static function store(array $request) { return self::storeBase(new pricelevelModel(), $request); }
    public static function update(array $request) { return self::updateBase(new pricelevelModel(), $request); }
    public static function modify(array $request) { return self::modifyBase(new pricelevelModel(), $request); }
    public static function hardDelete(array $request) { return self::hardDeleteByIdBase(new pricelevelModel(), $request); }
}
