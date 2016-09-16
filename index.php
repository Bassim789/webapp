<?php
session_start();
error_reporting(-1);
define('ROOT_PATH', __DIR__.'/');
include ROOT_PATH.'admin/api/module/timeout/check.php';
include ROOT_PATH.'app/php/util.php';
include ROOT_PATH.'app/php/app.php';

$app = new App();
$domain = explode('index.php', $_SERVER["SCRIPT_NAME"])[0];
$_SESSION['domain'] = $domain;

if ($app->config['cssvar_precompilation'])
{
	include ROOT_PATH.'app/php/cssvar.php';
	$cssvar = new Cssvar();
	$cssvar->load_global_var('app/global_var.css');
	$cssvar->process_folders([
		'public',
		'admin',
		'app/error_catcher',
		'app/first_config'
	]);
}

if ($app->config['configured'])
{
	$var = $app->load_var();
	$title = $var['title'];
	$description = $var['description'];
	$title_footer = $var['title footer'];
}
else
{
	$clean_domain = implode('.', explode('.', $_SERVER['HTTP_HOST'], -1));
	$title = $clean_domain;
	$description = $clean_domain;
	$title_footer = $clean_domain;
}

if (isset($_SESSION['admin_id']))
{
	$logged = true;
	$admin_id = $_SESSION['admin_id'];
}
else
{
	$logged = false;
	$admin_id = false;
}

$logo = $app->find_file('app/img/header/logo');

$app->gvar_to_js([
	'configured' => $app->config['configured'],
	'logged' => $logged,
	'admin_id' => $admin_id,
	'domain' => $domain,
	'title' => $title,
	'title_footer' => $title_footer,
	'background_image_desktop' => $app->find_file('app/img/background/default_desktop'),
	'background_image_mobile' => $app->find_file('app/img/background/default_mobile'),
	'background_image_sidr' => $app->find_file('app/img/background/default_sidr'),
	'logo' => $logo
]);

?>
<!DOCTYPE html>
<html>
	<head>
	    <title><?= $title ?></title>
		<link rel="shortcut icon" href="<?= $logo ?>">
	    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0">
	    <meta charset="utf-8">
	    <meta name="description" content="<?= $description ?>">
	    <script src="app/lib/mustache_js/mustache.js"></script>
		<script src="app/lib/jquery/jquery.min.js"></script>
        <script src="app/lib/jquery/jquery-ui.js"></script>
        <link href="app/lib/jquery/jquery-ui.css" rel="stylesheet">
	</head>
	<body>
		<header></header>
		<div id="body_wrap">
			<div id="body"></div>
		</div>
		<div id="background"></div>
		<footer></footer>
		<?php
			$app->include_folders([
				'app/error_catcher',
				'app/app.js',
				'app/js',
				'public/module',
				'public/page',
				'public/wrap'
			]);

			if (isset($_SESSION['admin_id']))
			{
				$app->include_folders([
					'admin/module',
					'admin/page',
					'admin/wrap',
				]);
			}

			if (!$app->config['configured'])
			{
				$app->include_files('app/first_config');
			}
		?>
		<script>  app = new App() </script>
	</body>
</html>