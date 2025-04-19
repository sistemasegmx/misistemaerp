<?php

namespace AuthenticationRESTfulAPI;

use src\core\helpers;
use src\auth\controllers\authController;




/*
|--------------------------------------------------------------------------
| Turn On The Lights
|--------------------------------------------------------------------------
*/

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
  header("HTTP/1.1 200 OK");
  exit();
}

date_default_timezone_set('America/Tijuana');

spl_autoload_register(function ($class) {
  $file = __DIR__ . '/' . str_replace('\\', '/', $class) . '.php';
  if (is_readable($file))
    require __DIR__ . '/' . str_replace('\\', '/', $class) . '.php';
});

$jsondata = file_get_contents('php://input');
$request = isset($jsondata) && !empty($jsondata) ? @json_decode($jsondata, TRUE) : array();

if (!empty($jsondata) && json_last_error() !== JSON_ERROR_NONE)
  return helpers::returnToAction(helpers::formatResponse(404, 'Incorrect JSON Format', []));


/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
*/


$router = new \src\core\router();

$router->any(helpers::class . '::noActionFound');
$router->get('/', helpers::class . '::indexAction');


/*
|--------------------------------------------------------------------------
| Auth
|--------------------------------------------------------------------------
*/

require 'routes_auth.inc.php';


/*
|--------------------------------------------------------------------------
| APP (logged)
|--------------------------------------------------------------------------
*/



$auth = authController::authenticateAccessToken();

if ($auth['status'] === 200) {
  
  if (strtoupper($_SERVER['REQUEST_METHOD']) == 'GET') {
    
    foreach (array_filter(explode('&', $_SERVER['QUERY_STRING'])) as $column) {
      $query = array_filter(explode('=', $column));
      if (isset($query[0]) && isset($query[1])) {
        $request[$query[0]] = $query[1];
      }
    }
  }
  
  include_once 'routes_app.inc.php';
}


/*
|--------------------------------------------------------------------------
| Launch
|--------------------------------------------------------------------------
*/

$request['_FILES'] = isset($_FILES) ? $_FILES : array();
$request['_REQUEST'] = isset($_REQUEST) ? $_REQUEST : array();
$request['_USER'] = isset($auth['data']) ? $auth['data'] : array();

$router->run($request, $_SERVER['REQUEST_METHOD']);
$router = null;