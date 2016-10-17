<?php
error_reporting(-1);
define('ROOT_PATH', __DIR__.'/../../');
require_once ROOT_PATH.'app/php/db.php';
error_reporting(-1);

function config_db($title)
{
	try {
		$sql = "CREATE table admin(
			id INT(15) AUTO_INCREMENT PRIMARY KEY,
			email VARCHAR(255) NOT NULL,
			hash VARCHAR(255) NOT NULL,
			activation_code VARCHAR(255) NOT NULL,
			nb_connexion INT(15) DEFAULT 0,
			last_connexion INT(15)
		)ENGINE=InnoDB CHARACTER SET=utf8;";
		Db::$db->exec($sql);

		$sql = "CREATE table var(
			id INT(15) AUTO_INCREMENT PRIMARY KEY,
			name VARCHAR(255) NOT NULL,
			value VARCHAR(255) NOT NULL
		)ENGINE=InnoDB CHARACTER SET=utf8;";
		Db::$db->exec($sql);
	} catch (Exception $e){}
	Db::$db->exec("TRUNCATE TABLE admin");
	Db::$db->exec("TRUNCATE TABLE var");
	$activation_code = substr(md5($_POST['email'] + microtime()), 0, 20);
	Db::insert('admin', [
		'email' => $_POST['email'],
		'activation_code' => $activation_code,
		'hash' => password_hash($_POST["password"], PASSWORD_BCRYPT, ['cost' => 12])
	]);
	Db::insert('var',[ 'name' => 'title', 'value' => $title ]);
	Db::insert('var',[ 'name' => 'title footer', 'value' => $title ]);
	Db::insert('var',[ 'name' => 'description', 'value' => $title ]);
	Db::insert('var',[ 'name' => 'title_homepage', 'value' => $title ]);
	return $activation_code;
}

if (isset($_GET['action']) && $_GET['action'] == 'test_file_permission') {
	$file_permission_denied = true;
	$filename = ROOT_PATH.'app/php/test_file_permission.php';
	if(@file_put_contents($filename, 'test file permission')) {
		$file_permission_denied = false;
		unlink($filename);
	}
	die(json_encode([
		'file_permission_denied' => $file_permission_denied
	]));
}

$config_file = ROOT_PATH.'config.json';
$config = json_decode(file_get_contents($config_file), true);

if ($config['configured'] == 'true') {
	die(json_encode([
		'msg' => 'already configured',
		'state' => 'error'
	]));
}

if (isset($_GET['activation_code'])) {
	Db::initialize();
	$code = $_GET['activation_code'];
	if($user = Db::get('admin', 'activation_code', $code)) {
		$config['configured'] = true;
		file_put_contents($config_file, json_encode($config, JSON_PRETTY_PRINT));
		die(header('location: ../../login_to_admin'));
	}
	die('wrong_activation_code');
}

if (isset($_GET['action']) && $_GET['action'] == 'connect') {
	$connexion = Db::try_initialize(
		$_POST['db_host'], 
		$_POST['db_name'], 
		$_POST['db_user'],
		$_POST['db_pass']
	);
	if ($connexion == 'success') {
		$filename = ROOT_PATH.'app/php/db_config.php';
		$var = "
<?php
define('DB_HOST', '".$_POST['db_host']."');
define('DB_NAME', '".$_POST['db_name']."');
define('DB_USERNAME', '".$_POST['db_user']."');
define('DB_PASSWORD', '".$_POST['db_pass']."');
?>
";
		if(!file_put_contents($filename, $var)) {
			die(json_encode([
				'msg' => 'cant write file',
				'state' => 'error'
			]));
		}

		$title = implode('.', explode('.', $_SERVER['HTTP_HOST'], -1));
		$activation_code = config_db($title);
		$link = $_SERVER['HTTP_HOST'].explode('?', $_SERVER['REQUEST_URI'])[0].'?activation_code='.$activation_code;
		$link = str_replace('//', '/', $link);
		$messageemail = "Hello, <br><br>
			
		Your Webapp $title is almost ready. <br><br>

		Here is the link to activate: <br><br>

		$link<br><br>

		<br><br>";
		mail(
			$_POST['email'],
			$title." activation",
			$messageemail,
			'Content-type: text/html; charset=utf-8'."\r\n".'From: "'.$title.'" <contact@'.$_SERVER['HTTP_HOST'].'>'
		);
		$msg = 'Db connected!<br>An email with activation link have been send!';
		$state = 'success';
	} else {
		$msg = 'Fail db connexion!<br>'.$connexion;
		$state = 'error';
	}
}
die(json_encode([
	'msg' => $msg,
	'state' => $state
]));
?>