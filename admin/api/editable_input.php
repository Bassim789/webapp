 <?php
include_once 'config/admin.php';
if (action('edit')) {
	$editable = [
		'var' => ['value'],
		'book' => ['name', 'img1', 'summary', 'amazon_link'],
		'book_chapter' => ['name', 'content']
	];
	if (!array_key_exists($_POST['table'], $editable)) {
		send(['msg' => 'wrong table']);
	}
	if (!in_array($_POST['col'], $editable[$_POST['table']])) {
		send(['msg' => 'wrong col']);
	}
	$new_value = $_POST['new_value'];
	if ($_POST['type'] == 'price') {
		$new_value = floatval($new_value) * 100;
	}
	$data = [
		$_POST['col'] => $new_value
	];
	Db::update($_POST['table'], $data, 'id', $_POST['id_row']);
	send(['msg' => 'ok']);
}
?>