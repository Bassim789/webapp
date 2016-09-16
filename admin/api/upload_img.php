<?php
include_once 'config/admin.php';

$root = realpath('../../');
$rand = rand(0, 999999);
$path = implode('/', explode('/', $_POST['url'], -1));
$path_part = explode('/', $_POST['url']);
$filename_post = explode('_v=', explode('.', end($path_part))[0])[0];
$storeFolder = $root.'/'.$path.'/';
$maxsize = 5000000;
$allowed_extensions = array('gif', 'png', 'jpg', 'jpeg');

$alea = rand(1, 1000000);
$error = false;
$tempFile = $_FILES['img']['tmp_name'];
$filename = $_FILES['img']['name'];
$temp_filename = explode(".", $filename);
$extension = end($temp_filename);
$new_filename = $filename_post.'_v='.$alea.'.'.$extension;

if (empty($_FILES)) $error = "Files empty";
if ($_FILES['img']['error'] > 0) $error = "Erreur lors du transfert";
if ($_FILES['img']['size'] > $maxsize) $error = "Le fichier est trop gros";
if (!in_array(strtolower($extension), $allowed_extensions))
{
	$error = "il faut un fichier gif, png, jpg ou jpeg.";
}
if ($error) die($error);

$targetPath = $storeFolder;
$targetFile =  $targetPath.$new_filename;
move_uploaded_file($tempFile, $targetFile);
unlink($root.'/'.$_POST['url']);
send([
	'state' => 'ok',
	'img' => $path.'/'.$new_filename
]);

?>