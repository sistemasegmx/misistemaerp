<?php

namespace APIWizard;

const WDB_HOST = 'localhost';

const WDB_USER = 'root';

const WDB_PASS = 'toor';

const WDB_NAME = 'misistemaerp_sistemasegmx';

const WDB_PORT = '3306';

const WDB_DSN = 'mysql:host=' . WDB_HOST . '; port=' . WDB_PORT . '; dbname=' . WDB_NAME;

const WDB_OPTIONS = 		[
	\PDO::ATTR_ERRMODE => \PDO::ERRMODE_EXCEPTION,
	\PDO::ATTR_DEFAULT_FETCH_MODE => \PDO::FETCH_ASSOC,
	\PDO::ATTR_EMULATE_PREPARES => false,
	\PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8'
];
