<?php
include_once 'config/admin.php';
include ROOT_PATH.'app/php/app.php';
$app = new App();
if (action('upload_new')) {
	$error = false;
	$maxsize = 5000000;
	$allowed_extensions = array('gif', 'png', 'jpg', 'jpeg');
	$tempFile = $_FILES['file']['tmp_name'];
	$filename = $_FILES['file']['name'];
	$img_name = $_POST['img_name'];
	$img_name = str_replace(' ', '_', trim($img_name));
	foreach (glob(ROOT_PATH.'app/img/uploaded/*') as $key => $file) {
		if (preg_match('#/img/uploaded/'.$img_name.'_v=#', $file, $matches)) {
			$error = 'Image name already exist';
		}
	}
	if (!$error) {
		$rand = rand(0, 999999);
		$temp_filename = explode(".", $filename);
		$extension = end($temp_filename);
		$new_filename = $img_name.'_v='.$rand.'.'.$extension;
		if (empty($_FILES)) $error = "Files empty";
		if ($_FILES['file']['error'] > 0) $error = "Erreur lors du transfert";
		if ($_FILES['file']['size'] > $maxsize) $error = "Le fichier est trop gros";
		if (!in_array(strtolower($extension), $allowed_extensions)) {
			$error = "il faut un fichier gif, png, jpg ou jpeg.";
		}
	}
	if (!$error) {
		$targetPath = ROOT_PATH.'/app/img/uploaded/';
		$targetFile =  $targetPath.$new_filename;
		move_uploaded_file($tempFile, $targetFile);
	}
	$img_list = $app->get_img_uploaded();
	send([
		'img_name' => $img_name,
		'filename' => $filename,
		'debug' => $_POST,
		'debug2' => $_FILES['file'],
		'error' => $error,
		'img' => $img_list
	]);
}
else if (action('delete')) {
	$error = false;
	unlink(ROOT_PATH.'/'.$_POST['img_url']);
	$img_list = $app->get_img_uploaded();
	send([
		'img_url' => $_POST['img_url'],
		'error' => $error,
		'img' => $img_list
	]);
}
?>