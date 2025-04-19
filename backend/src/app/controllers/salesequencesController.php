<?php

namespace src\app\controllers;

use \src\app\models\salesequencesModel;

class salesequencesController extends baseController
{
    public static function getAll(): array { return self::getAllBase(new salesequencesModel()); }
    public static function getCountFiltered(array $request): array { return self::getCountFilteredBase(new salesequencesModel(), $request); }
    public static function getAllFiltered(array $request): array { return self::getAllFilteredBase(new salesequencesModel(), $request); }
    public static function getOneById(array $request): array { return self::getOneByIdBase(new salesequencesModel(), $request); }
    public static function getAllDataByColumn(array $request): array { return self::getAllDataByColumnBase(new salesequencesModel(), $request); }
    public static function getPreDataByLike(array $request): array { return self::getPreDataByLikeBase(new salesequencesModel(), $request); }
    public static function store(array $request) { return self::storeBase(new salesequencesModel(), $request); }
    public static function update(array $request) { return self::updateBase(new salesequencesModel(), $request); }
    public static function modify(array $request) { return self::modifyBase(new salesequencesModel(), $request); }
    public static function hardDelete(array $request) { return self::hardDeleteByIdBase(new salesequencesModel(), $request); }
}
