<?php
include_once '../../config/admin.php';
$_SESSION['last_activity'] = time();
$data = [
	'last_connexion' => time(),
	'nb_connexion' => 'nb_connexion + 1'
];
Db::update('admin', $data, 'id', $_SESSION['admin_id']);
die(json_encode([
	'res' => 'ok'
]));
?>