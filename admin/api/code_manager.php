<?php
require_once 'config/admin.php';
require_once 'module/code_manager.php';

$root_path = explode('/admin/api', __DIR__)[0].'/';

//die('path: '.$root_path);

$code_manager = new Code_manager(
	$token = 'ab04lj3nggFFg',
	$url = 'api_diff_dev_prod',
	$root_path = $root_path,
	$site_version = 'PROD',
	$site_dev_domain = '',
	$site_prod_domain = ''
);

$code_manager->process($_GET['action']);

?>