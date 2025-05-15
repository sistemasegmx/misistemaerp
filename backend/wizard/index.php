<?php

namespace APIWizard;

header('content-type: application/json; charset=utf-8');

const ROOT_WIZARD_PATH = __DIR__;

require_once ROOT_WIZARD_PATH . '/helpers.php';
require_once ROOT_WIZARD_PATH . '/wizard.php';
require_once ROOT_WIZARD_PATH . '/config.php';

$filename = ROOT_WIZARD_PATH . '/misistemaerp_sistemasegmx.sql';

$response = wizard::index($filename);
helpers::returnToAction($response);
unset($response);
return;
