<?php

namespace src\app\controllers;

use \src\app\models\paymentModel;

class paymentController extends baseController
{
    public static function getAll(): array { return self::getAllBase(new paymentModel()); }
    public static function getAllFiltered(array $request): array { return self::getAllFilteredBase(new paymentModel(), $request); }
    public static function getOneById(array $request): array { return self::getOneByIdBase(new paymentModel(), $request); }
    public static function getAllDataByColumn(array $request): array { return self::getAllDataByColumnBase(new paymentModel(), $request); }
    public static function getPreDataByLike(array $request): array { return self::getPreDataByLikeBase(new paymentModel(), $request); }
    public static function store(array $request) { return self::storeBase(new paymentModel(), $request); }
    public static function update(array $request) { return self::updateBase(new paymentModel(), $request); }
    public static function modify(array $request) { return self::modifyBase(new paymentModel(), $request); }
    public static function hardDelete(array $request) { return self::hardDeleteByIdBase(new paymentModel(), $request); }
}
