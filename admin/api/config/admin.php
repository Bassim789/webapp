<?php
if (!defined('ROOT_PATH')) define('ROOT_PATH', __DIR__.'/../../../');
include_once ROOT_PATH.'public/api/config/public.php';
include_once ROOT_PATH.'admin/api/my_module/timeout/check.php';

if (!isset($_SESSION['admin_id']))
{
	die('not logged');
}

?>