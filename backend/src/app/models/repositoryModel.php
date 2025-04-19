<?php

namespace src\app\models;

use src\app\classes\helpers;
use src\core\db;

class repositoryModel
{
  private static $conn;

  public static function gteTableNames()
  {
    self::$conn = db::connect();

    if (is_object(self::$conn)) {

      $sql = 'SELECT table_name FROM information_schema.tables WHERE table_schema = "' . db::get('DB_NAME') . '"';
      $stmt = self::$conn->prepare($sql);

      if ($stmt->execute())
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    return false;
  }

  public static function getAllData(string $table)
  {
    self::$conn = db::connect();

    if (is_object(self::$conn)) {

      $sql = 'SELECT * FROM ' . db::get('DB_NAME') . '.' . $table;
      $stmt = self::$conn->prepare($sql);

      if ($stmt->execute())
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    return false;
  }

  public static function getAllPaginated(string $table, int $pageNumber, int $pageSize, array $data, string $ascending, string $field, string $value)
  {
    self::$conn = db::connect();

    if (!is_object(self::$conn))
      return false;

    $conditions = array_filter($data, function ($val) {
      return isset($val) && $val !== '';
    });

    $params = implode(' AND ', array_map(function ($key) {
      return "$key = :$key";
    }, array_keys($conditions)));

    if (!empty($field) && !empty($value)) {
      $params .= ($params ? ' AND ' : '') . "$field LIKE :value";
    }

    $offset = ($pageNumber - 1) * $pageSize;
    $sql = 'SELECT SQL_CALC_FOUND_ROWS * FROM ' . db::get('DB_NAME') . '.' . $table;
    if ($params) {
      $sql .= ' WHERE ' . $params;
    }
    $sql .= ' ORDER BY id ' . $ascending . ' LIMIT :limit OFFSET :offset';

    $stmt = self::$conn->prepare($sql);
    $stmt->bindValue(':limit', $pageSize, \PDO::PARAM_INT);
    $stmt->bindValue(':offset', $offset, \PDO::PARAM_INT);

    foreach ($conditions as $key => $val) {
      $stmt->bindValue(":$key", $val);
    }
    if (!empty($field) && !empty($value)) {
      $stmt->bindValue(':value', '%' . $value . '%', \PDO::PARAM_STR);
    }

    if ($stmt->execute()) {
      $data = $stmt->fetchAll(\PDO::FETCH_ASSOC);
      $totalStmt = self::$conn->query('SELECT FOUND_ROWS() as total');
      $total = $totalStmt->fetch(\PDO::FETCH_ASSOC)['total'];
      return ['data' => $data, 'total' => $total];
    }

    return false;
  }

  public static function getAllPaginatedCart(string $table, int $pageNumber, int $pageSize, array $data, string $ascending, string $field, string $value)
  {
    self::$conn = db::connect();

    if (!is_object(self::$conn))
      return false;

    $conditions = array_filter($data, function ($val) {
      return isset($val) && $val !== '';
    });

    $params = implode(' AND ', array_map(function ($key) {
      return "$key = :$key";
    }, array_keys($conditions)));

    if (!empty($field) && !empty($value)) {
      $params .= ($params ? ' AND ' : '') . "$field LIKE :value";
    }

    $offset = ($pageNumber - 1) * $pageSize;
    $sql = "SELECT SQL_CALC_FOUND_ROWS s.folio, s.entecode, s.entename, s.entecontact, si.*
            FROM sale s
            JOIN $table si ON s.id = si.saleid
            WHERE s.type = 'compra'";

    if ($params) {
      $sql .= ' AND ' . $params;
    }

    $sql .= ' ORDER BY s.folio ' . $ascending . ' LIMIT :limit OFFSET :offset';

    $stmt = self::$conn->prepare($sql);
    $stmt->bindValue(':limit', $pageSize, \PDO::PARAM_INT);
    $stmt->bindValue(':offset', $offset, \PDO::PARAM_INT);

    foreach ($conditions as $key => $val) {
      $stmt->bindValue(":$key", $val);
    }

    if (!empty($field) && !empty($value)) {
      $stmt->bindValue(':value', '%' . $value . '%', \PDO::PARAM_STR);
    }

    if ($stmt->execute()) {
      $data = $stmt->fetchAll(\PDO::FETCH_ASSOC);
      $totalStmt = self::$conn->query('SELECT FOUND_ROWS() as total');
      $total = $totalStmt->fetch(\PDO::FETCH_ASSOC)['total'];
      return ['data' => $data, 'total' => $total];
    }

    return false;
  }

  public static function getAllPaginatedReport(string $table, int $pageNumber, int $pageSize, array $data, array $dateRange, string $ascending)
  {
    self::$conn = db::connect();

    if (!is_object(self::$conn)) {
      return false;
    }

    $sql = 'SELECT SQL_CALC_FOUND_ROWS 
                sale.*, 
                user.id AS user_id, 
                user.fullname AS user_fullname
            FROM sale
            INNER JOIN user AS user ON sale.created_by = user.id
            WHERE sale.created_at BETWEEN :startDate AND :endDate';

    if (!empty($data['type'])) {
      $sql .= ' AND sale.type =:sale_type';
    }

    if (!empty($data['created_by'])) {
      $sql .= ' AND sale.created_by =:sale_created_by';
    }

    if (!empty($data['status'])) {
      $sql .= ' AND sale.status =:sale_status';
    }

    if (!empty($data['currency'])) {
      $sql .= ' AND sale.currency =:sale_currency';
    }

    if (!empty($data['folio'])) {
      $sql .= ' AND sale.folio LIKE :folio';
    }
    if (!empty($data['entename'])) {
      $sql .= ' AND (sale.entename IS NOT NULL AND sale.entename LIKE :entename)';
    }

    $sql .= ' ORDER BY sale.id ' . $ascending . ' LIMIT :limit OFFSET :offset';

    $stmt = self::$conn->prepare($sql);

    $stmt->bindValue(':startDate', $dateRange['startDate'], \PDO::PARAM_STR);
    $stmt->bindValue(':endDate', $dateRange['endDate'], \PDO::PARAM_STR);


    if (!empty($data['type'])) {
      $stmt->bindValue(':sale_type', $data['type'], \PDO::PARAM_STR);
    }
    if (!empty($data['created_by'])) {
      $stmt->bindValue(':sale_created_by', $data['created_by'], \PDO::PARAM_STR);
    }
    if (!empty($data['status'])) {
      $stmt->bindValue(':sale_status', $data['status'], \PDO::PARAM_STR);
    }
    if (!empty($data['currency'])) {
      $stmt->bindValue(':sale_currency', $data['currency'], \PDO::PARAM_STR);
    }
    if (!empty($data['folio'])) {
      $stmt->bindValue(':folio', '%' . $data['folio'] . '%', \PDO::PARAM_STR);
    }
    if (!empty($data['entename'])) {
      $stmt->bindValue(':entename', '%' . $data['entename'] . '%', \PDO::PARAM_STR);
    }

    $stmt->bindValue(':limit', $pageSize, \PDO::PARAM_INT);
    $stmt->bindValue(':offset', ($pageNumber - 1) * $pageSize, \PDO::PARAM_INT);

    if ($stmt->execute()) {
      return [
        'data' => $stmt->fetchAll(\PDO::FETCH_ASSOC),
        'total' => self::$conn->query('SELECT FOUND_ROWS() as total')->fetch(\PDO::FETCH_ASSOC)['total']
      ];
    }

    return false;
  }

  public static function getAllHistoryReportSaleItems(string $table, int $pageNumber, int $pageSize, array $data, array $dateRange, string $ascending, string $item)
  {
    self::$conn = db::connect();

    if (!is_object(self::$conn)) {
      return false;
    }

    $typeOrder = "FIELD(s.type, 'cotizacion', 'compra', 'remision', 'bodega-usa', 'proceso-importacion', 'bodega-tijuana')";

    $sql = "SELECT SQL_CALC_FOUND_ROWS 
                si.code AS sicode, 
                si.description AS sidescription, 
                si.unitkey,
                i.categoryname,
                s.type AS saletype, 
                s.status AS salestatus, 
                si.qty, 
                s.entename, 
                s.folio 
            FROM " . db::get('DB_NAME') . ".saleitems AS si
            INNER JOIN " . db::get('DB_NAME') . ".sale AS s ON si.saleid = s.id
            INNER JOIN " . db::get('DB_NAME') . ".item AS i ON si.itemid = i.id
            WHERE s.created_at BETWEEN :startDate AND :endDate
            AND s.type IN ('cotizacion', 'compra', 'remision', 'bodega-usa', 'proceso-importacion', 'bodega-tijuana')";

    if (!empty($data['categoryid'])) {
      $sql .= ' AND i.categoryid = :i_categoryid';
    }
    if (!empty($data['unitkey'])) {
      $sql .= ' AND si.unitkey = :si_unitkey';
    }
    if (!empty($data['created_by'])) {
      $sql .= ' AND s.created_by = :sale_created_by';
    }
    if (!empty($data['status'])) {
      $sql .= ' AND s.status = :sale_status';
    }
    if (!empty($item)) {
      $sql .= ' AND si.code LIKE :itemvalue';
    }

    $sql .= " ORDER BY si.code $ascending, $typeOrder, s.folio ASC LIMIT :limit OFFSET :offset";

    $stmt = self::$conn->prepare($sql);
    $stmt->bindValue(':limit', $pageSize, \PDO::PARAM_INT);
    $stmt->bindValue(':offset', ($pageNumber - 1) * $pageSize, \PDO::PARAM_INT);
    $stmt->bindValue(':startDate', $dateRange['startDate']);
    $stmt->bindValue(':endDate', $dateRange['endDate']);

    if (!empty($data['categoryid'])) {
      $stmt->bindValue(':i_categoryid', $data['categoryid'], \PDO::PARAM_STR);
    }
    if (!empty($data['unitkey'])) {
      $stmt->bindValue(':si_unitkey', $data['unitkey'], \PDO::PARAM_STR);
    }
    if (!empty($data['created_by'])) {
      $stmt->bindValue(':sale_created_by', $data['created_by'], \PDO::PARAM_INT);
    }
    if (!empty($data['status'])) {
      $stmt->bindValue(':sale_status', $data['status'], \PDO::PARAM_STR);
    }
    if (!empty($item)) {
      $stmt->bindValue(':itemvalue', '%' . $item . '%', \PDO::PARAM_STR);
    }

    if ($stmt->execute()) {
      $rawData = $stmt->fetchAll(\PDO::FETCH_ASSOC);

      $processedData = [];
      foreach ($rawData as $row) {
        $key = "{$row['sicode']}|{$row['saletype']}|{$row['salestatus']}";

        if (!isset($processedData[$key])) {
          $processedData[$key] = [
            'sicode' => $row['sicode'],
            'sidescription' => $row['sidescription'],
            'unitkey' => $row['unitkey'],
            'categoryname' => $row['categoryname'],
            'saletype' => $row['saletype'],
            'salestatus' => $row['salestatus'],
            'siqty' => 0,
            'saleentes' => [],
            'salefolios' => [],
          ];
        }

        $processedData[$key]['siqty'] += (int) $row['qty'];

        if (!empty($row['entename'])) {
          $processedData[$key]['saleentes'][$row['entename']] = true;
        }
        if (!empty($row['folio'])) {
          $processedData[$key]['salefolios'][] = $row['folio'];
        }
      }

      $finalData = [];
      foreach ($processedData as &$data) {
        $data['saleentes'] = count($data['saleentes']);
        $data['salefolios'] = !empty($data['salefolios']) ? min($data['salefolios']) . ' - ' . max($data['salefolios']) : '';
        $finalData[] = $data;
      }

      return [
        'data' => $finalData,
        'total' => self::$conn->query('SELECT FOUND_ROWS() as total')->fetch(\PDO::FETCH_ASSOC)['total']
      ];
    }

    return false;
  }

  public static function getAllPaginatedReportSaleItems(string $table, int $pageNumber, int $pageSize, array $data, array $dateRange, string $ascending, string $item)
  {
    self::$conn = db::connect();

    if (!is_object(self::$conn))
      return false;

    $sql = 'SELECT SQL_CALC_FOUND_ROWS 
                saleitems.*, 
                sale.folio, 
                sale.entename AS saleentename,
                sale.type AS saletype,
                sale.status AS salestatus, 
                sale.created_at AS salecreated_at,
                sale.modified_at AS salemodified_at,
                sale.currency AS salecurrency,
                user.fullname 
            FROM ' . db::get('DB_NAME') . '.' . $table . ' AS saleitems
            INNER JOIN ' . db::get('DB_NAME') . '.sale AS sale ON saleitems.saleid = sale.id
            INNER JOIN ' . db::get('DB_NAME') . '.user AS user ON saleitems.modified_by = user.id
            WHERE sale.created_at BETWEEN :startDate AND :endDate';

    if (!empty($data['type'])) {
      $sql .= ' AND sale.type = :sale_type';
    }

    if (!empty($data['created_by'])) {
      $sql .= ' AND sale.created_by = :sale_created_by';
    }

    if (!empty($data['status'])) {
      $sql .= ' AND sale.status = :sale_status';
    }

    if (!empty($data['currency'])) {
      $sql .= ' AND sale.currency = :sale_currency';
    }

    if (!empty($data['folio'])) {
      $sql .= ' AND sale.folio LIKE :folio';
    }

    if (!empty($data['entename'])) {
      $sql .= ' AND (sale.entename IS NOT NULL AND sale.entename LIKE :entename)';
    }

    if (!empty($item)) {
      $sql .= ' AND saleitems.code LIKE :itemvalue';
    }

    $sql .= ' ORDER BY sale.folio ' . $ascending . ' LIMIT :limit OFFSET :offset';

    $stmt = self::$conn->prepare($sql);
    $stmt->bindValue(':limit', $pageSize, \PDO::PARAM_INT);
    $stmt->bindValue(':offset', ($pageNumber - 1) * $pageSize, \PDO::PARAM_INT);
    $stmt->bindValue(':startDate', $dateRange['startDate']);
    $stmt->bindValue(':endDate', $dateRange['endDate']);


    if (!empty($data['type'])) {
      $stmt->bindValue(':sale_type', $data['type'], \PDO::PARAM_STR);
    }

    if (!empty($data['created_by'])) {
      $stmt->bindValue(':sale_created_by', $data['created_by'], \PDO::PARAM_INT);
    }

    if (!empty($data['status'])) {
      $stmt->bindValue(':sale_status', $data['status'], \PDO::PARAM_STR);
    }

    if (!empty($data['folio'])) {
      $stmt->bindValue(':folio', '%' . $data['folio'] . '%', \PDO::PARAM_STR);
    }

    if (!empty($data['entename'])) {
      $stmt->bindValue(':entename', '%' . $data['entename'] . '%', \PDO::PARAM_STR);
    }

    if (!empty($item)) {
      $stmt->bindValue(':itemvalue', '%' . $item . '%', \PDO::PARAM_STR);
    }

    if (!empty($data['currency'])) {
      $stmt->bindValue(':sale_currency', $data['currency'], \PDO::PARAM_STR);
    }

    if ($stmt->execute()) {
      return [
        'data' => $stmt->fetchAll(\PDO::FETCH_ASSOC),
        'total' => self::$conn->query('SELECT FOUND_ROWS() as total')->fetch(\PDO::FETCH_ASSOC)['total']
      ];
    }

    return false;
  }

  public static function getAllPaginatedByLike(string $table, int $pageNumber, int $pageSize, array $data, string $ascending, string $field, string $value)
  {
    self::$conn = db::connect();

    if (!is_object(self::$conn)) {
      return false;
    }

    $conditions = array_filter($data, function ($val) {
      return isset($val) && $val !== '';
    });

    $params = implode(' AND ', array_map(function ($key) {
      return "$key = :$key";
    }, array_keys($conditions)));

    if (!empty($field) && !empty($value)) {
      $params .= ($params ? ' AND ' : '') . "$field LIKE :value";
    }

    $offset = ($pageNumber - 1) * $pageSize;
    $sql = 'SELECT SQL_CALC_FOUND_ROWS * FROM ' . db::get('DB_NAME') . '.' . $table;

    if ($params) {
      $sql .= ' WHERE ' . $params;
    }

    $sql .= ' ORDER BY id ' . $ascending . ' LIMIT :limit OFFSET :offset';

    $stmt = self::$conn->prepare($sql);
    $stmt->bindValue(':limit', $pageSize, \PDO::PARAM_INT);
    $stmt->bindValue(':offset', $offset, \PDO::PARAM_INT);

    foreach ($conditions as $key => $val) {
      $stmt->bindValue(":$key", $val);
    }

    if (!empty($field) && !empty($value)) {
      $stmt->bindValue(':value', '%' . $value . '%', \PDO::PARAM_STR);
    }

    if ($stmt->execute()) {
      $data = $stmt->fetchAll(\PDO::FETCH_ASSOC);
      $totalStmt = self::$conn->query('SELECT FOUND_ROWS() as total');
      $total = $totalStmt->fetch(\PDO::FETCH_ASSOC)['total'];

      return ['data' => $data, 'total' => $total];
    }

    return false;
  }

  public static function getAllPaginatedBySaleItemsCompra(int $pageNumber, int $pageSize, string $ascending, ?string $folio, ?string $item, string $ente, array $dateRange, ?string $seller, ?string $status)
  {
    self::$conn = db::connect();

    if (!is_object(self::$conn)) {
      return false;
    }

    $offset = ($pageNumber - 1) * $pageSize;

    $sql = 'SELECT SQL_CALC_FOUND_ROWS 
                s.folio, 
                s.status, 
                s.entename, 
                s.modified_at AS salemodified_at, 
                u.fullname, 
                si.*
            FROM ' . db::get('DB_NAME') . '.saleitems AS si
            INNER JOIN ' . db::get('DB_NAME') . '.sale AS s ON si.saleid = s.id
            INNER JOIN ' . db::get('DB_NAME') . '.item AS i ON si.itemid = i.id
            INNER JOIN ' . db::get('DB_NAME') . '.user AS u ON si.modified_by = u.id
            WHERE si.modified_at BETWEEN :startDate AND :endDate
            AND s.type = :saleType';

    if (!empty($folio)) {
      $sql .= ' AND s.folio = :folio';
    }

    $sql .= !empty($status)
      ? " AND s.status = :salestatus"
      : " AND s.status IN ('orden procesada', 'material-in-transit', 'recibo bodega usa', 'proceso de importacion', 'recibido bodega tijuana')";

    if (!empty($seller)) {
      $sql .= ' AND s.created_by = :seller';
    }

    if (!empty($item)) {
      $sql .= ' AND (i.code LIKE :itemvalue1 OR i.description LIKE :itemvalue2)';
    }

    if (!empty($ente)) {
      $sql .= ' AND s.entename LIKE :entevalue1';
    }

    $sql .= ' ORDER BY s.folio ' . $ascending . ' LIMIT :limit OFFSET :offset';

    $stmt = self::$conn->prepare($sql);

    $stmt->bindValue(':limit', $pageSize, \PDO::PARAM_INT);
    $stmt->bindValue(':offset', $offset, \PDO::PARAM_INT);
    $stmt->bindValue(':saleType', 'compra', \PDO::PARAM_STR);
    $stmt->bindValue(':startDate', $dateRange['startDate'], \PDO::PARAM_STR);
    $stmt->bindValue(':endDate', $dateRange['endDate'], \PDO::PARAM_STR);

    if (!empty($folio)) {
      $stmt->bindValue(':folio', $folio, \PDO::PARAM_STR);
    }

    if (!empty($status)) {
      $stmt->bindValue(':salestatus', $status, \PDO::PARAM_STR);
    }

    if (!empty($seller)) {
      $stmt->bindValue(':seller', $seller, \PDO::PARAM_STR);
    }

    if (!empty($item)) {
      $stmt->bindValue(':itemvalue1', '%' . $item . '%', \PDO::PARAM_STR);
      $stmt->bindValue(':itemvalue2', '%' . $item . '%', \PDO::PARAM_STR);
    }

    if (!empty($ente)) {
      $stmt->bindValue(':entevalue1', '%' . $ente . '%', \PDO::PARAM_STR);
    }

    if ($stmt->execute()) {
      $data = $stmt->fetchAll(\PDO::FETCH_ASSOC);
      $totalStmt = self::$conn->query('SELECT FOUND_ROWS()');
      $total = $totalStmt->fetch(\PDO::FETCH_ASSOC)['FOUND_ROWS()'];

      return ['data' => $data, 'total' => $total];
    }

    return false;
  }

  public static function getAllPaginatedBySaleItemsRecibo(int $pageNumber, int $pageSize, string $ascending, ?string $folio, ?string $item, string $ente, array $dateRange, ?string $seller, ?string $type)
  {
    self::$conn = db::connect();

    if (!is_object(self::$conn)) {
      return false;
    }

    $offset = ($pageNumber - 1) * $pageSize;

    $sql = 'SELECT SQL_CALC_FOUND_ROWS 
                s.folio, 
                s.type, 
                s.entename, 
                s.created_at AS salecreated_at, 
                u.fullname, 
                si.*,
                uc.fullname AS comprador_fullname
            FROM ' . db::get('DB_NAME') . '.saleitems AS si
            INNER JOIN ' . db::get('DB_NAME') . '.sale AS s ON si.saleid = s.id
            LEFT JOIN ' . db::get('DB_NAME') . '.sale AS sc ON si.originfolio = sc.folio AND sc.type = "compra"
            INNER JOIN ' . db::get('DB_NAME') . '.item AS i ON si.itemid = i.id
            INNER JOIN ' . db::get('DB_NAME') . '.user AS u ON s.created_by = u.id
            LEFT JOIN ' . db::get('DB_NAME') . '.user AS uc ON sc.created_by = uc.id
            WHERE si.created_at BETWEEN :startDate AND :endDate';

    $sql .= !empty($type) ? ' AND s.type = :saleType' : " AND s.type IN ('bodega-usa', 'proceso-importacion', 'bodega-tijuana')";

    if (!empty($folio)) {
      $sql .= ' AND s.folio = :folio';
    }

    if (!empty($seller)) {
      $sql .= ' AND sc.created_by = :seller';
    }

    if (!empty($item)) {
      $sql .= ' AND (i.code LIKE :itemvalue1 OR i.description LIKE :itemvalue2)';
    }

    if (!empty($ente)) {
      $sql .= ' AND s.entename LIKE :entevalue1';
    }

    $sql .= ' ORDER BY s.created_at ' . $ascending . ' LIMIT :limit OFFSET :offset';

    $stmt = self::$conn->prepare($sql);

    $stmt->bindValue(':limit', $pageSize, \PDO::PARAM_INT);
    $stmt->bindValue(':offset', $offset, \PDO::PARAM_INT);
    $stmt->bindValue(':startDate', $dateRange['startDate'], \PDO::PARAM_STR);
    $stmt->bindValue(':endDate', $dateRange['endDate'], \PDO::PARAM_STR);

    if (!empty($folio)) {
      $stmt->bindValue(':folio', $folio, \PDO::PARAM_STR);
    }

    if (!empty($type)) {
      $stmt->bindValue(':saleType', $type, \PDO::PARAM_STR);
    }

    if (!empty($seller)) {
      $stmt->bindValue(':seller', $seller, \PDO::PARAM_STR);
    }

    if (!empty($item)) {
      $stmt->bindValue(':itemvalue1', '%' . $item . '%', \PDO::PARAM_STR);
      $stmt->bindValue(':itemvalue2', '%' . $item . '%', \PDO::PARAM_STR);
    }

    if (!empty($ente)) {
      $stmt->bindValue(':entevalue1', '%' . $ente . '%', \PDO::PARAM_STR);
    }

    if ($stmt->execute()) {
      $data = $stmt->fetchAll(\PDO::FETCH_ASSOC);
      $totalStmt = self::$conn->query('SELECT FOUND_ROWS()');
      $total = $totalStmt->fetch(\PDO::FETCH_ASSOC)['FOUND_ROWS()'];

      return ['data' => $data, 'total' => $total];
    }

    return false;
  }


  public static function getAllFilteredByRange(string $table, array $data, array $dateRange, string $ascending)
  {
    self::$conn = db::connect();

    if (!is_object(self::$conn)) {
      return false;
    }

    $params = !empty($data)
      ? implode(' AND ', array_map(function ($key) {
        return "$key = :$key";
      }, array_keys($data)))
      : '';

    $params .= ($params ? ' AND ' : '') . 'created_at BETWEEN :startDate AND :endDate';

    $sql = 'SELECT * FROM ' . db::get('DB_NAME') . '.' . $table;

    if (!empty($params)) {
      $sql .= ' WHERE ' . $params;
    }

    $sql .= ' ORDER BY id ' . $ascending;

    $stmt = self::$conn->prepare($sql);

    foreach ($data as $key => $val) {
      $stmt->bindValue(":$key", $val);
    }

    $stmt->bindValue(':startDate', $dateRange['startDate']);
    $stmt->bindValue(':endDate', $dateRange['endDate']);

    if ($stmt->execute()) {
      return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    return false;
  }

  public static function getCountDataFiltered(string $table, $data)
  {
    self::$conn = db::connect();

    if (is_object(self::$conn)) {

      $params = '';
      foreach ($data as $key => $value)
        $params .= $key . ' =:' . $key . ' AND ';
      $params = substr($params, 0, -5);

      $stmt = self::$conn->prepare('SELECT COUNT(*) AS total FROM ' . db::get('DB_NAME') . '.' . $table . ' WHERE ' . $params);
      foreach ($data as $key => $value)
        $stmt->bindParam(':' . $key, $data[$key]);

      if ($stmt->execute())
        return $stmt->fetch(\PDO::FETCH_ASSOC);
    }

    return false;
  }

  public static function getAllDataFiltered(string $table, $data, int $limitqty, string $ascending)
  {
    self::$conn = db::connect();

    if (is_object(self::$conn)) {

      $params = '';
      foreach ($data as $key => $value)
        $params .= $key . ' =:' . $key . ' AND ';
      $params = substr($params, 0, -5);

      $stmt = self::$conn->prepare('SELECT * FROM ' . db::get('DB_NAME') . '.' . $table . ' WHERE ' . $params . ' ORDER BY id ' . $ascending . ' LIMIT ' . $limitqty);
      foreach ($data as $key => $value)
        $stmt->bindParam(':' . $key, $data[$key]);

      if ($stmt->execute())
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    return false;
  }

  public static function getAllDataByColumn(string $table, string $field, $value)
  {
    self::$conn = db::connect();

    if (is_object(self::$conn)) {

      $sql = 'SELECT * FROM ' . db::get('DB_NAME') . '.' . $table . ' WHERE ' . $field . '=:value ORDER BY created_at';
      $stmt = self::$conn->prepare($sql);

      $stmt->bindParam(':value', $value);

      if ($stmt->execute())
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    return false;
  }

  public static function getAllDataByLike(string $table, string $field, $value)
  {
    self::$conn = db::connect();

    if (is_object(self::$conn)) {

      $sql = 'SELECT * FROM ' . db::get('DB_NAME') . '.' . $table . ' WHERE ' . $field . ' LIKE :value';
      $stmt = self::$conn->prepare($sql);

      $value = "%{$value}%";
      $stmt->bindParam(':value', $value);

      if ($stmt->execute())
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    return false;
  }

  public static function getPreDataByLike(string $table, array $data, int $limitqty, string $ascending)
  {

    if (empty($data) || !is_array($data))
      return false;

    self::$conn = db::connect();

    if (is_object(self::$conn)) {

      $whereClauses = [];
      foreach ($data as $key => $value) {
        $whereClauses[] = "$key LIKE :$key";
      }

      $whereClauseString = implode(' AND ', $whereClauses);

      $sql = "SELECT * FROM " . db::get('DB_NAME') . ".$table 
                  WHERE $whereClauseString 
                  ORDER BY id $ascending 
                  LIMIT $limitqty";

      $stmt = self::$conn->prepare($sql);

      foreach ($data as $key => $value) {
        $likeValue = "%{$value}%";
        $stmt->bindValue(":$key", $likeValue, \PDO::PARAM_STR);
      }

      if ($stmt->execute())
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    return false;
  }

  public static function getOneById(string $table, int $id)
  {
    self::$conn = db::connect();

    if (is_object(self::$conn)) {

      $sql = 'SELECT * FROM ' . db::get('DB_NAME') . '.' . $table . ' WHERE id=:id';

      $stmt = self::$conn->prepare($sql);
      $stmt->bindParam(':id', $id);

      if ($stmt->execute())
        return $stmt->fetch(\PDO::FETCH_ASSOC);
    }

    return false;
  }

  public static function getOneByColumn(string $table, string $column, $value)
  {
    self::$conn = db::connect();

    if (is_object(self::$conn)) {

      $sql = 'SELECT * FROM ' . db::get('DB_NAME') . '.' . $table . ' WHERE ' . $column . '=:value LIMIT 1';
      $stmt = self::$conn->prepare($sql);

      $stmt->bindParam(':value', $value);

      if ($stmt->execute())
        return $stmt->fetch(\PDO::FETCH_ASSOC);
    }

    return false;
  }

  public static function getCountsByItem(string $table, string $column, $value)
  {
    self::$conn = db::connect();

    if (is_object(self::$conn)) {

      $sql = 'SELECT SQL_CALC_FOUND_ROWS s.type, s.status, COUNT(*) AS total
                  FROM ' . db::get('DB_NAME') . '.' . $table . ' si
                  JOIN ' . db::get('DB_NAME') . '.sale s ON s.id = si.saleid
                  WHERE si.' . $column . " = :value
                  AND s.type IN ('cotizacion', 'compra', 'remision', 'bodega-usa', 'proceso-importacion', 'bodega-tijuana')
                  GROUP BY s.type, s.status";

      $stmt = self::$conn->prepare($sql);

      $stmt->bindParam(':value', $value);

      if ($stmt->execute()) {
        $data = $stmt->fetchAll(\PDO::FETCH_ASSOC);
        $totalStmt = self::$conn->query('SELECT FOUND_ROWS() as total');
        $total = $totalStmt->fetch(\PDO::FETCH_ASSOC)['total'];
        return ['data' => $data, 'total' => $total];
      }
    }

    return false;
  }

  public static function getRecentsByItem(string $table, string $column, $value)
  {
    self::$conn = db::connect();
    if (!is_object(self::$conn))
      return false;

    $sqlClientsCotizacion = "
        SELECT s.entename, si.modified_at, SUM(si.qty) AS total_units
        FROM " . db::get('DB_NAME') . ".$table si
        JOIN " . db::get('DB_NAME') . ".sale s ON s.id = si.saleid
        WHERE si.$column = :value AND s.type = 'cotizacion' AND s.entename IS NOT NULL
        GROUP BY s.entename, si.modified_at
        ORDER BY si.modified_at DESC
        LIMIT 10
    ";
    $stmtClientsCotizacion = self::$conn->prepare($sqlClientsCotizacion);
    $stmtClientsCotizacion->bindParam(':value', $value);
    $stmtClientsCotizacion->execute();
    $clientsCotizacion = $stmtClientsCotizacion->fetchAll(\PDO::FETCH_ASSOC);

    $sqlClientsRemision = "
        SELECT s.entename, si.modified_at, SUM(si.qty) AS total_units
        FROM " . db::get('DB_NAME') . ".$table si
        JOIN " . db::get('DB_NAME') . ".sale s ON s.id = si.saleid
        WHERE si.$column = :value AND s.type = 'remision' AND s.entename IS NOT NULL
        GROUP BY s.entename, si.modified_at
        ORDER BY si.modified_at DESC
        LIMIT 10
    ";
    $stmtClientsRemision = self::$conn->prepare($sqlClientsRemision);
    $stmtClientsRemision->bindParam(':value', $value);
    $stmtClientsRemision->execute();
    $clientsRemision = $stmtClientsRemision->fetchAll(\PDO::FETCH_ASSOC);

    $sqlSuppliers = "
        SELECT s.entename, si.modified_at, SUM(si.qty) AS total_units
        FROM " . db::get('DB_NAME') . ".$table si
        JOIN " . db::get('DB_NAME') . ".sale s ON s.id = si.saleid
        WHERE si.$column = :value AND s.type = 'compra' AND s.entename IS NOT NULL
        GROUP BY s.entename, si.modified_at
        ORDER BY si.modified_at DESC
        LIMIT 10
    ";
    $stmtSuppliers = self::$conn->prepare($sqlSuppliers);
    $stmtSuppliers->bindParam(':value', $value);
    $stmtSuppliers->execute();
    $suppliers = $stmtSuppliers->fetchAll(\PDO::FETCH_ASSOC);

    return [
      'clients_cotizacion' => $clientsCotizacion,
      'clients_remision' => $clientsRemision,
      'suppliers' => $suppliers
    ];
  }


  public static function checkExistById(string $table, int $id): bool
  {
    self::$conn = db::connect();

    if (is_object(self::$conn)) {

      $sql = 'SELECT * FROM ' . db::get('DB_NAME') . '.' . $table . ' WHERE id=:id';
      $stmt = self::$conn->prepare($sql);

      $stmt->bindParam(':id', $id);
      $stmt->execute();

      if ($stmt->fetch(\PDO::FETCH_ASSOC))
        return true;
    }

    return false;
  }

  public static function checkExistByColumn(string $table, string $column, $value)
  {
    self::$conn = db::connect();

    if (is_object(self::$conn)) {

      $sql = 'SELECT * FROM ' . db::get('DB_NAME') . '.' . $table . ' WHERE ' . $column . '=:value';
      $stmt = self::$conn->prepare($sql);

      $stmt->bindParam(':value', $value);

      $stmt->execute();

      if ($stmt->fetch(\PDO::FETCH_ASSOC))
        return true;
    }

    return false;
  }

  public static function storeData(string $table, array $data): int
  {
    self::$conn = db::connect();

    if (is_object(self::$conn)) {

      $columns = implode(',', array_keys($data));
      $params = implode(', :', array_keys($data));

      $stmt = self::$conn->prepare('INSERT INTO ' . db::get('DB_NAME') . '.' . $table . '(' . $columns . ') VALUES (:' . $params . ')');
      foreach ($data as $key => $value)
        $stmt->bindParam(':' . $key, $data[$key]);
      if ($stmt->execute())
        return self::$conn->lastInsertId();
    }

    return false;
  }

  public static function updateData(string $table, array $data, int $idKey): bool
  {
    self::$conn = db::connect();

    if (is_object(self::$conn)) {

      $set = '';
      foreach ($data as $key => $value)
        $set .= $key . '=:' . $key . ',';

      $set .= 'modified_at=NOW(),';

      $set = substr($set, 0, -1);

      $stmt = self::$conn->prepare('UPDATE ' . db::get('DB_NAME') . '.' . $table . ' SET ' . $set . ' WHERE id=:idKey');
      foreach ($data as $key => $value)
        $stmt->bindParam(':' . $key, $data[$key]);
      $stmt->bindParam(':idKey', $idKey, \PDO::PARAM_INT);
      if ($stmt->execute())
        return true;
    }

    return false;
  }

  public static function hardDeleteById(string $table, int $id): bool
  {
    self::$conn = db::connect();

    if (is_object(self::$conn)) {

      $sql = 'DELETE FROM ' . db::get('DB_NAME') . '.' . $table . ' WHERE id = ?';
      $stmt = self::$conn->prepare($sql);
      $stmt->bindParam(1, $id, \PDO::PARAM_INT);
      if ($stmt->execute())
        return true;
    }

    return false;
  }

  public static function hardDeleteAll(string $table, string $column, $value): bool
  {
    self::$conn = db::connect();

    if (is_object(self::$conn)) {

      $sql = 'DELETE FROM ' . db::get('DB_NAME') . '.' . $table . ' WHERE ' . $column . '=:value';
      $stmt = self::$conn->prepare($sql);
      $stmt->bindParam(':value', $value);

      if ($stmt->execute())
        return true;
    }

    return false;
  }

  public static function hardDeleteByColumnMinor(string $table, string $column, $value): bool
  {
    self::$conn = db::connect();

    if (is_object(self::$conn)) {

      $sql = 'DELETE FROM ' . db::get('DB_NAME') . '.' . $table . ' WHERE ' . $column . '<:value';
      $stmt = self::$conn->prepare($sql);
      $stmt->bindParam(':value', $value);

      if ($stmt->execute())
        return true;
    }

    return false;
  }

  public static function getTraceabilityReportItems(array $orderIds, int $pageNumber, int $pageSize, array $data, array $dateRange)
  {
    self::$conn = db::connect();
    if (!is_object(self::$conn)) {
      return false;
    }

    if (empty($orderIds)) {
      return ['data' => [], 'total' => 0];
    }

    $typeOrder = "FIELD(s.type, 'cotizacion', 'compra', 'remision', 'bodega-usa', 'proceso-importacion', 'bodega-tijuana')";

    $sql = "SELECT SQL_CALC_FOUND_ROWS 
                si.code AS sicode, 
                si.description AS sidescription, 
                si.unitkey,
                i.categoryname,
                s.type AS saletype, 
                s.status AS salestatus, 
                si.qty, 
                s.entename, 
                s.folio 
            FROM saleitems AS si
            INNER JOIN sale AS s ON si.saleid = s.id
            INNER JOIN item AS i ON si.itemid = i.id
            WHERE s.id IN (" . implode(',', $orderIds) . ")
            AND s.modified_at BETWEEN :startDate AND :endDate";


    if (!empty($data['categoryid'])) {
      $sql .= ' AND i.categoryid = :i_categoryid';
    }
    if (!empty($data['unitkey'])) {
      $sql .= ' AND si.unitkey = :si_unitkey';
    }
    if (!empty($data['created_by'])) {
      $sql .= ' AND s.created_by = :sale_created_by';
    }
    if (!empty($data['status'])) {
      $sql .= ' AND s.status = :sale_status';
    }

    $sql .= " ORDER BY si.code ASC, $typeOrder, s.folio ASC LIMIT :limit OFFSET :offset";

    $stmt = self::$conn->prepare($sql);
    $stmt->bindValue(':limit', $pageSize, \PDO::PARAM_INT);
    $stmt->bindValue(':offset', ($pageNumber - 1) * $pageSize, \PDO::PARAM_INT);
    $stmt->bindValue(':startDate', $dateRange['startDate']);
    $stmt->bindValue(':endDate', $dateRange['endDate']);

    if (!empty($data['categoryid'])) {
      $stmt->bindValue(':i_categoryid', $data['categoryid'], \PDO::PARAM_STR);
    }
    if (!empty($data['unitkey'])) {
      $stmt->bindValue(':si_unitkey', $data['unitkey'], \PDO::PARAM_STR);
    }
    if (!empty($data['created_by'])) {
      $stmt->bindValue(':sale_created_by', $data['created_by'], \PDO::PARAM_INT);
    }
    if (!empty($data['status'])) {
      $stmt->bindValue(':sale_status', $data['status'], \PDO::PARAM_STR);
    }

    if ($stmt->execute()) {
      $rawData = $stmt->fetchAll(\PDO::FETCH_ASSOC);

      $processedData = [];
      foreach ($rawData as $row) {
        $key = "{$row['sicode']}|{$row['saletype']}|{$row['salestatus']}";

        if (!isset($processedData[$key])) {
          $processedData[$key] = [
            'sicode' => $row['sicode'],
            'sidescription' => $row['sidescription'],
            'unitkey' => $row['unitkey'],
            'categoryname' => $row['categoryname'],
            'saletype' => $row['saletype'],
            'salestatus' => $row['salestatus'],
            'siqty' => 0,
            'saleentes' => [],
            'salefolios' => [],
          ];
        }


        $processedData[$key]['siqty'] += (int) $row['qty'];

        if (!empty($row['saleentename'])) {
          $processedData[$key]['saleentes'][$row['saleentename']] = true;
        }
        if (!empty($row['folio'])) {
          $processedData[$key]['salefolios'][] = $row['folio'];
        }
      }

      $finalData = [];
      foreach ($processedData as &$data) {
        $data['saleentes'] = count($data['saleentes']);
        $data['salefolios'] = !empty($data['salefolios']) ? min($data['salefolios']) . ' - ' . max($data['salefolios']) : '';
        $finalData[] = $data;
      }

      return [
        'data' => $finalData,
        'total' => self::$conn->query('SELECT FOUND_ROWS() as total')->fetch(\PDO::FETCH_ASSOC)['total']
      ];
    }

    return false;
  }

  public static function getAllTraceabilityReportSaleItems(string $table, int $pageNumber, int $pageSize, array $data, array $dateRange, string $searchMode, string $item)
  {
    self::$conn = db::connect();
    if (!is_object(self::$conn))
      return false;

    $sales = self::getSales($searchMode, $item, $dateRange);

    if ($searchMode === 'cliente') {
      $cotizaciones = $sales;
      $compras = self::getComprasVinculadas(array_column($sales, 'id'));
      $recibos = self::getRecibosVinculados(array_column($compras, 'id'));
      $remisiones = self::getRemisiones(array_column($sales, 'id'), $dateRange);
    } else {
      $cotizaciones = self::getCotizacionesVinculadas(array_column($sales, 'id'));
      $compras = $sales;
      $recibos = self::getRecibosVinculados(array_column($sales, 'id'));
      $remisiones = self::getRemisiones(array_column($sales, 'id'), $dateRange);
    }

    $orderIds = array_merge(
      array_column($cotizaciones, 'id'),
      array_column($compras, 'id'),
      array_column($recibos, 'id'),
      array_column($remisiones, 'id')
    );

    $traceabilityItems = self::getTraceabilityReportItems($orderIds, $pageNumber, $pageSize, $data, $dateRange);

    return [
      'cotizaciones' => count($cotizaciones),
      'compras' => count($compras),
      'recibos' => count($recibos),
      'remisiones' => count($remisiones),
      'data' => $traceabilityItems['data'],
      'total' => $traceabilityItems['total'],
    ];
  }

  private static function getSales(string $searchMode, string $item, array $dateRange)
  {
    $saleType = ($searchMode === 'cliente') ? 'cotizacion' : 'compra';

    $sql = "SELECT id, folio FROM sale
            WHERE modified_at BETWEEN :startDate AND :endDate
            AND type = :saleType
            AND entename LIKE :ente";

    $stmt = self::$conn->prepare($sql);
    $stmt->bindValue(':saleType', $saleType, \PDO::PARAM_STR);
    $stmt->bindValue(':ente', "%$item%", \PDO::PARAM_STR);
    $stmt->bindValue(':startDate', $dateRange['startDate']);
    $stmt->bindValue(':endDate', $dateRange['endDate']);
    $stmt->execute();

    return $stmt->fetchAll(\PDO::FETCH_ASSOC);
  }

  private static function getCotizacionesVinculadas(array $compraIds): array
  {
    if (empty($compraIds))
      return [];

    $sql = "SELECT id, folio FROM sale 
            WHERE saleid IN (" . implode(',', $compraIds) . ") 
            AND type = 'cotizacion'";

    return self::$conn->query($sql)->fetchAll(\PDO::FETCH_ASSOC);
  }

  private static function getRemisiones(array $relatedIds, array $dateRange): array
  {
    if (empty($relatedIds))
      return [];

    $sql = "SELECT id, folio FROM sale 
            WHERE saleid IN (" . implode(',', $relatedIds) . ") 
            AND type = 'remision'
            AND created_at BETWEEN :startDate AND :endDate";

    $stmt = self::$conn->prepare($sql);
    $stmt->bindValue(':startDate', $dateRange['startDate']);
    $stmt->bindValue(':endDate', $dateRange['endDate']);
    $stmt->execute();

    return $stmt->fetchAll(\PDO::FETCH_ASSOC);
  }

  private static function getComprasVinculadas(array $cotizacionIds)
  {
    if (empty($cotizacionIds))
      return [];

    $sql = "SELECT id, folio FROM sale WHERE saleid IN (" . implode(',', $cotizacionIds) . ") AND type = 'compra'";
    return self::$conn->query($sql)->fetchAll(\PDO::FETCH_ASSOC);
  }

  private static function getRecibosVinculados(array $compraIds)
  {
    if (empty($compraIds))
      return [];

    $sql = "SELECT id, folio, type FROM sale WHERE saleid IN (" . implode(',', $compraIds) . ") 
            AND type IN ('bodega-usa', 'proceso-importacion', 'bodega-tijuana')";
    return self::$conn->query($sql)->fetchAll(\PDO::FETCH_ASSOC);
  }

}