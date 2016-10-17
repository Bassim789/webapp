<?php
session_start();
error_reporting(-1);
define('ROOT_PATH', __DIR__.'/../../');
include ROOT_PATH.'admin/api/my_module/timeout/check.php';
include ROOT_PATH.'app/php/util.php';
include ROOT_PATH.'app/php/app.php';
$app = new App();
$domain = explode('app/php', $_SERVER["SCRIPT_NAME"])[0];
$_SESSION['domain'] = $domain;
if ($app->config['configured']) {
	$var = $app->load_var();
	$title = $var['title'];
	$description = $var['description'];
	$title_footer = $var['title footer'];
	$intro = isset($var['intro']) ? $var['intro'] : 'intro test';
	$title_homepage = $var['title_homepage'];
} else {
	$clean_domain = implode('.', explode('.', $_SERVER['HTTP_HOST'], -1));
	$title = $clean_domain;
	$description = $clean_domain;
	$title_footer = $clean_domain;
	$intro = $clean_domain;
	$title_homepage = $clean_domain;
}
$logged = false;
$admin_id = false;
if (isset($_SESSION['admin_id'])) {
	$logged = true;
	$admin_id = $_SESSION['admin_id'];
}
$app->include_folders([
	'app/js_head',
	'app/js',
	'public/my_module',
	'public/page',
	'public/wrap'
]);
if (isset($_SESSION['admin_id'])) {
	$app->include_folders([
		'admin/my_module',
		'admin/page',
		'admin/wrap',
	]);
}
if (!$app->config['configured']) {
	$app->include_folders(['app/first_config']);
}		
send([
	'files' => $app->files,
	'templates' => $app->templates,
	'gvar' => [
		'configured' => $app->config['configured'],
		'logged' => $logged,
		'admin_id' => $admin_id,
		'description' => $description,
		'domain' => $domain,
		'title' => $title,
		'title_footer' => $title_footer,
		'intro' => $intro,
		'title_homepage' => $title_homepage,
		'img' => $app->get_img_uploaded()
	]
]);
?>