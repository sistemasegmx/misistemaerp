<?php

namespace src\tests;

use src\core\helpers;

class testsController
{
  public static function register()
  {
    $return = array();
    $filename = __DIR__ . '\register.json';
    $criteria = strval('');

    if (filesize($filename) > 0) {
      $fd = fopen($filename, 'r');
      $criteria = fread($fd, filesize($filename));
      fclose($fd);
    }

    if (is_string($criteria) && !empty($criteria)) {
      $curl = curl_init();
      curl_setopt_array(
        $curl,
        array(
          CURLOPT_URL => helpers::getDomainName('/auth/register'),
          CURLOPT_RETURNTRANSFER => true,
          CURLOPT_ENCODING => '',
          CURLOPT_MAXREDIRS => 10,
          CURLOPT_TIMEOUT => 0,
          CURLOPT_FOLLOWLOCATION => true,
          CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
          CURLOPT_CUSTOMREQUEST => 'POST',
          CURLOPT_POSTFIELDS => $criteria,
        )
      );

      $response = curl_exec($curl);
      http_response_code(200);
      curl_close($curl);

      $return = helpers::formatResponse(200, 'Tests complete!, Method: register', [$response]);
    }

    return $return;
  }

  public static function login()
  {
    $return = array();
    $filename = __DIR__ . '\login.json';
    $criteria = strval('');

    if (filesize($filename) > 0) {
      $fd = fopen($filename, 'r');
      $criteria = fread($fd, filesize($filename));
      fclose($fd);
    }

    if (is_string($criteria) && !empty($criteria)) {
      $curl = curl_init();
      curl_setopt_array(
        $curl,
        array(
          CURLOPT_URL => helpers::getDomainName('/auth/login'),
          CURLOPT_RETURNTRANSFER => true,
          CURLOPT_ENCODING => '',
          CURLOPT_MAXREDIRS => 10,
          CURLOPT_TIMEOUT => 0,
          CURLOPT_FOLLOWLOCATION => true,
          CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
          CURLOPT_CUSTOMREQUEST => 'POST',
          CURLOPT_POSTFIELDS => $criteria,
        )
      );

      $response = curl_exec($curl);
      http_response_code(200);
      curl_close($curl);

      $return = helpers::formatResponse(200, 'Tests complete!, Method: login', [$response]);
    }

    return $return;
  }
  public static function activate()
  {
    $return = array();
    $filename = __DIR__ . '\activate.txt';
    $criteria = strval('');

    if (filesize($filename) > 0) {
      $fd = fopen($filename, 'r');
      $criteria = fread($fd, filesize($filename));
      fclose($fd);
    }

    if (is_string($criteria) && !empty($criteria)) {
      $curl = curl_init();
      curl_setopt_array(
        $curl,
        array(
          CURLOPT_URL => helpers::getDomainName('/auth/activate?' . $criteria),
          CURLOPT_RETURNTRANSFER => true,
          CURLOPT_ENCODING => '',
          CURLOPT_MAXREDIRS => 10,
          CURLOPT_TIMEOUT => 0,
          CURLOPT_FOLLOWLOCATION => true,
          CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
          CURLOPT_CUSTOMREQUEST => 'GET',
        )
      );

      $response = curl_exec($curl);
      http_response_code(200);
      curl_close($curl);

      $return = helpers::formatResponse(200, 'Tests complete!, Method: login', [$response]);
    }

    return $return;
  }
}
