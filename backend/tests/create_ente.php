<?php

namespace APITest;

header('content-type: application/json; charset=utf-8');

const ROOT_TEST_PATH = __DIR__;

require_once ROOT_TEST_PATH . '/helpers.php';

$criteria = helpers::getFileAsJSON(ROOT_TEST_PATH . '/create_ente.json');

$response = json_encode('No Data Found', http_response_code(404));

if (is_string($criteria) && !empty($criteria)) {

  $curl = curl_init();

  curl_setopt_array($curl, array(
    CURLOPT_URL => helpers::getDomainName('/ente/addnew'),
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_ENCODING => '',
    CURLOPT_MAXREDIRS => 10,
    CURLOPT_TIMEOUT => 0,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
    CURLOPT_CUSTOMREQUEST => 'POST',
    CURLOPT_POSTFIELDS => $criteria,
  ));

  $response = curl_exec($curl);
  http_response_code(200);

  curl_close($curl);
}

echo $response;
