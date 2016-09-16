<?php
session_start();
if (!defined('ROOT_PATH')) define('ROOT_PATH', __DIR__.'/../../../');
date_default_timezone_set('Europe/Paris');
error_reporting(-1);
include_once ROOT_PATH.'app/php/util.php';
include_once ROOT_PATH.'app/php/db.php';
Db::initialize();
?>